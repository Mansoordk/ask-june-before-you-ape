const { moralisFetch } = require("./moralis");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Missing address in request body" });
    }

    // ✅ Using the shared moralisFetch helper — cleaner & DRY
    const [netWorthData, tokenData] = await Promise.all([
      moralisFetch(`/wallets/${address}/net-worth?chains%5B0%5D=eth&exclude_spam=true`),
      moralisFetch(`/wallets/${address}/tokens?chain=eth`)
    ]);

    const tokens = tokenData.result || [];

    // ✅ Array check BEFORE processing
    if (!Array.isArray(tokens)) {
      console.error("Unexpected response:", JSON.stringify(tokenData).slice(0, 500));
      return res.status(502).json({
        error: "Unexpected response format from Moralis"
      });
    }

    const topTokens = tokens.slice(0, 10).map(t => ({
      symbol: t.symbol,
      balance: Number(t.balance) / Math.pow(10, t.decimals ?? 18),
      usd: t.usd_value ?? 0
    }));

    // ✅ Single declaration — from the net worth endpoint
    const totalValue = Number(netWorthData.total_networth_usd || 0);

    const prompt = `
You are a professional crypto wallet analyst.
Analyze this wallet.
Address: ${address}
Portfolio Value: $${totalValue}
Top Holdings: ${JSON.stringify(topTokens, null, 2)}

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
wallet_score 0-100
risk_level = Low Medium High
strengths 3-5
weaknesses 3-5
suggestions 3-5
JSON ONLY
`;

    const aiRes = await fetch(
      "https://api.blockchain.info/ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.JUNE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.JUNE_MODEL,
          messages: [{ role: "user", content: prompt }]
        })
      }
    );

    if (!aiRes.ok) {
      return res.status(502).json({ error: "AI analysis request failed" });
    }

    const aiData = await aiRes.json();
    const choice = aiData?.choices?.[0];
    if (!choice?.message?.content) {
      return res.status(502).json({ error: "Invalid AI response format" });
    }

    const content = choice.message.content
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();

    const report = JSON.parse(content);
    report.portfolio_value = totalValue;
    report.top_tokens = topTokens;

    return res.status(200).json(report);

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
