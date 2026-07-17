const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const typingText = document.getElementById('typingText');
const cursorGlow = document.querySelector('.cursor-glow');
const revealItems = document.querySelectorAll('.reveal');
const projectSearch = document.getElementById('projectSearch');
const projectCards = [...document.querySelectorAll('.project-card')];
const filterButtons = [...document.querySelectorAll('.filter')];
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');
const navAnchors = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const scrollProgress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

const savedTheme = localStorage.getItem('theme') || 'light';
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? 'Dark' : 'Light';
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  localStorage.setItem('theme', theme);
}
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 10);
  const doc = document.documentElement;
  const progress = (y / (doc.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  backTop.classList.toggle('visible', y > 500);
});

const typingWords = ['Web Developer', 'Front-End Enthusiast', 'SMK Student'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
function typeLoop() {
  const current = typingWords[wordIndex];
  charIndex += deleting ? -1 : 1;
  typingText.textContent = current.slice(0, charIndex);
  if (!deleting && charIndex === current.length) { deleting = true; setTimeout(typeLoop, 1100); return; }
  if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % typingWords.length; }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
revealItems.forEach((el) => observer.observe(el));

const countObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    obs.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

function applyFilter() {
  const query = projectSearch.value.toLowerCase().trim();
  const active = document.querySelector('.filter.active')?.dataset.filter || 'all';
  projectCards.forEach((card) => {
    const tags = card.dataset.tags || '';
    const matchesTag = active === 'all' || tags.includes(active);
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    card.style.display = matchesTag && matchesQuery ? '' : 'none';
  });
}
filterButtons.forEach((btn) => btn.addEventListener('click', () => {
  filterButtons.forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
}));
projectSearch.addEventListener('input', applyFilter);

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (!name || !email || !message) { toast.textContent = 'Mohon lengkapi semua field.'; return; }
  toast.textContent = 'Pesan berhasil dikirim. Terima kasih!';
  contactForm.reset();
  setTimeout(() => { toast.textContent = ''; }, 3000);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  });
}, { threshold: 0.5 });
sections.forEach((section) => sectionObserver.observe(section));

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

function addRipple(el, event) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

document.querySelectorAll('.ripple').forEach((el) => el.addEventListener('click', (event) => addRipple(el, event)));

document.querySelectorAll('.lightbox-trigger').forEach((item) => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.full;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
