export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { address } = req.body;

    // Get wallet balances from Moralis

    const balanceRes = await fetch(

      `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`,

      {
        headers: {
          "X-API-Key": process.env.MORALIS_API_KEY
        }
      }

    );

    const tokens = await balanceRes.json();

    // Top holdings

    const topTokens = tokens
      .slice(0,10)
      .map(t=>{

        const balance =
        Number(t.balance) /
        Math.pow(10,t.decimals);

        return {

          symbol:t.symbol,

          balance,

          usd:t.usd_value ?? 0

        };

      });

    const totalValue =
    topTokens.reduce(
      (a,b)=>a+b.usd,
      0
    );

    const prompt = `

You are a professional crypto wallet analyst.

Analyze this wallet.

Address:

${address}

Portfolio Value:

$${totalValue}

Top Holdings:

${JSON.stringify(topTokens,null,2)}

Return ONLY valid JSON.

{

"wallet_score":0,

"risk_level":"",

"wallet_type":"",

"summary":"",

"strengths":[],

"weaknesses":[],

"suggestions":[],

"verdict":""

}

Rules:

wallet_score 0-100

risk_level = Low Medium High

strengths 3-5

weaknesses 3-5

suggestions 3-5

JSON ONLY

`;

    const ai = await fetch(

      "https://api.blockchain.info/ai/api/v1/chat/completions",

      {

        method:"POST",

        headers:{

          Authorization:`Bearer ${process.env.JUNE_API_KEY}`,

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          model:process.env.JUNE_MODEL,

          messages:[{

            role:"user",

            content:prompt

          }]

        })

      }

    );

    const aiData =
    await ai.json();

    const content =
    aiData.choices[0].message.content
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

    const report =
    JSON.parse(content);

    report.portfolio_value =
    totalValue;

    report.top_tokens =
    topTokens;

    return res.status(200).json(report);

  }

  catch(err){

    console.error(err);

    return res.status(500).json({

      error:"Internal Server Error"

    });

  }

}
