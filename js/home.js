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

const CYCLE = ["—", "B", "P", "T"];
const rounds = [0, 0, 0];
let activeSlot = 1;
const slots = {
  1: { banker: 0, player: 0, latent: 0 },
  2: { banker: 0, player: 0, latent: 0 },
  3: { banker: 0, player: 0, latent: 0 },
  4: { banker: 0, player: 0, latent: 0 },
};

function executeCalculation() {
  const win = Number(document.getElementById("banker").value) || 0;
  const lose = Number(document.getElementById("player").value) || 0;
  const s1 = Number(document.getElementById("slot1")?.value) || 0;
  const s2 = Number(document.getElementById("slot2")?.value) || 0;
  const s3 = Number(document.getElementById("slot3")?.value) || 1;
  const s4 = Number(document.getElementById("slot4")?.value) || 0;

  // A = WIN - LOSE
  const A = win - lose;

  // B = ô thứ 1 + ô thứ 2 : ô thứ 3 x ô thứ 4, làm tròn ra số tự nhiên
  const divisor = s3 === 0 ? 1 : s3;
  const bRaw = s1 + (s2 / divisor) * s4;
  const B = Math.round(bRaw);

  // TOTAL = A + B
  // QUY TẮC: CHẴN CON (PLAYER), LẺ CÁI (BANKER)
  const total = A + B;
  const isEven = Math.abs(total) % 2 === 0;
  const isPlayer = isEven; // Chẵn = Player (Con)
  const isBanker = !isEven; // Lẻ = Banker (Cái)
  const verdict = isPlayer ? "PLAYER" : "BANKER";

  return {
    win: win,
    lose: lose,
    A: A,
    s1: s1,
    s2: s2,
    s3: s3,
    s4: s4,
    B: B,
    total: total,
    isEven: isEven,
    isPlayer: isPlayer,
    isBanker: isBanker,
    verdict: verdict,
  };
}

const RANGE_GROUPS = [
  "4, 5, 6, 7, 8",
  "5, 6, 7, 8",
  "6, 7, 8, 9",
  "7, 8, 9, 10",
];

function getRandomRange() {
  return RANGE_GROUPS[Math.floor(Math.random() * RANGE_GROUPS.length)];
}

function updateSideRange() {
  const el = document.getElementById("sideRangeVal");
  if (el) {
    el.textContent = getRandomRange();
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
  document.getElementById("banker").value = 0;
  document.getElementById("player").value = 0;
  document.getElementById("latent").value = 0;
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
  }
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
  const latentInput = document.getElementById("latent");
  const resultCell = document.querySelector(".result-cell");
  const resultOut = document.getElementById("resultOut");

  // BƯỚC 1: Hiển thị kết quả ra LATENT FACTOR
  if (latentInput) {
    latentInput.value = data.B;
  }
  if (formulaBar) {
    formulaBar.textContent = `B = ${data.s1} + (${data.s2} : ${data.s3}) × ${data.s4} = ${data.B}`;
  }

  // BƯỚC 2: Hiệu ứng nhấp nháy tính toán kết quả (Flicker / Calculating Animation)
  if (resultCell) resultCell.classList.add("calculating");
  if (resultOut) {
    resultOut.classList.remove("revealed");
    resultOut.classList.add("calculating");
  }

  const flickers = ["CALC...", "SYNC...", "0x8F", "P / B...", "ANALYZING", "SCANNING", "98.4%", "COMPUTING..."];
  let flickerCount = 0;
  const flickerInterval = setInterval(function () {
    flickerCount += 1;
    if (resultOut) {
      const randText = flickers[Math.floor(Math.random() * flickers.length)];
      resultOut.textContent = randText;
      resultOut.style.color = flickerCount % 2 === 0 ? "#ff2bd6" : "#00ffe5";
    }
  }, 90);

  // Sau 1.2s nhấp nháy tính toán -> Xuất kết quả chính thức
  setTimeout(function () {
    clearInterval(flickerInterval);
    if (resultCell) resultCell.classList.remove("calculating");

    if (resultOut) {
      resultOut.classList.remove("calculating");
      resultOut.classList.add("revealed");
      resultOut.textContent = data.verdict;
      resultOut.style.color = data.isPlayer ? "#00ffe5" : "#ff7ae8";
    }

    if (formulaBar) {
      formulaBar.textContent = `A (${data.A}) + B (${data.B}) = ${data.total} → ${data.isPlayer ? "CHẴN (PLAYER)" : "LẺ (BANKER)"}`;
    }
    document.querySelector('[data-check="data"]').classList.add("on");

    // BƯỚC 3: Hiển thị Popup Modal Result
    setTimeout(function () {
      const modal = document.getElementById("resultModal");
      if (modal) {
        document.getElementById("rmValA").textContent = `${data.win} - ${data.lose} = ${data.A}`;
        document.getElementById("rmValB").textContent = `${data.s1} + (${data.s2} : ${data.s3}) × ${data.s4} = ${data.B}`;
        document.getElementById("rmValTotal").textContent = `${data.A} + ${data.B} = ${data.total} (${data.isPlayer ? "CHẴN" : "LẺ"})`;

        const verdictBox = document.getElementById("rmVerdictBox");
        verdictBox.className = "rm-verdict " + (data.isPlayer ? "player" : "banker");
        document.getElementById("rmVerdictName").textContent = data.isPlayer ? "PLAYER WIN" : "BANKER WIN";

        modal.hidden = false;
      }
      isAnalyzing = false;
      btn.disabled = false;
    }, 450);
  }, 1200);
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
