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

    // Coin details
    const coinRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );

    const coin = await coinRes.json();

    return res.status(200).json({
      // Tokenomics
      price: coin.market_data.current_price.usd,
      market_cap: coin.market_data.market_cap.usd,
      fdv: coin.market_data.fully_diluted_valuation.usd,
      volume: coin.market_data.total_volume.usd,
      circulating_supply: coin.market_data.circulating_supply,
      total_supply: coin.market_data.total_supply,
      max_supply: coin.market_data.max_supply,
      rank: coin.market_cap_rank,

      // Market performance
      ath: coin.market_data.ath.usd,
      ath_change: coin.market_data.ath_change_percentage.usd,
      ath_date: coin.market_data.ath_date.usd,

      atl: coin.market_data.atl.usd,
      atl_change: coin.market_data.atl_change_percentage.usd,
      atl_date: coin.market_data.atl_date.usd,


      // Links
      website: coin.links.homepage?.[0] || null,

      twitter: coin.links.twitter_screen_name
        ? `https://x.com/${coin.links.twitter_screen_name}`
        : null,

      github: coin.links.repos_url.github?.[0] || null,

      telegram: coin.links.telegram_channel_identifier
        ? `https://t.me/${coin.links.telegram_channel_identifier}`
        : null,

      // Project Info
      category: coin.categories?.[0] || "N/A",
      genesis_date: coin.genesis_date,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch tokenomics",
    });
  }
}
