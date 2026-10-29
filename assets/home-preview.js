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
}());
