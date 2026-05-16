/**
 * Aviso padrao de propriedade intelectual no rodape.
 */
(function () {
    'use strict';

    function ensureOwnershipNotice() {
        var footer = document.querySelector('footer');
        if (!footer) return;
        if (footer.querySelector('.reino-ownership-notice')) return;

        var notice = document.createElement('p');
        notice.className = 'mb-0 small reino-ownership-notice';
        notice.innerHTML = 'Os personagens do Reino OIDC são propriedade exclusiva da <strong>Cara Core Informática</strong>.';

        var container = footer.querySelector('.container') || footer;
        container.appendChild(notice);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureOwnershipNotice);
    } else {
        ensureOwnershipNotice();
    }
})();
