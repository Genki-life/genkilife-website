/* ============================================================
   nav.js — injects the shared header (with Rituals mega menu) and
   footer into every page. Single source of truth: edit nav/footer
   ONLY here and it updates across the whole site.
   Also wires: sticky-pill on scroll, mega menu open/close, mobile menu.
   ============================================================ */
(function () {
  "use strict";

  /* ---- The Genki "G" mark (reused in nav + footer) ---- */
  var MARK =
    '<svg width="28" height="28" viewBox="0 0 30 30" fill="none">' +
    '<path d="M22 9 C19 5.5 13.5 5 10 8.5 C6 12.5 6.5 19 11 21.5 C15 23.7 19.5 22 21.5 18.5" stroke="#534AB7" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
    '<path d="M21.5 18.5 C22.5 16.5 22.5 15 21 14 L16 14" stroke="#534AB7" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>';

  /* ---- Rituals data: SINGLE source for both desktop mega + mobile accordion ----
     status: "Live" only for shipped tools (currently just Breathe).
     Keep every tool NON-MEDICAL (general wellness only). ---- */
  var RITUALS = [
    { dim: "Body",  zh: "身体", tools: [
        { n: "Breathe", s: "Live" }, { n: "Stretch", s: "Soon" }, { n: "Wind-down", s: "Soon" } ] },
    { dim: "Mind",  zh: "心智", tools: [
        { n: "Focus", s: "Soon" }, { n: "Reflect", s: "Soon" } ] },
    { dim: "Mood",  zh: "情绪", tools: [
        { n: "Ground", s: "Soon" }, { n: "Mood note", s: "Soon" } ] },
    { dim: "Bond",  zh: "联结", warm: true, tools: [
        { n: "Gratitude note", s: "Soon" }, { n: "Check on someone", s: "Soon" } ] },
    { dim: "Craft", zh: "创造", tools: [
        { n: "Free write", s: "Soon" }, { n: "Make something small", s: "Soon" } ] }
  ];

  function tagHtml(s) {
    var cls = s === "Live" ? "tg" : "tg soon";
    return '<span class="' + cls + '">' + s + "</span>";
  }

  /* ---- Build the desktop mega panel ---- */
  function megaHtml() {
    var cols = RITUALS.map(function (d) {
      var items = d.tools.map(function (t) {
        return '<a class="titem" href="rituals.html">' + t.n + " " + tagHtml(t.s) + "</a>";
      }).join("");
      return '<div class="mega-col' + (d.warm ? " warm" : "") + '">' +
             '<div class="ch"><b>' + d.dim + "</b> " + d.zh + "</div>" + items + "</div>";
    }).join("");
    return (
      '<div class="mega" id="ritualsMega" role="menu" aria-label="Rituals">' +
      '<div class="mega-lead">Rituals</div>' +
      '<div class="mega-tag">Small, gentle practices — organized by the five layers of how you are.</div>' +
      '<div class="mega-cols">' + cols + "</div>" +
      '<div class="mega-foot">' +
      '<span class="note">Body first — more rituals unfold as Genki grows. General wellness, not medical advice.</span>' +
      '<a class="cta" href="rituals.html">Open Rituals &rarr;</a></div></div>'
    );
  }

  /* ---- Build the mobile menu (links + Rituals accordion) ---- */
  function mobileMenuHtml() {
    var dims = RITUALS.map(function (d) {
      var tools = d.tools.map(function (t) {
        return '<a class="mm-tool" href="rituals.html">' + t.n + " " + tagHtml(t.s) + "</a>";
      }).join("");
      return '<div class="mm-dim"><div class="mm-dim-name">' + d.dim + " · " + d.zh + "</div>" + tools + "</div>";
    }).join("");
    return (
      '<div class="mobile-menu"><div class="mm-inner">' +
        '<div class="mm-acc" id="mmRituals">' +
          '<div class="mm-acc-head">Rituals <span class="chev"></span></div>' +
          '<div class="mm-acc-body">' + dims +
            '<a class="mm-tool" href="rituals.html" style="font-weight:600;color:var(--accent);padding-left:8px;">Open Rituals &rarr;</a>' +
          '</div>' +
        '</div>' +
        '<a class="mm-link" href="index.html#five-layers">The five layers</a>' +
        '<a class="mm-link" href="index.html#philosophy">Philosophy</a>' +
        '<a class="mm-link" href="index.html#manifesto">Manifesto</a>' +
        '<a class="mm-cta" href="index.html#waitlist">Join the waitlist</a>' +
      '</div></div>'
    );
  }

  /* ---- Header markup ---- */
  function headerHtml() {
    return (
      '<header class="site-header" id="siteHeader"><div class="wrap"><div class="nav">' +
        '<a class="brand" href="index.html" style="text-decoration:none;color:inherit;">' + MARK + " Genki</a>" +
        '<div class="nav-links">' +
          '<span class="has-mega">' +
            '<button class="rituals-trigger" id="ritualsTrigger" aria-haspopup="true" aria-expanded="false">Rituals <span class="chev"></span></button>' +
          '</span>' +
          '<a href="index.html#philosophy">Philosophy</a>' +
          '<a href="index.html#five-layers">The five layers</a>' +
          '<a href="index.html#manifesto">Manifesto</a>' +
          '<a href="index.html#waitlist" class="nav-cta">Join the waitlist</a>' +
        '</div>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        megaHtml() +
      '</div>' + mobileMenuHtml() + '</div></header>'
    );
  }

  /* ---- Footer markup ---- */
  function footerHtml() {
    return (
      '<footer><div class="wrap"><div class="foot-inner">' +
        '<div class="foot-brand"><a class="brand" href="index.html" style="text-decoration:none;color:inherit;">' + MARK + " Genki</a>" +
        '<p>A quiet Growth OS for becoming. General wellness, not medical advice.</p></div>' +
        '<div class="foot-cols">' +
          '<div class="foot-col"><h4>Product</h4><a href="rituals.html">Rituals</a><a href="index.html#five-layers">The five layers</a><a href="index.html#waitlist">Join the waitlist</a></div>' +
          '<div class="foot-col"><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>' +
          '<div class="foot-col"><h4>Contact</h4><a href="mailto:hello@genkilife.ai">hello@genkilife.ai</a></div>' +
        '</div></div>' +
        '<div class="foot-legal">© 2026 Genki · genkilife.ai</div>' +
      '</div></footer>'
    );
  }

  /* ---- Inject ---- */
  var navRoot = document.getElementById("site-nav-root");
  var footRoot = document.getElementById("site-footer-root");
  if (navRoot) navRoot.innerHTML = headerHtml();
  if (footRoot) footRoot.innerHTML = footerHtml();

  /* mark active page (body[data-page]) */
  var page = document.body.getAttribute("data-page");
  if (page === "rituals") {
    var rt = document.getElementById("ritualsTrigger");
    if (rt) rt.style.color = "var(--ink)";
  }

  var header = document.getElementById("siteHeader");
  if (!header) return;

  /* ---- Sticky pill on scroll ---- */
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Desktop mega: open on hover (with small close delay) + click + Esc ---- */
  var hasMega = header.querySelector(".has-mega");
  var trigger = document.getElementById("ritualsTrigger");
  var mega = document.getElementById("ritualsMega");
  var closeTimer = null;
  function openMega() { clearTimeout(closeTimer); header.classList.add("mega-open"); if (trigger) trigger.setAttribute("aria-expanded", "true"); }
  function closeMega() { header.classList.remove("mega-open"); if (trigger) trigger.setAttribute("aria-expanded", "false"); }
  function deferClose() { clearTimeout(closeTimer); closeTimer = setTimeout(closeMega, 180); }

  if (trigger && mega) {
    trigger.addEventListener("mouseenter", openMega);
    trigger.addEventListener("focus", openMega);
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      header.classList.contains("mega-open") ? closeMega() : openMega();
    });
    mega.addEventListener("mouseenter", openMega);
    mega.addEventListener("mouseleave", deferClose);
    if (hasMega) hasMega.addEventListener("mouseleave", deferClose);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMega(); });
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) closeMega();
    });
  }

  /* ---- Mobile menu toggle ---- */
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  /* mobile Rituals accordion */
  var mmAcc = document.getElementById("mmRituals");
  if (mmAcc) {
    var head = mmAcc.querySelector(".mm-acc-head");
    head.addEventListener("click", function () { mmAcc.classList.toggle("open"); });
  }
})();
