// ── Typed Text Effect ──────────────────────────────────────
const roles = [
  'Full-Stack Developer',
  'Java Developer',
  'Cloud Enthusiast',
  'MERN Stack Dev',
  'Open Source Contributor',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const current = roles[roleIndex];

  if (!isDeleting) {
    el.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 60 : 100);
}

// ── Navbar scroll shadow ───────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
});

// ── Mobile menu ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// ── Intersection Observer – fade-in sections ───────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ── Active nav highlight ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color =
            link.getAttribute('href') === `#${entry.target.id}`
              ? 'var(--text)'
              : '';
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((s) => sectionObserver.observe(s));

// ── Contact Form ───────────────────────────────────────────
async function sendMessage() {
  const name    = document.getElementById('name')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const subject = document.getElementById('subject')?.value.trim();
  const message = document.getElementById('message')?.value.trim();
  const status  = document.getElementById('form-status');
  const btn     = document.getElementById('sendBtn');

  // Client-side validation
  if (!name || !email || !message) {
    setStatus('⚠️ Please fill in all required fields.', 'var(--danger)');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setStatus('⚠️ Please enter a valid email address.', 'var(--danger)');
    return;
  }

  // Loading state
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  setStatus('', '');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json();

    if (data.success) {
      setStatus('✅ Message sent! I\'ll get back to you soon.', 'var(--accent2)');
      // Clear form
      ['name', 'email', 'subject', 'message'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (err) {
    setStatus(`❌ ${err.message || 'Failed to send. Please try again.'}`, 'var(--danger)');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message ✉'; }
  }
}

function setStatus(msg, color) {
  const status = document.getElementById('form-status');
  if (status) {
    status.textContent = msg;
    status.style.color = color;
  }
}

// ── Smooth scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  typeEffect();
});
