export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/search/trending"
    );

    const data = await response.json();
const coins = data.coins
  .slice(0, 6)
  .map(({ item }) => ({
    name: item.name,
    symbol: item.symbol,
    rank: item.market_cap_rank,
  }));

return res.status(200).json(coins);

  } catch (err) {
  return res.status(200).json([
  {
    name: "Bitcoin",
    symbol: "BTC",
    rank: 1
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    rank: 2
  },
  {
    name: "Solana",
    symbol: "SOL",
    rank: 6
  },
  {
    name: "Hyperliquid",
    symbol: "HYPE",
    rank: 11
  },
  {
    name: "Monad",
    symbol: "MON",
    rank: "-"
  }
]);
  }
}
