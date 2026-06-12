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
      <div class="risk-card ${data.risk_level?.toLowerCase() || "medium"}">
        <h2>Risk Score</h2>
        <h1>${data.risk_score || "N/A"}/100</h1>
        <p>${data.risk_level || "Unknown"} Risk</p>
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
      </div>

      <div class="card">
        <small>
          Powered by June AI API • Built by @mernsoordk
        </small>
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

    // Share button
    document
      .getElementById("shareBtn")
      .addEventListener("click", () => {

        const tweet =
          `I just analyzed ${project} using Ask June Before You Ape 🚀\n\nPowered by June AI`;

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
