export default async function handler(req, res) {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({
        error: "Project name required",
      });
    }

    // Search project
    const searchRes = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(project)}`
    );

    const search = await searchRes.json();

    if (!search.coins.length) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const id = search.coins[0].id;

    // Fetch coin details
    const coinRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );

    const coin = await coinRes.json();

res.status(200).json({
  price: coin.market_data.current_price?.usd ?? null,

  market_cap: coin.market_data.market_cap?.usd ?? null,

  fdv:
    coin.market_data.fully_diluted_valuation?.usd ??
    coin.market_data.market_cap?.usd ??
    null,

  volume:
    coin.market_data.total_volume?.usd ??
    coin.market_data.total_volume?.btc ??
    null,

  circulating_supply:
    coin.market_data.circulating_supply ?? null,

  max_supply:
    coin.market_data.max_supply ?? null,

  rank: coin.market_cap_rank ?? null,
});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch tokenomics",
    });

  }
}
