(function () {
    'use strict';

    var STORY_KEYS = [
        'reino_oidc_story_part_1_done',
        'reino_oidc_story_part_2_done',
        'reino_oidc_story_part_3_done'
    ];
    var ACADEMY_KEY = 'reino_oidc_completed_paths';
    var VALID_PATHS = ['iniciante', 'aventureiro', 'mestre'];
    var localState = window.__REINO_OIDC_LOCAL_STATE__;
    var isDesktopApp = Boolean(localState && localState.progress);
    var progress = isDesktopApp ? Object.assign({}, localState.progress) : {};
    var ready = Promise.resolve();
    var errorShown = false;

    function reportError(error) {
        console.error('Não foi possível persistir o progresso do Reino OIDC.', error);
        if (errorShown) return;
        errorShown = true;

        function showBanner() {
            if (!document.body) return;
            var banner = document.createElement('div');
            banner.className = 'alert alert-danger';
            banner.setAttribute('role', 'alert');
            banner.style.cssText = 'position:fixed;z-index:2000;left:1rem;right:1rem;bottom:1rem;margin:0;';
            banner.textContent = 'O progresso não pôde ser salvo neste computador. Tente novamente antes de fechar o aplicativo.';
            document.body.appendChild(banner);
        }

        if (document.body) showBanner();
        else document.addEventListener('DOMContentLoaded', showBanner, { once: true });
    }

    function parseLegacyProgress() {
        var legacy = {};
        STORY_KEYS.forEach(function (key) {
            var value = localStorage.getItem(key);
            if (value === 'true' || value === '1') legacy[key] = true;
            else if (value !== null && value !== 'false' && value !== '0') {
                throw new Error('Formato inválido no progresso legado da história: ' + key);
            }
        });

        var paths = localStorage.getItem(ACADEMY_KEY);
        if (paths !== null) {
            var parsed = JSON.parse(paths);
            if (!Array.isArray(parsed) || parsed.some(function (path) {
                return VALID_PATHS.indexOf(path) === -1;
            })) {
                throw new Error('Formato inválido no progresso legado da Academia.');
            }
            legacy[ACADEMY_KEY] = Array.from(new Set(parsed));
        }
        return legacy;
    }

    function sendJson(url, method, payload) {
        return fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify(payload)
        }).then(function (response) {
            return response.json().catch(function () {
                throw new Error('O servidor local retornou uma resposta inválida.');
            }).then(function (body) {
                if (!response.ok) {
                    throw new Error(body.error || 'O servidor local recusou a gravação.');
                }
                return body;
            });
        });
    }

    function validate(key, value) {
        if (STORY_KEYS.indexOf(key) !== -1 && typeof value === 'boolean') return;
        if (key === ACADEMY_KEY && Array.isArray(value) && value.every(function (path) {
            return VALID_PATHS.indexOf(path) !== -1;
        }) && new Set(value).size === value.length) return;
        throw new Error('Valor de progresso inválido: ' + key);
    }

    if (isDesktopApp) {
        if (localState.recovered) {
            reportError(new Error('O arquivo principal estava inválido; uma cópia de segurança foi recuperada.'));
        }

        if (!localState.migrationComplete) {
            try {
                ready = sendJson('/__reino_state/migrate', 'POST', {
                    progress: parseLegacyProgress()
                }).then(function (result) {
                    progress = Object.assign({}, result.progress);
                }).catch(function (error) {
                    reportError(error);
                    throw error;
                });
            } catch (error) {
                reportError(error);
                ready = Promise.reject(error);
            }
        }
    }
    ready.catch(function () {});

    window.ReinoOIDCProgress = {
        get: function (key) {
            if (key !== ACADEMY_KEY && STORY_KEYS.indexOf(key) === -1) {
                throw new Error('Chave de progresso não permitida.');
            }
            if (isDesktopApp) {
                if (Object.prototype.hasOwnProperty.call(progress, key)) {
                    return Array.isArray(progress[key]) ? progress[key].slice() : progress[key];
                }
                return key === ACADEMY_KEY ? [] : false;
            }
            if (key === ACADEMY_KEY) {
                var raw = localStorage.getItem(key);
                return raw === null ? [] : JSON.parse(raw);
            }
            var stored = localStorage.getItem(key);
            return stored === 'true' || stored === '1';
        },

        set: function (key, value) {
            validate(key, value);
            if (!isDesktopApp) {
                if (key === ACADEMY_KEY) localStorage.setItem(key, JSON.stringify(value));
                else localStorage.setItem(key, value ? 'true' : 'false');
                return Promise.resolve(true);
            }

            return ready.then(function () {
                return sendJson('/__reino_state/progress', 'PUT', { key: key, value: value });
            }).then(function (result) {
                progress = Object.assign({}, result.progress);
                return true;
            }).catch(function (error) {
                reportError(error);
                throw error;
            });
        },

        ready: ready,
        reportError: reportError
    };
})();
