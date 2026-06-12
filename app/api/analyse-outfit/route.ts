import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `You are a warm, knowledgeable personal stylist — the kind who gives honest, encouraging feedback like a best friend who happens to have a NIFT degree. Analyse this outfit photo and return ONLY a valid JSON object.

{
  "score": integer 0–100 (genuine overall outfit quality — be honest, not generous),
  "headline": "5–8 word assessment e.g. 'clean smart casual — navy anchors it well'",
  "compliment": "1–2 sentences. Warm and specific — call out exactly what they got right. Not generic praise. e.g. 'The way the olive jacket picks up the tan in your shoes is intentional-looking, even if it wasn't — that's the mark of a good eye.'",
  "colorStory": "brief palette description e.g. 'white + black neutral base with rose accent'",
  "occasion": one of ["casual","office","smart-casual","date-night","brunch","festive","wedding-guest","party-night","travel","college","sport","loungewear"],
  "pieces": array of { "name": string, "category": one of ["top","bottom","full-body","outerwear","footwear","accessory","dupatta"] },
  "strengths": array of 1–3 short specific strengths e.g. ["clean colour palette", "formality is consistent across all pieces"],
  "improvements": array of 0–2 specific, actionable improvements (empty array if the look is strong),
  "gaps": array of 0–3 objects {
    "severity": "critical" | "moderate" | "opportunity",
    "nudge": "short direct suggestion e.g. 'a slim brown belt closes the waist and adds the finishing detail this needs'",
    "category": "accessory" | "footwear" | "outerwear" | "top" | "bottom",
    "priceRange": { "min": number, "max": number }
  }
}

If footwear is not visible in the photo, flag it as a critical gap. Price ranges should be in INR and realistic for the look's formality level (casual looks: ₹800–₹4,000 range; formal: ₹2,000–₹12,000 range). Return ONLY the JSON object — no explanation, no markdown.`

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json()
    if (!imageBase64) {
      return NextResponse.json({ error: 'no image' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
            },
          },
          { type: 'text', text: PROMPT },
        ],
      }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (e) {
    console.error('analyse-outfit error:', e)
    return NextResponse.json({ error: 'analysis failed' }, { status: 500 })
  }
}
