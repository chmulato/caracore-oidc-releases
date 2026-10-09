/**
 * Rodapé comum: copyright, fornecedor, privacidade e versão do aplicativo.
 */
(function () {
    'use strict';

    var COPYRIGHT = '© 2025–2026 Cara Core Informática — gratuito para pessoas físicas, uso pessoal e estudo.';
    var SUPPLIER = 'Cara Core Informática · CNPJ 23.969.028/0001-37 · Campo Largo/PR · o endereço completo é informado na confirmação do atendimento · suporte@caracore.com.br · +55 41 9 9909-7797 · +55 41 9 9896-4818';

    function ensureParagraph(footer, className, text) {
        if (footer.querySelector('.' + className)) return null;
        var notice = document.createElement('p');
        notice.className = 'mb-0 small ' + className;
        notice.textContent = text;
        var container = footer.querySelector('.container') || footer;
        container.appendChild(notice);
        return notice;
    }

    function ensurePrivacyLink(footer) {
        if (footer.querySelector('a[href="politica-privacidade.html"]')) return;
        var link = document.createElement('p');
        link.className = 'mb-0 small';
        link.innerHTML = '<a href="politica-privacidade.html">Política de privacidade</a> · <a href="licenca-uso.html">Licença de uso</a>';
        var container = footer.querySelector('.container') || footer;
        container.appendChild(link);
    }

    function ensureVersion(footer) {
        if (footer.querySelector('.reino-app-version')) return;
        var line = document.createElement('p');
        line.className = 'mb-0 small reino-app-version';
        var container = footer.querySelector('.container') || footer;
        container.appendChild(line);

        function showFixed() {
            var release = window.REINO_RELEASE;
            var label = release && release.versionLabel ? release.versionLabel : '2.0.2';
            line.textContent = 'Edição Free · versão ' + label;
        }

        var host = window.location.hostname;
        var localApp = host === '127.0.0.1' || host === 'localhost' || host === '::1' || !!window.__REINO_OIDC_LOCAL_STATE__;
        if (!localApp) {
            showFixed();
            return;
        }

        line.textContent = 'Edição Free';
        fetch('/__reino_health', { cache: 'no-store' })
            .then(function (response) { return response.ok ? response.json() : null; })
            .then(function (body) {
                if (!body || !body.version) {
                    showFixed();
                    return;
                }
                var raw = String(body.version);
                var label = raw.replace(/-free$/, '');
                line.textContent = 'Edição Free · versão ' + label;
            })
            .catch(function () {
                showFixed();
            });
    }

    function ensureFooter() {
        var footer = document.querySelector('body > footer');
        if (!footer) return;
        ensureParagraph(footer, 'reino-copyright', COPYRIGHT);
        ensureParagraph(footer, 'reino-supplier', SUPPLIER);
        ensureParagraph(footer, 'reino-ownership-notice', 'Os personagens do Reino OIDC são propriedade exclusiva da Cara Core Informática.');
        ensurePrivacyLink(footer);
        ensureVersion(footer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureFooter);
    } else {
        ensureFooter();
    }
})();
