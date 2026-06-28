export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/search/trending"
    );

    const data = await response.json();

    const coins = data.coins
      .slice(0, 5)
      .map(item => item.item.name);

    return res.status(200).json(coins);

  } catch (err) {
    return res.status(200).json([
      "Bitcoin",
      "Ethereum",
      "Solana",
      "Hyperliquid",
      "Monad"
    ]);
  }
}
