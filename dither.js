(function () {
  var FIELD = "data:image/png;base64,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";
  var COLS = 50, ROWS = 31, SRC_W = 170, SRC_H = 105, ZOOM = 1.7;
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  var canvas = document.querySelector(".play-dither canvas");
  var row = document.querySelector("[data-dither]");
  var panel = document.querySelector(".play-dither");
  if (!canvas || !row || !panel) return;

  var ctx = canvas.getContext("2d");
  canvas.width = COLS;
  canvas.height = ROWS;
  var frame = ctx.createImageData(COLS, ROWS);
  var field = null;
  var raf = 0;
  var stopTimer = 0;
  var start = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var img = new Image();
  img.onload = function () {
    var off = document.createElement("canvas");
    off.width = SRC_W;
    off.height = SRC_H;
    var octx = off.getContext("2d");
    octx.drawImage(img, 0, 0);
    var data = octx.getImageData(0, 0, SRC_W, SRC_H).data;
    field = new Float32Array(SRC_W * SRC_H);
    for (var i = 0; i < field.length; i++) field[i] = data[i * 4] / 255;
    draw(0);
  };
  img.src = FIELD;

  function bounce(v, max) {
    var m = max * 2;
    v = ((v % m) + m) % m;
    return v > max ? m - v : v;
  }

  function sample(u, v) {
    u = bounce(u, SRC_W - 1.001);
    v = bounce(v, SRC_H - 1.001);
    var x0 = Math.floor(u), y0 = Math.floor(v);
    var fx = u - x0, fy = v - y0;
    var a = field[y0 * SRC_W + x0], b = field[y0 * SRC_W + x0 + 1];
    var c = field[(y0 + 1) * SRC_W + x0], d = field[(y0 + 1) * SRC_W + x0 + 1];
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
  }

  function draw(t) {
    if (!field) return;
    var px = frame.data;
    var sx = ZOOM, sy = ZOOM;
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var u = x * sx + t * 5 + Math.sin(y * 0.11 + t * 0.8) * 6;
        var v = y * sy + t * 3 + Math.cos(x * 0.09 + t * 0.6) * 5;
        var dark = sample(u, v) > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
        var o = (y * COLS + x) * 4;
        var c = dark ? 0 : 255;
        px[o] = px[o + 1] = px[o + 2] = c;
        px[o + 3] = 255;
      }
    }
    ctx.putImageData(frame, 0, 0);
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!start) start = now;
    draw((now - start) / 1000);
  }

  function play() {
    clearTimeout(stopTimer);
    if (reduceMotion.matches || raf) return;
    start = 0;
    raf = requestAnimationFrame(loop);
  }

  function pause() {
    clearTimeout(stopTimer);
    stopTimer = setTimeout(function () {
      cancelAnimationFrame(raf);
      raf = 0;
    }, 400);
  }

  function follow(e) {
    panel.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%)";
  }

  row.addEventListener("mouseenter", function (e) {
    follow(e);
    panel.classList.add("is-active");
    play();
  });
  row.addEventListener("mousemove", follow);
  row.addEventListener("mouseleave", function () {
    panel.classList.remove("is-active");
    pause();
  });
})();
