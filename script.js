/* Mundo Academy — script.js — Mundo Ejecutivo */

// ── Navbar scroll ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'translateY(7px) rotate(45deg)';
    s2.style.opacity   = '0';
    s3.style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    [s1,s2,s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}));

// ── Particles (gold palette) ──────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const pts = Array.from({ length: 55 }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r:  Math.random() * 1.5 + 0.5,
    a:  Math.random() * 0.35 + 0.05,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,160,40,${p.a})`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(201,160,40,${0.05*(1-d/110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Counter animation ─────────────────────────────────────
function animateCounter(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(eased * target);
    el.textContent = val >= 1000 ? (val/1000).toFixed(val%1000===0?0:1)+'k' : val;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? (target/1000).toFixed(target%1000===0?0:1)+'k' : target;
  }
  requestAnimationFrame(tick);
}

// ── Intersection Observer ─────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.classList.contains('reveal')) {
      const siblings = [...el.parentElement.querySelectorAll('.reveal')];
      el.style.transitionDelay = `${siblings.indexOf(el) * 90}ms`;
      el.classList.add('visible');
    }
    if (el.dataset.target) animateCounter(el, parseInt(el.dataset.target), 1800);
    io.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, [data-target]').forEach(el => io.observe(el));

// ── Countdown timer ───────────────────────────────────────
function initCountdown() {
  const KEY = 'ma_deadline';
  let deadline = localStorage.getItem(KEY);
  if (!deadline) {
    deadline = Date.now() + 23 * 3600000 + 47 * 60000 + 12000;
    localStorage.setItem(KEY, deadline);
  }
  function update() {
    const diff = Math.max(0, deadline - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const fmt = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    document.querySelectorAll('#countdown, #offerTimer').forEach(el => { if (el) el.textContent = fmt; });
  }
  update();
  setInterval(update, 1000);
}
initCountdown();

// ── Spots counter (fake scarcity) ─────────────────────────
(function spotsCounter() {
  const el = document.getElementById('spotsLeft');
  if (!el) return;
  let spots = parseInt(localStorage.getItem('ma_spots') || '14');
  el.textContent = spots;
  setInterval(() => {
    if (spots > 4 && Math.random() < 0.08) {
      spots--;
      localStorage.setItem('ma_spots', spots);
      el.textContent = spots;
      el.style.color = spots <= 6 ? '#ef4444' : '';
    }
  }, 18000);
})();

// ── FAQ accordion ─────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Parallax orbs ─────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 25;
  const y = (e.clientY / window.innerHeight - 0.5) * 25;
  document.querySelectorAll('.orb-1').forEach(o => { o.style.transform = `translate(${x*.5}px,${y*.5}px)`; });
  document.querySelectorAll('.orb-2').forEach(o => { o.style.transform = `translate(${-x*.3}px,${-y*.3}px)`; });
}, { passive: true });

// ── Tilt on cards ─────────────────────────────────────────
document.querySelectorAll('.inc-card, .testi-card, .price-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Active nav highlight ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold-light)' : '';
  });
}, { passive: true });
