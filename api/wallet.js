const { moralisFetch } = require("./moralis");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        error: "Wallet address is required"
      });
    }

    // Native ETH Balance
    const native = await moralisFetch(
      `/wallets/${address}/balance?chain=eth`
    );

    // ERC20 Tokens
    const tokenData = await moralisFetch(
      `/wallets/${address}/tokens?chain=eth`
    );

    const tokens = Array.isArray(tokenData.result)
      ? tokenData.result
      : [];

    const nativeBalance =
      Number(native.balance) / 1e18;

    const nativeUsd =
      Number(native.usd_value || 0);

    const holdings = tokens.map(t => ({

      symbol: t.symbol,

      name: t.name,

      balance:
        Number(t.balance) /
        Math.pow(10, t.decimals),

      usd:
        Number(t.usd_value || 0)

    }));

    const totalValue =
      nativeUsd +
      holdings.reduce(
        (sum, t) => sum + t.usd,
        0
      );

    return res.status(200).json({

      address,

      portfolio_value: totalValue,

      native: {

        symbol: native.native_token?.symbol || "ETH",

        balance: nativeBalance,

        usd: nativeUsd

      },

      holdings

    });

  }

  catch (err) {

    console.error(err);

    return res.status(500).json({

      error: err.message

    });

  }

};
