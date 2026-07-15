export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address } = req.body;

    // --- FIX 1 & 2: Parse the response, then log it ---
    const balanceRes = await fetch(
      `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`,
      {
        headers: { "X-API-Key": process.env.MORALIS_API_KEY }
      }
    );

    if (!balanceRes.ok) {
      console.error("Moralis error:", balanceRes.status, await balanceRes.text());
      return res.status(502).json({ error: "Failed to fetch wallet data" });
    }

    const { result: tokens } = await balanceRes.json();
    console.log(`Fetched ${tokens?.length ?? 0} tokens for ${address}`);

    // --- Top holdings ---
    const topTokens = (tokens ?? [])
      .slice(0, 10)
      .map(t => {
        const balance = Number(t.balance) / Math.pow(10, t.decimals ?? 18);
        return {
          symbol: t.symbol,
          balance,
          usd: t.usd_value ?? 0
        };
      });

    const totalValue = topTokens.reduce((a, b) => a + b.usd, 0);

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
      console.error("AI API error:", aiRes.status, await aiRes.text());
      return res.status(502).json({ error: "AI analysis failed" });
    }

    const aiData = await aiRes.json();

    // --- FIX 3: Validate AI response shape ---
    const choice = aiData?.choices?.[0];
    if (!choice?.message?.content) {
      console.error("Unexpected AI response:", JSON.stringify(aiData));
      return res.status(502).json({ error: "Invalid AI response format" });
    }

    const content = choice.message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Wrap JSON.parse in try/catch in case AI returns malformed JSON
    let report;
    try {
      report = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI JSON:", content);
      return res.status(502).json({ error: "AI returned invalid JSON" });
    }

    report.portfolio_value = totalValue;
    report.top_tokens = topTokens;

    return res.status(200).json(report);

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


const balanceRes = await fetch(
  `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`,
  { headers: { "X-API-Key": process.env.MORALIS_API_KEY } }
);

// 🔍 ADD THESE TWO LINES:
console.log("Moralis status:", balanceRes.status);
const raw = await balanceRes.text();
console.log("Moralis raw body (first 500 chars):", raw.slice(0, 500));

// Then try to parse it
const jsonData = JSON.parse(raw);
console.log("Parsed type:", typeof jsonData, "Is array?", Array.isArray(jsonData));
console.log("Has result?", jsonData?.result !== undefined);
const tokens = jsonData?.result;
console.log("Tokens type:", typeof tokens, "Is array?", Array.isArray(tokens));
