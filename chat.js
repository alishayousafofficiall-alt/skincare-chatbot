// api/chat.js
// Ye Vercel serverless function hai. Ye tumhari website (InfinityFree) se
// message leta hai, Gemini API ko bhejta hai, aur jawab wapis karta hai.

// ==== APNI SKINCARE KNOWLEDGE BASE YAHAN DAALO ====
// Products, FAQs, prices, etc. Jitna zyada detail dogi, chatbot utna behtar jawab dega.
const KNOWLEDGE_BASE = `
Tum ek helpful skincare store ki customer support assistant ho. Naam: "Glow Assistant".
Sirf skincare products aur unke istemal ke baare mein madad karo. Roman Urdu ya English,
jis mein customer baat kare usi mein jawab do. Jawab chota aur friendly rakho.

Store products:
- Vitamin C Serum - Rs. 1200 - Dark spots aur glow ke liye, raat/din dono mein use ho sakta hai
- Hyaluronic Acid Moisturizer - Rs. 900 - Dry skin ke liye, hydration
- Niacinamide Serum - Rs. 1000 - Oily skin aur open pores ke liye
- Sunscreen SPF 50 - Rs. 800 - Har roz subah use karna zaroori hai

Delivery: 3-5 working days, poore Pakistan mein
Return policy: 7 din ke andar agar seal band ho
`;

export default async function handler(req, res) {
  // CORS allow karo taake InfinityFree website se call ho sake
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
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message zaroori hai' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${KNOWLEDGE_BASE}\n\nCustomer ka sawal: ${message}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: 'AI se jawab lene mein masla hua' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Maazrat, mujhe abhi jawab nahi mil raha. Dobara try karein.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Kuch ghalat hogaya, dobara try karein' });
  }
}
