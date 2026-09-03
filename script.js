/**
 * ==========================================================================
 * SOFIA IA — JAVASCRIPT ENGINE (NEON VELOCITY)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {



    /* ==========================================================================
       HELPER: GA4 EVENT TRACKING
       ========================================================================== */
    function trackGAEvent(eventName, params = {}) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    }

    /* ==========================================================================
       1. VSL PLAYER CONTROLLER (SMART AUTOPLAY MUTED + CLIQUE PARA OUVIR + GA4)
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

                // Tracking de marcos de progresso do vídeo
                player.on('timeupdate', (data) => {
                    const percent = Math.floor(data.percent * 100);
                    [25, 50, 75, 90].forEach((m) => {
                        if (percent >= m && !milestones[m]) {
                            milestones[m] = true;
                            trackGAEvent('video_progress', {
                                video_percent: m,
                                video_provider: 'vimeo',
                                video_title: 'VSL Sofia IA Barbearia',
                                event_category: 'VSL'
                            });
                        }
                    });
                });

                player.on('ended', () => {
                    trackGAEvent('video_complete', {
                        video_provider: 'vimeo',
                        video_title: 'VSL Sofia IA Barbearia',
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
            trackGAEvent('vsl_unmute_click', {
                video_title: 'VSL Sofia IA Barbearia',
                event_category: 'VSL'
            });
            trackGAEvent('video_start', {
                video_provider: 'vimeo',
                video_title: 'VSL Sofia IA Barbearia',
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
       2. COUNTDOWN TIMER (PERSISTENTE NO LOCALSTORAGE, TABULAR-NUMS)
       ========================================================================== */
    (function initCountdown() {
        const STORAGE_KEY = 'sofia_countdown_timer_v1';
        const timerElements = document.querySelectorAll('.countdown-timer');

        function getEndTime() {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = parseInt(stored, 10);
                if (parsed > Date.now()) return parsed;
            }
            // 11 horas, 42 minutos e 18 segundos de urgência perene
            const newEnd = Date.now() + ((11 * 3600) + (42 * 60) + 18) * 1000;
            localStorage.setItem(STORAGE_KEY, newEnd.toString());
            return newEnd;
        }

        let endTime = getEndTime();

        function updateTimer() {
            const remaining = endTime - Date.now();
            if (remaining <= 0) {
                timerElements.forEach(el => el.textContent = '00:00:00');
                localStorage.removeItem(STORAGE_KEY);
                return;
            }

            const hours = Math.floor(remaining / 3600000);
            const mins = Math.floor((remaining % 3600000) / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);

            const formatted = 
                String(hours).padStart(2, '0') + ':' +
                String(mins).padStart(2, '0') + ':' +
                String(secs).padStart(2, '0');

            timerElements.forEach(el => {
                el.textContent = formatted;
            });
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    })();

    /* ==========================================================================
       3. FAQ ACCORDION (INTERAÇÃO FLUIDA)
       ========================================================================== */
    (function initFAQ() {
        const faqItems = document.querySelectorAll('.faq__item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq__question');
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
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
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

        // Persistência em sessionStorage
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
       7. GA4 TRACKING DOS PRINCIPAIS BOTÕES DA PÁGINA
       ========================================================================== */
    (function initGA4ButtonTracking() {
        // Botões de Checkout (Dispara begin_checkout)
        document.querySelectorAll('a[href*="greenn.com.br"]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const isFinal = btn.closest('.final-cta') !== null;
                const buttonLocation = isFinal ? 'final_cta' : 'offer_card';
                trackGAEvent('begin_checkout', {
                    currency: 'BRL',
                    value: 198.00,
                    items: [{
                        item_id: 'sofia_ia_mensal',
                        item_name: 'Sofia IA - Atendente WhatsApp Barbearia',
                        price: 198.00,
                        quantity: 1
                    }],
                    button_location: buttonLocation,
                    event_category: 'ecommerce'
                });
            });
        });

        // Botões de Âncora (Hero CTA e Header CTA)
        document.querySelectorAll('.hero__cta-row a, .header__cta a').forEach((btn) => {
            btn.addEventListener('click', () => {
                trackGAEvent('navigation_cta_click', {
                    event_category: 'engagement',
                    button_text: btn.innerText.trim(),
                    target_section: btn.getAttribute('href') || '#oferta'
                });
            });
        });

        // Botão de Dúvidas / WhatsApp Secundário
        document.querySelectorAll('.whatsapp-support__btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                trackGAEvent('whatsapp_contact_click', {
                    event_category: 'lead',
                    contact_channel: 'whatsapp_support',
                    phone: '5535984295953'
                });
            });
        });
    })();

});

