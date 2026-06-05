/* =========================================
   AANYA ECOPATRA — script.js
   ========================================= */

'use strict';

/* ===== 0. ENABLE ANIMATIONS — mark body as JS-ready ===== */
// This gates the .fade-in opacity:0 state in CSS.
// If this line runs, JS is working and IntersectionObserver will reveal elements.
// If JS never loads, content stays fully visible (no opacity:0 applied).
document.body.classList.add('js-ready');

/* ===== 1. NAVBAR: scroll shadow + active link highlight ===== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ===== 2. HAMBURGER MENU ===== */
(function initHamburger() {
  const btn    = document.getElementById('hamburger');
  const links  = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');
  if (!btn || !links) return;

  function openMenu() {
    links.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    links.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    links.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on any nav link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on outside click (tap anywhere on the page)
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && navbar && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
  });
})(); /* <-- semicolon was missing here, halting strict-mode script execution */


/* ===== 3. SCROLL ANIMATIONS (Intersection Observer) ===== */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ===== 4. BACK TO TOP BUTTON ===== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===== 5. FAQ ACCORDION ===== */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      questions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      // Open clicked (if it was closed)
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();


/* ===== 6. CONTACT FORM (client-side validation + feedback) ===== */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !emailRe.test(email)) {
      shakeForm(form);
      return;
    }

    // Show success
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Simulate async send (replace with real fetch / EmailJS / etc.)
    setTimeout(() => {
      if (success) {
        success.classList.add('visible');
      }
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';

      setTimeout(() => {
        if (success) success.classList.remove('visible');
      }, 5000);
    }, 1000);
  });

  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }
})();


/* ===== 7. SMOOTH ACTIVE NAV HIGHLIGHT on scroll ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(a => {
            a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '700' : '';
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => obs.observe(s));
})();


/* ===== 8. CSS keyframe: shake (injected via JS for form validation) ===== */
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();
