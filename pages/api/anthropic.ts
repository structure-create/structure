import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const runtime = 'nodejs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obtain text from request header
    const { base64Image } = req.body;

    // Define LLM prompt
    const prompt = `
      You are an expert compliance and language reviewer for construction permits.

      Return **ONLY** a raw JSON object (no markdown) in the following format.
      Each category array MUST be present; if no violations exist, return an empty array.

      {
        "complianceScore": 0‑100,

        "Electrical": [
          { "quote": "...", "explanation": "..." }
        ],

        "Zoning": [
          { "quote": "...", "explanation": "..." }
        ],

        "Plumbing": [
          { "quote": "...", "explanation": "..." }
        ],

        "Mechanical": [
          { "quote": "...", "explanation": "..." }
        ],

        "Ambiguity": [
          { "quote": "...", "explanation": "..." }
        ]
      }

      • **Electrical, Plumbing, Mechanical** – list any NEC / CPC / CMC issues, service‑load errors, fixture counts, Title 24 energy requirements, etc.  
      • **Zoning** – lot coverage, setbacks, parking, height limits, use restrictions, etc.  
      • **Ambiguity** – unclear statements, missing references, contradictory notes, vague qualifiers.

      Only include items actually found in the permit.

      Analyze the drawing below:
    `;

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ];

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-opus',
        messages,
        max_tokens: 1000,
        temperature: 0.1,
      },
      {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
      }
    );

    

    const result = response.data;
    const modelOutput = result.choices?.[0]?.message?.content ?? '';
    // console.log("Model Output: ", modelOutput);
    console.log("Model Output with markers: >>>" + modelOutput + "<<<");


    res.status(200).json({ success: true, raw: modelOutput });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
