/**
 * Liga gatilhos [data-reino-explore] à página explorar-imagem.html.
 */
(function (global) {
  "use strict";

  function currentPage() {
    var path = window.location.pathname || "";
    var parts = path.split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function buildExploreUrl(trigger) {
    var group = trigger.getAttribute("data-reino-explore-group");
    var index = trigger.getAttribute("data-explore-index") || "0";
    var from = trigger.getAttribute("data-explore-from") || currentPage();
    var params = new URLSearchParams();
    params.set("from", from);

    if (group) {
      params.set("group", group);
      params.set("i", index);
    } else {
      var src =
        trigger.getAttribute("data-explore-src") ||
        trigger.getAttribute("data-reino-explore-src");
      if (src) params.set("src", src);
      var title = trigger.getAttribute("data-explore-title");
      var caption = trigger.getAttribute("data-explore-caption");
      if (title) params.set("title", title);
      if (caption) params.set("caption", caption);
    }

    return "explorar-imagem.html?" + params.toString();
  }

  function bindTriggers() {
    document.querySelectorAll("[data-reino-explore]").forEach(function (trigger) {
      if (trigger._reinoExploreBound) return;
      trigger._reinoExploreBound = true;

      if (trigger.tagName === "A") {
        if (!trigger.getAttribute("href")) {
          trigger.setAttribute("href", buildExploreUrl(trigger));
        }
        return;
      }

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = buildExploreUrl(trigger);
      });
    });
  }

  function init() {
    bindTriggers();
  }

  global.ReinoImageExplorer = { init: init, buildUrl: buildExploreUrl };

  if (document.body && !document.body.classList.contains("reino-explore-page")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})(typeof window !== "undefined" ? window : this);
