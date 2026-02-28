/* ============================================
   PURPLE GALAXY — Portfolio Script
   Yulduzxon Axmedova
   ============================================ */

/* ============================================
   THEME TOGGLE (global — called via onclick)
   ============================================ */
function toggleTheme() {
  var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('portfolio-theme', newTheme);

  var toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = newTheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }
}

/* Apply saved theme on page load (before IIFE) */
(function () {
  var savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  /* Update button icon once DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      var toggleBtn = document.getElementById('themeToggle');
      if (toggleBtn) {
        toggleBtn.textContent = savedTheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
      }
    });
  } else {
    var toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.textContent = savedTheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    }
  }
})();

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const langToggle = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const starsCanvas = document.getElementById('stars-canvas');

  /* ---------- State ---------- */
  let currentLang = 'uz'; // default language

  /* ============================================
     STARS / GALAXY BACKGROUND
     ============================================ */
  function initStars() {
    if (!starsCanvas) return;
    const ctx = starsCanvas.getContext('2d');
    let width, height;
    const stars = [];
    const STAR_COUNT = 180;

    function resize() {
      width = starsCanvas.width = window.innerWidth;
      height = starsCanvas.height = window.innerHeight;
    }

    function createStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let animId;
    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(function (star) {
        const flicker = Math.sin(time * star.twinkleSpeed + star.phase) * 0.35 + 0.65;
        const alpha = star.opacity * flicker;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 180, 255, ' + alpha + ')';
        ctx.fill();

        // Subtle glow for bigger stars
        if (star.radius > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(139, 92, 246, ' + (alpha * 0.12) + ')';
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw(0);

    window.addEventListener('resize', function () {
      resize();
      createStars();
    });
  }

  /* ============================================
     NAVBAR SCROLL EFFECT
     ============================================ */
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ============================================
     ACTIVE NAV LINK HIGHLIGHT
     ============================================ */
  function updateActiveNav() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinksAll = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     HAMBURGER MENU
     ============================================ */
  function toggleMenu() {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ============================================
     LANGUAGE TOGGLE
     ============================================ */
  function setLanguage(lang) {
    currentLang = lang;
    langLabel.textContent = lang === 'uz' ? 'EN' : 'UZ';
    document.documentElement.lang = lang;

    const elements = document.querySelectorAll('[data-uz][data-en]');
    elements.forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (text) {
        el.textContent = text;
      }
    });
  }

  langToggle.addEventListener('click', function () {
    setLanguage(currentLang === 'uz' ? 'en' : 'uz');
  });

  /* ============================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================ */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     SMOOTH SCROLL (for anchor links)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     CONTACT FORM
     ============================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.elements['name'].value.trim();
      const email = contactForm.elements['email'].value.trim();
      const message = contactForm.elements['message'].value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = currentLang === 'uz'
          ? 'Iltimos, barcha maydonlarni to\'ldiring.'
          : 'Please fill in all fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Simulate sending (no backend)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'uz' ? 'Yuborilmoqda...' : 'Sending...';

      setTimeout(function () {
        formStatus.textContent = currentLang === 'uz'
          ? 'Xabaringiz muvaffaqiyatli yuborildi!'
          : 'Your message has been sent successfully!';
        formStatus.className = 'form-status success';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = currentLang === 'uz' ? 'Yuborish' : 'Send Message';

        setTimeout(function () {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 4000);
      }, 1200);
    });
  }

  /* ============================================
     SCROLL EVENTS (throttled)
     ============================================ */
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNavbarScroll();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ============================================
     INIT
     ============================================ */
  initStars();
  initReveal();
  handleNavbarScroll();
  updateActiveNav();
})();
