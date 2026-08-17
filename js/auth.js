const SESSION_KEY = "bcr_admin_session";
const ADMIN_USER = "admin";
const ADMIN_PASS = "tesla";

function randomBits(groups, width) {
  const parts = [];
  for (let i = 0; i < groups; i += 1) {
    let chunk = "";
    for (let j = 0; j < width; j += 1) chunk += Math.round(Math.random());
    parts.push(chunk);
  }
  return parts.join(" ");
}

function fillBinary() {
  const mid = document.getElementById("binMid");
  if (!mid) return;
  const lines = [];
  for (let i = 0; i < 10; i += 1) lines.push(randomBits(6, 3 + (i % 2)));
  mid.innerHTML = lines.join("<br />");
}

function tickTopBinary() {
  const el = document.getElementById("binTop");
  if (!el) return;
  el.innerHTML = randomBits(5, 6) + "<br />" + randomBits(6, 4);
}

if (sessionStorage.getItem(SESSION_KEY)) {
  window.location.replace("home.html");
}

fillBinary();
setInterval(function () {
  tickTopBinary();
  fillBinary();
}, 1400);

const form = document.getElementById("loginForm");
const box = document.getElementById("loginBox");
const errorEl = document.getElementById("loginError");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ user: user, ts: Date.now() })
    );
    window.location.href = "home.html";
    return;
  }

  errorEl.classList.add("show");
  box.classList.remove("shake");
  void box.offsetWidth;
  box.classList.add("shake");
});
