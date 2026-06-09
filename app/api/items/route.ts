import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEMO_USER = 'demo'

// ── GET /api/items ─────────────────────────────────────────────

export async function GET() {
  try {
    const items = await prisma.wardrobeItem.findMany({
      where: { userId: DEMO_USER, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: 'failed to fetch' }, { status: 500 })
  }
}

// ── POST /api/items ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name, category, subtype,
      primaryColor, secondaryColor,
      pattern, patternScale, fabricWeight, fabricTexture,
      formality, topSilhouette, bottomSilhouette,
      occasions, photoUrl, brand, purchasePrice,
    } = body

    if (!name || !category || !subtype || !primaryColor || !occasions?.length) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
    }

    // Ensure demo user exists
    await prisma.user.upsert({
      where: { id: DEMO_USER },
      update: {},
      create: { id: DEMO_USER, email: 'demo@almari.app', name: 'Demo User' },
    })

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: DEMO_USER,
        name,
        category,
        subtype,
        primaryColor,
        secondaryColor: secondaryColor ?? null,
        pattern: pattern ?? 'solid',
        patternScale: patternScale ?? 'none',
        fabricWeight: fabricWeight ?? 'medium',
        fabricTexture: fabricTexture ?? 'matte',
        formality: Number(formality) ?? 3,
        topSilhouette: topSilhouette || null,
        bottomSilhouette: bottomSilhouette || null,
        occasions: Array.isArray(occasions) ? occasions.join(',') : occasions,
        photoUrl: photoUrl ?? null,
        brand: brand ?? null,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null,
        isActive: true,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}

// ── DELETE /api/items?id=xxx ───────────────────────────────────

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await prisma.wardrobeItem.update({
    where: { id },
    data: { isActive: false },
  })

  return NextResponse.json({ ok: true })
}
