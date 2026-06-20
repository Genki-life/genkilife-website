/* ============================================================
   nova.js — Nova: a quiet light that notices you.
   Breathes on its own; cursor & scroll cause a small, heavily
   damped drift + brightness lift — "it noticed you moved",
   never chasing the pointer. Respects prefers-reduced-motion.
   Renders into <canvas id="novaSphere">. No-op if absent.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cv = document.getElementById("novaSphere");
  if (!cv) return;

  var ctx = cv.getContext("2d"), W, H, dpr, t = 0, raf = 0;
  var ptr = { tx: 0, ty: 0, cx: 0, cy: 0, act: 0, actC: 0 };
  var scrollV = 0, lastY = window.scrollY;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function lerp(a, b, n) { return a + (b - a) * n; }

  window.addEventListener("pointermove", function (e) {
    var r = cv.getBoundingClientRect();
    ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    ptr.act = 1;
  });
  window.addEventListener("pointerleave", function () { ptr.act = 0; });
  window.addEventListener("scroll", function () {
    scrollV = Math.min(Math.abs(window.scrollY - lastY), 40); lastY = window.scrollY;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var cx0 = W * 0.5, cy0 = H * 0.5;
    ptr.cx = lerp(ptr.cx, ptr.tx, 0.04);
    ptr.cy = lerp(ptr.cy, ptr.ty, 0.04);
    ptr.actC = lerp(ptr.actC, ptr.act, 0.03);
    scrollV *= 0.92;

    var breathe = 0.5 + 0.5 * Math.sin(t * 0.5);
    var micro = 0.5 + 0.5 * Math.sin(t * 1.3 + 1.0);
    var ox = ptr.cx * 26 * ptr.actC, oy = ptr.cy * 20 * ptr.actC;
    var cx = cx0 + ox, cy = cy0 + oy;
    var base = Math.min(W, H) * 0.30, R = base * (1 + 0.05 * breathe);
    var lift = 0.10 * ptr.actC + Math.min(scrollV / 40, 1) * 0.06;
    var aCore = 0.16 + 0.06 * breathe + lift, aMid = 0.10 + 0.04 * micro + lift * 0.6;

    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.7);
    g.addColorStop(0, "rgba(127,119,221," + aMid + ")");
    g.addColorStop(0.4, "rgba(168,162,236," + (aMid * 0.6) + ")");
    g.addColorStop(1, "rgba(168,162,236,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    var g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g2.addColorStop(0, "rgba(99,88,201," + aCore + ")");
    g2.addColorStop(0.5, "rgba(127,119,221," + (aCore * 0.55) + ")");
    g2.addColorStop(1, "rgba(127,119,221,0)");
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    var rp = (t * 0.18) % 1, rr = R * 0.5 + rp * R * 1.4, ra = (1 - rp) * 0.05 * (0.6 + 0.4 * breathe);
    ctx.beginPath(); ctx.strokeStyle = "rgba(127,119,221," + ra + ")"; ctx.lineWidth = 1.5;
    ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();

    for (var i = 0; i < 14; i++) {
      var a = i / 14 * Math.PI * 2 + t * 0.1;
      var rad = R * (0.3 + 0.45 * ((i * 37 % 100) / 100));
      var px = cx + Math.cos(a + Math.sin(t * 0.3 + i)) * rad * 0.6;
      var py = cy + Math.sin(a + Math.cos(t * 0.25 + i)) * rad * 0.6;
      ctx.beginPath();
      ctx.fillStyle = "rgba(99,88,201," + (0.10 + 0.08 * Math.sin(t + i)) + ")";
      ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    t += 0.016;
  }
  function frame() { draw(); raf = requestAnimationFrame(frame); }

  resize();
  window.addEventListener("resize", function () { resize(); if (reduce) draw(); });

  if (reduce) {
    draw(); // static single frame — still a quiet light, no motion
  } else {
    frame();
    var hero = cv.closest(".hero");
    if ("IntersectionObserver" in window && hero) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (!raf) frame(); }
          else { cancelAnimationFrame(raf); raf = 0; }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }
})();
