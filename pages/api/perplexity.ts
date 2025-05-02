import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const runtime = 'nodejs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obtain text from request header
    const { text } = req.body;

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

        Here is the permit text:
        """${text}"""
    `;

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
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
    console.log("Model Output: ", modelOutput);

    res.status(200).json({ success: true, raw: modelOutput });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
