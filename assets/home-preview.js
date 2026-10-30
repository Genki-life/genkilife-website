(function () {
  "use strict";
  var choices = {
    focus: { response: "“Let’s make space for one thing at a time.”", link: "Explore rituals →", href: "rituals.html" },
    unwind: { response: "“Take a breath. We can slow down together.”", link: "Try a breathing ritual →", href: "rituals/breathe.html" },
    reflect: { response: "“What’s been on your mind today?”", link: "Explore rituals →", href: "rituals.html" }
  };
  var choiceButtons = document.querySelectorAll("[data-nova-choice]");
  choiceButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var choice = choices[button.getAttribute("data-nova-choice")];
      choiceButtons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      document.getElementById("nova-response").textContent = choice.response;
      var link = document.getElementById("nova-link");
      link.textContent = choice.link;
      link.href = choice.href;
    });
  });

  var carousel = document.querySelector(".product-demo-view");
  if (!carousel) return;
  var track = carousel.querySelector(".product-demo-track");
  var screens = carousel.querySelectorAll(".product-demo-track img");
  var buttons = carousel.querySelectorAll(".product-demo-controls button");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var current = 0, timer = null, visible = false;

  function show(index) {
    current = index;
    track.style.transform = "translateX(-" + (index * 100) + "%)";
    buttons.forEach(function (button, i) { button.setAttribute("aria-pressed", String(i === index)); });
    screens.forEach(function (screen, i) { screen.setAttribute("aria-hidden", String(i !== index)); });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    if (visible && !motion.matches && !document.hidden && !carousel.matches(":hover") && !carousel.contains(document.activeElement)) {
      timer = setInterval(function () { show((current + 1) % buttons.length); }, 5000);
    }
  }
  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () { show(index); start(); });
  });
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", function (event) { if (!carousel.contains(event.relatedTarget)) start(); });
  document.addEventListener("visibilitychange", start);
  if (motion.addEventListener) motion.addEventListener("change", start);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; start(); }, { threshold: 0.25 }).observe(carousel);
  } else { visible = true; }
  show(0);
  start();
}());
