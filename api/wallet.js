export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address } = req.body || {};

    if (!address || typeof address !== "string" || !address.trim()) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    const prompt = `
You are a professional crypto wallet analyst.
Analyze this wallet:
${address.trim()}
Assume this is an EVM wallet.
Return ONLY valid JSON.
{
  "wallet_score": 0,
  "risk_level": "",
  "wallet_type": "",
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "verdict": ""
}
Rules:
- wallet_score must be between 0 and 100
- risk_level must be Low, Medium or High
- wallet_type should be one of:
  Retail Investor
  Trader
  DeFi User
  NFT Collector
  Whale
  Unknown
- strengths: 3-5 points
- weaknesses: 3-5 points
- suggestions: 3-5 points
- beginner friendly
- concise
- JSON only
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
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("June API error:", response.status, errText);
      return res.status(502).json({ error: "AI provider request failed" });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Unexpected AI response shape:", JSON.stringify(data));
      return res.status(502).json({ error: "No content returned by AI" });
    }

    // Strip code fences and grab just the {...} block in case the model
    // adds any preamble text around the JSON.
    const cleaned = content.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const toParse = jsonMatch ? jsonMatch[0] : cleaned;

    let parsed;
    try {
      parsed = JSON.parse(toParse);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw content:", content);
      return res.status(502).json({ error: "AI returned invalid JSON" });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
