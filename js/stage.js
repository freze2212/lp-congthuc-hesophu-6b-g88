(function fitStage() {
  const stage = document.getElementById("stage");
  if (!stage) return;

  function resize() {
    const sx = window.innerWidth / 1920;
    const sy = window.innerHeight / 1080;
    stage.style.transform = "scale(" + sx + ", " + sy + ")";
  }

  resize();
  window.addEventListener("resize", resize);
})();

