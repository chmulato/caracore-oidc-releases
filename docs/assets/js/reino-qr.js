/**
 * Geração local de QR Code (sem API externa).
 * Requer assets/js/qrcode.min.js (qrcodejs).
 */
(function (global) {
    'use strict';

    function tlv(id, value) {
        value = String(value);
        if (value.length > 99) {
            throw new RangeError('O valor PIX excede o limite de um campo EMV.');
        }
        return id + String(value.length).padStart(2, '0') + value;
    }

    function crc16(text) {
        var crc = 0xFFFF;
        for (var i = 0; i < text.length; i += 1) {
            crc ^= text.charCodeAt(i) << 8;
            for (var bit = 0; bit < 8; bit += 1) {
                crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
                crc &= 0xFFFF;
            }
        }
        return crc.toString(16).toUpperCase().padStart(4, '0');
    }

    function buildPixPayload(options) {
        if (!options || !options.key || !options.amount || !options.merchantName || !options.merchantCity) {
            throw new TypeError('Informe chave, valor, recebedor e cidade para gerar o BR Code PIX.');
        }

        var key = String(options.key).replace(/\D/g, '');
        var merchantName = String(options.merchantName);
        var merchantCity = String(options.merchantCity);
        var amount = Number(options.amount).toFixed(2);
        var txid = options.txid == null ? '***' : String(options.txid);
        if (!/^\d{14}$/.test(key)) {
            throw new TypeError('A chave PIX CNPJ deve conter 14 dígitos.');
        }
        if (!/^[A-Z0-9 ]+$/.test(merchantName) || merchantName.length > 25) {
            throw new TypeError('O nome do recebedor deve ser ASCII, sem acentos, e ter até 25 caracteres.');
        }
        if (!/^[A-Z0-9 ]+$/.test(merchantCity) || merchantCity.length > 15) {
            throw new TypeError('A cidade do recebedor deve ser ASCII, sem acentos, e ter até 15 caracteres.');
        }
        if (!/^\d+\.\d{2}$/.test(amount) || Number(amount) <= 0) {
            throw new TypeError('O valor PIX deve ser maior que zero.');
        }
        if (!/^[A-Za-z0-9*]{1,25}$/.test(txid)) {
            throw new TypeError('O identificador da transação PIX deve ter de 1 a 25 caracteres alfanuméricos.');
        }

        var merchantAccount = tlv('00', 'br.gov.bcb.pix') + tlv('01', key);
        var additionalData = tlv('05', txid);
        var payload = tlv('00', '01') +
            tlv('26', merchantAccount) +
            tlv('52', '0000') +
            tlv('53', '986') +
            tlv('54', amount) +
            tlv('58', 'BR') +
            tlv('59', merchantName) +
            tlv('60', merchantCity) +
            tlv('62', additionalData) +
            '6304';
        return payload + crc16(payload);
    }

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
        crc16: crc16,
        buildPixPayload: buildPixPayload,
        toDataUrl: toDataUrl,
        applyToImg: applyToImg
    };
})(typeof window !== 'undefined' ? window : this);
