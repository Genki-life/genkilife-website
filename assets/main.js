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

  /* ---- Bond band: silhouettes slide in (CSS) ----
     NOTE: the waitlist count-up lives in waitlist.js now, because the number
     comes from the live backend, not a hard-coded target. We only trigger the
     silhouette slide-in animation here. ---- */
  var band = document.querySelector(".bond-band");
  if (band) {
    if (reduce || !("IntersectionObserver" in window)) {
      band.classList.add("bond-in");
    } else {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            band.classList.add("bond-in");
            bio.unobserve(e.target);
          }
        });
      }, { threshold: 0.35 });
      bio.observe(band);
    }
  }
})();
