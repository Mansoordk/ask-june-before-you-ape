export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/search/trending"
    );

    const data = await response.json();

    // Wannan zai nuna mana response ɗin a Vercel Logs
    console.log(JSON.stringify(data, null, 2));

    const coins = data.coins
      .slice(0, 6)
      .map(({ item }) => ({
        name: item.name,
        symbol: item.symbol,
        rank: item.market_cap_rank,
        price: item.data?.price || "N/A",
        change:
          item.data?.price_change_percentage_24h?.usd ?? null,
      }));

    return res.status(200).json(coins);

  } catch (err) {
    console.error(err);

    return res.status(200).json([
      {
        name: "Bitcoin",
        symbol: "BTC",
        rank: 1,
        price: "$108,000",
        change: 2.5,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        rank: 2,
        price: "$2,700",
        change: -1.2,
      },
    ]);
  }
}
