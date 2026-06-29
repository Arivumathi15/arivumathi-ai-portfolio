// ===================== YEAR =====================
document.getElementById('year').textContent = new Date().getFullYear();

// ===================== NAV SCROLL STATE + PROGRESS BAR =====================
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');

// ===================== MOBILE NAV TOGGLE =====================
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===================== ACTIVE NAV LINK ON SCROLL =====================
const sections = Array.from(document.querySelectorAll('section, header.hero'));
const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));

function updateActiveNav(){
  let current = sections[0];
  const offset = 110;
  for (const sec of sections){
    if (sec.getBoundingClientRect().top - offset <= 0) current = sec;
  }
  navLinkEls.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current.id);
  });
}

function onScroll(){
  const scrollTop = window.scrollY;
  navbar.classList.toggle('scrolled', scrollTop > 12);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';

  updateActiveNav();
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===================== TYPING EFFECT =====================
const roles = [
  'Data Scientist',
  'GenAI & LLM Engineer',
  'RAG Pipeline Builder',
  'Automation Specialist (n8n)',
  'Founder, SkillEdge Coaching'
];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const word = roles[roleIndex];
  if (!deleting){
    charIndex++;
    typedEl.textContent = word.slice(0, charIndex);
    if (charIndex === word.length){
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = word.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 75);
}
typeLoop();

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===================== ANIMATED COUNTERS =====================
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObserver.observe(el));

function animateCounter(el){
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===================== CERTIFICATE GALLERY =====================
const certificateCards = Array.from(document.querySelectorAll('.certificate-card'));
let activeCertificate = 0;

function getCertificatePlacement(position){
  const placements = [
    { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
    { x: 165, y: 28, scale: 0.9, rotate: 4, opacity: 0.88 },
    { x: 292, y: 62, scale: 0.8, rotate: 7, opacity: 0.58 },
    { x: -285, y: 76, scale: 0.76, rotate: -8, opacity: 0.42 }
  ];

  if (position < placements.length) return placements[position];
  return { x: -360, y: 96, scale: 0.7, rotate: -10, opacity: 0 };
}

function updateCertificateStack(){
  const total = certificateCards.length;

  certificateCards.forEach((card, index) => {
    const position = (index - activeCertificate + total) % total;
    const placement = getCertificatePlacement(position);
    const preview = card.querySelector('.certificate-preview');
    const expand = card.querySelector('.certificate-expand');

    card.style.setProperty('--stack-pos', position);
    card.style.setProperty('--stack-x', `${placement.x}px`);
    card.style.setProperty('--stack-y', `${placement.y}px`);
    card.style.setProperty('--stack-scale', placement.scale);
    card.style.setProperty('--stack-rotate', `${placement.rotate}deg`);
    card.style.setProperty('--stack-opacity', placement.opacity);
    card.classList.toggle('is-front', position === 0);
    card.setAttribute('aria-hidden', position > 3 ? 'true' : 'false');

    if (preview){
      preview.tabIndex = position === 0 ? 0 : -1;
      preview.setAttribute('aria-label', position === 0 ? 'Show next certificate' : 'Certificate waiting in the stack');
    }

    if (expand){
      expand.tabIndex = position === 0 ? 0 : -1;
    }
  });
}

function showNextCertificate(){
  if (!certificateCards.length) return;
  activeCertificate = (activeCertificate + 1) % certificateCards.length;
  updateCertificateStack();
}

certificateCards.forEach((card) => {
  const preview = card.querySelector('.certificate-preview');
  const expand = card.querySelector('.certificate-expand');

  if (preview){
    preview.addEventListener('click', showNextCertificate);
    preview.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        showNextCertificate();
      }
    });
  }

  if (expand){
    expand.addEventListener('click', (event) => {
      event.stopPropagation();
      openCertificatePreview(preview, expand);
    });
  }
});

updateCertificateStack();

const certLightbox = document.getElementById('certLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
let lastCertificateTrigger = null;

function openCertificatePreview(preview, trigger = preview){
  lastCertificateTrigger = trigger;
  lightboxImage.src = preview.dataset.certSrc;
  lightboxImage.alt = preview.querySelector('img')?.alt || preview.dataset.certTitle;
  lightboxCaption.textContent = preview.dataset.certTitle;
  certLightbox.classList.add('open');
  certLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeCertificatePreview(){
  certLightbox.classList.remove('open');
  certLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImage.src = '';
  if (lastCertificateTrigger) lastCertificateTrigger.focus();
}

lightboxClose.addEventListener('click', closeCertificatePreview);
certLightbox.addEventListener('click', (event) => {
  if (event.target === certLightbox) closeCertificatePreview();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && certLightbox.classList.contains('open')){
    closeCertificatePreview();
  }
});
