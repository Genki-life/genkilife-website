/* ============================================================
   main.js — page content interactions:
   - scroll reveal (.reveal, .mline)
   - Bond band silhouettes slide-in + waitlist count-up
   Respects prefers-reduced-motion. Safe to load on any page.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll reveal ---- */
  var items = document.querySelectorAll(".reveal, .mline");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Bond band: silhouettes slide in (CSS) + waitlist count-up ---- */
  var band = document.querySelector(".bond-band");
  var numEl = band && band.querySelector(".num");
  function fmt(n) { return n.toLocaleString("en-US"); }
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out (damped)
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }
  if (band) {
    if (reduce || !("IntersectionObserver" in window)) {
      band.classList.add("bond-in");
      if (numEl) numEl.textContent = fmt(parseInt(numEl.getAttribute("data-target"), 10) || 0);
    } else {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            band.classList.add("bond-in");
            if (numEl) countUp(numEl);
            bio.unobserve(e.target);
          }
        });
      }, { threshold: 0.35 });
      bio.observe(band);
    }
  }
})();
