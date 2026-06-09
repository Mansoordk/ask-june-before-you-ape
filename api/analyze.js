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

Analyze the crypto project: ${project}

Provide:

# Overview

# Core Use Case

# Key Strengths

# Potential Risks

# Main Competitors

# Long-Term Outlook

# Verdict

Keep the analysis balanced, objective and beginner-friendly.
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
          model: "gpt-4.1",
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

    return res.status(200).json({
      analysis:
        data?.choices?.[0]?.message?.content ||
        "No analysis returned.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
