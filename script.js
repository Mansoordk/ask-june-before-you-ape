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
        <p>${data.risk_level} Risk</p>
      </div>

      <div class="card">
        <h2>📋 Overview</h2>
        <p>${data.overview}</p>
      </div>

      <div class="card">
        <h2>⚙️ Use Case</h2>
        <p>${data.use_case}</p>
      </div>

      <div class="card">
        <h2>💪 Strengths</h2>
        <ul>
          ${data.strengths.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="card">
        <h2>⚠️ Risks</h2>
        <ul>
          ${data.risks.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="card">
        <h2>🥊 Competitors</h2>
        <ul>
          ${data.competitors.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="card">
        <h2>📈 Outlook</h2>
        <p>${data.outlook}</p>
      </div>

      <div class="card">
        <h2>🎯 Verdict</h2>
        <p>${data.verdict}</p>
      </div>
    `;
  } catch (err) {
    result.innerHTML = `
      <div class="card">
        Something went wrong.
      </div>
    `;
  }

  loading.classList.add("hidden");
});
