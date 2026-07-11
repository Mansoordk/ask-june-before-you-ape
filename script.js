const analyzeBtn = document.getElementById("analyzeBtn");
const projectInput = document.getElementById("projectInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

function renderAnalysis(data, tokenomics) {
  return `
    <div class="risk-card ${data.risk_level?.toLowerCase()}">
      <h2>Risk Score</h2>

      <h1>${data.risk_score}/100</h1>

      <div class="risk-bar">
        <div
          class="risk-fill ${data.risk_level?.toLowerCase()}"
          style="width:${data.risk_score}%"
        ></div>
      </div>

      <p>${data.risk_level} Risk</p>
    </div>

  ${renderTokenomics(tokenomics)}

${renderProjectInfo(tokenomics)}

${renderMarketPerformance(tokenomics)}

${renderPricePerformance(tokenomics)}

${renderChart()}

    <div class="card">
      <h2>📋 Overview</h2>
      <p>${data.overview || "No overview available."}</p>
    </div>

    <div class="card">
      <h2>⚙️ Use Case</h2>
      <p>${data.use_case || "No use case available."}</p>
    </div>

    <div class="card">
      <h2>💪 Strengths</h2>
      <ul>
        ${(data.strengths || []).map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h2>⚠️ Risks</h2>
      <ul>
        ${(data.risks || []).map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h2>🥊 Competitors</h2>
      <ul>
        ${(data.competitors || []).map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h2>🟢 Bull Case</h2>
      <ul>
        ${(data.bull_case || []).map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h2>🔴 Bear Case</h2>
      <ul>
        ${(data.bear_case || []).map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h2>🎯 Investment Thesis</h2>
      <p>${data.investment_thesis || "No investment thesis available."}</p>
    </div>

    <div class="card">
      <h2>📈 Outlook</h2>
      <p>${data.outlook || "No outlook available."}</p>
    </div>

    <div class="card">
      <h2>🎯 Verdict</h2>
      <p>${data.verdict || "No verdict available."}</p>
    </div>

    <div class="card">
      <button id="copyBtn">📋 Copy Analysis</button>
      <button id="shareBtn">𝕏 Share on X</button>
      <button id="downloadBtn">📸 Download Image</button>
    </div>
  `;
}


function renderTokenomics(token) {

  if (!token) return "";

  return `
  <div class="card">

    <h2>🪙 Tokenomics Snapshot</h2>

    <div class="tokenomics-grid">

      <div class="token-box">
        <span>💰 Price</span>
        <strong>${token.price}</strong>
      </div>

      <div class="token-box">
        <span>🏆 Market Cap</span>
        <strong>${token.marketCap}</strong>
      </div>

      <div class="token-box">
        <span>📈 FDV</span>
        <strong>${token.fdv}</strong>
      </div>

      <div class="token-box">
        <span>🔄 24h Volume</span>
        <strong>${token.volume}</strong>
      </div>

      <div class="token-box">
        <span>🪙 Circulating</span>
        <strong>${token.supply}</strong>
      </div>

      <div class="token-box">
        <span>🥇 Rank</span>
        <strong>#${token.rank}</strong>
      </div>

    </div>

  </div>
  `;
}


function renderProjectInfo(token) {

  if (!token) return "";

  return `
    <div class="card">

      <h2>🌐 Project Information</h2>

      <div class="tokenomics-grid">

        <div class="token-box">
          <span>🏷️ Category</span>
          <strong>${token.category || "N/A"}</strong>
        </div>

        <div class="token-box">
          <span>📅 Launch Date</span>
          <strong>${token.genesisDate || "N/A"}</strong>
        </div>

        <div class="token-box">
          <span>🌍 Website</span>
          <strong>
            ${
              token.website
                ? `<a href="${token.website}" target="_blank">Open ↗</a>`
                : "N/A"
            }
          </strong>
        </div>

        <div class="token-box">
          <span>𝕏 Twitter</span>
          <strong>
            ${
              token.twitter
                ? `<a href="${token.twitter}" target="_blank">Open ↗</a>`
                : "N/A"
            }
          </strong>
        </div>

        <div class="token-box">
          <span>💻 GitHub</span>
          <strong>
            ${
              token.github
                ? `<a href="${token.github}" target="_blank">Open ↗</a>`
                : "N/A"
            }
          </strong>
        </div>

        <div class="token-box">
          <span>💬 Telegram</span>
          <strong>
            ${
              token.telegram
                ? `<a href="${token.telegram}" target="_blank">Open ↗</a>`
                : "N/A"
            }
          </strong>
        </div>

      </div>

    </div>
  `;
}

function renderMarketPerformance(token) {

  if (!token) return "";

  return `
    <div class="card">

      <h2>📈 Market Performance</h2>

      <div class="tokenomics-grid">

        <div class="token-box">
          <span>🏆 All-Time High</span>
          <strong>${token.ath}</strong>
        </div>

        <div class="token-box">
          <span>📉 From ATH</span>
          <strong>${token.athChange?.toFixed(2)}%</strong>
        </div>

        <div class="token-box">
          <span>📅 ATH Date</span>
          <strong>${
            token.athDate
              ?new Date(token.athDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : "N/A"
          }</strong>
        </div>

        <div class="token-box">
          <span>📉 All-Time Low</span>
          <strong>${token.atl}</strong>
        </div>

        <div class="token-box">
          <span>🚀 From ATL</span>
          <strong>${token.atlChange?.toFixed(2)}%</strong>
        </div>

        <div class="token-box">
          <span>📅 ATL Date</span>
          <strong>${
            token.atlDate
              ?new Date(token.atlDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"
          }</strong>
        </div>

      </div>

    </div>
  `;
}


function renderPricePerformance(token) {

  if (!token) return "";

  const color = (value) => {
    if (value == null) return "#ffffff";
    return value >= 0 ? "#22c55e" : "#ef4444";
  };

  const arrow = (value) => {
    if (value == null) return "";
    return value >= 0 ? "▲" : "▼";
  };

  const format = (value) => {
    if (value == null) return "N/A";
    return `${arrow(value)} ${Math.abs(value).toFixed(2)}%`;
  };

  return `
    <div class="card">

      <h2>📊 Price Performance</h2>

      <div class="tokenomics-grid">

        <div class="token-box">
          <span>24 Hours</span>
          <strong style="color:${color(token.change24h)}">
            ${format(token.change24h)}
          </strong>
        </div>

        <div class="token-box">
          <span>7 Days</span>
          <strong style="color:${color(token.change7d)}">
            ${format(token.change7d)}
          </strong>
        </div>

        <div class="token-box">
          <span>30 Days</span>
          <strong style="color:${color(token.change30d)}">
            ${format(token.change30d)}
          </strong>
        </div>

        <div class="token-box">
          <span>1 Year</span>
          <strong style="color:${color(token.change1y)}">
            ${format(token.change1y)}
          </strong>
        </div>

      </div>

    </div>
  `;
}


function renderChart() {

  return `
    <div class="card">
      <h2>📈 7-Day Price Chart</h2>

      <canvas id="priceChart"></canvas>

    </div>
  `;

}


function formatNumber(value) {

  if (value == null) return "N/A";

  const num = Number(value);

  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";

  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";

  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";

  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";

  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2
  });

}

function formatMoney(value) {

  if (value == null) return "N/A";

  const num = Number(value);

  if (num >= 1e12) return "$" + (num / 1e12).toFixed(2) + "T";

  if (num >= 1e9) return "$" + (num / 1e9).toFixed(2) + "B";

  if (num >= 1e6) return "$" + (num / 1e6).toFixed(2) + "M";

  if (num >= 1e3) return "$" + (num / 1e3).toFixed(2) + "K";

  return "$" + num.toLocaleString(undefined, {
    maximumFractionDigits: 2
  });

}


analyzeBtn.addEventListener("click", async () => {
  const project = projectInput.value.trim();


  if (!project) {
    alert("Enter a project name");
    return;
  }

analyzeBtn.disabled = true;
analyzeBtn.textContent = "Analyzing...";

loading.classList.remove("hidden");
result.innerHTML = "";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project }),
    });

    const data = await response.json();

    let tokenomics = null;

try {

  const tokenResponse = await fetch(
    `/api/tokenomics?project=${encodeURIComponent(project)}`
  );

  if (tokenResponse.ok) {
const token = await tokenResponse.json();

tokenomics = {
  // Tokenomics
  price: formatMoney(token.price),
  marketCap: formatMoney(token.market_cap),
  fdv: formatMoney(token.fdv),
  volume: formatMoney(token.volume),
  supply: formatNumber(token.circulating_supply),
  rank: token.rank,

  // Project Information
  website: token.website,
  twitter: token.twitter,
  github: token.github,
  telegram: token.telegram,
  category: token.category,
  genesisDate: token.genesis_date,

  // Market Performance
  ath: formatMoney(token.ath),
  athChange: token.ath_change,
  athDate: token.ath_date,

  atl: formatMoney(token.atl),
  atlChange: token.atl_change,
  atlDate: token.atl_date,

  // Price Performance
  change24h: token.price_change_24h,
  change7d: token.price_change_7d,
  change30d: token.price_change_30d,
  change1y: token.price_change_1y,
};

  }

} catch (err) {

  console.error("Tokenomics Error:", err);

}

 result.innerHTML =
  renderAnalysis(data, tokenomics);

    try {

  const chartResponse = await fetch(
    `/api/chart?project=${encodeURIComponent(project)}`
  );

  if (chartResponse.ok) {

    const prices = await chartResponse.json();

    const labels = prices.map((_, i) => i + 1);

    const values = prices.map(p => p[1]);

    new Chart(
      document.getElementById("priceChart"),
      {
        type: "line",

        data: {

          labels,

          datasets: [

            {

              label: "Price (USD)",

              data: values,

              borderColor: "#3b82f6",

              borderWidth: 2,

              fill: false,

              tension: .35,

              pointRadius: 0

            }

          ]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {

              display: false

            }

          },

          scales: {

            x: {

              display: false

            },

            y: {

              ticks: {

                color: "#cbd5e1"

              }

            }

          }

        }

      }
    );

  }

} catch (err) {

  console.error("Chart Error:", err);

}

    // Copy button
    document
      .getElementById("copyBtn")
      .addEventListener("click", async () => {
        await navigator.clipboard.writeText(
          result.innerText
        );

        alert("Analysis copied successfully.");
      });


    // Download Image button
document
  .getElementById("downloadBtn")
  .addEventListener("click", async () => {

    try {

      const canvas = await html2canvas(
        document.getElementById("result")
      );

      const link = document.createElement("a");

      link.href = canvas.toDataURL("image/png");

      link.download =
        `${project}-analysis.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    } catch (error) {

      console.error(
        "Download Error:",
        error
      );

      alert(
        "Download failed. Check console."
      );
    }

});
   // Share button
document
  .getElementById("shareBtn")
  .addEventListener("click", () => {

    const tweet = `I analyzed ${project} using Ask June Before You Ape 🚀

Risk Score: ${data.risk_score}/100
Risk Level: ${data.risk_level}

Powered by June AI

https://ask-june-before-you-ape.vercel.app`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank"
    );
  });

  } catch (err) {
    console.error(err);

    result.innerHTML = `
      <div class="card">
        Something went wrong. Please try again.
      </div>
    `;
  }

  loading.classList.add("hidden");

analyzeBtn.disabled = false;
analyzeBtn.textContent = "Analyze with June";
});


async function loadTrending() {
  try {
    const response = await fetch("/api/trending");
    const projects = await response.json();

    const container =
      document.getElementById("trendingProjects");

    container.innerHTML = "";

   projects.forEach(project => {

  const btn = document.createElement("button");

  btn.className = "example-btn";

const positive = project.change >= 0;

// Format the price nicely
let price = "N/A";

if (project.price !== "N/A") {
  const value = Number(project.price);

  if (!isNaN(value)) {
    if (value >= 1) {
      price = value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      price = `$${value.toFixed(4)}`;
    }
  }
}

btn.innerHTML = `
<div class="coin-card">

  <div class="coin-top">
    <span class="coin-symbol">${project.symbol}</span>
    <span class="coin-rank">#${project.rank ?? "-"}</span>
  </div>

  <div class="coin-name">
    ${project.name}
  </div>

  <div class="coin-price">
    ${price}
  </div>

  <div class="${positive ? "coin-green" : "coin-red"}">
    ${
      project.change == null
        ? "N/A"
        : `${positive ? "▲" : "▼"} ${Math.abs(project.change).toFixed(2)}%`
    }
  </div>

</div>
`;

btn.addEventListener("click", () => {
  projectInput.value = project.name;

  // Automatically analyze the selected project
  analyzeBtn.click();
});

  container.appendChild(btn);

});

  } catch (err) {
    console.error(err);
  }
}

loadTrending();

projectInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    analyzeBtn.click();
  }
});
