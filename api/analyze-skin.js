export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }
  try {
    const { image } = req.body; // expects data URL: "data:image/jpeg;base64,...."
    if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
      return res.status(400).json({ error: 'Valid image (data URL) zaroori hai' });
    }
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const SYSTEM_PROMPT = `You are a professional dermatological skin analysis AI. You will be shown a photo of a person's skin (could be face, hand, arm, leg, or any body part). Carefully examine the actual visual content of the image and respond with ONLY a JSON object (no markdown, no extra text) in exactly this shape:
{
  "bodyPartDetected": "face" | "hand" | "arm" | "leg" | "neck" | "other-body" | "unclear",
  "imageQuality": "good" | "poor-lighting" | "blurry" | "too-far",
  "skinType": "Oily" | "Dry" | "Normal" | "Combination",
  "undertone": "Warm" | "Cool" | "Neutral",
  "estimatedAgeRange": "string, e.g. '20-25', or null if not a face",
  "concerns": {
    "acne": 0-100,
    "pores": 0-100,
    "hydrationDeficit": 0-100,
    "redness": 0-100,
    "uvSunDamage": 0-100,
    "darkSpots": 0-100,
    "unevenTone": 0-100,
    "textureRoughness": 0-100,
    "fineLines": 0-100,
    "underEyeCircles": 0-100
  },
  "overallScore": 0-100,
  "topConcerns": ["short phrase 1", "short phrase 2", "short phrase 3"],
  "summary": "2-3 sentence honest description of what you actually observe in this specific photo, in Roman Urdu/Hinglish mixed with English, friendly tone"
}
Rules:
- Base every number ONLY on what is visibly present in the image. Do not invent generic scores.
- If the image doesn't show skin clearly, set imageQuality accordingly and give conservative mid-range scores with a summary explaining what's wrong.
- underEyeCircles only relevant if bodyPartDetected is "face", else 0.
- estimatedAgeRange only if bodyPartDetected is "face", else null.
- Respond with raw JSON only — no backticks, no prose outside the JSON.`;
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.6-27b',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: SYSTEM_PROMPT },
                { type: 'image_url', image_url: { url: image } }
              ]
            }
          ],
          temperature: 0.4,
          max_completion_tokens: 2048
        })
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error('Groq vision API error:', data);
      return res.status(500).json({ error: 'AI analysis mein masla hua', details: data?.error?.message });
    }
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) {
      return res.status(500).json({ error: 'AI se koi response nahi mila' });
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // model sometimes wraps JSON in text/backticks — extract the {...} block and retry
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e2) {
          return res.status(500).json({ error: 'AI response parse nahi ho saka', raw });
        }
      } else {
        return res.status(500).json({ error: 'AI response parse nahi ho saka', raw });
      }
    }
    return res.status(200).json({ analysis: parsed });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Kuch ghalat hogaya, dobara try karein' });
  }
}
