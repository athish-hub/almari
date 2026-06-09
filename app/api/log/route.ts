import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEMO_USER = 'demo'

// ── POST /api/log — save a daily look ─────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { photoUrl, analysis, mood, occasion } = await req.json()

    // Ensure demo user exists
    await prisma.user.upsert({
      where: { id: DEMO_USER },
      update: {},
      create: { id: DEMO_USER, email: 'demo@almari.app', name: 'Demo User' },
    })

    // Create a lightweight outfit record from AI analysis
    const outfit = await prisma.outfit.create({
      data: {
        userId: DEMO_USER,
        occasion: occasion ?? analysis?.occasion ?? 'casual',
        scoreTotal: analysis?.score ?? 0,
        scoreColorHarmony: 0,
        scoreFormalityMatch: 0,
        scoreProportionBalance: 0,
        scorePatternMix: 0,
        scoreCompleteness: 0,
        stylistNoteJson: JSON.stringify({
          headline:       analysis?.headline ?? '',
          colorStory:     analysis?.colorStory ?? '',
          proportionNote: analysis?.compliment ?? '',
          strengths:      analysis?.strengths ?? [],
          improvements:   analysis?.improvements ?? [],
        }),
        gapsJson: JSON.stringify(analysis?.gaps ?? []),
      },
    })

    // Create the daily log
    const log = await prisma.dailyLog.create({
      data: {
        userId:   DEMO_USER,
        date:     new Date(),
        outfitId: outfit.id,
        photoUrl: photoUrl ?? null,
        mood:     mood ?? null,
        occasion: occasion ?? analysis?.occasion ?? 'casual',
      },
    })

    return NextResponse.json({ logId: log.id, outfitId: outfit.id }, { status: 201 })
  } catch (e) {
    console.error('log error:', e)
    return NextResponse.json({ error: 'failed to save log' }, { status: 500 })
  }
}

// ── DELETE /api/log?id=xxx — remove a log entry ───────────────

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const log = await prisma.dailyLog.findUnique({ where: { id } })
    if (!log) return NextResponse.json({ error: 'not found' }, { status: 404 })

    // Deleting the outfit cascades to DailyLog and OutfitItems
    await prisma.outfit.delete({ where: { id: log.outfitId } })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('log delete error:', e)
    return NextResponse.json({ error: 'failed to delete' }, { status: 500 })
  }
}

// ── GET /api/log — fetch history ──────────────────────────────

export async function GET() {
  try {
    const logs = await prisma.dailyLog.findMany({
      where: { userId: DEMO_USER },
      orderBy: { date: 'desc' },
      include: { outfit: true },
      take: 50,
    })

    const result = logs.map(log => ({
      id:       log.id,
      date:     log.date,
      mood:     log.mood,
      occasion: log.occasion,
      photoUrl: log.photoUrl,
      score:    log.outfit.scoreTotal,
      note:     (() => {
        try { return JSON.parse(log.outfit.stylistNoteJson) } catch { return {} }
      })(),
      gaps: (() => {
        try { return JSON.parse(log.outfit.gapsJson) } catch { return [] }
      })(),
    }))

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: 'failed to fetch' }, { status: 500 })
  }
}
