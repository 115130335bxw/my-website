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
const skillTabs = document.querySelectorAll(".skill-tab");
const minimaxForm = document.querySelector("#minimaxForm");
const skillPrompt = document.querySelector("#skillPrompt");
const skillMode = document.querySelector("#skillMode");
const skillOption = document.querySelector("#skillOption");
const skillReference = document.querySelector("#skillReference");
const skillExtra = document.querySelector("#skillExtra");
const skillPromptLabel = document.querySelector("#skillPromptLabel");
const skillModeLabel = document.querySelector("#skillModeLabel");
const skillOptionLabel = document.querySelector("#skillOptionLabel");
const skillReferenceWrap = document.querySelector("#skillReferenceWrap");
const skillReferenceLabel = document.querySelector("#skillReferenceLabel");
const skillExtraWrap = document.querySelector("#skillExtraWrap");
const skillExtraLabel = document.querySelector("#skillExtraLabel");
const skillBadge = document.querySelector("#skillBadge");
const skillTitle = document.querySelector("#skillTitle");
const skillDescription = document.querySelector("#skillDescription");
const skillProgress = document.querySelector("#skillProgress");
const commandPreview = document.querySelector("#commandPreview code");
const copyCommandButton = document.querySelector("#copyCommandButton");

let uploadedImage = "";
let activeStyle = "电影感";
let progressTimer;
let activeSkill = "image";
let skillTimer;

const minimaxSkills = {
  image: {
    badge: "image-01",
    title: "MiniMax 图片生成",
    description: "支持文生图、图生图、比例选择、URL 或 Base64 结果保存。",
    promptLabel: "图片提示词",
    modeLabel: "生成方式",
    optionLabel: "画面比例",
    referenceLabel: "参考图片 URL / 本地路径",
    extraLabel: "输出文件名",
    placeholder: "例如：一只橘猫在阳光下睡觉，电影感，细节丰富",
    referencePlaceholder: "图生图时填写，例如：https://example.com/cat.jpg 或 C:\\images\\cat.png",
    extraPlaceholder: "例如：output.png",
    modes: [
      ["generate", "文生图"],
      ["edit", "图生图"]
    ],
    options: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    defaultPrompt: "一张高级电影感产品海报，暖色光影，主体清晰，背景层次丰富"
  },
  video: {
    badge: "MiniMax-Hailuo-2.3",
    title: "MiniMax 视频生成",
    description: "支持文生视频、图生视频、首尾帧视频和主体参考视频，默认 5 秒 720P MP4。",
    promptLabel: "视频提示词",
    modeLabel: "视频模式",
    optionLabel: "输出设置",
    referenceLabel: "参考图片 / 起始帧 URL",
    extraLabel: "结束帧 URL / 输出文件名",
    placeholder: "例如：海浪轻轻拍打沙滩，夕阳逆光，镜头缓慢推进",
    referencePlaceholder: "图生视频、首尾帧或主体参考时填写图片 URL",
    extraPlaceholder: "首尾帧模式填写结束帧 URL，其他模式可填 output.mp4",
    modes: [
      ["generate", "文生视频"],
      ["from-image", "图生视频"],
      ["frames", "首尾帧视频"],
      ["subject", "主体参考视频"]
    ],
    options: ["自动下载 MP4", "仅创建任务"],
    defaultPrompt: "未来城市夜景中镜头缓慢穿过霓虹街道，电影感，细节丰富"
  },
  music: {
    badge: "music-2.5 / lyrics-01",
    title: "MiniMax 音乐生成",
    description: "支持歌词生成、完整音乐生成、分段歌词结构和 MP3 保存。",
    promptLabel: "音乐主题 / 歌词",
    modeLabel: "音乐功能",
    optionLabel: "音乐风格",
    referenceLabel: "关键词",
    extraLabel: "歌曲描述 / 输出文件名",
    placeholder: "生成音乐时填写歌词；生成歌词时填写主题，例如：一首关于夏天海边的歌",
    referencePlaceholder: "例如：阳光 沙滩 海浪",
    extraPlaceholder: "例如：欢快的流行电子风格 或 song.mp3",
    modes: [
      ["lyrics", "生成歌词"],
      ["generate", "生成音乐"]
    ],
    options: ["流行", "电子", "民谣", "摇滚", "温柔叙事"],
    defaultPrompt: "[verse]\\n傍晚的风吹过海岸\\n我们追着光奔跑\\n[chorus]\\n把夏天唱成一首歌"
  },
  speech: {
    badge: "speech-2.8-hd",
    title: "MiniMax 语音合成",
    description: "支持同步 TTS、异步 TTS、音色克隆、音色设计和常用音色选择。",
    promptLabel: "语音文本 / 音色描述",
    modeLabel: "语音功能",
    optionLabel: "音色",
    referenceLabel: "参考音频路径",
    extraLabel: "输出文件名 / 音色名称",
    placeholder: "例如：欢迎使用 MiniMax 多模态创作中心，今天我们一起把创意变成作品。",
    referencePlaceholder: "音色克隆时填写，例如：C:\\audio\\voice.mp3",
    extraPlaceholder: "例如：output.mp3 或 我的音色",
    modes: [
      ["tts", "同步语音合成"],
      ["tts-async", "异步语音合成"],
      ["clone", "音色克隆"],
      ["design", "音色设计"]
    ],
    options: ["female-tianmei", "male-yunyang", "female-badu", "male-shawn", "female-shanshan"],
    defaultPrompt: "欢迎使用 MiniMax 语音服务，这是一段自然流畅的中文旁白。"
  }
};

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

function shellQuote(value) {
  const text = String(value || "").trim();
  return `"${text.replaceAll('"', '\\"')}"`;
}

function fillSelect(select, values) {
  select.innerHTML = "";
  values.forEach((item) => {
    const option = document.createElement("option");
    if (Array.isArray(item)) {
      option.value = item[0];
      option.textContent = item[1];
    } else {
      option.value = item;
      option.textContent = item;
    }
    select.append(option);
  });
}

function setMiniMaxSkill(skillName) {
  const skill = minimaxSkills[skillName];
  activeSkill = skillName;

  skillTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.skill === skillName);
  });

  skillBadge.textContent = skill.badge;
  skillTitle.textContent = skill.title;
  skillDescription.textContent = skill.description;
  skillPromptLabel.textContent = skill.promptLabel;
  skillModeLabel.textContent = skill.modeLabel;
  skillOptionLabel.textContent = skill.optionLabel;
  skillReferenceLabel.textContent = skill.referenceLabel;
  skillExtraLabel.textContent = skill.extraLabel;
  skillPrompt.placeholder = skill.placeholder;
  skillReference.placeholder = skill.referencePlaceholder;
  skillExtra.placeholder = skill.extraPlaceholder;
  skillPrompt.value = skill.defaultPrompt;
  skillReference.value = "";
  skillExtra.value = "";
  skillProgress.style.width = "0%";
  fillSelect(skillMode, skill.modes);
  fillSelect(skillOption, skill.options);
  updateCommandPreview();
}

function buildMiniMaxCommand() {
  const prompt = skillPrompt.value.trim() || minimaxSkills[activeSkill].defaultPrompt;
  const mode = skillMode.value;
  const option = skillOption.value;
  const reference = skillReference.value.trim();
  const extra = skillExtra.value.trim();
  const base = "MINIMAX_API_KEY=你的密钥 MINIMAX_REGION=cn python";

  if (activeSkill === "image") {
    const output = extra || "output.png";
    if (mode === "edit") {
      return `${base} minimax-image/scripts/image.py edit ${shellQuote(prompt)} -i ${shellQuote(reference || "reference.png")} -o ${shellQuote(output)} -r ${option}`;
    }
    return `${base} minimax-image/scripts/image.py generate ${shellQuote(prompt)} -o ${shellQuote(output)} -r ${option}`;
  }

  if (activeSkill === "video") {
    const output = extra && !extra.startsWith("http") ? ` -o ${shellQuote(extra)}` : " -o output.mp4";
    if (mode === "from-image") {
      return `${base} minimax-video/scripts/video.py from-image ${shellQuote(prompt)} -i ${shellQuote(reference || "https://example.com/image.jpg")}${output}`;
    }
    if (mode === "frames") {
      return `${base} minimax-video/scripts/video.py frames ${shellQuote(prompt)} -s ${shellQuote(reference || "https://example.com/start.jpg")} -e ${shellQuote(extra || "https://example.com/end.jpg")} -o output.mp4`;
    }
    if (mode === "subject") {
      return `${base} minimax-video/scripts/video.py subject ${shellQuote(prompt)} -i ${shellQuote(reference || "https://example.com/person.jpg")}${output}`;
    }
    return `${base} minimax-video/scripts/video.py generate ${shellQuote(prompt)}${output}`;
  }

  if (activeSkill === "music") {
    if (mode === "lyrics") {
      const keywords = reference ? ` -k ${reference.split(/\s+/).map(shellQuote).join(" ")}` : "";
      return `${base} minimax-music/scripts/music.py lyrics ${shellQuote(prompt)}${keywords}`;
    }
    const description = extra || `${option} 风格，完整编曲，适合短视频`;
    return `${base} minimax-music/scripts/music.py generate ${shellQuote(prompt)} -d ${shellQuote(description)} -o song.mp3`;
  }

  if (mode === "clone") {
    return `${base} minimax-speech/scripts/speech.py clone ${shellQuote(reference || "reference_audio.mp3")} -t ${shellQuote(extra || "我的音色")}`;
  }
  if (mode === "design") {
    return `${base} minimax-speech/scripts/speech.py design ${shellQuote(prompt)} -s ${shellQuote(option)}`;
  }
  if (mode === "tts-async") {
    return `${base} minimax-speech/scripts/speech.py tts-async ${shellQuote(prompt)} -v ${shellQuote(option)}`;
  }
  return `${base} minimax-speech/scripts/speech.py tts ${shellQuote(prompt)} -v ${shellQuote(option)} -o ${shellQuote(extra || "output.mp3")}`;
}

function updateCommandPreview() {
  commandPreview.textContent = buildMiniMaxCommand();
}

function simulateSkillTask() {
  let progress = 0;
  clearInterval(skillTimer);
  skillProgress.style.width = "0%";

  skillTimer = setInterval(() => {
    progress += Math.random() * 20 + 10;
    skillProgress.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(skillTimer);
      skillDescription.textContent = "任务命令已生成。复制命令后，在 minimax-skills-main 项目根目录运行即可调用真实 MiniMax API。";
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

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => setMiniMaxSkill(tab.dataset.skill));
});

[skillPrompt, skillMode, skillOption, skillReference, skillExtra].forEach((element) => {
  element.addEventListener("input", updateCommandPreview);
  element.addEventListener("change", updateCommandPreview);
});

minimaxForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateCommandPreview();
  simulateSkillTask();
});

copyCommandButton.addEventListener("click", async () => {
  const text = commandPreview.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyCommandButton.textContent = "已复制";
    setTimeout(() => {
      copyCommandButton.textContent = "复制";
    }, 1400);
  } catch {
    copyCommandButton.textContent = "复制失败";
    setTimeout(() => {
      copyCommandButton.textContent = "复制";
    }, 1400);
  }
});

setMiniMaxSkill("image");
