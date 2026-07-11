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

console.log("June API Response:", data);

if (!response.ok) {
  return res.status(response.status).json(data);
}

const content = data?.choices?.[0]?.message?.content;

if (!content) {
  return res.status(500).json({
    error: "No content returned from June API",
    data,
  });
}

const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log(cleaned);

return res.status(200).json(JSON.parse(cleaned));
