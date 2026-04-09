/* Mundo Academy — script.js — White/Corporate Edition */

// ── Navbar scroll ──────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ── Hamburger / burger ─────────────────────────────────────
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

// ── Scroll-reveal ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.querySelectorAll('.reveal')];
    el.style.transitionDelay = `${siblings.indexOf(el) * 80}ms`;
    el.classList.add('visible');
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero mouse parallax ────────────────────────────────────
(function heroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const watermark = hero.querySelector('.deco-watermark');
  const vLine     = hero.querySelector('.deco-v');
  const hLine     = hero.querySelector('.deco-h');
  const ring      = hero.querySelector('.deco-ring');

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left  - r.width  / 2) / r.width;
    const y = (e.clientY - r.top   - r.height / 2) / r.height;
    if (watermark) watermark.style.transform = `translateY(calc(-50% + ${y * 14}px)) translateX(${x * 10}px)`;
    if (vLine)     vLine.style.transform     = `translate(${x * -10}px, ${y * 18}px)`;
    if (hLine)     hLine.style.transform     = `translate(${x * 22}px, ${y * -8}px)`;
    if (ring)      ring.style.transform      = `translate(${x * -16}px, ${y * 12}px)`;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    if (watermark) watermark.style.transform = '';
    if (vLine)     vLine.style.transform     = '';
    if (hLine)     hLine.style.transform     = '';
    if (ring)      ring.style.transform      = '';
  });
})();

// ── Active nav link on scroll ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#111' : '';
  });
}, { passive: true });
