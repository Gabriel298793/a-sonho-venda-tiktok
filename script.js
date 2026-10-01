/**
 * ==========================================================================
 * SOFIA IA — JAVASCRIPT ENGINE (LUXURY DARK NEURAL SYSTEM)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       HELPER: EVENT TRACKING (GA4 + META PIXEL)
       ========================================================================== */
    function trackEvent(eventName, params = {}, metaEvent = null, metaParams = {}) {
        // Google Analytics 4
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }

        // Meta Pixel
        if (typeof window.fbq === 'function') {
            if (metaEvent) {
                window.fbq('track', metaEvent, Object.keys(metaParams).length ? metaParams : params);
            }
        }
    }

    /* ==========================================================================
       1. PITCH DELAY MANAGER (REVELA BOTÃO & PREÇO AOS 3:30 MIN DE VSL)
       ========================================================================== */
    const PitchDelay = (function initPitchDelay() {
        const DEFAULT_DELAY_SECONDS = 210; // 3 min e 30 seg
        const STORAGE_KEY = 'sofia_pitch_revealed_v1';
        let isPitchRevealed = false;
        let pitchTimer = null;

        // Suporte para testes via URL (ex: ?tempo=5 para 5s, ou ?pitch=true para imediato)
        const urlParams = new URLSearchParams(window.location.search);
        let delaySeconds = DEFAULT_DELAY_SECONDS;
        if (urlParams.has('tempo')) {
            const parsed = parseInt(urlParams.get('tempo'), 10);
            if (!isNaN(parsed) && parsed >= 0) delaySeconds = parsed;
        }

        function revealPitch(triggerSource = 'vsl_timer') {
            if (isPitchRevealed) return;
            isPitchRevealed = true;

            try {
                localStorage.setItem(STORAGE_KEY, 'true');
            } catch (e) {}

            const delayedElements = document.querySelectorAll('.pitch-delayed');
            delayedElements.forEach(el => {
                el.classList.add('is-revealed');
            });

            trackEvent('pitch_revealed', {
                trigger_source: triggerSource,
                delay_seconds: delaySeconds,
                event_category: 'VSL'
            });

            console.log(`[Sofia IA] Oferta revelada com sucesso via ${triggerSource} (${delaySeconds}s)!`);
        }

        // Expor para testes no console
        window.revealPitch = () => revealPitch('manual_console');

        // Se o visitante já assistiu ao pitch anteriormente ou tem ?pitch=true, revela de imediato
        const hasSeenPitch = (() => {
            try {
                return localStorage.getItem(STORAGE_KEY) === 'true';
            } catch (e) {
                return false;
            }
        })();

        if (hasSeenPitch || urlParams.get('pitch') === 'true') {
            revealPitch('instant_cache');
        }

        // Fallback de leitura geral caso passe 4 minutos no site lendo o conteúdo
        setTimeout(() => {
            if (!isPitchRevealed) {
                revealPitch('page_reading_fallback');
            }
        }, 240 * 1000);

        // Ação do Botão Surgido no Hero que leva suavemente para o card de planos
        const heroPitchBtn = document.getElementById('btn-hero-scroll-pitch');
        if (heroPitchBtn) {
            heroPitchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const planosEl = document.getElementById('planos');
                if (planosEl) {
                    if (!isPitchRevealed) revealPitch('cta_click');
                    planosEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const card = planosEl.querySelector('.pricing-card');
                    if (card) {
                        card.classList.remove('card-highlight-pulse');
                        void card.offsetWidth; // força reflow
                        card.classList.add('card-highlight-pulse');
                    }
                }
                trackEvent('pitch_cta_click', {
                    target: 'planos',
                    event_category: 'conversion'
                });
            });
        }

        return {
            onVideoPlay: () => {
                if (!pitchTimer && !isPitchRevealed) {
                    pitchTimer = setTimeout(() => {
                        revealPitch('play_duration_fallback');
                    }, delaySeconds * 1000);
                }
            },
            onTimeUpdate: (currentSeconds) => {
                if (currentSeconds >= delaySeconds && !isPitchRevealed) {
                    revealPitch('vimeo_timeupdate');
                }
            },
            reveal: revealPitch,
            isRevealed: () => isPitchRevealed
        };
    })();

    /* ==========================================================================
       2. VSL PLAYER CONTROLLER (SMART AUTOPLAY MUTED + CLIQUE PARA OUVIR + GA4)
       ========================================================================== */
    (function initVSL() {
        const iframe = document.getElementById('vsl-iframe');
        const overlay = document.getElementById('vsl-overlay');
        if (!iframe || !overlay) return;

        let player = null;
        const milestones = { 25: false, 50: false, 75: false, 90: false };

        function getPlayer() {
            if (!player && window.Vimeo && window.Vimeo.Player) {
                player = new Vimeo.Player(iframe);

                // Tracking de marcos de progresso do vídeo + gatilho do pitch aos 3:30 min
                player.on('timeupdate', (data) => {
                    PitchDelay.onTimeUpdate(data.seconds);

                    const percent = Math.floor(data.percent * 100);
                    [25, 50, 75, 90].forEach((m) => {
                        if (percent >= m && !milestones[m]) {
                            milestones[m] = true;
                            trackEvent('video_progress', {
                                video_percent: m,
                                video_provider: 'vimeo',
                                video_title: 'Sofia IA - Apresentacao VSL',
                                event_category: 'VSL'
                            });
                        }
                    });
                });

                player.on('play', () => {
                    PitchDelay.onVideoPlay();
                });

                player.on('ended', () => {
                    trackEvent('video_complete', {
                        video_provider: 'vimeo',
                        video_title: 'Sofia IA - Apresentacao VSL',
                        event_category: 'VSL'
                    });
                    player.setMuted(true).catch(() => {});
                    player.setCurrentTime(0).catch(() => {});
                    player.play().catch(() => {});
                    overlay.classList.remove('hidden');
                });
            }
            return player;
        }

        getPlayer();

        overlay.addEventListener('click', () => {
            PitchDelay.onVideoPlay();

            trackEvent('vsl_unmute_click', {
                video_title: 'Sofia IA - Apresentacao VSL',
                event_category: 'VSL'
            });
            trackEvent('video_start', {
                video_provider: 'vimeo',
                video_title: 'Sofia IA - Apresentacao VSL',
                event_category: 'VSL'
            });

            const vimeoPlayer = getPlayer();

            if (vimeoPlayer) {
                vimeoPlayer.setMuted(false).then(() => {
                    return vimeoPlayer.setVolume(1);
                }).catch(() => {});

                vimeoPlayer.setCurrentTime(0).then(() => {
                    return vimeoPlayer.play();
                }).catch(() => {
                    vimeoPlayer.play().catch(() => {});
                });
            } else {
                const win = iframe.contentWindow;
                if (win) {
                    win.postMessage(JSON.stringify({ method: 'setVolume', value: 1 }), '*');
                    win.postMessage(JSON.stringify({ method: 'setMuted', value: false }), '*');
                    win.postMessage(JSON.stringify({ method: 'setCurrentTime', value: 0 }), '*');
                    win.postMessage(JSON.stringify({ method: 'play' }), '*');
                }
            }

            overlay.classList.add('hidden');
        });
    })();

    /* ==========================================================================
       3. FAQ ACCORDION
       ========================================================================== */
    (function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            if (!btn) return;

            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    })();

    /* ==========================================================================
       4. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    (function initScrollReveal() {
        const fadeElements = document.querySelectorAll('.fade-in');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            fadeElements.forEach(el => observer.observe(el));
        } else {
            fadeElements.forEach(el => el.classList.add('visible'));
        }
    })();

    /* ==========================================================================
       5. SMOOTH SCROLL PARA ÂNCORAS
       ========================================================================== */
    (function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                // Se for clique para ir até a seção de planos, garante que o pitch foi revelado
                if (targetId === '#planos' && !PitchDelay.isRevealed()) {
                    PitchDelay.reveal('anchor_click');
                }

                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    if (targetId === '#planos') {
                        const card = targetEl.querySelector('.pricing-card');
                        if (card) {
                            card.classList.remove('card-highlight-pulse');
                            void card.offsetWidth;
                            card.classList.add('card-highlight-pulse');
                        }
                    }
                }
            });
        });
    })();

    /* ==========================================================================
       6. UTM PASSTHROUGH (INJEÇÃO AUTOMÁTICA NOS LINKS DE CHECKOUT)
       ========================================================================== */
    (function initUTMPassthrough() {
        const CHECKOUT_DOMAINS = ['payfast.greenn.com.br', 'greenn.com.br', 'hotmart.com', 'kiwify.com.br'];
        const UTM_KEYS = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'subid', 'sid2', 'subid2', 'subid3', 'subid4', 'subid5',
            'xcod', 'sck', 'fbclid', 'gclid', 'ttclid', 'ref', 'src'
        ];

        const pageParams = new URLSearchParams(window.location.search);
        const capturedParams = {};

        UTM_KEYS.forEach(key => {
            const val = pageParams.get(key);
            if (val) capturedParams[key] = val;
        });

        const STORAGE_KEY = 'sofia_utms';
        let storedParams = {};
        try {
            storedParams = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
        } catch(e) {}

        const mergedParams = Object.assign({}, storedParams, capturedParams);
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mergedParams));
        } catch(e) {}

        function applyUTMsToCheckoutLinks() {
            if (Object.keys(mergedParams).length === 0) return;

            const allLinks = document.querySelectorAll('a');
            allLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#')) return;

                const isCheckout = CHECKOUT_DOMAINS.some(domain => href.includes(domain));
                if (isCheckout) {
                    try {
                        const url = new URL(href, window.location.origin);
                        Object.keys(mergedParams).forEach(param => {
                            url.searchParams.set(param, mergedParams[param]);
                        });
                        link.href = url.toString();
                    } catch(err) {}
                }
            });
        }

        applyUTMsToCheckoutLinks();

        if ('MutationObserver' in window) {
            new MutationObserver(applyUTMsToCheckoutLinks).observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    })();

    /* ==========================================================================
       7. GA4 & META PIXEL BUTTON TRACKING
       ========================================================================== */
    (function initConversionTracking() {
        // Botões de Checkout (Dispara begin_checkout e InitiateCheckout)
        document.querySelectorAll('a[href*="greenn.com.br"]').forEach((btn) => {
            btn.addEventListener('click', () => {
                trackEvent('begin_checkout', {
                    currency: 'BRL',
                    value: 198.00,
                    items: [{
                        item_id: 'sofia_ia_pro',
                        item_name: 'Sofia IA - Atendente WhatsApp Barbearia',
                        price: 198.00,
                        quantity: 1
                    }],
                    button_location: 'pricing_card',
                    event_category: 'ecommerce'
                }, 'InitiateCheckout', {
                    currency: 'BRL',
                    value: 198.00
                });
            });
        });

        // Botão de Dúvidas / WhatsApp Secundário (Dispara Lead / Contact)
        document.querySelectorAll('.whatsapp-support__btn, a[href*="wa.me"]').forEach((btn) => {
            btn.addEventListener('click', () => {
                trackEvent('whatsapp_contact_click', {
                    event_category: 'lead',
                    contact_channel: 'whatsapp_support',
                    phone: '5535984295953'
                }, 'Contact', {
                    contact_method: 'whatsapp'
                });
            });
        });
    })();

});
