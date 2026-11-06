(function () {
  "use strict";

  if (window.__genkiAnalyticsInitialized) return;
  window.__genkiAnalyticsInitialized = true;

  var endpoint = "https://api.genkilife.ai/api/analytics/events";
  var visitorKey = "genki_analytics_visitor_v1";
  var lifetime = 90 * 24 * 60 * 60 * 1000;
  var pages = {
    "/": "evt_1", "/index.html": "evt_1",
    "/rituals": "evt_2", "/rituals.html": "evt_2",
    "/about": "evt_3", "/about.html": "evt_3",
    "/rituals/breathe": "evt_4", "/rituals/breathe.html": "evt_4",
    "/rituals/manifest": "evt_5", "/rituals/manifest.html": "evt_5"
  };
  var path = window.location.pathname;
  var pageCode = pages[path];
  if (!pageCode) return;

  function randomId() {
    var crypto = window.crypto;
    if (!crypto) return null;
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    if (typeof crypto.getRandomValues !== "function") return null;
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.prototype.map.call(bytes, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function visitorId() {
    var now = Date.now();
    try {
      var saved = JSON.parse(localStorage.getItem(visitorKey) || "null");
      if (saved && /^[A-Za-z0-9_-]{16,64}$/.test(saved.id) && typeof saved.expires === "number" && saved.expires > now) return saved.id;
    } catch (e) { /* Storage may be unavailable. */ }
    var id = randomId();
    if (id) {
      try { localStorage.setItem(visitorKey, JSON.stringify({ id: id, expires: now + lifetime })); } catch (e) { /* Use this page's in-memory ID. */ }
    }
    return id;
  }

  var visitor = visitorId();
  if (!visitor) return;

  function retryDelay(response, attempt) {
    var header = response && response.headers.get("Retry-After");
    var seconds = header && Number(header);
    var date = header && Date.parse(header);
    var minimum = header ? (isFinite(seconds) ? seconds * 1000 : (isFinite(date) ? Math.max(0, date - Date.now()) : 0)) : 0;
    return Math.max(minimum, attempt === 0 ? 1000 : 3000) + Math.random() * 250;
  }

  function send(code) {
    var eventId = randomId();
    if (!eventId) return;
    var body = JSON.stringify({ event_id: eventId, event_code: code, visitor_id: visitor, path: path });
    function attempt(number) {
      fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "omit", keepalive: true, body: body
      }).then(function (response) {
        if (number < 2 && (response.status === 429 || response.status === 503)) {
          setTimeout(function () { attempt(number + 1); }, retryDelay(response, number));
        }
      }).catch(function () {
        if (number < 2) setTimeout(function () { attempt(number + 1); }, retryDelay(null, number));
      });
    }
    attempt(0);
  }

  var pendingView = false;
  window.addEventListener("pageshow", function () {
    if (document.visibilityState === "visible") send(pageCode);
    else pendingView = true;
  });
  document.addEventListener("visibilitychange", function () {
    if (pendingView && document.visibilityState === "visible") {
      pendingView = false;
      send(pageCode);
    }
  });

  if (pageCode !== "evt_1") return;
  var lastClicks = new WeakMap();
  document.addEventListener("click", function (event) {
    var target = event.target instanceof Element ? event.target : event.target.parentElement;
    if (!target) return;
    var control = target.closest("#siteHeader .nav-cta, #siteHeader .mm-cta, #waitlist button[type='submit'], .final form[data-waitlist] button[type='submit']");
    if (!control) return;
    var now = Date.now();
    var last = lastClicks.get(control);
    if (last !== undefined && now - last < 300) return;
    lastClicks.set(control, now);
    if (control.matches(".nav-cta, .mm-cta")) send("evt_6");
    else if (control.closest("#waitlist")) send("evt_7");
    else send("evt_9");
  }, true);
}());
