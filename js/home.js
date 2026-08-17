const SESSION_KEY = "bcr_admin_session";

if (!sessionStorage.getItem(SESSION_KEY)) {
  window.location.replace("index.html");
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
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

function compute() {
  const banker = Number(document.getElementById("banker").value) || 0;
  const player = Number(document.getElementById("player").value) || 0;
  const latent = Number(document.getElementById("latent").value) || 0;
  const raw = banker + player + latent;
  const even = Math.abs(raw) % 2 === 0;
  const out = document.getElementById("resultOut");
  out.textContent = even ? "BANKER" : "PLAYER";
  out.style.color = even ? "#ff7ae8" : "#00ffe5";
  return { banker: banker, player: player, latent: latent, raw: raw, even: even };
}

["banker", "player", "latent"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", compute);
});

document.querySelectorAll(".slot-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    slots[activeSlot] = {
      banker: Number(document.getElementById("banker").value) || 0,
      player: Number(document.getElementById("player").value) || 0,
      latent: Number(document.getElementById("latent").value) || 0,
    };
    activeSlot = Number(btn.dataset.slot);
    document.querySelectorAll(".slot-btn").forEach(function (el) {
      el.classList.toggle("active", Number(el.dataset.slot) === activeSlot);
    });
    document.getElementById("banker").value = slots[activeSlot].banker;
    document.getElementById("player").value = slots[activeSlot].player;
    document.getElementById("latent").value = slots[activeSlot].latent;
    compute();
  });
});

document.querySelectorAll(".round-chip").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const i = Number(btn.dataset.round);
    rounds[i] = (rounds[i] + 1) % CYCLE.length;
    const label = CYCLE[rounds[i]];
    btn.textContent = "R" + (i + 1) + " · " + label;
    btn.classList.remove("banker", "player", "tie");
    if (label === "B") btn.classList.add("banker");
    if (label === "P") btn.classList.add("player");
    if (label === "T") btn.classList.add("tie");
    const filled = rounds.filter(function (v) {
      return v > 0;
    }).length;
    document.querySelector('[data-check="rounds"]').classList.toggle("on", filled === 3);
  });
});

document.querySelectorAll(".check").forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.classList.toggle("on");
  });
});

document.getElementById("connectBtn").addEventListener("click", function () {
  const table = document.getElementById("tableNo").value.trim();
  if (!table) {
    document.getElementById("tableNo").focus();
    return;
  }
  runConnect(table, this);
});

function runConnect(table, btn) {
  const overlay = document.getElementById("connectOverlay");
  const logs = document.getElementById("connectLogs");
  const bar = document.getElementById("connectBar");
  const pct = document.getElementById("connectPct");
  const title = document.getElementById("connectTitle");
  const lines = [
    { t: "> scanning table frequency...", c: "" },
    { t: "> handshake_tesla.dll  OK", c: "ok" },
    { t: "> syncing latent core...", c: "" },
    { t: "> AES-256 tunnel established", c: "ok" },
    { t: "> ACCESS GRANTED", c: "hot" },
  ];

  btn.disabled = true;
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
      btn.disabled = false;
      btn.textContent = "LINKED";
      document.querySelector('[data-check="table"]').classList.add("on");
      setTimeout(function () {
        overlay.hidden = true;
      }, 700);
    }
  }, 120);
}

document.getElementById("tableNo").addEventListener("input", function () {
  document.querySelector('[data-check="table"]').classList.toggle("on", this.value.trim().length > 0);
});

document.querySelectorAll(".bead").forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.classList.toggle("off");
  });
});

document.getElementById("resetBtn").addEventListener("click", function () {
  document.getElementById("banker").value = 0;
  document.getElementById("player").value = 0;
  document.getElementById("latent").value = 0;
  document.getElementById("tableNo").value = "";
  document.getElementById("statPatterns").value = 5;
  document.getElementById("statHands").value = 6;
  document.getElementById("statCards").value = 7;
  document.querySelectorAll(".check").forEach(function (el) {
    el.classList.remove("on");
  });
  document.querySelectorAll(".round-chip").forEach(function (el, i) {
    rounds[i] = 0;
    el.textContent = "R" + (i + 1) + " · —";
    el.classList.remove("banker", "player", "tie");
  });
  document.getElementById("connectBtn").textContent = "CONNECT";
  compute();
});

document.getElementById("analyzeBtn").addEventListener("click", function () {
  compute();
  const patterns = Number(document.getElementById("statPatterns").value) || 0;
  const hands = Number(document.getElementById("statHands").value) || 0;
  const cards = Number(document.getElementById("statCards").value) || 0;
  if (patterns + hands + cards > 0) {
    document.querySelector('[data-check="data"]').classList.add("on");
  }
});

compute();

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
