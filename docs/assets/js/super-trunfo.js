/**
 * Reino OIDC — Motor de Cálculo Super Trunfo
 * compareCards(attr): valida quem tem maior valor no atributo.
 * Edição Free: dois baralhos gratuitos (9 personagens + 5 cartas da Aliança Federada).
 */

(function () {
    'use strict';

    const ATTR_IDS = ['seguranca', 'complexidade', 'escalabilidade', 'privacidade'];
    const ATTR_LABELS = {
        seguranca: 'Fortificação',
        complexidade: 'Nobreza',
        escalabilidade: 'Linhagem',
        privacidade: 'Sigilo'
    };
    const ATTR_LABELS_TECNICO = {
        seguranca: 'Segurança',
        complexidade: 'Complexidade',
        escalabilidade: 'Escalabilidade',
        privacidade: 'Privacidade (LGPD)'
    };
    /* Ordem de exibição nas cartas: Fortificação, Nobreza, Linhagem, Sigilo */
    const ATTR_DISPLAY_ORDER = ['seguranca', 'complexidade', 'escalabilidade', 'privacidade'];
    const ATTR_DISPLAY_NAMES = { seguranca: 'Fortificação', complexidade: 'Nobreza', escalabilidade: 'Linhagem', privacidade: 'Sigilo' };
    /* Deck 1: Nobreza (Autoridade) = higher is better. Outros decks podem usar LOWER_IS_BETTER para complexidade. */
    const LOWER_IS_BETTER = { complexidade: true };

    /**
     * REINO_DECK — Os 9 personagens (prompt_eras_historia.txt). Cada um tem era em que 'despertou'.
     * isLocked por era: a progressão da história libera as cartas das três Eras no plano Free.
     */
    const REINO_DECK = [
        { id: 'lady-oauth', name: 'Lady OAuth', subtitle: 'Guardiã das Portas', emoji: '👑', seguranca: 72, escalabilidade: 65, privacidade: 62, complexidade: 58, deckId: 1, reinoDeck: true, era: 1, flavor_text: 'Ela guarda as Portas do Reino; quem não tem o selo de autorização não passa.' },
        { id: 'lord-oidc', name: 'Lord OIDC', subtitle: 'O Mago da Identidade', emoji: '🧙‍♂️', seguranca: 68, escalabilidade: 72, privacidade: 68, complexidade: 65, deckId: 1, reinoDeck: true, era: 2, flavor_text: 'Governa o Baile das Identidades, revelando a verdade através do ID Token.' },
        { id: 'alex-client', name: 'Alex Client', subtitle: 'O Mensageiro Confiável', emoji: '🧑‍💼', seguranca: 58, escalabilidade: 68, privacidade: 60, complexidade: 55, deckId: 1, reinoDeck: true, era: 2, flavor_text: 'No cliente público não guarda segredo; o cliente confidencial guarda client_secret ou uma chave.' },
        { id: 'pixie-pkce', name: 'Pixie PKCE', subtitle: 'Guardiã dos Códigos Secretos', emoji: '🧚', seguranca: 92, escalabilidade: 85, privacidade: 94, complexidade: 91, deckId: 1, reinoDeck: true, era: 2, flavor_text: 'O espírito que tece code_verifier e code_challenge antes de cada travessia.' },
        { id: 'ida-token', name: 'IDA Token', subtitle: 'A Mensageira da Verdade', emoji: '🪪', seguranca: 90, escalabilidade: 92, privacidade: 95, complexidade: 93, deckId: 1, reinoDeck: true, era: 2, flavor_text: 'A verdade assinada por Lord OIDC; quem a lê conhece o usuário sem ver a senha.' },
        { id: 'rex-token', name: 'Rex Token', subtitle: 'O Renovador Eterno', emoji: '♾️', seguranca: 89, escalabilidade: 87, privacidade: 91, complexidade: 94, deckId: 1, reinoDeck: true, era: 2, flavor_text: 'Quando Ace e IDA viram pó, ele traz nova vida dos cofres seguros.' },
        { id: 'ace-token', name: 'Ace Token', subtitle: 'O Guerreiro das Permissões', emoji: '🛡️', seguranca: 88, escalabilidade: 90, privacidade: 87, complexidade: 91, deckId: 1, reinoDeck: true, era: 3, flavor_text: 'O cavaleiro Bearer que abre os portões dos recursos a quem porta o token válido.' },
        { id: 'seraph-resource', name: 'Seraph Resource', subtitle: 'O Guardião dos Dados', emoji: '🏦', seguranca: 95, escalabilidade: 88, privacidade: 90, complexidade: 87, deckId: 1, reinoDeck: true, era: 3, flavor_text: 'A muralha que só abre aos tokens legítimos; verifica assinatura e escopo.' },
        { id: 'devia', name: 'Devia', subtitle: 'Integradora Suprema', emoji: '👩‍💻', seguranca: 85, escalabilidade: 86, privacidade: 88, complexidade: 92, deckId: 1, reinoDeck: true, era: 3, integradoraSuprema: true, flavor_text: 'A programadora do futuro: une o poder de todos os personagens no seu código. O Reino OIDC é o seu presente.' }
    ];

    var DECK_1 = REINO_DECK.slice();

    /* Deck 2 — FREE. Aliança Federada. */
    const DECK_2 = [
        { id: 'oauth-2.1', name: 'OAuth 2.1', subtitle: 'Protocolo das Autorizações', emoji: '🔑', seguranca: 9, complexidade: 6, escalabilidade: 9, privacidade: 8, deckId: 2 },
        { id: 'oidc-core', name: 'OIDC Core', subtitle: 'Núcleo da Identidade', emoji: '🪙', seguranca: 9, complexidade: 7, escalabilidade: 9, privacidade: 9, deckId: 2 },
        { id: 'pkce-flow', name: 'PKCE Flow', subtitle: 'Fluxo da Confirmação', emoji: '🔐', seguranca: 9, complexidade: 5, escalabilidade: 8, privacidade: 8, deckId: 2 },
        { id: 'jwks', name: 'JWKS', subtitle: 'Conjunto de Chaves Públicas', emoji: '📜', seguranca: 8, complexidade: 6, escalabilidade: 9, privacidade: 7, deckId: 2 },
        { id: 'jwt', name: 'JWT', subtitle: 'Token Assinado', emoji: '🎫', seguranca: 8, complexidade: 5, escalabilidade: 9, privacidade: 8, deckId: 2 }
    ];

    const DECK_BY_ID = { 1: DECK_1, 2: DECK_2 };
    const DECK_NAMES = { 1: 'Personagens do Reino', 2: 'Aliança Federada' };

    const CONFIG = {
        STORAGE_LAST_ERA_KEY: 'reino_oidc_last_era_seen'
    };

    let state = {
        deckAtivo: 'deck1',
        deckId: 1,
        deck: [],
        cartaMaquina: null,
        cartaJogadoraAtual: null,
        rodadaAtiva: false,
        eliteUnlocked: false,
        licenseChecked: false,
        premiumDecks: {},
        currentEra: 1,
        placar: loadPlacar()
    };

    function check_license() {
        state.eliteUnlocked = false;
        state.licenseChecked = true;
        return false;
    }

    /**
     * Comparação de cartas: valida quem tem o maior valor no atributo escolhido.
     * @param {string} attr - seguranca | complexidade | escalabilidade | privacidade
     * @returns {number} 1 = jogadora vence, -1 = conselho vence, 0 = empate
     */
    function compareCards(attr) {
        if (!state.cartaJogadoraAtual || !state.cartaMaquina) return 0;
        var vJ = state.cartaJogadoraAtual[attr];
        var vM = state.cartaMaquina[attr];
        return compareValues(attr, vJ, vM, state.cartaJogadoraAtual, state.cartaMaquina);
    }

    function logTelemetria(message, type) {
        type = type || 'AUDIT';
        var logEl = document.getElementById('telemetria-log');
        if (!logEl) return;
        var ts = new Date().toLocaleTimeString('pt-BR', { hour12: false });
        var line = document.createElement('div');
        line.className = 'log-line' + (type === 'SUCESSO' ? ' log-success' : '') + (type === 'BATALHA' ? ' log-batalha' : '');
        line.innerHTML = '<span class="ts">[' + ts + ']</span> <span class="audit">[' + type + ']</span> ' + escapeHtml(message);
        logEl.appendChild(line);
        logEl.scrollTop = logEl.scrollHeight;
    }

    function logBatalha(message) {
        logTelemetria(message, 'BATALHA');
    }

    function getBattleNarrative(result, attr, cardJ, cardM) {
        var label = ATTR_LABELS[attr] || attr;
        var vJ = cardJ && cardJ[attr] != null ? cardJ[attr] : 0;
        var vM = cardM && cardM[attr] != null ? cardM[attr] : 0;
        if (result === 0) {
            return "Comparação " + label + ": empate — Jogadora " + vJ + " = Conselho " + vM + ".";
        }
        var who = result === 1 ? (cardJ && cardJ.name) || 'Jogadora' : (cardM && cardM.name) || 'Conselho';
        var power = result === 1 && cardJ && cardJ.poder ? cardJ.poder : (cardM && cardM.poder) || null;
        if (power) {
            return who + " usou '" + power + "'. " + label + " do Invasor " + (result === 1 ? "superada." : "reduzida.");
        }
        return "Comparação " + label + ": " + (result === 1 ? "Jogadora " + vJ + " vence Conselho " + vM + "." : "Conselho " + vM + " vence Jogadora " + vJ + ".");
    }

    function getResultPresentation(result) {
        if (result === 1) {
            return { className: 'win', message: 'Você venceu esta rodada! Governa suas identidades.' };
        }
        if (result === -1) {
            return { className: 'lose', message: 'O Conselho da Confiança venceu. Proteja seu Reino na próxima.' };
        }
        return { className: 'tie', message: 'Empate! Ninguém leva a carta.' };
    }

    window.ReinoSuperTrunfoResults = Object.freeze({
        getBattleNarrative: getBattleNarrative,
        getResultPresentation: getResultPresentation
    });

    function escapeHtml(s) {
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function loadPlacar() {
        try {
            var raw = localStorage.getItem('reino_oidc_trunfo_placar');
            var data = raw ? JSON.parse(raw) : null;
            if (!data || typeof data.vitorias !== 'number' || typeof data.derrotas !== 'number' || typeof data.empates !== 'number') {
                throw new Error('empty');
            }
            return { vitorias: data.vitorias, derrotas: data.derrotas, empates: data.empates };
        } catch (e) {
            return { vitorias: 0, derrotas: 0, empates: 0 };
        }
    }

    function savePlacar() {
        try {
            localStorage.setItem('reino_oidc_trunfo_placar', JSON.stringify(state.placar));
        } catch (e) {}
    }

    function renderPlacar() {
        var el = document.getElementById('trunfo-placar');
        if (!el || !state.placar) return;
        el.textContent = 'Vitórias ' + state.placar.vitorias + ' · Derrotas ' + state.placar.derrotas + ' · Empates ' + state.placar.empates;
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    function drawCard(deck) {
        if (!deck.length) return null;
        return deck.pop();
    }

    function compareValues(attr, valorJogadora, valorMaquina, cardJ, cardM) {
        var lowerBetter = LOWER_IS_BETTER[attr];
        if (attr === 'complexidade' && ((cardJ && cardJ.reinoDeck) || (cardM && cardM.reinoDeck))) {
            lowerBetter = false;
        }
        if (lowerBetter) {
            if (valorJogadora < valorMaquina) return 1;
            if (valorJogadora > valorMaquina) return -1;
        } else {
            if (valorJogadora > valorMaquina) return 1;
            if (valorJogadora < valorMaquina) return -1;
        }
        return 0;
    }

    function triggerRoundEffect() {
        var body = document.body;
        if (body) body.classList.add('screen-shake');
        setTimeout(function () {
            if (body) body.classList.remove('screen-shake');
        }, 400);
    }

    function paidModuleIncluded() {
        var config = window.REINO_OIDC_CONFIG || {};
        return config.paidModuleIncluded === true;
    }

    function attrBarHtml(attrKey, value) {
        var label = ATTR_DISPLAY_NAMES[attrKey] || attrKey;
        var pct = (value != null && value > 10) ? Math.min(100, Math.max(0, value)) : Math.min(100, Math.max(0, value) * 10);
        return '<div class="attr-row">' +
            '<span class="attr-name">' + label + '</span>' +
            '<span class="attr-bar-wrap"><span class="attr-bar-fill" style="width:' + pct + '%"></span></span>' +
            '<span class="attr-value">' + value + '</span></div>';
    }

    /**
     * Renderiza uma carta dos baralhos gratuitos.
     */
    function renderCard(card, container, isMachine) {
        if (!card) return;
        var extraDeck = (card.deckId >= 3 || card.elite) && (card.deckId !== undefined || card.elite);
        if (extraDeck) return;
        var locked = !!(card.isLocked && card.reinoDeck);
        var div = document.createElement('div');
        div.className = 'trunfo-card' + (card.elite ? ' elite' : '') + (locked ? ' trunfo-card-locked' : '');
        if (locked) div.setAttribute('role', 'button');
        if (locked) div.setAttribute('tabindex', '0');
        if (card.elite) div.innerHTML = '<span class="badge-elite">ELITE</span>';
        if (card.poder) div.innerHTML += '<span class="badge-poder">' + escapeHtml(card.poder) + '</span>';
        if (card.reinoDeck && card.era) div.innerHTML += '<span class="card-awakened-era" title="Despertou nesta Era">Era ' + card.era + '</span>';
        if (card.integradoraSuprema) div.classList.add('devia-integradora');
        if (locked) div.innerHTML += '<span class="card-lock-icon" aria-hidden="true">🔒</span>';
        var subtitleHtml = card.subtitle ? '<div class="card-subtitle">' + escapeHtml(card.subtitle) + '</div>' : '';
        var flavorHtml = (card.flavor_text && !locked) ? '<p class="card-flavor-text">' + escapeHtml(card.flavor_text) + '</p>' : (card.flavor_text && locked) ? '<p class="card-flavor-text card-flavor-text-locked">' + escapeHtml(card.flavor_text) + '</p>' : '';
        var deviaTransitionHtml = (card.integradoraSuprema && !locked) ? '<p class="card-devia-transition">' + (typeof window.ReinoEras !== 'undefined' ? window.ReinoEras.getDeviaTransitionText() : 'O futuro chegou. Você é Devia. O Reino OIDC agora é o seu código.') + '</p>' : '';
        div.innerHTML +=
            '<div class="card-name">' + escapeHtml(card.name) + '</div>' +
            subtitleHtml +
            '<div class="card-emoji">' + card.emoji + '</div>';
        if (!locked) {
            ATTR_DISPLAY_ORDER.forEach(function (key) {
                div.innerHTML += attrBarHtml(key, card[key] != null ? card[key] : 0);
            });
        } else {
            var lockMessage = 'Conclua a parte anterior da história para liberar esta carta.';
            div.innerHTML += '<p class="card-desbloqueie">' + escapeHtml(lockMessage) + '</p>';
        }
        div.innerHTML += flavorHtml + deviaTransitionHtml;
        if (card.reinoDeck && card.era && typeof window.ReinoEras !== 'undefined') {
            var foco = window.ReinoEras.getFocoTecnicoEra(card.era);
            div.innerHTML += '<div class="card-foco-tecnico">' + escapeHtml(foco) + '</div>';
        }
        /* Mantém o destaque visual da carta da Era 3 sem confundir currículo com upgrade. */
        if (card.integradoraSuprema) {
            div.classList.add('devia-glitch-card');
        }
        var openLockedCard = function () {
            if (card.reinoDeck) {
                var eras = window.ReinoEras && window.ReinoEras.ERAS;
                var previousEra = eras && eras[card.era - 1];
                if (previousEra && previousEra.storyPage) window.location.href = previousEra.storyPage;
            }
        };
        if (locked) {
            div.addEventListener('click', function (e) {
                if (e.target && e.target.getAttribute && e.target.getAttribute('data-cta-checkout') !== null) return;
                e.preventDefault();
                openLockedCard();
            });
            div.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLockedCard();
                }
            });
        }
        var ctaBtn = div.querySelector('[data-cta-checkout]');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (typeof window.openRitualAtivacao === 'function') window.openRitualAtivacao();
            });
        }
        container.appendChild(div);
    }

    /**
     * Renderiza o deck de personagens com base na progressão gratuita da história.
     */
    function renderDeck(container) {
        if (!container) return;
        container.innerHTML = '';
        var list = getReinoDeckForEra();
        list.forEach(function (card) {
            renderCard(card, container, false);
        });
    }

    function getReinoDeckForEra() {
        var unlockedIds = typeof window.ReinoEras !== 'undefined' ? window.ReinoEras.getUnlockedCharacterIds() : ['lady-oauth'];
        return REINO_DECK.map(function (c) {
            var unlocked = unlockedIds.indexOf(c.id) !== -1;
            return Object.assign({}, c, { isLocked: !unlocked });
        });
    }

    function buildDeck(deckId) {
        var id = typeof deckId === 'string' ? parseInt(deckId.replace('deck', ''), 10) : deckId;
        if (!id || (id < 3 && !DECK_BY_ID[id])) return shuffle(DECK_1.slice());
        var list;
        if (id === 1) {
            list = getReinoDeckForEra().slice();
        } else if (id >= 3 && check_license()) {
            list = (state.premiumDecks[String(id)] || []).slice();
            if (!list.length) return shuffle(DECK_1.slice());
        } else {
            list = DECK_BY_ID[id].slice();
        }
        return shuffle(list.filter(function (card) { return !card.isLocked; }));
    }

    function startGame() {
        var activeTab = document.querySelector('.deck-tab.active');
        var deckKey = (activeTab && activeTab.dataset.deck) || 'deck1';
        state.deckAtivo = deckKey;
        state.deckId = parseInt(deckKey.replace('deck', ''), 10) || 1;
        if (state.deckId >= 3 && !check_license()) {
            state.deckId = 1;
            state.deckAtivo = 'deck1';
            document.querySelectorAll('.deck-tab').forEach(function (t) {
                t.classList.toggle('active', t.dataset.deck === 'deck1');
            });
        }
        var list = buildDeck(state.deckId);
        state.deck = list;
        state.cartaJogadoraAtual = drawCard(state.deck);
        state.cartaMaquina = drawCard(state.deck);
        state.rodadaAtiva = true;

        logTelemetria('Sessão iniciada no Reino. Deck: ' + (DECK_NAMES[state.deckId] || state.deckAtivo) + '.');
        logTelemetria('Identidade Federada Validada via OIDC (ambiente local).');

        updateUI();
        hideResult();
        hideShadedCard();
        bindAttrButtons();
    }

    function updateUI() {
        var zonaJogadora = document.getElementById('cartas-jogadora');
        var zonaMaquina = document.getElementById('carta-maquina');
        if (!zonaJogadora || !zonaMaquina) return;

        zonaJogadora.innerHTML = '';
        zonaMaquina.innerHTML = '';

        if (state.cartaJogadoraAtual) {
            renderCard(state.cartaJogadoraAtual, zonaJogadora, false);
        }
        if (state.cartaMaquina) {
            renderCard(state.cartaMaquina, zonaMaquina, true);
        }

        var chooseEl = document.getElementById('choose-attr');
        if (chooseEl) {
            chooseEl.style.display = state.rodadaAtiva && state.cartaJogadoraAtual && state.cartaMaquina ? 'block' : 'none';
        }

        var scoreEl = document.getElementById('score-jogadora');
        if (scoreEl) {
            scoreEl.textContent = state.deck.length + (state.cartaJogadoraAtual ? 1 : 0) + (state.cartaMaquina ? 1 : 0);
        }
    }

    function hideResult() {
        var r = document.getElementById('round-result');
        if (r) {
            r.classList.remove('show', 'win', 'lose', 'tie');
            r.style.display = 'none';
        }
    }

    function showResult(result, attr) {
        var r = document.getElementById('round-result');
        if (!r) return;
        var presentation = getResultPresentation(result);
        r.classList.remove('win', 'lose', 'tie');
        r.classList.add(presentation.className, 'show');
        r.style.display = 'block';
        var msg = r.querySelector('.result-msg');
        if (msg) {
            msg.textContent = presentation.message;
        }
        var detail = r.querySelector('.result-detail');
        if (detail) {
            var label = ATTR_LABELS[attr] || attr;
            var tech = ATTR_LABELS_TECNICO[attr];
            detail.textContent = 'Atributo: ' + label + (tech ? ' (' + tech + ')' : '');
        }
    }

    function playRound(attr) {
        if (!state.rodadaAtiva || !state.cartaJogadoraAtual || !state.cartaMaquina) return;

        var result = compareCards(attr);
        var cardJ = state.cartaJogadoraAtual;
        var cardM = state.cartaMaquina;
        var usesPower = (cardJ && (cardJ.poder || cardJ.deckId >= 3)) || (cardM && (cardM.poder || cardM.deckId >= 3));

        logBatalha(getBattleNarrative(result, attr, cardJ, cardM));
        if (result === 1) {
            state.placar.vitorias += 1;
            logTelemetria('Protocolo OIDC validado com honras.', 'SUCESSO');
        } else if (result === -1) {
            state.placar.derrotas += 1;
            logTelemetria('Rodada: vitória do Conselho da Confiança. Defesa registrada no Reino.');
        } else {
            state.placar.empates += 1;
            logTelemetria('Empate no Reino. Nova rodada disponível.');
        }
        savePlacar();
        renderPlacar();

        if (usesPower) triggerRoundEffect();

        showResult(result, attr);
        state.rodadaAtiva = false;

        var attrBtns = document.querySelectorAll('.attr-btn');
        attrBtns.forEach(function (b) { b.disabled = true; });

        var btnProxima = document.getElementById('btn-proxima');
        if (btnProxima) btnProxima.style.display = 'inline-block';

        showShadedCard();
    }

    function showShadedCard() {
        var zone = document.getElementById('carta-sombreada-premium');
        if (!zone) return;
        zone.classList.add('show');
    }

    function hideShadedCard() {
        var zone = document.getElementById('carta-sombreada-premium');
        if (zone) zone.classList.remove('show');
    }

    function nextRound() {
        if (state.deck.length < 2) {
            logTelemetria('Baralho insuficiente. Fim de jogo.');
            state.rodadaAtiva = false;
            state.cartaJogadoraAtual = null;
            state.cartaMaquina = null;
            updateUI();
            var chooseEl = document.getElementById('choose-attr');
            if (chooseEl) chooseEl.style.display = 'none';
            var btnProxima = document.getElementById('btn-proxima');
            if (btnProxima) btnProxima.style.display = 'none';
            var r = document.getElementById('round-result');
            if (r) {
                r.classList.remove('win', 'lose', 'tie');
                r.classList.add('show', 'win');
                var msg = r.querySelector('.result-msg');
                if (msg) msg.textContent = 'Partida encerrada. Torne-se a Arquiteta do Acesso!';
                var det = r.querySelector('.result-detail');
                if (det) det.textContent = '';
            }
            return;
        }

        state.cartaJogadoraAtual = drawCard(state.deck);
        state.cartaMaquina = drawCard(state.deck);
        if (!state.cartaJogadoraAtual || !state.cartaMaquina) {
            nextRound();
            return;
        }
        state.rodadaAtiva = true;
        hideResult();
        hideShadedCard();
        updateUI();
        bindAttrButtons();
        var btnProxima = document.getElementById('btn-proxima');
        if (btnProxima) btnProxima.style.display = 'none';
        logTelemetria('Nova rodada no Reino. Carta da jogadora e do Conselho da Confiança distribuídas.');
    }

    function bindAttrButtons() {
        ATTR_IDS.forEach(function (attr) {
            var btn = document.getElementById('attr-' + attr);
            if (btn) {
                btn.onclick = function () { playRound(attr); };
                btn.disabled = false;
            }
        });
    }

    function initDeckTabs() {
        var unlocked = check_license();
        [1, 2, 3, 4, 5].forEach(function (id) {
            var tab = document.getElementById('deck-' + id);
            if (!tab) return;
            if (id <= 2) {
                tab.classList.remove('locked');
                tab.onclick = function () { setDeck('deck' + id); };
            } else if (!paidModuleIncluded()) {
                tab.hidden = true;
            } else {
                if (unlocked) {
                    tab.classList.remove('locked');
                    tab.onclick = function () { setDeck('deck' + id); };
                } else {
                    tab.classList.add('locked');
                    tab.onclick = function () {
                        logTelemetria('O baralho ' + (DECK_NAMES[id] || id) + ' não faz parte desta Edição Free.');
                    };
                }
            }
        });
    }

    function setDeck(deckId) {
        var id = typeof deckId === 'string' ? parseInt(deckId.replace('deck', ''), 10) : deckId;
        if (id >= 3 && !paidModuleIncluded()) return;
        if (id >= 3 && (!check_license() || !state.premiumDecks[String(id)])) return;
        state.deckAtivo = 'deck' + id;
        state.deckId = id;
        document.querySelectorAll('.deck-tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.deck === state.deckAtivo);
        });
        logTelemetria('Deck selecionado no Reino: ' + (DECK_NAMES[id] || state.deckAtivo) + '.');
    }

    function renderTimeline() {
        var container = document.getElementById('reino-timeline');
        if (!container || typeof window.ReinoEras === 'undefined') return;
        var state = window.ReinoEras.getTimelineState();
        var eras = window.ReinoEras.ERAS;
        container.innerHTML = '';
        container.className = 'reino-timeline';
        [1, 2, 3].forEach(function (e) {
            var era = eras[e];
            var done = e === 1 ? state.part1 : e === 2 ? state.part2 : state.part3;
            var span = document.createElement('span');
            span.className = 'timeline-era' + (done ? ' active' : '');
            span.setAttribute('title', era.title);
            span.innerHTML = '<span class="timeline-era-dot"></span><span class="timeline-era-label">Era ' + e + '</span>';
            if (e < 3) {
                var link = document.createElement('a');
                link.href = era.storyPage;
                link.className = 'timeline-era-link';
                link.textContent = era.subtitle;
                span.appendChild(link);
            }
            container.appendChild(span);
        });
    }

    function applyEraTheme() {
        var era = typeof window.ReinoEras !== 'undefined' ? window.ReinoEras.getCurrentEra() : 1;
        state.currentEra = era;
        document.body.classList.remove('era-1', 'era-2', 'era-3');
        document.body.classList.add('era-' + era);
    }

    /**
     * Overlay dos Contos das Eras: título gótico + texto técnico sem-serifa.
     * Quando currentEra muda, exibe o texto educativo correspondente à Era.
     */
    function showEraOverlay(era) {
        if (typeof window.ReinoEras === 'undefined') return;
        var narrativa = window.ReinoEras.getNarrativaEra(era);
        var isEra3 = era === 3;

        var overlay = document.getElementById('reino-era-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'reino-era-overlay';
            overlay.className = 'reino-era-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-labelledby', 'reino-era-overlay-title');
            document.body.appendChild(overlay);
        }

        var deviaText = window.ReinoEras.getDeviaTransitionText();
        var deviaBlock = isEra3
            ? '<p class="reino-era-devia-glitch">' + escapeHtml(deviaText) + '</p>'
            : '';

        overlay.innerHTML =
            '<div class="reino-era-overlay-inner">' +
            '<h2 id="reino-era-overlay-title" class="reino-era-overlay-titulo">' + escapeHtml(narrativa.titulo) + '</h2>' +
            '<p class="reino-era-overlay-subtitulo">' + escapeHtml(narrativa.subtitulo) + '</p>' +
            '<p class="reino-era-overlay-tecnico">' + escapeHtml(narrativa.textoTecnico) + '</p>' +
            deviaBlock +
            '<button type="button" class="reino-era-overlay-fechar">Continuar</button>' +
            '</div>';
        overlay.classList.add('show');

        overlay.querySelector('.reino-era-overlay-fechar').addEventListener('click', function () {
            overlay.classList.remove('show');
        });
    }

    function checkEraTransitionAndShowOverlay() {
        if (typeof window.ReinoEras === 'undefined') return;
        var currentEra = window.ReinoEras.getCurrentEra();
        var lastSeen = null;
        try {
            lastSeen = sessionStorage.getItem(CONFIG.STORAGE_LAST_ERA_KEY);
        } catch (e) {}
        if (String(currentEra) !== lastSeen) {
            showEraOverlay(currentEra);
            try {
                sessionStorage.setItem(CONFIG.STORAGE_LAST_ERA_KEY, String(currentEra));
            } catch (e) {}
        }
    }

    function init() {
        renderPlacar();
        logTelemetria('Reino da Identidade Federada — Super Trunfo iniciado. Proteja seu Reino.');
        applyEraTheme();
        renderTimeline();
        checkEraTransitionAndShowOverlay();

        var btnIniciar = document.getElementById('btn-iniciar');
        if (btnIniciar) btnIniciar.onclick = startGame;

        var btnProxima = document.getElementById('btn-proxima');
        if (btnProxima) btnProxima.onclick = nextRound;

        Promise.resolve(paidModuleIncluded() ? window.reinoLicenseReady : null)
            .then(function () {
                return paidModuleIncluded() && check_license() && window.ReinoLicense ?
                    window.ReinoLicense.premiumDecks() : {};
            })
            .then(function (decks) {
                state.premiumDecks = decks || {};
                initDeckTabs();
                setDeck('deck1');
                applyEraTheme();
                renderTimeline();
            })
            .catch(function (error) {
                logTelemetria('Não foi possível preparar os baralhos: ' + error.message, 'ERROR');
                state.premiumDecks = {};
                initDeckTabs();
                setDeck('deck1');
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
