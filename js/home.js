const SESSION_KEY = "bcr_admin_session";

const FORMULA_IDLE_1 = "HỆ SỐ PHỤ = α + (β ÷ γ) × δ";
const FORMULA_IDLE_2 = "HỆ SỐ PHỤ = (A + B) − (C ÷ π) + (D ÷ 6) × √e";
const CALC_SPIN_MS = 4000;
const REVEAL_FLICKER_MS = 3500;

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

function getBeadSum() {
  let sum = 0;
  document.querySelectorAll(".bead-input").forEach(function (inp) {
    sum += Number(inp.value) || 0;
  });
  return sum;
}

function executeCalculation1() {
  const s1 = Number(document.getElementById("slot1")?.value) || 0;
  const s2 = Number(document.getElementById("slot2")?.value) || 0;
  const s3 = Number(document.getElementById("slot3")?.value) || 1;
  const s4 = Number(document.getElementById("slot4")?.value) || 0;
  const divisor = s3 === 0 ? 1 : s3;
  const latent = Math.round(s1 + (s2 / divisor) * s4);

  return {
    s1: s1,
    s2: s2,
    s3: s3,
    s4: s4,
    latent: latent,
    formula:
      s1 + " + (" + s2 + " ÷ " + s3 + ") × " + s4 + " = " + latent,
    formulaLong:
      "HỆ SỐ PHỤ = " +
      s1 +
      " + (" +
      s2 +
      " ÷ " +
      s3 +
      ") × " +
      s4 +
      " = " +
      latent,
  };
}

function executeCalculation2() {
  const a = Number(document.getElementById("statPatterns")?.value) || 0;
  const b = Number(document.getElementById("statHands")?.value) || 0;
  const c = Number(document.getElementById("statCards")?.value) || 0;
  const d = getBeadSum();
  const latent = Math.round((a + b) - c / Math.PI + (d / 6) * Math.sqrt(Math.E));

  return {
    a: a,
    b: b,
    c: c,
    d: d,
    latent: latent,
    formula:
      "(" +
      a +
      " + " +
      b +
      ") − (" +
      c +
      " ÷ π) + (" +
      d +
      " ÷ 6) × √e = " +
      latent,
    formulaLong:
      "HỆ SỐ PHỤ = (" +
      a +
      " + " +
      b +
      ") − (" +
      c +
      " ÷ π) + (" +
      d +
      " ÷ 6) × 2.718 = " +
      latent,
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

function randomMathFlash() {
  const ops = ["+", "−", "×", "÷"];
  const constants = ["π", "e", "√2", "φ", "2.718", "3.14159", "ln(2)", "√5"];
  const a = Math.floor(Math.random() * 99);
  const b = Math.floor(Math.random() * 99);
  const c = Math.floor(Math.random() * 99);
  const op1 = ops[Math.floor(Math.random() * ops.length)];
  const op2 = ops[Math.floor(Math.random() * ops.length)];
  const k = constants[Math.floor(Math.random() * constants.length)];
  const templates = [
    a + " " + op1 + " " + b + " " + op2 + " " + k,
    "(" + a + " ÷ " + b + ") × " + k + " " + op1 + " " + c,
    k + " × " + a + " " + op2 + " √" + b,
    "Σ(" + a + "," + b + "," + c + ") " + op1 + " " + k,
    "Δ" + a + " / " + k + " " + op2 + " " + b,
  ];
  return templates[Math.floor(Math.random() * templates.length)] + " ...";
}

function randomFormulaFlash1(data) {
  const snippets = [
    randomMathFlash(),
    data.s1 + " + (" + data.s2 + " ÷ " + data.s3 + ") × π ...",
    "α + (β ÷ γ) × δ → " + randomMathFlash(),
    "(" + data.s2 + " × " + data.s4 + ") ÷ " + data.s3 + " + " + data.s1 + " ...",
  ];
  return snippets[Math.floor(Math.random() * snippets.length)];
}

function randomFormulaFlash2(data) {
  const snippets = [
    randomMathFlash(),
    "(" + data.a + " + " + data.b + ") − (C ÷ π) + √e ...",
    "A + B − D/π × 2.718 ...",
    "(" + data.d + " ÷ 6) × √e " + randomMathFlash(),
  ];
  return snippets[Math.floor(Math.random() * snippets.length)];
}

function isCondition2Filled() {
  const fields = ["statPatterns", "statHands", "statCards"];
  for (let i = 0; i < fields.length; i += 1) {
    const val = document.getElementById(fields[i])?.value.trim();
    if (val) return true;
  }
  let hasBead = false;
  document.querySelectorAll(".bead-input").forEach(function (inp) {
    if (inp.value.trim()) hasBead = true;
  });
  return hasBead;
}

function setPanelCalculating(active, cond2Filled) {
  const box1 = document.getElementById("formulaBox1");
  const box2 = document.getElementById("formulaBox2");
  const cell1 = document.getElementById("resultCell1");
  const cell2 = document.getElementById("resultCell2");
  const spin1 = document.getElementById("spinner1");
  const spin2 = document.getElementById("spinner2");

  if (box1) box1.classList.toggle("calculating", active);
  if (box2) box2.classList.toggle("calculating", active && cond2Filled);
  if (cell1) cell1.classList.toggle("calculating", active);
  if (cell2) cell2.classList.toggle("calculating", active && cond2Filled);
  if (spin1) spin1.hidden = !active;
  if (spin2) spin2.hidden = !active || !cond2Filled;
}

function setModalFlicker(active) {
  const tables = document.getElementById("rmDualTables");
  const card1 = document.getElementById("rmCard1");
  const card2 = document.getElementById("rmCard2");
  if (tables) tables.classList.toggle("flickering", active);
  if (card1) card1.classList.toggle("is-active", active);
  if (card2) card2.classList.toggle("is-active", active && !card2.classList.contains("is-empty"));
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

  const formulaText1 = document.getElementById("formulaText1");
  const formulaText2 = document.getElementById("formulaText2");
  if (formulaText1) formulaText1.textContent = FORMULA_IDLE_1;
  if (formulaText2) formulaText2.textContent = FORMULA_IDLE_2;

  ["resultOut1", "resultOut2"].forEach(function (id) {
    const out = document.getElementById(id);
    if (out) {
      out.textContent = "—";
      out.style.color = "var(--cyan)";
      out.classList.remove("calculating", "revealed");
    }
  });

  ["resultCell1", "resultCell2"].forEach(function (id) {
    const cell = document.getElementById(id);
    if (cell) cell.classList.remove("calculating", "flickering");
  });

  setPanelCalculating(false, false);
  setModalFlicker(false);

  const closeBtn = document.getElementById("closeResultBtn");
  if (closeBtn) closeBtn.hidden = false;
}

updateSideRange();

let isAnalyzing = false;
let calcIntervals = [];

function clearCalcIntervals() {
  calcIntervals.forEach(clearInterval);
  calcIntervals = [];
}

document.getElementById("analyzeBtn").addEventListener("click", function () {
  if (isAnalyzing) return;
  isAnalyzing = true;
  clearCalcIntervals();

  const btn = this;
  btn.disabled = true;
  btn.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const data1 = executeCalculation1();
  const data2 = executeCalculation2();
  const cond2Filled = isCondition2Filled();

  const formulaText1 = document.getElementById("formulaText1");
  const formulaText2 = document.getElementById("formulaText2");
  const resultOut1 = document.getElementById("resultOut1");
  const resultOut2 = document.getElementById("resultOut2");
  const modal = document.getElementById("resultModal");
  const rmTitle = document.getElementById("rmTitle");
  const closeBtn = document.getElementById("closeResultBtn");
  const rmCard2 = document.getElementById("rmCard2");

  setModalFlicker(false);
  setPanelCalculating(true, cond2Filled);

  if (resultOut1) {
    resultOut1.classList.add("calculating");
    resultOut1.classList.remove("revealed");
    resultOut1.textContent = "···";
    resultOut1.style.color = "#00ffe5";
  }
  if (resultOut2) {
    resultOut2.classList.remove("calculating", "revealed");
    if (cond2Filled) {
      resultOut2.classList.add("calculating");
      resultOut2.textContent = "···";
      resultOut2.style.color = "#7dffb8";
    } else {
      resultOut2.textContent = "—";
      resultOut2.style.color = "var(--cyan)";
    }
  }

  const spinInterval = setInterval(function () {
    if (formulaText1) formulaText1.textContent = randomFormulaFlash1(data1);
    if (formulaText2 && cond2Filled) formulaText2.textContent = randomFormulaFlash2(data2);
  }, 110);
  calcIntervals.push(spinInterval);

  setTimeout(function () {
    clearCalcIntervals();
    setPanelCalculating(false, false);

    if (formulaText1) formulaText1.textContent = data1.formulaLong;
    if (formulaText2) {
      formulaText2.textContent = cond2Filled ? data2.formulaLong : FORMULA_IDLE_2;
    }

    if (resultOut1) {
      resultOut1.classList.remove("calculating");
      resultOut1.classList.add("revealed");
      resultOut1.textContent = String(data1.latent);
      resultOut1.style.color = "#00ffe5";
    }
    if (resultOut2) {
      resultOut2.classList.remove("calculating");
      if (cond2Filled) {
        resultOut2.classList.add("revealed");
        resultOut2.textContent = String(data2.latent);
        resultOut2.style.color = "#7dffb8";
      } else {
        resultOut2.classList.remove("revealed");
        resultOut2.textContent = "—";
        resultOut2.style.color = "var(--cyan)";
      }
    }

    document.querySelector('[data-check="data"]').classList.add("on");

    if (modal) {
      if (rmTitle) rmTitle.textContent = "ĐANG PHÂN TÍCH...";
      if (closeBtn) closeBtn.hidden = true;

      document.getElementById("rmFormula1").textContent = randomFormulaFlash1(data1);
      document.getElementById("rmVal1").textContent = randomMathFlash();

      if (rmCard2) {
        rmCard2.classList.toggle("is-empty", !cond2Filled);
        rmCard2.classList.toggle("is-active", cond2Filled);
      }
      if (cond2Filled) {
        document.getElementById("rmFormula2").textContent = randomFormulaFlash2(data2);
        document.getElementById("rmVal2").textContent = randomMathFlash();
      } else {
        document.getElementById("rmFormula2").textContent = "Chưa nhập dữ liệu";
        document.getElementById("rmVal2").textContent = "—";
      }

      setModalFlicker(true);
      modal.hidden = false;

      const flickerInterval = setInterval(function () {
        document.getElementById("rmFormula1").textContent =
          Math.random() > 0.4 ? randomFormulaFlash1(data1) : data1.formula;
        document.getElementById("rmVal1").textContent =
          Math.random() > 0.35 ? randomMathFlash() : String(data1.latent);

        if (cond2Filled) {
          document.getElementById("rmFormula2").textContent =
            Math.random() > 0.4 ? randomFormulaFlash2(data2) : data2.formula;
          document.getElementById("rmVal2").textContent =
            Math.random() > 0.35 ? randomMathFlash() : String(data2.latent);
        }
      }, 130);
      calcIntervals.push(flickerInterval);

      setTimeout(function () {
        clearCalcIntervals();
        setModalFlicker(false);

        if (rmTitle) rmTitle.textContent = "ANALYSIS COMPLETE";
        document.getElementById("rmFormula1").textContent = data1.formula;
        document.getElementById("rmVal1").textContent = String(data1.latent);

        if (cond2Filled) {
          document.getElementById("rmFormula2").textContent = data2.formula;
          document.getElementById("rmVal2").textContent = String(data2.latent);
        }

        if (closeBtn) closeBtn.hidden = false;
        isAnalyzing = false;
        btn.disabled = false;
      }, REVEAL_FLICKER_MS);
    } else {
      isAnalyzing = false;
      btn.disabled = false;
    }
  }, CALC_SPIN_MS);
});

const closeResultBtn = document.getElementById("closeResultBtn");
if (closeResultBtn) {
  closeResultBtn.addEventListener("click", function () {
    const modal = document.getElementById("resultModal");
    if (modal) modal.hidden = true;
    setModalFlicker(false);
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
