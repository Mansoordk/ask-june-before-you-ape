export default async function handler(req, res) {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({
        error: "Project required",
      });
    }

    // Search coin
    const searchRes = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(project)}`
    );

    const search = await searchRes.json();

    if (!search.coins.length) {
      return res.status(404).json({
        error: "Coin not found",
      });
    }

    const id = search.coins[0].id;

    // Last 7 days prices
    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
    );

    const chart = await chartRes.json();

    res.status(200).json(chart.prices);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load chart",
    });

  }
}
