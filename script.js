/* ============================================================
   CONFIG — sirf ye values apni daalni hain
   - accessKey : https://web3forms.com par email daalo, key email par aayegi (free)
   - email     : tumhara business email
   - whatsapp  : country code ke saath, bina + ya space ke (e.g. 923001234567)
   - github    : tumhara GitHub profile URL
   ============================================================ */
const CONFIG = {
  accessKey: 'b02517f3-ba30-4b7c-8619-0348bb595563',
  email: 'techali0407@gmail.com',
  whatsapp: '923132779458',
  github: 'https://github.com/techali0407'
};

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Apply CONFIG to links (har page par kaam karta hai) -----
  const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi CyberNova, I want to discuss a project.')}`;
  $$('[data-mail]').forEach((a) => {
    a.href = `mailto:${CONFIG.email}`;
    if (a.hasAttribute('data-show')) a.textContent = CONFIG.email;
  });
  $$('[data-wa]').forEach((a) => (a.href = waUrl));
  $$('[data-gh]').forEach((a) => (a.href = CONFIG.github));
  $$('[data-gh-path]').forEach((a) => (a.href = `${CONFIG.github}/${a.dataset.ghPath}`));
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // ----- Mobile menu -----
  const menuBtn = $('#menuBtn');
  const menu = $('#menu');
  if (menuBtn && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  // ----- Header, progress, back-to-top -----
  const header = $('#header');
  const progress = $('#progress');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (toTop) toTop.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Reveal on scroll -----
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  window.__cnReady = true;

  // ----- Typed text (sirf home page par) -----
  const typed = $('#typed');
  if (typed) {
    const words = ['websites', 'web apps', 'AI chatbots', 'automation tools', 'secure systems'];
    if (reduce) {
      typed.textContent = words[0];
    } else {
      let wi = 0, ci = 0, del = false;
      const tick = () => {
        const word = words[wi];
        ci += del ? -1 : 1;
        typed.textContent = word.slice(0, ci);
        let wait = del ? 40 : 85;
        if (!del && ci === word.length) { del = true; wait = 1500; }
        else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 350; }
        setTimeout(tick, wait);
      };
      tick();
    }
  }

  // ----- Starfield background -----
  const canvas = $('#stars');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, stars = [];
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.min(110, Math.floor((w * h) / 16000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        v: Math.random() * 0.25 + 0.05,
        gold: Math.random() > 0.72
      }));
    };
    const drawStars = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.y -= s.v;
        if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? 'rgba(245,196,83,.8)' : 'rgba(201,178,255,.7)';
        ctx.fill();
      });
      if (!reduce) requestAnimationFrame(drawStars);
    };
    window.addEventListener('resize', resize);
    resize();
    drawStars();
  }

  // ----- Counters -----
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce || !('IntersectionObserver' in window)) { el.textContent = end + suf; return; }
    const o = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (!en.isIntersecting) return;
        o.disconnect();
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min((t - t0) / 1200, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
    o.observe(el);
  });

  // ----- Carousel -----
  $$('[data-carousel]').forEach((root) => {
    const track = $('.c-track', root);
    const slides = $$('.c-slide', root);
    const dotsBox = $('.c-dots', root);
    const prev = $('.c-prev', root), next = $('.c-next', root);
    let idx = 0, pv = 1, timer = null;
    const perView = () => (window.innerWidth > 1050 ? 3 : window.innerWidth > 700 ? 2 : 1);
    const max = () => Math.max(0, slides.length - pv);
    const go = (i) => {
      idx = i > max() ? 0 : i < 0 ? max() : i;
      track.style.transform = `translateX(${-idx * (100 / pv)}%)`;
      [...dotsBox.children].forEach((d, k) => d.classList.toggle('active', k === idx));
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { if (reduce || timer) return; timer = setInterval(() => go(idx + 1), 4500); };
    const restart = () => { stop(); start(); };
    const build = () => {
      pv = perView();
      slides.forEach((s) => (s.style.flexBasis = `${100 / pv}%`));
      dotsBox.innerHTML = '';
      for (let i = 0; i <= max(); i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', () => { go(i); restart(); });
        dotsBox.appendChild(b);
      }
      go(Math.min(idx, max()));
    };
    prev.addEventListener('click', () => { go(idx - 1); restart(); });
    next.addEventListener('click', () => { go(idx + 1); restart(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    let x0 = null;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    track.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { go(dx < 0 ? idx + 1 : idx - 1); restart(); }
    });
    track.addEventListener('pointercancel', () => { x0 = null; });
    window.addEventListener('resize', build);
    build();
    start();
  });

  // ----- Work filter -----
  const chips = $$('[data-filter]');
  chips.forEach((b) => b.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('active', c === b));
    const f = b.dataset.filter;
    $$('[data-cat]').forEach((card) => { card.hidden = !(f === 'all' || card.dataset.cat.split(' ').includes(f)); });
  }));

  // ----- Contact form -----
  const form = $('#contactForm');
  if (form) {
    const btn = $('#submitBtn');
    const note = $('#formNote');
    const btnHTML = btn.innerHTML;
    const keyMissing = !CONFIG.accessKey || CONFIG.accessKey.startsWith('YOUR_');

    const setNote = (msg, type) => { note.textContent = msg; note.className = `form-note ${type || ''}`; };
    const mailtoFallback = (d) => {
      const subject = encodeURIComponent(`[CyberNova] ${d.service}`);
      const body = encodeURIComponent(`${d.message}\n\n— ${d.name} (${d.email})`);
      window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.botcheck.checked) return;

      let ok = true;
      $$('[required]', form).forEach((f) => {
        const good = f.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) : f.value.trim() !== '';
        f.classList.toggle('invalid', !good);
        if (!good) ok = false;
      });
      if (!ok) { setNote('Please fill in all required fields correctly.', 'err'); return; }

      const data = {
        name: form.elements['name'].value.trim(),
        email: form.elements['email'].value.trim(),
        service: form.elements['service'].value,
        message: form.elements['message'].value.trim()
      };

      if (keyMissing) { mailtoFallback(data); return; }

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      setNote('');
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: CONFIG.accessKey,
            subject: `[CyberNova] ${data.service} — ${data.name}`,
            from_name: 'CyberNova Website',
            name: data.name,
            email: data.email,
            service: data.service,
            message: data.message
          })
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setNote('Message sent! We will get back to you soon.', 'ok');
          form.reset();
        } else {
          throw new Error(json.message || 'Request failed');
        }
      } catch (err) {
        setNote('Could not send right now. Opening your email app instead...', 'err');
        setTimeout(() => mailtoFallback(data), 1200);
      } finally {
        btn.disabled = false;
        btn.innerHTML = btnHTML;
      }
    });
    form.addEventListener('input', (e) => e.target.classList.remove('invalid'));
  }
});

/* ===== Enhancements ===== */
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (fine && !reduce) {
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('.card,.pack,.feature');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    const lc = document.querySelector('.logo-card');
    if (lc) {
      lc.addEventListener('pointermove', (e) => {
        const r = lc.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        lc.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      lc.addEventListener('pointerleave', () => { lc.style.transform = ''; });
    }
  }

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('#menu a:not(.btn)').forEach((a) => {
    const target = (a.getAttribute('href') || '').toLowerCase();
    if (target === here) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });

  document.querySelectorAll('[data-carousel]').forEach((c) => {
    c.setAttribute('tabindex', '0');
    c.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { const b = c.querySelector('.c-next'); b && b.click(); }
      if (e.key === 'ArrowLeft') { const b = c.querySelector('.c-prev'); b && b.click(); }
    });
  });
});

/* ===== Enhancements 2 ===== */
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce) {
    document.querySelectorAll('a[href]').forEach((a) => {
      const h = a.getAttribute('href');
      if (!h || h.startsWith('#') || h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:') || a.target === '_blank') return;
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => { location.href = h; }, 220);
      });
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('leaving'); });
  }

  const stars = document.getElementById('stars');
  if (stars) document.addEventListener('visibilitychange', () => { stars.style.visibility = document.hidden ? 'hidden' : 'visible'; });

  document.querySelectorAll('img').forEach((img) => {
    img.decoding = 'async';
    if (!img.complete) {
      img.classList.add('cn-load');
      const done = () => img.classList.remove('cn-load');
      img.addEventListener('load', done); img.addEventListener('error', done);
    }
  });

  const items = [...document.querySelectorAll('.faq details')];
  items.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
  }));
});

/* ===== Glowing cursor ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mk = (c, h) => { const d = document.createElement('div'); d.className = c; if (h) d.innerHTML = h; document.body.appendChild(d); return d; };
  const aura = mk('cn-aura');
  const cur = mk('cn-cur', '<img src="cursor-lg.png" alt="" width="34" height="34">');
  const img = cur.firstChild;
  new Image().src = 'cursor-lg-hover.png';

  let x = 0, y = 0, ax = 0, ay = 0, on = false, lastSpark = 0, sx = 0, sy = 0, tick = false;
  const colors = ['#8b5cf6', '#c9b2ff', '#f5c453', '#ffe9a8'];
  const HOV = 'a,button,summary,.btn,label,select,[role="button"],.c-btn';

  const state = (t) => {
    if (!t || !t.closest) return;
    const hov = !!t.closest(HOV), txt = !!t.closest('input,textarea');
    cur.classList.toggle('hov', hov); aura.classList.toggle('hov', hov);
    cur.classList.toggle('text', txt); aura.classList.toggle('text', txt);
    const want = hov ? 'cursor-lg-hover.png' : 'cursor-lg.png';
    if (!img.src.endsWith(want)) img.src = want;
  };

  const start = () => {
    if (on) return; on = true;
    document.documentElement.classList.add('cn-cursor-on');
    cur.classList.add('show'); aura.classList.add('show');
    const loop = () => {
      ax += (x - ax) * 0.2; ay += (y - ay) * 0.2;
      cur.style.transform = `translate3d(${x}px,${y}px,0)`;
      aura.style.transform = `translate3d(${ax}px,${ay}px,0)`;
      requestAnimationFrame(loop);
    };
    ax = x; ay = y; loop();
  };

  try {
    const p = JSON.parse(sessionStorage.getItem('cnPos') || 'null');
    if (p) { x = p.x; y = p.y; start(); }
  } catch (e) {}

  document.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY; start();
    cur.classList.add('show'); aura.classList.add('show');
    state(e.target);
    if (!reduce) {
      const now = performance.now();
      if (now - lastSpark > 70 && Math.hypot(x - sx, y - sy) > 14) {
        lastSpark = now; sx = x; sy = y;
        const s = mk('cn-spark'), a = Math.random() * 6.283, d = 14 + Math.random() * 16;
        s.style.cssText = `left:${x}px;top:${y}px;background:${colors[(Math.random() * 4) | 0]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + 10}px`;
        setTimeout(() => s.remove(), 700);
      }
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (tick || !on) return; tick = true;
    requestAnimationFrame(() => { tick = false; state(document.elementFromPoint(x, y)); });
  }, { passive: true });

  document.addEventListener('pointerdown', () => {
    cur.classList.add('down');
    if (!reduce) { const r = mk('cn-ring'); r.style.left = x + 'px'; r.style.top = y + 'px'; setTimeout(() => r.remove(), 550); }
  });
  document.addEventListener('pointerup', () => cur.classList.remove('down'));
  document.documentElement.addEventListener('mouseleave', () => { cur.classList.remove('show'); aura.classList.remove('show'); });
  window.addEventListener('pagehide', () => { try { sessionStorage.setItem('cnPos', JSON.stringify({ x, y })); } catch (e) {} });
});

/* ===== Ad banner slider + promo bar ===== */
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-adslider]').forEach((root) => {
    const track = root.querySelector('.ad-track');
    const slides = [...root.querySelectorAll('.ad-slide')];
    const dotsBox = root.querySelector('.ad-dots');
    const prev = root.querySelector('.ad-prev');
    const next = root.querySelector('.ad-next');
    if (!track || !slides.length) return;
    let idx = 0, timer = null;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to offer ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsBox.appendChild(b);
    });

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-idx * 100}%)`;
      [...dotsBox.children].forEach((d, k) => d.classList.toggle('active', k === idx));
    }
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { if (reduce || timer) return; timer = setInterval(() => go(idx + 1), 5500); };
    const restart = () => { stop(); start(); };

    prev.addEventListener('click', () => { go(idx - 1); restart(); });
    next.addEventListener('click', () => { go(idx + 1); restart(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    let x0 = null;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    track.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { go(dx < 0 ? idx + 1 : idx - 1); restart(); }
    });
    track.addEventListener('pointercancel', () => { x0 = null; });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    go(0);
    start();
  });

  const bar = document.getElementById('promoBar');
  const close = document.getElementById('promoClose');
  if (bar && close) {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('cnPromoClosed') === '1'; } catch (e) {}
    if (!dismissed) {
      setTimeout(() => {
        bar.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('show')));
      }, 6000);
    }
    close.addEventListener('click', () => {
      bar.classList.remove('show');
      setTimeout(() => { bar.hidden = true; }, 400);
      try { sessionStorage.setItem('cnPromoClosed', '1'); } catch (e) {}
    });
  }
});