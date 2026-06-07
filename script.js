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

    result.innerHTML = data.analysis;
  } catch (err) {
    result.innerHTML = "Something went wrong.";
  }

  loading.classList.add("hidden");
});
