const BASE_URL = "https://deep-index.moralis.io/api/v2.2";

const headers = {
  "X-API-Key": process.env.MORALIS_API_KEY
};

async function moralisFetch(endpoint) {

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();

}

module.exports = {
  moralisFetch
};
