/**
 * Edição Free: não consulta licença nem identificador de máquina.
 */
(function () {
    'use strict';

    window.reinoStatus = 'VASSALO';
    window.verificarStatusReino = function () { return Promise.resolve(false); };
    window.ReinoLicense = {
        available: false,
        status: function () {
            return {
                active: false,
                available: false,
                message: 'Edição Free ativa. A edição paga não faz parte desta versão.'
            };
        },
        refresh: function () { return Promise.resolve(false); }
    };
    window.reinoLicenseReady = Promise.resolve(false);
})();
