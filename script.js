/* =========================================================
   Mundo Academy — script.js
   ========================================================= */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger menu ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// close on nav link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Particle canvas ───────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT  = 60;
  const COLORS = ['rgba(108,60,225,', 'rgba(236,72,153,', 'rgba(249,115,22,', 'rgba(59,130,246,'];

  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 2 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.4 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,60,225,${0.06 * (1 - dist / 120)})`;
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
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current >= 1000
      ? (current / 1000).toFixed(1).replace('.0', '') + 'k'
      : current.toString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target >= 1000
      ? (target / 1000).toFixed(1).replace('.0', '') + 'k'
      : target.toString();
  }
  requestAnimationFrame(update);
}

// ── Intersection Observer ─────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // reveal animation
    if (el.classList.contains('reveal')) {
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 80}ms`;
      el.classList.add('visible');
    }

    // counter
    if (el.dataset.target) {
      animateCounter(el, parseInt(el.dataset.target, 10), 1800);
    }

    io.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, [data-target]').forEach(el => io.observe(el));

// ── Course tabs filter ────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.tab;
    const cards  = document.querySelectorAll('.course-card');

    cards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.transitionDelay = `${i * 50}ms`;
      card.style.opacity    = match ? '1' : '0';
      card.style.transform  = match ? 'scale(1)' : 'scale(0.95)';
      card.style.pointerEvents = match ? '' : 'none';
      card.style.display    = match ? '' : 'none';
    });

    // re-show after brief delay for transition
    if (filter !== 'all') {
      setTimeout(() => {
        cards.forEach(card => {
          if (card.dataset.cat !== filter) card.style.display = 'none';
          else card.style.display = '';
        });
      }, 10);
    }
  });
});

// ── Smooth category card colors ───────────────────────────
document.querySelectorAll('.cat-card').forEach(card => {
  const color = card.dataset.color;
  if (color) card.style.setProperty('--card-color', color);
});

// ── Parallax orbs on mouse move ───────────────────────────
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  document.querySelectorAll('.orb-1').forEach(el => {
    el.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  });
  document.querySelectorAll('.orb-2').forEach(el => {
    el.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
  });
  document.querySelectorAll('.orb-3').forEach(el => {
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
}, { passive: true });

// ── Active nav link on scroll ─────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#F8F9FA' : '';
  });
}, { passive: true });

// ── Tilt effect on course cards ───────────────────────────
document.querySelectorAll('.course-card, .instructor-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
