(function () {
  var LOADER_ID = "app-loader";
  var PROGRESS_ID = "loader-progress";
  // Absolute cap: a slow or failed boot must never trap users behind the splash.
  var ABSOLUTE_CAP_MS = 3500;
  var FADE_MS = 250;
  var hidden = false;

  // --- Progress bar animation (decorative, capped at 90% until done) ---
  var progress = document.getElementById(PROGRESS_ID);
  var value = 0;
  var interval = null;
  if (progress) {
    interval = setInterval(function () {
      value += Math.random() * 15 + 5;
      if (value > 90) value = 90;
      progress.style.width = value + "%";
    }, 200);
  }
  function stopProgress() {
    if (interval) clearInterval(interval);
    interval = null;
    if (progress) progress.style.width = "100%";
  }
  window.__loaderStop = stopProgress;

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  }

  // --- Hide + remove the splash overlay ---
  function hide() {
    if (hidden) return;
    hidden = true;
    stopProgress();
    var el = document.getElementById(LOADER_ID);
    if (!el) return;
    try {
      if (prefersReducedMotion()) {
        if (el.parentNode) el.parentNode.removeChild(el);
        return;
      }
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, FADE_MS);
    } catch (e) {
      try {
        if (el.parentNode) el.parentNode.removeChild(el);
      } catch (_) {}
    }
  }

  // Reveal the instant React paints (dispatched from the app shell) ...
  window.addEventListener("rbdcye:app-ready", hide);
  // ... with an absolute cap as a safety net.
  setTimeout(hide, ABSOLUTE_CAP_MS);
  window.__loaderHide = hide;
})();
