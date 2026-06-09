import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `You are a professional fashion stylist with deep knowledge of Indian wardrobes. Analyse this clothing item photo and return ONLY a valid JSON object — no explanation, no markdown, just raw JSON.

Required fields and allowed values:

{
  "name": "descriptive short name e.g. white linen shirt, black slim trousers, rose blazer",
  "category": one of ["top","bottom","full-body","outerwear","footwear","accessory","dupatta"],
  "subtype": pick the closest from:
    top → ["t-shirt","shirt","blouse","crop-top","tank","kurti","kurta","corset-top","sweatshirt","hoodie"]
    bottom → ["jeans","trousers","chinos","shorts","skirt-mini","skirt-midi","skirt-maxi","palazzo","salwar","leggings","wide-leg","dhoti-pants"]
    full-body → ["dress-mini","dress-midi","dress-maxi","jumpsuit","romper","saree","lehenga","anarkali","sharara-set","co-ord-set"]
    outerwear → ["blazer","jacket-denim","jacket-leather","jacket-bomber","cardigan","shawl","overcoat","trench"]
    footwear → ["sneakers","loafers","oxfords","heels-block","heels-stiletto","mules","kolhapuris","juttis","sandals-flat","sandals-heeled","chelsea-boots","boots-ankle","slides","flats"]
    accessory → ["belt","watch","bag-tote","bag-clutch","bag-sling","bag-structured","necklace","earrings","bangles","sunglasses","scarf","hat","potli"]
    dupatta → ["dupatta"],
  "primaryColor": pick the single closest from ["white","off-white","ivory","cream","black","charcoal","graphite","grey-light","grey-medium","grey-dark","navy","camel","tan","beige","khaki","brown","chocolate","red","crimson","burgundy","maroon","coral","terracotta","rust","orange","amber","yellow","mustard","gold","olive","lime","green","emerald","sage","mint","forest","teal","cyan","blue-light","blue-sky","blue-royal","blue-cobalt","indigo","pink","blush","rose","hot-pink","magenta","fuchsia","purple","violet","lavender","lilac","plum","saffron","turmeric","marigold","peacock","parrot-green","rani-pink","mehendi","multicolor","printed"],
  "pattern": one of ["solid","stripes-thin","stripes-bold","checks-small","checks-bold","floral-small","floral-large","geometric","abstract","animal-print","ethnic-print","embroidered","tie-dye","sequinned"],
  "fabricWeight": one of ["sheer","light","medium","heavy","structured"],
  "formality": integer 1–5 where 1=athleisure/sport, 2=casual everyday, 3=smart casual/brunch, 4=office/semi-formal, 5=wedding/formal,
  "occasions": array of 1–4 from ["casual","college","office","smart-casual","brunch","date-night","festive","wedding-guest","wedding-function","party-night","travel","sport","loungewear"],
  "topSilhouette": if category is "top" pick from ["fitted","semi-fitted","relaxed","oversized","cropped","structured"], else null,
  "bottomSilhouette": if category is "bottom" pick from ["skinny","slim","straight","wide-leg","flared","a-line","pleated","draped"], else null
}

Be precise about color — pick the single closest named color. For Indian ethnic wear like sarees, lehengas, kurtis, be specific. Return ONLY the JSON object.`

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'no image provided' }, { status: 400 })
    }

    const validMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const mime = validMime.includes(mimeType) ? mimeType : 'image/jpeg'

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mime as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            {
              type: 'text',
              text: PROMPT,
            },
          ],
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''

    // Strip any accidental markdown wrapping
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (e) {
    console.error('analyse error:', e)
    return NextResponse.json({ error: 'analysis failed' }, { status: 500 })
  }
}
