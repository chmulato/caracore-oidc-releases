/**
 * Marca a parte da história como concluída. Arquivo externo para a CSP (script-src 'self').
 */
(function () {
    'use strict';

    function bind(part) {
        var btn = document.getElementById('btn-concluir-parte-' + part);
        var doneEl = document.getElementById('concluido-parte-' + part);
        var box = document.getElementById('concluir-parte-' + part + '-box');
        if (!btn || !window.ReinoEras) return;
        if (window.ReinoEras.getStoryPartDone(part)) {
            if (doneEl) doneEl.classList.remove('d-none');
            if (box) {
                box.classList.remove('alert-info');
                box.classList.add('alert-success');
            }
        }
        btn.addEventListener('click', function () {
            btn.disabled = true;
            window.ReinoEras.setStoryPartDone(part).then(function () {
                if (doneEl) doneEl.classList.remove('d-none');
                if (box) {
                    box.classList.remove('alert-info');
                    box.classList.add('alert-success');
                }
            }).catch(function (error) {
                btn.disabled = false;
                if (window.ReinoOIDCProgress) window.ReinoOIDCProgress.reportError(error);
                else console.error('Não foi possível salvar o progresso.', error);
            });
        });
    }

    function start() {
        bind(1);
        bind(2);
        bind(3);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
