export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { portfolio } = req.body;

    const prompt = `
You are a professional crypto portfolio analyst.

Analyze this crypto portfolio.

Portfolio:

${portfolio}

Return ONLY valid JSON.

{
  "overall_score": 0,
  "risk_level": "",
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "diversification": "",
  "suggestions": [],
  "best_asset": "",
  "riskiest_asset": ""
}

Rules:

- overall_score between 0-100
- strengths 3-5 items
- weaknesses 3-5 items
- suggestions 3-5 items
- JSON only.
`;

    const response = await fetch(
      "https://api.blockchain.info/ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.JUNE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.JUNE_MODEL,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({
        error: err,
      });
    }

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content || "";

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.status(200).json(JSON.parse(cleaned));

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message,
    });

  }
}
