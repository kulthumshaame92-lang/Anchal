/* ==========================================================================
   HealthGlobe — script.js
   Anti-Gravity Physics, Particle System, Animations & Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ── ELEMENT REFERENCES ─────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const toTopBtn = document.getElementById('toTopBtn');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const canvas = document.getElementById('gravityCanvas');
  const heroContent = document.getElementById('heroContent');
  const antigravityBtn = document.getElementById('antigravityBtn');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const fadeEls = document.querySelectorAll('.fade-up');
  const statNums = document.querySelectorAll('.stat-num');

  /* =====================================================================
     1. NAVBAR — Glass Effect on Scroll
     ===================================================================== */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    toTopBtn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  /* =====================================================================
     2. MOBILE NAV TOGGLE
     ===================================================================== */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* =====================================================================
     3. ACTIVE NAV HIGHLIGHT ON SCROLL
     ===================================================================== */
  const sectionEls = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY + 220;
    sectionEls.forEach(sec => {
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { passive: true });

  /* =====================================================================
     4. BACK TO TOP
     ===================================================================== */
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =====================================================================
     5. SMOOTH SCROLL FOR ANCHOR LINKS
     ===================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* =====================================================================
     6. FADE-IN ON SCROLL — Intersection Observer
     ===================================================================== */
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObs.observe(el));

  /* =====================================================================
     7. ANIMATED STAT COUNTERS
     ===================================================================== */
  let statsDone = false;
  const countUp = el => {
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;
    const steps = 50;
    const inc = target / steps;
    let cur = 0;
    const tick = () => {
      cur += inc;
      if (cur >= target) {
        el.textContent = isFloat ? target.toFixed(1) : Math.round(target).toLocaleString();
        return;
      }
      el.textContent = isFloat ? cur.toFixed(1) : Math.round(cur).toLocaleString();
      requestAnimationFrame(tick);
    };
    tick();
  };
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !statsDone) {
        statsDone = true;
        statNums.forEach(countUp);
      }
    });
  }, { threshold: 0.3 });
  const aboutSec = document.getElementById('about');
  if (aboutSec) statsObs.observe(aboutSec);

  /* =====================================================================
     8. ANTI-GRAVITY TOGGLE (Hero)
     Inspired by Google Anti-Gravity: hero content items float, drift,
     and gently rotate as if gravity is turned off.
     ===================================================================== */
  let antigravityActive = false;
  const agItems = document.querySelectorAll('.antigravity-item');

  // Each item gets its own physics state
  const agStates = [];
  agItems.forEach(() => {
    agStates.push({
      x: 0, y: 0, r: 0,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.5 + 0.3),   // upward
      vr: (Math.random() - 0.5) * 0.3,
    });
  });

  const antigravLoop = () => {
    if (!antigravityActive) return;
    agItems.forEach((el, i) => {
      const s = agStates[i];
      s.x += s.vx;
      s.y += s.vy;
      s.r += s.vr;

      // Gentle bounds — if too far, reverse gently
      if (Math.abs(s.x) > 80) s.vx *= -0.9;
      if (Math.abs(s.y) > 60) s.vy *= -0.9;
      if (Math.abs(s.r) > 8) s.vr *= -0.9;

      // Small random perturbation (anti-gravity "wobble")
      s.vx += (Math.random() - 0.5) * 0.04;
      s.vy += (Math.random() - 0.5) * 0.04;

      el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;
    });
    requestAnimationFrame(antigravLoop);
  };

  antigravityBtn.addEventListener('click', () => {
    antigravityActive = !antigravityActive;
    antigravityBtn.classList.toggle('active', antigravityActive);
    heroContent.classList.toggle('antigravity-on', antigravityActive);

    if (antigravityActive) {
      // Reset states
      agStates.forEach(s => {
        s.x = 0; s.y = 0; s.r = 0;
        s.vx = (Math.random() - 0.5) * 0.8;
        s.vy = -(Math.random() * 0.6 + 0.3);
        s.vr = (Math.random() - 0.5) * 0.4;
      });
      requestAnimationFrame(antigravLoop);
    } else {
      // Reset elements to original position
      agItems.forEach(el => { el.style.transform = ''; });
    }
  });

  /* =====================================================================
     9. HERO PARTICLE SYSTEM — Anti-Gravity Floating Particles
     Canvas-based particle network with gentle upward drift
     ===================================================================== */
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Dot {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 2.2 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35 - 0.12;
        this.alpha = Math.random() * 0.35 + 0.05;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.015;

        // Wrap
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
      }
      draw() {
        const a = this.alpha + Math.sin(this.pulse) * 0.05;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(a, 0.02)})`;
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor((W * H) / 7000), 140);
    for (let i = 0; i < count; i++) particles.push(new Dot());

    // Mouse interaction — particles repel gently from cursor
    let mouseX = -1000, mouseY = -1000;
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        // Repel from mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.6;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }
        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        p.update();
        p.draw();
      });
      drawLines();
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* =====================================================================
     10. TILT EFFECT ON ISSUE CARDS
     Subtle 3D perspective tilt that follows the mouse
     ===================================================================== */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =====================================================================
     11. CONTACT FORM VALIDATION
     ===================================================================== */
  const showErr = (id, msg) => {
    const el = document.getElementById(id);
    el.textContent = msg;
    const inp = el.previousElementSibling || el.parentElement.querySelector('input,textarea');
    if (inp) inp.classList.add('invalid');
  };
  const clearErrs = () => {
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.form-group input,.form-group textarea').forEach(e => e.classList.remove('invalid'));
  };
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrs();

    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg = document.getElementById('fmessage').value.trim();
    let ok = true;

    if (!name) { showErr('fnameError', 'Please share your name with us.'); ok = false; }
    else if (name.length < 2) { showErr('fnameError', 'Name should be at least 2 characters.'); ok = false; }

    if (!email) { showErr('femailError', 'We\'ll need your email to respond.'); ok = false; }
    else if (!isEmail(email)) { showErr('femailError', 'Please enter a valid email address.'); ok = false; }

    if (!msg) { showErr('fmessageError', 'Please write a brief message.'); ok = false; }
    else if (msg.length < 10) { showErr('fmessageError', 'Could you share a bit more? (At least 10 characters)'); ok = false; }

    if (ok) {
      const btn = document.getElementById('formSubmitBtn');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.style.opacity = 0.6;

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.opacity = 1;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 8000);
      }, 1200);
    }
  });

  /* =====================================================================
     12. PARALLAX MICRO-MOVEMENT ON SCROLL (Regions & Issues cards)
     ===================================================================== */
  const parallaxCards = document.querySelectorAll('.region-card, .issue-card');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    parallaxCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top / window.innerHeight - 0.5) * (i % 2 === 0 ? 8 : -8);
        card.style.setProperty('--parallax-y', `${offset}px`);
      }
    });
  }, { passive: true });
});
