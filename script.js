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
                            trackEvent('video_progress', {
                                video_percent: m,
                                video_provider: 'vimeo',
                                video_title: 'Sofia IA - Apresentacao VSL',
                                event_category: 'VSL'
                            });
                        }
                    });
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
       2. PRICING TOGGLE (MENSAL / ANUAL)
       ========================================================================== */
    (function initPricingToggle() {
        const btnMonthly = document.getElementById('btn-monthly');
        const btnAnnual = document.getElementById('btn-annual');
        const priceElements = document.querySelectorAll('.price-val');
        if (!btnMonthly || !btnAnnual) return;

        btnMonthly.addEventListener('click', () => {
            btnMonthly.classList.add('active');
            btnAnnual.classList.remove('active');

            priceElements.forEach(el => {
                const monthlyVal = el.getAttribute('data-monthly');
                if (monthlyVal) el.textContent = monthlyVal;
            });
        });

        btnAnnual.addEventListener('click', () => {
            btnAnnual.classList.add('active');
            btnMonthly.classList.remove('active');

            priceElements.forEach(el => {
                const annualVal = el.getAttribute('data-annual');
                if (annualVal) el.textContent = annualVal;
            });
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
