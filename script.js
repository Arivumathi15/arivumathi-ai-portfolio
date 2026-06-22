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
