/**
 * Navegação global — Reino OIDC v2 (menu sanduíche mobile/tablet).
 */
(function () {
    "use strict";

    var COLLAPSE_MAX = 991.98;

    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function isNarrowNav() {
        return window.matchMedia("(max-width: " + COLLAPSE_MAX + "px)").matches;
    }

    function getCollapse() {
        return (
            document.getElementById("navbarNav") ||
            document.getElementById("navbarWiki")
        );
    }

    function hideCollapse(collapse) {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
            var inst = bootstrap.Collapse.getInstance(collapse);
            if (!inst) {
                inst = bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false });
            }
            inst.hide();
            return;
        }
        collapse.classList.remove("show");
    }

    onReady(function () {
        var collapse = getCollapse();
        if (!collapse) {
            return;
        }

        var toggler = document.querySelector(
            '[data-bs-target="#' + collapse.id + '"]'
        );
        if (toggler) {
            toggler.setAttribute("aria-controls", collapse.id);
            if (!toggler.getAttribute("aria-label")) {
                toggler.setAttribute("aria-label", "Abrir menu de navegação");
            }
            collapse.addEventListener("shown.bs.collapse", function () {
                toggler.setAttribute("aria-expanded", "true");
                toggler.setAttribute("aria-label", "Fechar menu de navegação");
            });
            collapse.addEventListener("hidden.bs.collapse", function () {
                toggler.setAttribute("aria-expanded", "false");
                toggler.setAttribute("aria-label", "Abrir menu de navegação");
            });
        }

        collapse.querySelectorAll(".dropdown-item").forEach(function (link) {
            link.addEventListener("click", function () {
                if (isNarrowNav()) {
                    hideCollapse(collapse);
                }
            });
        });

        var storyLabels = {
            "historia_p1.html": "Parte I — A Era das Senhas e a Chegada de Lady OAuth",
            "historia_p2.html": "Parte II — A Era da Confiança e o Lord OIDC",
            "historia_p3.html": "Parte III — A Nova Ordem Digital e a Aprendiz Devia"
        };
        collapse.querySelectorAll("a.dropdown-item").forEach(function (link) {
            var href = link.getAttribute("href");
            if (href && storyLabels[href]) {
                link.textContent = storyLabels[href];
            }
        });

        if (document.body.classList.contains("cc-i-page")) {
            var list = collapse.querySelector(".navbar-nav");
            if (list && !list.querySelector('a[href="download.html"]')) {
                var downloadItem = document.createElement("li");
                downloadItem.className = "nav-item";
                downloadItem.innerHTML = '<a class="nav-link" href="download.html">⬇️ Download</a>';
                list.insertBefore(downloadItem, list.firstChild ? list.firstChild.nextSibling : null);
            }
            if (list && !list.querySelector('a[href="canal-feedback.html"]')) {
                var feedbackItem = document.createElement("li");
                feedbackItem.className = "nav-item";
                feedbackItem.innerHTML = '<a class="nav-link" href="canal-feedback.html">Feedback</a>';
                list.appendChild(feedbackItem);
            }
        }

        collapse.querySelectorAll(".nav-link").forEach(function (link) {
            if (link.classList.contains("dropdown-toggle")) {
                return;
            }
            link.addEventListener("click", function () {
                if (isNarrowNav()) {
                    hideCollapse(collapse);
                }
            });
        });
    });
})();
