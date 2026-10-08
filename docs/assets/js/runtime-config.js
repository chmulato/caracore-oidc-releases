/**
 * Runtime config do Reino OIDC.
 * Baseline da branch oidc_local: execução local sem login.
 */
(function () {
    'use strict';

    window.REINO_OIDC_CONFIG = Object.assign(
        {
            mode: 'local',
            localMode: true,
            selfContained: true,
            requireLogin: false,
            unlockAllLearningContent: true,
            paidModuleIncluded: false
        },
        window.REINO_OIDC_CONFIG || {}
    );
})();
