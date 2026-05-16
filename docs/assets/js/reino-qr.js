/**
 * Geração local de QR Code (sem API externa).
 * Requer assets/js/qrcode.min.js (qrcodejs).
 */
(function (global) {
    'use strict';

    function toDataUrl(text, size) {
        if (!global.QRCode || !text) return '';
        size = size || 180;
        var host = document.createElement('div');
        host.style.cssText = 'position:fixed;left:-9999px;top:0;overflow:hidden;width:' + size + 'px;height:' + size + 'px';
        document.body.appendChild(host);
        try {
            host.innerHTML = '';
            /* eslint-disable no-new */
            new global.QRCode(host, {
                text: String(text),
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: global.QRCode.CorrectLevel.M
            });
            var canvas = host.querySelector('canvas');
            if (canvas && canvas.toDataURL) {
                return canvas.toDataURL('image/png');
            }
            var img = host.querySelector('img');
            return img && img.src ? img.src : '';
        } catch (e) {
            return '';
        } finally {
            if (host.parentNode) host.parentNode.removeChild(host);
        }
    }

    function applyToImg(imgEl, text, size) {
        if (!imgEl || !text) return false;
        var url = toDataUrl(text, size || parseInt(imgEl.getAttribute('width'), 10) || 180);
        if (!url) return false;
        imgEl.src = url;
        imgEl.alt = imgEl.alt || 'QR Code PIX';
        return true;
    }

    global.ReinoQR = {
        toDataUrl: toDataUrl,
        applyToImg: applyToImg
    };
})(typeof window !== 'undefined' ? window : this);
