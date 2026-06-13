const imageInput = document.querySelector("#imageInput");
const promptInput = document.querySelector("#promptInput");
const modeInput = document.querySelector("#modeInput");
const ratioInput = document.querySelector("#ratioInput");
const strengthInput = document.querySelector("#strengthInput");
const strengthValue = document.querySelector("#strengthValue");
const previewImage = document.querySelector("#previewImage");
const previewCanvas = document.querySelector("#previewCanvas");
const emptyState = document.querySelector("#emptyState");
const progressBar = document.querySelector("#progressBar");
const resultLabel = document.querySelector("#resultLabel");
const downloadButton = document.querySelector("#downloadButton");
const sampleButton = document.querySelector("#sampleButton");
const resetButton = document.querySelector("#resetButton");
const generatorForm = document.querySelector("#generatorForm");
const styleChips = document.querySelectorAll(".style-chip");

let uploadedImage = "";
let activeStyle = "电影感";
let progressTimer;

const sampleSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ead8bd"/>
        <stop offset="0.55" stop-color="#8da07f"/>
        <stop offset="1" stop-color="#241b17"/>
      </linearGradient>
      <radialGradient id="sun" cx="62%" cy="26%" r="22%">
        <stop offset="0" stop-color="#ffb84d"/>
        <stop offset="1" stop-color="#ffb84d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)"/>
    <rect width="1200" height="900" fill="url(#sun)"/>
    <path d="M0 700 C240 560 390 720 600 620 C820 514 980 560 1200 420 L1200 900 L0 900 Z" fill="#17110d" opacity=".62"/>
    <circle cx="574" cy="380" r="120" fill="#fff8ec" opacity=".9"/>
    <rect x="444" y="500" width="270" height="250" rx="130" fill="#c9582b"/>
    <text x="80" y="120" font-family="Arial" font-size="54" font-weight="800" fill="#fff8ec">Sample Image</text>
  </svg>
`;

function setPreview(src) {
  uploadedImage = src;
  previewImage.src = src;
  previewImage.style.display = "block";
  emptyState.style.display = "none";
  previewCanvas.classList.remove("generated");
  downloadButton.disabled = true;
}

function resetStudio() {
  uploadedImage = "";
  imageInput.value = "";
  promptInput.value = "";
  progressBar.style.width = "0%";
  previewImage.removeAttribute("src");
  previewImage.style.display = "none";
  emptyState.style.display = "block";
  previewCanvas.classList.remove("generated");
  downloadButton.disabled = true;
  resultLabel.textContent = "AI 生成结果";
}

function updateRatio() {
  const ratio = ratioInput.value;
  const [width, height] = ratio.split(":").map(Number);
  previewCanvas.style.aspectRatio = `${width} / ${height}`;
}

function simulateGeneration() {
  let progress = 0;
  clearInterval(progressTimer);
  progressBar.style.width = "0%";
  downloadButton.disabled = true;
  previewCanvas.classList.remove("generated");

  progressTimer = setInterval(() => {
    progress += Math.random() * 18 + 8;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(progressTimer);
      previewCanvas.classList.add("generated");
      resultLabel.textContent = `${activeStyle} · ${modeInput.value} · ${strengthInput.value}%`;
      downloadButton.disabled = false;
    }
  }, 260);
}

imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files;

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => setPreview(reader.result));
  reader.readAsDataURL(file);
});

styleChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    styleChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeStyle = chip.textContent.trim();
  });
});

strengthInput.addEventListener("input", () => {
  strengthValue.textContent = `${strengthInput.value}%`;
});

ratioInput.addEventListener("change", updateRatio);

sampleButton.addEventListener("click", () => {
  const encoded = window.btoa(unescape(encodeURIComponent(sampleSvg)));
  setPreview(`data:image/svg+xml;base64,${encoded}`);
});

resetButton.addEventListener("click", resetStudio);

generatorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!uploadedImage) {
    sampleButton.click();
  }

  if (!promptInput.value.trim()) {
    promptInput.value = "将参考图改造成高级电影感视觉，保留主体构图，增强光影、材质和背景氛围。";
  }

  simulateGeneration();
});

downloadButton.addEventListener("click", () => {
  if (!uploadedImage) {
    return;
  }

  const link = document.createElement("a");
  link.href = uploadedImage;
  link.download = "imagemorph-ai-result.png";
  link.click();
});

updateRatio();
