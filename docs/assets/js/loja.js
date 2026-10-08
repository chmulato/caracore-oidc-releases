/**
 * Reino OIDC — Loja (reino-oidc-releases)
 * Script compartilhado para páginas que não carregam outro script em assets/js.
 */
'use strict';

(function () {
    var supplier = document.querySelector('.reino-supplier');
    if (!supplier) {
        var footer = document.querySelector('footer');
        if (!footer) {
            footer = document.createElement('footer');
            footer.className = 'py-4';
            document.body.appendChild(footer);
        }
        var block = document.createElement('p');
        block.className = 'mb-0 small reino-supplier';
        block.textContent = 'Cara Core Informática · CNPJ 23.969.028/0001-37 · Campo Largo/PR · o endereço completo é informado na confirmação do atendimento · suporte@caracore.com.br · +55 41 9 9909-7797 · +55 41 9 9896-4818';
        (footer.querySelector('.container') || footer).appendChild(block);
        if (!footer.querySelector('a[href="politica-privacidade.html"]')) {
            var privacy = document.createElement('p');
            privacy.className = 'mb-0 small';
            privacy.innerHTML = '<a href="politica-privacidade.html">Política de privacidade</a>';
            (footer.querySelector('.container') || footer).appendChild(privacy);
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var id = a.getAttribute('href');
        if (id === '#') return;
        var el = document.querySelector(id);
        if (el) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    });
})();
