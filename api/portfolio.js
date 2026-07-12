export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { portfolio } = req.body;

    const prompt = `
You are a professional crypto portfolio analyst.

Analyze this crypto portfolio:

${portfolio}

Return ONLY valid JSON.

{
  "overall_score": 0,
  "risk_level": "",
  "diversification": "",
  "best_asset": "",
  "riskiest_asset": "",
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Rules:

- overall_score = 0-100
- risk_level = Low, Medium or High
- diversification = Excellent, Good, Fair or Poor
- strengths = 3-5 points
- weaknesses = 3-5 points
- suggestions = 3-5 points
- summary = 2 concise sentences

Return JSON only.
`;

    const response = await fetch(
      "https://api.blockchain.info/ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.JUNE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.JUNE_MODEL,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();

      return res.status(500).json({
        error: text
      });
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.status(200).json(
      JSON.parse(cleaned)
    );

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }

}
