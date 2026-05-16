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
