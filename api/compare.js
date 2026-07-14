export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { project } = req.body;

    const prompt = `
You are a professional crypto analyst.

The user wants to compare:

${project}

Return ONLY valid JSON.

{
  "project_a":"",
  "project_b":"",
  "winner":"",
  "summary":"",
  "comparison":{
    "Use Case":{"a":"","b":""},
    "Risk":{"a":"","b":""},
    "Adoption":{"a":"","b":""},
    "Developer Activity":{"a":"","b":""},
    "Long-term Outlook":{"a":"","b":""}
  }
}
`;

    const response = await fetch(
      "https://api.blockchain.info/ai/api/v1/chat/completions",
      {
        method:"POST",
        headers:{
          Authorization:`Bearer ${process.env.JUNE_API_KEY}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          model:process.env.JUNE_MODEL,
          messages:[
            {
              role:"user",
              content:prompt
            }
          ]
        })
      }
    );

    const ai = await response.json();

    const content =
      ai.choices[0].message.content
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

    res.status(200).json(
      JSON.parse(content)
    );

  } catch(err){

    console.error(err);

    res.status(500).json({
      error:"AI comparison failed."
    });

  }

}
