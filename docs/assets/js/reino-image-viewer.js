/**
 * Página dedicada explorar-imagem.html — zoom, pan e galeria.
 */
(function () {
  "use strict";

  var MIN_ZOOM = 1;
  var MAX_ZOOM = 4;
  var ZOOM_STEP = 0.35;

  var state = {
    items: [],
    index: 0,
    group: null,
    from: "index.html",
    scale: 1,
    tx: 0,
    ty: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    panStartX: 0,
    panStartY: 0,
  };

  var stage;
  var imgEl;
  var titleEl;
  var captionEl;
  var zoomLabelEl;
  var btnPrev;
  var btnNext;
  var viewport;
  var backLink;

  function readParams() {
    var p = new URLSearchParams(window.location.search);
    return {
      group: p.get("group"),
      index: parseInt(p.get("i") || p.get("index") || "0", 10) || 0,
      from: p.get("from") || "",
      src: p.get("src"),
      title: p.get("title") || "",
      caption: p.get("caption") || "",
    };
  }

  function loadItems(params) {
    if (
      params.group &&
      window.REINO_EXPLORE_GROUPS &&
      window.REINO_EXPLORE_GROUPS[params.group]
    ) {
      return window.REINO_EXPLORE_GROUPS[params.group].slice();
    }
    if (params.src) {
      return [
        {
          src: params.src,
          title: params.title,
          caption: params.caption,
        },
      ];
    }
    return [];
  }

  function syncUrl() {
    if (!state.group) return;
    var p = new URLSearchParams(window.location.search);
    p.set("group", state.group);
    p.set("i", String(state.index));
    if (state.from) {
      p.set("from", state.from);
    }
    var next = "explorar-imagem.html?" + p.toString();
    history.replaceState(null, "", next);
  }

  function applyTransform() {
    stage.style.transform =
      "translate(calc(-50% + " +
      state.tx +
      "px), calc(-50% + " +
      state.ty +
      "px)) scale(" +
      state.scale +
      ")";
    zoomLabelEl.textContent = Math.round(state.scale * 100) + "%";
    viewport.classList.toggle("is-pannable", state.scale > 1);
  }

  function clampPan() {
    if (state.scale <= 1) {
      state.tx = 0;
      state.ty = 0;
      return;
    }
    var rect = viewport.getBoundingClientRect();
    var maxX = (rect.width * (state.scale - 1)) / 2;
    var maxY = (rect.height * (state.scale - 1)) / 2;
    state.tx = Math.max(-maxX, Math.min(maxX, state.tx));
    state.ty = Math.max(-maxY, Math.min(maxY, state.ty));
  }

  function setZoom(next, centerX, centerY) {
    var prev = state.scale;
    state.scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    if (state.scale <= 1) {
      state.tx = 0;
      state.ty = 0;
    } else if (centerX != null && centerY != null && prev !== state.scale) {
      var factor = state.scale / prev - 1;
      var rect = viewport.getBoundingClientRect();
      var cx = centerX - rect.left - rect.width / 2;
      var cy = centerY - rect.top - rect.height / 2;
      state.tx -= cx * factor;
      state.ty -= cy * factor;
      clampPan();
    }
    applyTransform();
  }

  function showItem(idx) {
    if (!state.items.length) return;
    state.index = (idx + state.items.length) % state.items.length;
    var item = state.items[state.index];
    state.scale = 1;
    state.tx = 0;
    state.ty = 0;
    imgEl.src = item.src;
    imgEl.alt = item.caption || item.title || "Ilustração do Reino OIDC";
    titleEl.textContent = item.title || "Explorar ilustração";
    captionEl.textContent = item.caption || "";
    document.title = (item.title || "Explorar") + " — Reino OIDC";
    var multi = state.items.length > 1;
    btnPrev.disabled = !multi;
    btnNext.disabled = !multi;
    applyTransform();
    syncUrl();
  }

  function goBack() {
    if (state.from) {
      window.location.href = state.from;
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "index.html";
  }

  function bindControls() {
    btnPrev.addEventListener("click", function () {
      showItem(state.index - 1);
    });
    btnNext.addEventListener("click", function () {
      showItem(state.index + 1);
    });
    document.querySelector("[data-explore-zoom-in]").addEventListener("click", function () {
      setZoom(state.scale + ZOOM_STEP);
    });
    document.querySelector("[data-explore-zoom-out]").addEventListener("click", function () {
      setZoom(state.scale - ZOOM_STEP);
    });
    document.querySelector("[data-explore-reset]").addEventListener("click", function () {
      setZoom(1);
    });
    backLink.addEventListener("click", function (e) {
      if (state.from) return;
      e.preventDefault();
      goBack();
    });

    viewport.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        setZoom(state.scale + delta, e.clientX, e.clientY);
      },
      { passive: false }
    );

    viewport.addEventListener("pointerdown", function (e) {
      if (state.scale <= 1) return;
      state.dragging = true;
      viewport.classList.add("is-dragging");
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartX = state.tx;
      state.panStartY = state.ty;
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener("pointermove", function (e) {
      if (!state.dragging) return;
      state.tx = state.panStartX + (e.clientX - state.dragStartX);
      state.ty = state.panStartY + (e.clientY - state.dragStartY);
      clampPan();
      applyTransform();
    });

    viewport.addEventListener("pointerup", function (e) {
      state.dragging = false;
      viewport.classList.remove("is-dragging");
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {}
    });

    viewport.addEventListener("pointercancel", function () {
      state.dragging = false;
      viewport.classList.remove("is-dragging");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") goBack();
      if (e.key === "+" || e.key === "=") setZoom(state.scale + ZOOM_STEP);
      if (e.key === "-") setZoom(state.scale - ZOOM_STEP);
      if (e.key === "ArrowLeft") showItem(state.index - 1);
      if (e.key === "ArrowRight") showItem(state.index + 1);
      if (e.key === "0") setZoom(1);
    });
  }

  function init() {
    var params = readParams();
    state.group = params.group;
    state.from = params.from;
    state.items = loadItems(params);

    stage = document.querySelector(".reino-explore-page__stage");
    imgEl = document.getElementById("reino-explore-img");
    titleEl = document.getElementById("reino-explore-title");
    captionEl = document.getElementById("reino-explore-caption");
    zoomLabelEl = document.querySelector("[data-explore-zoom-label]");
    btnPrev = document.querySelector("[data-explore-prev]");
    btnNext = document.querySelector("[data-explore-next]");
    viewport = document.querySelector(".reino-explore-page__viewport");
    backLink = document.getElementById("reino-explore-back");

    if (state.from) {
      backLink.setAttribute("href", state.from);
    } else {
      backLink.setAttribute("href", "index.html");
    }

    if (!state.items.length) {
      titleEl.textContent = "Imagem não encontrada";
      captionEl.textContent = "Volte à página anterior e tente novamente.";
      btnPrev.disabled = true;
      btnNext.disabled = true;
      return;
    }

    bindControls();
    showItem(params.index);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
