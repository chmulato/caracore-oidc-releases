/**
 * URLs oficiais da release vigente (loja Reino OIDC).
 * Atualize ao publicar nova tag em caracore-oidc-releases.
 */
(function (global) {
  "use strict";

  var TAG = "v2.0.1-free";
  var REPO = "https://github.com/chmulato/caracore-oidc-releases";

  global.REINO_RELEASE = {
    tag: TAG,
    version: "2.0.1-free",
    edition: "Free",
    versionLabel: "2.0.1",
    exeName: "ReinoOIDC-v2.exe",
    sizeBytes: 18157874,
    sha256: "067352c7201f2e3478d11abcf3a87f212fad6dc1c02768ccebd6ad78de2992b5",
    requirements: "Windows 10/11 64 bits com Microsoft Edge WebView2 Runtime",
    releasesIndex: REPO + "/releases",
    releasePage: REPO + "/releases/tag/" + TAG,
    download: function (asset) {
      return REPO + "/releases/download/" + TAG + "/" + asset;
    },
  };

  function fill(id, value) {
    var node = document.getElementById(id);
    if (node && value) node.textContent = value;
  }

  if (typeof document !== "undefined") {
    var apply = function () {
      var release = global.REINO_RELEASE;
      fill("reino-size", release.sizeBytes.toLocaleString("pt-BR") + " bytes");
      fill("reino-sha256", release.sha256);
      fill("reino-requirements", release.requirements);
      var page = document.getElementById("reino-release-page");
      if (page) page.href = release.releasePage;
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply);
    } else {
      apply();
    }
  }
})(typeof window !== "undefined" ? window : this);
