/**
 * URLs oficiais da release vigente (loja Reino OIDC).
 * Atualize ao publicar nova tag em caracore-oidc-releases.
 */
(function (global) {
  "use strict";

  var TAG = "v2.0.0-RC1";
  var REPO = "https://github.com/chmulato/caracore-oidc-releases";

  global.REINO_RELEASE = {
    tag: TAG,
    version: "2.0.0-RC1",
    exeName: "ReinoOIDC-v2.exe",
    releasesIndex: REPO + "/releases",
    releasePage: REPO + "/releases/tag/" + TAG,
    download: function (asset) {
      return REPO + "/releases/download/" + TAG + "/" + asset;
    },
  };
})(typeof window !== "undefined" ? window : this);
