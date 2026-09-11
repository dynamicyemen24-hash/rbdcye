(function () {
  var progress = document.getElementById("loader-progress");
  if (!progress) return;
  var value = 0;
  var interval = setInterval(function () {
    value += Math.random() * 15 + 5;
    if (value > 90) value = 90;
    progress.style.width = value + "%";
  }, 200);
  window.__loaderStop = function () {
    clearInterval(interval);
    progress.style.width = "100%";
  };
})();
