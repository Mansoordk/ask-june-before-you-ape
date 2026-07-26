const BASE_URL = "https://deep-index.moralis.io/api/v2.2";

const headers = {
  "X-API-Key": process.env.MORALIS_API_KEY
};

async function moralisFetch(endpoint) {
  // ✅ Ensure there's always a leading slash
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const res = await fetch(`${BASE_URL}${path}`, { headers });

  if (!res.ok) {
    throw new Error(`Moralis API error (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

module.exports = { moralisFetch };
