/* ============================================================
   waitlist.js — connects the signup forms + live count to the
   Genki waitlist backend (Go service on Railway).

   Backend:
     POST {API}/api/waitlist        body: email=...  (form-urlencoded)
     GET  {API}/api/waitlist/count  -> plain number text

   Markup contract:
     - signup blocks use <form class="signup" data-waitlist> with an
       <input type="email"> and a submit <button>.
     - the live count number element is .num (inside .count-pill).
   ============================================================ */
(function () {
  "use strict";

  var API = "https://genki-waitlist-production.up.railway.app";

  /* ---------- helpers ---------- */
  function fmt(n) { return Number(n).toLocaleString("en-US"); }

  function isValidEmail(v) {
    // simple, permissive check — the backend is the real validator
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  /* ---------- live count (animated count-up to the REAL number) ---------- */
  var numEl = document.querySelector(".count-pill .num");

  function animateTo(el, target) {
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  function loadCount(animate) {
    if (!numEl) return;
    fetch(API + "/api/waitlist/count")
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var n = parseInt(String(text).trim(), 10);
        if (isNaN(n)) return;
        if (animate) animateTo(numEl, n);
        else numEl.textContent = fmt(n);
      })
      .catch(function () {
        /* network/backend down — leave whatever is shown, don't crash the page */
      });
  }

  /* Animate the count when the Bond band scrolls into view (keeps the nice
     reveal), but the number is now the REAL backend value, not a fake target. */
  var band = document.querySelector(".bond-band");
  if (numEl && band && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { loadCount(true); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    io.observe(band);
  } else {
    loadCount(false); // fallback: just fetch and show
  }

  /* ---------- signup forms ---------- */
  var forms = document.querySelectorAll("form[data-waitlist]");

  forms.forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"], button');
    var note = form.querySelector(".form-msg");
    // create an inline message element if the page didn't provide one
    if (!note) {
      note = document.createElement("p");
      note.className = "form-msg";
      form.appendChild(note);
    }

    function setMsg(text, kind) {
      note.textContent = text;
      note.setAttribute("data-kind", kind || "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input && input.value || "").trim();

      if (!isValidEmail(email)) {
        setMsg("Please enter a valid email.", "error");
        if (input) input.focus();
        return;
      }

      var original = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Joining…"; }
      setMsg("", "");

      fetch(API + "/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "email=" + encodeURIComponent(email)
      })
        .then(function (r) {
          if (!r.ok) throw new Error("bad status " + r.status);
          return r.text();
        })
        .then(function () {
          setMsg("You're on the list. We'll be in touch.", "success");
          if (input) input.value = "";
          if (button) { button.textContent = "Joined ✓"; }
          loadCount(true); // refresh the visible count after a successful join
        })
        .catch(function () {
          setMsg("Something went wrong — please try again in a moment.", "error");
          if (button) { button.disabled = false; button.textContent = original; }
        });
    });
  });
})();
