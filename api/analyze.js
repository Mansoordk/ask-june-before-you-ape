export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { project } = req.body;

   const prompt = `
You are a professional crypto analyst.

Analyze this crypto project:

${project}

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations outside JSON.

Use this exact structure:

{
  "risk_score": 0,
  "risk_level": "",
  "overview": "",
  "use_case": "",
  "strengths": [],
  "risks": [],
  "competitors": [],
  "bull_case": [],
  "bear_case": [],
  "investment_thesis": "",
  "tokenomics": {
    "ticker": "",
    "market_cap": "",
    "fdv": "",
    "circulating_supply": "",
    "max_supply": "",
    "category": ""
  },
  "outlook": "",
  "verdict": ""
}

Rules:

- risk_score must be between 0 and 100
- risk_level must be Low, Medium, or High
- strengths must contain 3-5 points
- risks must contain 3-5 points
- competitors must contain 3-6 competitors
- bull_case must contain 3-5 points
- bear_case must contain 3-5 points
- investment_thesis must be 1-2 concise sentences
- explain the main reason an investor may be bullish on the project
- keep everything concise
- beginner friendly
- balanced and objective

For tokenomics:

- ticker = project symbol if known
- market_cap = estimated market cap if publicly known
- fdv = estimated fully diluted valuation if known
- circulating_supply = estimated circulating supply
- max_supply = maximum supply if known
- category = Layer1, AI, DeFi, Meme, Gaming, Infrastructure, etc.

If unknown return "Unknown".

Return JSON only.
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
          temperature: 0.7,
        }),
      }
    );

  const data = await response.json();

const content =
  data?.choices?.[0]?.message?.content;

const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return res.status(200).json(
  JSON.parse(cleaned)
);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
