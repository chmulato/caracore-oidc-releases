/**
 * URLs oficiais da release vigente (loja Reino OIDC).
 * Atualize ao publicar nova tag em caracore-oidc-releases.
 */
(function (global) {
  "use strict";

  var TAG = "v2.0.2-free";
  var REPO = "https://github.com/chmulato/caracore-oidc-releases";

  global.REINO_RELEASE = {
    tag: TAG,
    version: "2.0.2-free",
    edition: "Free",
    versionLabel: "2.0.2",
    exeName: "ReinoOIDC-2.0.2-free.exe",
    sizeBytes: 17861640,
    sha256: "d5c6121e921dedab678b056129653870ebb6fbfa28a75b12074f3d4fbc131bcc",
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
