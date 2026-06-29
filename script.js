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

  btn.innerHTML = `
    <span class="coin-symbol">${project.symbol}</span>
    <span class="coin-name">${project.name}</span>
    <span class="coin-rank">#${project.rank}</span>
  `;

  btn.addEventListener("click", () => {
    projectInput.value = project.name;
  });

  container.appendChild(btn);

});

  } catch (err) {
    console.error(err);
  }
}

loadTrending();
