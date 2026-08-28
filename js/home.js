const SESSION_KEY = "bcr_admin_session";

if (!sessionStorage.getItem(SESSION_KEY)) {
  window.location.replace("index.html");
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
});

document.querySelectorAll(".nav-item").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".nav-item").forEach(function (el) {
      el.classList.remove("active");
    });
    btn.classList.add("active");
  });
});

function executeCalculation() {
  const s1 = Number(document.getElementById("slot1")?.value) || 0;
  const s2 = Number(document.getElementById("slot2")?.value) || 0;
  const s3 = Number(document.getElementById("slot3")?.value) || 1;
  const s4 = Number(document.getElementById("slot4")?.value) || 0;

  const divisor = s3 === 0 ? 1 : s3;
  const latentRaw = s1 + (s2 / divisor) * s4;
  const latent = Math.round(latentRaw);

  return {
    s1: s1,
    s2: s2,
    s3: s3,
    s4: s4,
    latent: latent,
  };
}

function getRandomPair() {
  const nums = [6, 7, 8, 9];
  const a = nums[Math.floor(Math.random() * nums.length)];
  const larger = nums.filter(function (n) {
    return n > a;
  });
  const b = larger[Math.floor(Math.random() * larger.length)];
  return a + "-" + b;
}

function updateSideRange() {
  const el = document.getElementById("sideRangeVal");
  if (el) {
    el.textContent = getRandomPair();
  }
}

document.querySelectorAll(".check").forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.classList.toggle("on");
  });
});

const sideConnectBtn = document.getElementById("sideConnectBtn");
if (sideConnectBtn) {
  sideConnectBtn.addEventListener("click", function () {
    const table = document.getElementById("sideTableInput")?.value.trim() || "C06";
    runConnect(table, this);
  });
}

function runConnect(table, btn) {
  const overlay = document.getElementById("connectOverlay");
  const logs = document.getElementById("connectLogs");
  const bar = document.getElementById("connectBar");
  const pct = document.getElementById("connectPct");
  const title = document.getElementById("connectTitle");
  const sideConnPct = document.getElementById("sideConnPct");
  const sideAccRate = document.getElementById("sideAccRate");
  const sideInput = document.getElementById("sideTableInput");
  const lines = [
    { t: "> scanning table frequency...", c: "" },
    { t: "> handshake_tesla.dll  OK", c: "ok" },
    { t: "> syncing latent core...", c: "" },
    { t: "> AES-256 tunnel established", c: "ok" },
    { t: "> ACCESS GRANTED", c: "hot" },
  ];

  if (sideInput) sideInput.value = table.toUpperCase();
  if (btn) btn.disabled = true;

  logs.innerHTML = "";
  bar.style.width = "0%";
  pct.textContent = "00%";
  title.textContent = "CONNECTING TO TABLE";
  document.getElementById("connectTable").textContent = "TABLE " + table.toUpperCase();
  overlay.hidden = false;

  let step = 0;
  const timer = setInterval(function () {
    step += 1;
    const progress = Math.min(100, step * 8);
    bar.style.width = progress + "%";
    pct.textContent = String(progress).padStart(2, "0") + "%";
    if (sideConnPct) sideConnPct.textContent = progress + "%";
    if (sideAccRate) {
      const liveRate = Math.floor(Math.random() * (90 - 75 + 1)) + 75;
      sideAccRate.textContent = liveRate + "%";
    }

    if (step % 3 === 0 && lines.length) {
      const line = lines.shift();
      const li = document.createElement("li");
      li.textContent = line.t;
      if (line.c) li.className = line.c;
      logs.appendChild(li);
    }

    if (progress >= 100) {
      clearInterval(timer);
      title.textContent = "UPLINK ESTABLISHED";
      if (btn) {
        btn.disabled = false;
        btn.textContent = "LINKED";
      }
      document.querySelector('[data-check="table"]').classList.add("on");
      if (sideConnPct) sideConnPct.textContent = "100%";
      if (sideAccRate) {
        const finalRate = Math.floor(Math.random() * 16) + 75;
        sideAccRate.textContent = finalRate + "%";
      }
      updateSideRange();
      setTimeout(function () {
        overlay.hidden = true;
      }, 700);
    }
  }, 120);
}

const sideTableInput = document.getElementById("sideTableInput");
if (sideTableInput) {
  sideTableInput.addEventListener("input", function () {
    const val = this.value.trim();
    document.querySelector('[data-check="table"]').classList.toggle("on", val.length > 0);
  });
}

function resetAllToZero() {
  if (document.getElementById("slot1")) document.getElementById("slot1").value = 1;
  if (document.getElementById("slot2")) document.getElementById("slot2").value = 2;
  if (document.getElementById("slot3")) document.getElementById("slot3").value = 3;
  if (document.getElementById("slot4")) document.getElementById("slot4").value = 4;
  if (document.getElementById("statPatterns")) document.getElementById("statPatterns").value = "";
  if (document.getElementById("statHands")) document.getElementById("statHands").value = "";
  if (document.getElementById("statCards")) document.getElementById("statCards").value = "";
  document.querySelectorAll(".bead-input").forEach(function (inp) {
    inp.value = "";
  });
  const formulaBar = document.querySelector(".formula-bar");
  if (formulaBar) {
    formulaBar.textContent = "CÔNG THỨC TẠO RA CƠ SỐ PHỤ (LATENT FACTOR)";
  }
  const out = document.getElementById("resultOut");
  if (out) {
    out.textContent = "—";
    out.style.color = "var(--cyan)";
    out.classList.remove("calculating", "revealed");
  }
  const resultCell = document.querySelector(".result-cell");
  if (resultCell) resultCell.classList.remove("calculating");
}

document.getElementById("resetBtn").addEventListener("click", function () {
  resetAllToZero();
  if (sideTableInput) sideTableInput.value = "C06";
  if (sideConnectBtn) {
    sideConnectBtn.disabled = false;
    sideConnectBtn.textContent = "CONNECT";
  }
  const sideConnPct = document.getElementById("sideConnPct");
  if (sideConnPct) sideConnPct.textContent = "100%";
  const sideAccRate = document.getElementById("sideAccRate");
  if (sideAccRate) {
    const defaultRate = Math.floor(Math.random() * 16) + 75;
    sideAccRate.textContent = defaultRate + "%";
  }
  updateSideRange();
  document.querySelectorAll(".check").forEach(function (el) {
    el.classList.remove("on");
  });
});

updateSideRange();

let isAnalyzing = false;

document.getElementById("analyzeBtn").addEventListener("click", function () {
  if (isAnalyzing) return;
  isAnalyzing = true;
  const btn = this;
  btn.disabled = true;

  const data = executeCalculation();
  const formulaBar = document.querySelector(".formula-bar");
  const resultCell = document.querySelector(".result-cell");
  const resultOut = document.getElementById("resultOut");
  const calcDelay = Math.floor(Math.random() * 1000) + 4000;

  if (formulaBar) {
    formulaBar.textContent =
      "ĐANG TÍNH: " + data.s1 + " + (" + data.s2 + " : " + data.s3 + ") × " + data.s4 + " ...";
  }

  if (resultCell) resultCell.classList.add("calculating");
  if (resultOut) {
    resultOut.classList.remove("revealed");
    resultOut.classList.add("calculating");
    resultOut.textContent = "CALC...";
    resultOut.style.color = "#00ffe5";
  }

  const flickers = ["CALC...", "SYNC...", "0x8F", "MATRIX", "ANALYZING", "SCANNING", "98.4%", "COMPUTING..."];
  let flickerCount = 0;
  const flickerInterval = setInterval(function () {
    flickerCount += 1;
    if (resultOut) {
      const randText = flickers[Math.floor(Math.random() * flickers.length)];
      resultOut.textContent = randText;
      resultOut.style.color = flickerCount % 2 === 0 ? "#ff2bd6" : "#00ffe5";
    }
  }, 120);

  setTimeout(function () {
    clearInterval(flickerInterval);
    if (resultCell) resultCell.classList.remove("calculating");

    if (resultOut) {
      resultOut.classList.remove("calculating");
      resultOut.classList.add("revealed");
      resultOut.textContent = String(data.latent);
      resultOut.style.color = "#00ffe5";
    }

    if (formulaBar) {
      formulaBar.textContent =
        data.s1 + " + (" + data.s2 + " : " + data.s3 + ") × " + data.s4 + " = " + data.latent;
    }
    document.querySelector('[data-check="data"]').classList.add("on");

    setTimeout(function () {
      const modal = document.getElementById("resultModal");
      if (modal) {
        document.getElementById("rmValCoeffs").textContent =
          data.s1 + " + (" + data.s2 + " : " + data.s3 + ") × " + data.s4;
        document.getElementById("rmValLatent").textContent = String(data.latent);

        const verdictBox = document.getElementById("rmVerdictBox");
        verdictBox.className = "rm-verdict latent";
        document.getElementById("rmVerdictName").textContent = String(data.latent);
        document.getElementById("rmVerdictSub").textContent = "KẾT QUẢ LATENT FACTOR";

        modal.hidden = false;
      }
      isAnalyzing = false;
      btn.disabled = false;
    }, 400);
  }, calcDelay);
});

const closeResultBtn = document.getElementById("closeResultBtn");
if (closeResultBtn) {
  closeResultBtn.addEventListener("click", function () {
    const modal = document.getElementById("resultModal");
    if (modal) modal.hidden = true;
    resetAllToZero();
  });
}

(function matrixRain() {
  const canvas = document.getElementById("matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const glyphs = "01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF";

  function size() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  size();

  const fontSize = 12;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array.from({ length: columns }, function () {
    return Math.random() * 40;
  });

  function draw() {
    ctx.fillStyle = "rgba(0, 6, 24, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px JetBrains Mono, monospace";
    for (let i = 0; i < drops.length; i += 1) {
      const ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
      ctx.fillStyle = i % 5 === 0 ? "#ff2bd6" : "#00ffe5";
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1;
    }
  }

  setInterval(draw, 46);
  window.addEventListener("resize", function () {
    size();
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, function () {
      return Math.random() * 40;
    });
  });
})();

(function hackerTerminal() {
  const container = document.getElementById("hackerStream");
  if (!container) return;

  const logs = [
    { t: "> [INIT] tesla_core_bcr.bin loaded", c: "ok" },
    { t: "> [SYNC] table RF stream: 5.48 GHz", c: "info" },
    { t: "> [LATENT] matrix factorized", c: "hot" },
    { t: "> [HASH] 0x9F4C2A1E verified", c: "hex" },
    { t: "> [DEEP_NET] node #7 latency 1.4ms", c: "info" },
    { t: "> [SCAN] delta variance: 0.0031", c: "" },
    { t: "> [AES-256] uplink tunnel established", c: "ok" },
    { t: "> [CORE] 16 threads computing...", c: "info" },
    { t: "> [BUFFER] 128-bit checksum: PASS", c: "ok" },
    { t: "> [AI] latent resonance locked 100%", c: "hot" },
    { t: "> [SYS] handshake token: valid", c: "ok" },
    { t: "> [TELEMETRY] package 0xAA42 synced", c: "hex" },
    { t: "> [RNG] dynamic bias check: 99.8%", c: "info" },
    { t: "> [FEED] live socket streaming...", c: "" },
    { t: "> [ALGO] predictive vector matched", c: "hot" },
    { t: "> [OPT] memory pool purged: 0 leaks", c: "ok" },
    { t: "> [DIAG] GPU compute cluster active", c: "info" },
    { t: "> [WARN] frequency variance corrected", c: "warn" },
    { t: "> [SYNC] baccarat latent state: READY", c: "hot" },
  ];

  let index = 0;
  const maxLines = 7;

  function addLog() {
    const item = logs[index % logs.length];
    index += 1;

    const line = document.createElement("div");
    line.className = "hc-line" + (item.c ? " " + item.c : "");
    line.textContent = item.t;
    container.appendChild(line);

    while (container.children.length > maxLines) {
      container.removeChild(container.firstChild);
    }
  }

  for (let i = 0; i < 5; i++) {
    addLog();
  }

  function scheduleNext() {
    const delay = Math.floor(Math.random() * 800) + 800;
    setTimeout(function () {
      addLog();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
})();
