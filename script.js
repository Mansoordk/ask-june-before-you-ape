const analyzeBtn = document.getElementById("analyzeBtn");
const projectInput = document.getElementById("projectInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

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

    result.innerHTML = `
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
          ${(data.strengths || [])
            .map(item => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>

      <div class="card">
        <h2>⚠️ Risks</h2>
        <ul>
          ${(data.risks || [])
            .map(item => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>

      <div class="card">
        <h2>🥊 Competitors</h2>
        <ul>
          ${(data.competitors || [])
            .map(item => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>

      <div class="card">
  <h2>🟢 Bull Case</h2>
  <ul>
    ${(data.bull_case || [])
      .map(item => `<li>${item}</li>`)
      .join("")}
  </ul>
</div>

<div class="card">
  <h2>🔴 Bear Case</h2>
  <ul>
    ${(data.bear_case || [])
      .map(item => `<li>${item}</li>`)
      .join("")}
  </ul>
</div>

<div class="card">
  <h2>🎯 Investment Thesis</h2>
  <p>${data.investment_thesis || "No investment thesis available."}</p>
</div>

<div class="card">
  <h2>🪙 Tokenomics Snapshot</h2>

  <table class="tokenomics-table">

    <tr>
      <td>Ticker</td>
      <td>${data.tokenomics?.ticker || "Unknown"}</td>
    </tr>

    <tr>
      <td>Category</td>
      <td>${data.tokenomics?.category || "Unknown"}</td>
    </tr>

    <tr>
      <td>Market Cap</td>
      <td>${data.tokenomics?.market_cap || "Unknown"}</td>
    </tr>

    <tr>
      <td>FDV</td>
      <td>${data.tokenomics?.fdv || "Unknown"}</td>
    </tr>

    <tr>
      <td>Circulating Supply</td>
      <td>${data.tokenomics?.circulating_supply || "Unknown"}</td>
    </tr>

    <tr>
      <td>Max Supply</td>
      <td>${data.tokenomics?.max_supply || "Unknown"}</td>
    </tr>

  </table>
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
