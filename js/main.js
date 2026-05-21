/* ============================================================
   SPORT ELITE — main.js
   RTL/LTR toggle | Header | Mobile Nav | Sliders | FAQ
   Countdown | Number Counter | Scroll Reveal | Particles
   ============================================================ */

(function () {
  'use strict';

  /* ── helpers ────────────────────────────── */
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ══════════════════════════════════════════
     1.  RTL / LTR  GLOBE TOGGLE
  ══════════════════════════════════════════ */
  const html = document.documentElement;
  const globeButtons = qsa('.lang-toggle, .globe-btn');

  let isRTL = localStorage.getItem('dir') === 'rtl';

  function applyDir(rtl) {
    isRTL = rtl;
    html.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    qsa('.dir-label').forEach(label => {
      label.textContent = rtl ? 'RTL' : 'LTR';
    });
    localStorage.setItem('dir', rtl ? 'rtl' : 'ltr');
  }

  applyDir(isRTL);

  globeButtons.forEach(btn => {
    btn.addEventListener('click', () => applyDir(!isRTL));
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') applyDir(!isRTL); });
  });

  /* ══════════════════════════════════════════
     1.5. THEME TOGGLE (DARK / LIGHT)
  ══════════════════════════════════════════ */
  const themeToggles = qsa('.theme-toggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.add('light-theme');
    } else {
      html.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    const isLight = html.classList.contains('light-theme');
    applyTheme(isLight ? 'dark' : 'light');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
  });

  // Sync theme across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') applyTheme(e.newValue);
    if (e.key === 'dir') applyDir(e.newValue === 'rtl');
  });

  // 1.8. TOPBAR USER PROFILE NAVIGATION REDIRECT
  const userProfileTrigger = qs('#topbar-profile-trigger');
  if (userProfileTrigger) {
    userProfileTrigger.addEventListener('click', () => {
      const settingsNav = qs('.sidebar-nav .nav-item[data-target="view-profile"], .sidebar-nav .nav-item[data-target="admin-settings"]');
      if (settingsNav) {
        settingsNav.click();
      }
    });
  }

  /* ══════════════════════════════════════════
     2.  HEADER SCROLL BEHAVIOUR
  ══════════════════════════════════════════ */
  const header = qs('#header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
    const btt = qs('#back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══════════════════════════════════════════
     2.5. DESKTOP DROPDOWNS (Click Trigger)
  ══════════════════════════════════════════ */
  const navItems = qsa('.nav-item');

  navItems.forEach(item => {
    const link = qs('.nav-link', item);
    const dropdown = qs('.dropdown', item);

    if (dropdown && link) {
      link.addEventListener('click', e => {
        // Only trigger for desktop (where dropdown exists and isn't hidden by mobile CSS)
        if (window.innerWidth > 992) {
          e.preventDefault();
          e.stopPropagation();

          const isActive = item.classList.contains('dropdown-active');

          // Close others
          navItems.forEach(i => i.classList.remove('dropdown-active'));

          // Toggle current
          if (!isActive) item.classList.add('dropdown-active');
        }
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item')) {
      navItems.forEach(i => i.classList.remove('dropdown-active'));
    }
  });

  /* ══════════════════════════════════════════
     3.  MOBILE NAVIGATION
  ══════════════════════════════════════════ */
  const hamburger = qs('#hamburger');
  const mobileNav = qs('#mobile-nav');
  const mobileOverlay = qs('#mobile-overlay');

  function closeMobileNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    if (isOpen) { closeMobileNav(); return; }
    hamburger.classList.add('open');
    mobileNav?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileOverlay?.addEventListener('click', closeMobileNav);

  /* Mobile accordion dropdowns */
  qsa('.mobile-nav-link[data-toggle]').forEach(link => {
    link.addEventListener('click', () => {
      const target = qs(link.dataset.toggle);
      if (!target) return;
      const isOpen = target.classList.contains('open');
      qsa('.mobile-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) target.classList.add('open');
    });
  });

  /* ══════════════════════════════════════════
     4.  ACTIVE NAV LINK (scroll spy light)
  ══════════════════════════════════════════ */
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav-link[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ══════════════════════════════════════════
     5.  SMOOTH SCROLL FOR ANCHOR LINKS
  ══════════════════════════════════════════ */
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMobileNav();
  });

  /* ══════════════════════════════════════════
     6.  BACK TO TOP
  ══════════════════════════════════════════ */
  qs('#back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════════
     7.  SCROLL REVEAL (Intersection Observer)
  ══════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  qsa('.reveal').forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════════════
     8.  NUMBER COUNTER ANIMATION
  ══════════════════════════════════════════ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.round(current).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  qsa('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  /* ══════════════════════════════════════════
     9.  PRODUCT FILTER
  ══════════════════════════════════════════ */
  const filterBtns = qsa('.filter-btn');
  const productCards = qsa('.product-card[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      productCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'scaleIn 0.3s ease forwards';
        }
      });
    });
  });

  /* ══════════════════════════════════════════
     10.  NEW ARRIVALS SLIDER
  ══════════════════════════════════════════ */
  function initSlider(trackId, prevId, nextId, visibleCount) {
    const track = qs(`#${trackId}`);
    if (!track) return;
    const cards = qsa('.arrival-card', track);
    const cardW = cards[0] ? cards[0].offsetWidth + 24 : 304;
    let index = 0;
    const maxIndex = Math.max(0, cards.length - visibleCount);

    function updateSlider() {
      const dir = html.getAttribute('dir') === 'rtl' ? 1 : -1;
      track.style.transform = `translateX(${dir * index * cardW}px)`;
    }

    qs(`#${nextId}`)?.addEventListener('click', () => {
      index = index < maxIndex ? index + 1 : 0;
      updateSlider();
    });

    qs(`#${prevId}`)?.addEventListener('click', () => {
      index = index > 0 ? index - 1 : maxIndex;
      updateSlider();
    });

    window.addEventListener('resize', () => {
      index = 0; updateSlider();
    });
  }

  initSlider('arrivals-track', 'arrivals-prev', 'arrivals-next', 3);

  /* ══════════════════════════════════════════
     11.  TESTIMONIALS AUTO-CAROUSEL
  ══════════════════════════════════════════ */
  (function () {
    const track = qs('#testi-track');
    if (!track) return;

    // Set fixed gap for calculation (matches CSS gap)
    const gap = 28;
    let isTransitioning = false;

    function moveNext() {
      if (isTransitioning) return;
      isTransitioning = true;

      const firstCard = track.firstElementChild;
      if (!firstCard) {
        isTransitioning = false;
        return;
      }

      const cardW = firstCard.offsetWidth + gap;
      const dir = html.getAttribute('dir') === 'rtl' ? 1 : -1;

      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      track.style.transform = `translateX(${dir * cardW}px)`;

      setTimeout(() => {
        track.style.transition = 'none';
        track.appendChild(firstCard);
        track.style.transform = 'translateX(0)';
        // Force reflow
        void track.offsetWidth;
        isTransitioning = false;
      }, 500);
    }

    function movePrev() {
      if (isTransitioning) return;
      isTransitioning = true;

      const lastCard = track.lastElementChild;
      if (!lastCard) {
        isTransitioning = false;
        return;
      }

      const cardW = lastCard.offsetWidth + gap;
      const dir = html.getAttribute('dir') === 'rtl' ? 1 : -1;

      track.style.transition = 'none';
      track.prepend(lastCard);
      track.style.transform = `translateX(${dir * cardW}px)`;

      // Force reflow before animating back
      void track.offsetWidth;

      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      track.style.transform = 'translateX(0)';

      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }

    let testiInterval = setInterval(moveNext, 4000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(testiInterval));
    track.addEventListener('mouseleave', () => { testiInterval = setInterval(moveNext, 4000); });

    qs('#testi-next')?.addEventListener('click', () => {
      clearInterval(testiInterval);
      moveNext();
      testiInterval = setInterval(moveNext, 4000);
    });

    qs('#testi-prev')?.addEventListener('click', () => {
      clearInterval(testiInterval);
      movePrev();
      testiInterval = setInterval(moveNext, 4000);
    });
  })();

  /* ══════════════════════════════════════════
     12.  FAQ ACCORDION
  ══════════════════════════════════════════ */
  qsa('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      qsa('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ══════════════════════════════════════════
     13.  COUNTDOWN TIMER
  ══════════════════════════════════════════ */
  (function () {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    end.setHours(23, 59, 59, 0);

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const dEl = qs('#cd-days');
      const hEl = qs('#cd-hours');
      const mEl = qs('#cd-mins');
      const sEl = qs('#cd-secs');
      if (dEl) dEl.textContent = pad(d);
      if (hEl) hEl.textContent = pad(h);
      if (mEl) mEl.textContent = pad(m);
      if (sEl) sEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ══════════════════════════════════════════
     14.  HERO PARTICLES
  ══════════════════════════════════════════ */
  (function () {
    const canvas = qs('#particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x: Math.random() * W,
        y: H + 10,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
      };
    }

    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.y = Math.random() * H;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.y -= p.speed;
        p.opacity -= 0.001;
        if (p.y < -10 || p.opacity <= 0) particles[i] = createParticle();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ══════════════════════════════════════════
     15.  PARALLAX HERO
  ══════════════════════════════════════════ */
  const heroBg = qs('.hero-bg');
  window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const offset = window.scrollY * 0.35;
    heroBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });

  /* ══════════════════════════════════════════
     16.  NEWSLETTER FORM
  ══════════════════════════════════════════ */
  qs('#newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = qs('#newsletter-email');
    const btn = qs('#newsletter-submit');
    if (!input || !input.value.includes('@')) return;
    btn.textContent = 'Subscribed!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      input.value = '';
    }, 3000);
  });

  /* ══════════════════════════════════════════
     17.  HERO TEXT TYPING ANIMATION
  ══════════════════════════════════════════ */
  (function () {
    const el = qs('#hero-typed');
    if (!el) return;
    const words = ['CHAMPIONS', 'ATHLETES', 'LEGENDS', 'WINNERS'];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
      let delay = deleting ? 60 : 100;
      if (!deleting && ci > word.length) { delay = 2000; deleting = true; }
      if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
      setTimeout(type, delay);
    }
    type();
  })();

  /* ══════════════════════════════════════════
     18.  GALLERY LIGHTBOX (simple)
  ══════════════════════════════════════════ */
  qsa('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = qs('img', item);
      if (!img) return;
      const lb = document.createElement('div');
      lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      const i = document.createElement('img');
      i.src = img.src;
      i.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8);';
      lb.appendChild(i);
      lb.addEventListener('click', () => lb.remove());
      document.body.appendChild(lb);
    });
  });

  /* ══════════════════════════════════════════
     19.  HEADER CTA HOVER GLOW
  ══════════════════════════════════════════ */
  qsa('.btn-primary,.btn-outline').forEach(b => {
    b.addEventListener('mousemove', e => {
      const rect = b.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      b.style.setProperty('--mx', `${x}%`);
      b.style.setProperty('--my', `${y}%`);
    });
  });

  /* ══════════════════════════════════════════
     20.  PRODUCT CARD TILT (subtle 3-D)
  ══════════════════════════════════════════ */
  qsa('.product-card,.feature-card,.membership-card,.value-card,.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
