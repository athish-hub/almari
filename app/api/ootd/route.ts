import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOOTD } from '@/lib/styling-engine'
import type { WardrobeItem, OccasionTag, FormalityLevel } from '@/lib/types'

const DEMO_USER = 'demo'

function toWardrobeItem(row: any): WardrobeItem {
  return {
    ...row,
    formality: row.formality as FormalityLevel,
    occasions: row.occasions
      ? (row.occasions as string).split(',').filter(Boolean) as OccasionTag[]
      : [],
  }
}

export async function POST(req: NextRequest) {
  try {
    const { occasion = 'smart-casual' } = await req.json()

    const rows = await prisma.wardrobeItem.findMany({
      where: { userId: DEMO_USER, isActive: true },
    })

    if (rows.length === 0) {
      return NextResponse.json({ error: 'empty-wardrobe' }, { status: 400 })
    }

    const wardrobe = rows.map(toWardrobeItem)
    const outfit = generateOOTD(wardrobe, occasion as OccasionTag)

    // Serialise — strip circular refs, keep what the UI needs
    const payload = {
      score: outfit.score,
      stylistNote: outfit.stylistNote,
      occasion: outfit.occasion,
      gaps: outfit.gaps,
      items: outfit.items.map(oi => ({
        role: oi.role,
        item: {
          id: oi.item.id,
          name: oi.item.name,
          category: oi.item.category,
          subtype: oi.item.subtype,
          primaryColor: oi.item.primaryColor,
          pattern: oi.item.pattern,
          formality: oi.item.formality,
          photoUrl: oi.item.photoUrl ?? null,
        },
      })),
    }

    return NextResponse.json(payload)
  } catch (e) {
    console.error('ootd error:', e)
    return NextResponse.json({ error: 'generation failed' }, { status: 500 })
  }
}
