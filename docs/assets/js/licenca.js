(function () {
    'use strict';

    var apiRoot = '/__reino_license';
    var paidModuleIncluded = !!(window.REINO_OIDC_CONFIG && window.REINO_OIDC_CONFIG.paidModuleIncluded === true);
    var localApp = paidModuleIncluded && window.location.protocol === 'http:' &&
        ['127.0.0.1', 'localhost', '::1'].indexOf(window.location.hostname) !== -1;
    var status = {
        active: false,
        available: localApp,
        device_id: null,
        box_pub: null,
        message: 'Edição Free ativa. A edição paga não faz parte desta versão.'
    };

    function notify() {
        window.reinoStatus = status.active ? 'SOBERANO' : 'VASSALO';
        window.dispatchEvent(new CustomEvent('reino-license-changed', { detail: status }));
    }

    function readResponse(response) {
        return response.json().then(function (body) {
            if (!response.ok) {
                throw new Error(body && body.error ? body.error : 'A solicitação de licença falhou.');
            }
            return body;
        });
    }

    function refresh() {
        if (!localApp) {
            status.active = false;
            notify();
            return Promise.resolve(false);
        }
        return fetch(apiRoot + '/status', { cache: 'no-store' })
            .then(readResponse)
            .then(function (body) {
                status = Object.assign({ available: true }, body);
                notify();
                return status.active === true;
            })
            .catch(function (error) {
                status.active = false;
                status.message = error.message;
                notify();
                return false;
            });
    }

    function activationRequest() {
        if (!localApp) return Promise.reject(new Error('Abra esta página no aplicativo Windows.'));
        return fetch(apiRoot + '/request', { cache: 'no-store' }).then(readResponse);
    }

    function importFiles(licenseFile, packFile) {
        if (!localApp) return Promise.reject(new Error('A importação está disponível somente no aplicativo Windows.'));
        var form = new FormData();
        form.append('license', licenseFile);
        form.append('pack', packFile);
        return fetch(apiRoot + '/import', { method: 'POST', body: form })
            .then(readResponse)
            .then(function () { return refresh(); });
    }

    function premiumDecks() {
        if (!localApp || !status.active) {
            return Promise.reject(new Error('Esta Edição Free não inclui licenciamento.'));
        }
        return fetch(apiRoot + '/decks', { cache: 'no-store' })
            .then(readResponse)
            .then(function (body) {
                if (!body.decks || !['3', '4', '5'].every(function (id) {
                    return Array.isArray(body.decks[id]) && body.decks[id].length > 0;
                })) {
                    throw new Error('O aplicativo não retornou baralhos adicionais.');
                }
                return body.decks;
            });
    }

    window.reinoStatus = 'VASSALO';
    window.isPremium = function () { return status.active === true; };
    window.verificarStatusReino = refresh;
    window.ReinoLicense = {
        available: localApp,
        status: function () { return Object.assign({}, status); },
        refresh: refresh,
        activationRequest: activationRequest,
        importFiles: importFiles,
        premiumDecks: premiumDecks
    };
    window.reinoLicenseReady = refresh();
})();
