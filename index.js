/* ═══════════════════════════════════════════════════════
   ALLEN JOY — PORTFOLIO WEBSITE
   index.js
═══════════════════════════════════════════════════════ */

'use strict';

// ─── UTILS ───────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
const raf = fn => requestAnimationFrame(fn);

// ─── PAGE LOADER ─────────────────────────────────────
window.addEventListener('load', () => {
  const loader = $('#pageLoader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 1600);
});
document.body.style.overflow = 'hidden';

// ─── CUSTOM CURSOR ───────────────────────────────────
(function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;
  if (window.innerWidth <= 768) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf(animateRing);
  }
  raf(animateRing);

  document.addEventListener('mouseover', e => {
    const t = e.target;
    if (t.matches('a,button,.expertise-card,.project-card,.blog-card,.book-card')) {
      ring.classList.add('hovered');
    } else {
      ring.classList.remove('hovered');
    }
  });
})();

// ─── THEME TOGGLE ────────────────────────────────────
(function initTheme() {
  const btn  = $('#themeToggle');
  const icon = $('#themeIcon');
  let dark = localStorage.getItem('theme') !== 'light';

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (icon) {
      icon.className = dark ? 'fas fa-moon' : 'fas fa-sun';
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  applyTheme();

  on(btn, 'click', () => {
    dark = !dark;
    applyTheme();
  });
})();

// ─── NAVIGATION & SPA ────────────────────────────────
(function initNav() {
  const navbar   = $('#navbar');
  const links    = $$('.nav-link[data-page]');
  const pages    = $$('.page');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    const btt = $('#backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Navigate to page
  function navigate(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    const target = $(`#${pageId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const activeLink = $(`[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Close mobile nav
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');

    // Trigger page-specific init
    setTimeout(() => {
      initPageAnimations(pageId);
    }, 100);
  }

  // Handle nav link clicks
  links.forEach(link => {
    on(link, 'click', e => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigate(page);
    });
  });

  // Handle ALL anchor hrefs that map to pages
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;

    // External links — let browser handle normally
    if (href.startsWith('http') || href.startsWith('mailto')) {
      return;
    }

    // Internal page navigation
    if (href.startsWith('#')) {
      const hash = href.slice(1);
      const validPages = ['home','portfolio','blog','author','about','contact'];
      if (validPages.includes(hash)) {
        e.preventDefault();
        navigate(hash);
      }
    }
  });

  // Hamburger
  on(hamburger, 'click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Back to top
  on($('#backToTop'), 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Init home on load
  navigate('home');
})();

// ─── TYPEWRITER EFFECT ───────────────────────────────
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const roles = [
    'Data Analyst',
    'Data Engineer',
    'DevOps Engineer',
    'Cloud Enthusiast',
    'AWS Architect',
    'Author & Writer'
  ];

  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const current = roles[ri];
    el.textContent = deleting
      ? current.slice(0, ci--)
      : current.slice(0, ci++);

    let delay = deleting ? 60 : 90;

    if (!deleting && ci > current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      ri = (ri + 1) % roles.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

// ─── HERO CANVAS ─────────────────────────────────────
(function initHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(139,92,246,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    raf(loop);
  }
  loop();
})();

// ─── COUNTER ANIMATION ───────────────────────────────
function animateCounters() {
  $$('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// ─── SCROLL ANIMATIONS ───────────────────────────────
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => {
          el.classList.add('visible');
          // Animate skill bars
          if (el.classList.contains('skill-bar-item')) {
            const bar = $('.bar-fill', el);
            if (bar) bar.style.width = el.dataset.pct + '%';
          }
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  const selectors = [
    '.expertise-card','.project-card','.blog-card',
    '.book-card','.timeline-item','.skill-bar-item',
    '.hidden-el'
  ];
  $$(selectors.join(',')).forEach(el => observer.observe(el));

  // Counter observer
  const counterTarget = $('.hero-stats');
  if (counterTarget) {
    const cObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        cObs.disconnect();
      }
    }, { threshold: 0.5 });
    cObs.observe(counterTarget);
  }
}

function initPageAnimations(pageId) {
  const page = $(`#${pageId}`);
  if (!page) return;

  // Re-trigger observers for newly visible page
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => {
          el.classList.add('visible');
          if (el.classList.contains('skill-bar-item')) {
            const bar = $('.bar-fill', el);
            if (bar) bar.style.width = el.dataset.pct + '%';
          }
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  $$('.expertise-card,.project-card,.blog-card,.book-card,.timeline-item,.skill-bar-item', page)
    .forEach(el => {
      el.classList.remove('visible');
      observer.observe(el);
    });

  if (pageId === 'home') animateCounters();
  if (pageId === 'portfolio') generateGithubGrid();
}

// ─── PORTFOLIO FILTER ────────────────────────────────
(function initPortfolioFilter() {
  const filterBtns = $$('#portfolioFilter .filter-btn');
  const grid = $('#portfolioGrid');
  if (!filterBtns.length || !grid) return;

  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      $$('[data-cat]', grid).forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'fadeInUp 0.4s ease both';
          setTimeout(() => card.style.animation = '', 400);
        }
      });
    });
  });
})();

// ─── BLOG SEARCH + FILTER ────────────────────────────
(function initBlogFilter() {
  const searchInput = $('#blogSearch');
  const catBtns     = $$('#blogCats .cat-btn');
  const grid        = $('#blogGrid');
  if (!grid) return;

  let currentCat = 'all';

  function filterCards() {
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    $$('.blog-card', grid).forEach(card => {
      const cat   = card.dataset.cat || '';
      const text  = card.textContent.toLowerCase();
      const catOk = currentCat === 'all' || cat === currentCat;
      const txtOk = !q || text.includes(q);
      card.style.display = catOk && txtOk ? '' : 'none';
    });
  }

  catBtns.forEach(btn => {
    on(btn, 'click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      filterCards();
    });
  });

  on(searchInput, 'input', filterCards);
})();

// ─── GITHUB CONTRIBUTION GRID ────────────────────────
function generateGithubGrid() {
  const grid = $('#githubContrib');
  if (!grid || grid.children.length) return;

  const levels = [0,0,0,1,1,2,2,3,4];
  for (let i = 0; i < 52 * 7; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';
    const chance = Math.random();
    if (chance > 0.65) {
      const lvl = levels[Math.floor(Math.random() * levels.length)];
      if (lvl > 0) cell.classList.add(`contrib-${lvl}`);
    }
    cell.title = `${Math.floor(Math.random() * 10)} contributions`;
    grid.appendChild(cell);
  }
}

// ─── COMMENTS SYSTEM ─────────────────────────────────
(function initComments() {
  const form = $('#commentForm');
  const list = $('#commentsList');
  if (!form || !list) return;

  on(form, 'submit', e => {
    e.preventDefault();
    const inputs = $$('input, textarea', form);
    const name = inputs[0].value.trim();
    const text = inputs[1].value.trim();
    if (!name || !text) return;

    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.innerHTML = `
      <div class="comment-avatar"><i class="fas fa-user"></i></div>
      <div class="comment-body">
        <div class="comment-meta"><strong>${escapeHtml(name)}</strong><span>just now</span></div>
        <p>${escapeHtml(text)}</p>
        <button class="comment-reply">Reply</button>
      </div>`;
    list.prepend(comment);
    form.reset();
    showToast('Comment posted!');
  });
})();

// ─── CONTACT FORM ────────────────────────────────────
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  on(form, 'submit', async e => {
    e.preventDefault();
    const btn = $('#contactSubmit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        $('#formSuccess').classList.add('show');
        form.reset();
        showToast('Message sent! I\'ll be in touch within 24 hours.');
        setTimeout(() => $('#formSuccess').classList.remove('show'), 6000);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      showToast('Something went wrong. Please try again.');
    }
  });
})();

// ─── NEWSLETTER FORMS ────────────────────────────────
(function initNewsletter() {
  ['#newsletterForm', '#footerForm'].forEach(sel => {
    const form = $(sel);
    if (!form) return;
    on(form, 'submit', e => {
      e.preventDefault();
      const input = $('input[type="email"]', form);
      if (input && input.value) {
        showToast('🎉 You\'re subscribed! Welcome to the list.');
        form.reset();
      }
    });
  });
})();

// ─── LOAD MORE POSTS ─────────────────────────────────
(function initLoadMore() {
  const btn = $('#loadMorePosts');
  if (!btn) return;

  const extraPosts = [];

  on(btn, 'click', () => {
    const grid = $('#blogGrid');
    extraPosts.forEach((post, i) => {
      const article = document.createElement('article');
      article.className = 'blog-card';
      article.dataset.cat = post.cat;
      article.style.animationDelay = `${i * 100}ms`;
      article.innerHTML = `
        <div class="blog-img">
          <div class="blog-bg" style="--hue:${post.hue}"></div>
          <span class="blog-cat">${post.cat.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
        </div>
        <div class="blog-body">
          <div class="blog-meta"><span><i class="far fa-clock"></i> ${post.date}</span><span>${post.time}</span></div>
          <h3>${post.title}</h3>
          <p>${post.text}</p>
          <div class="blog-tags">${post.tags.map(t => `<span>${t}</span>`).join('')}</div>
          <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>`;
      grid.appendChild(article);
      setTimeout(() => article.classList.add('visible'), 50 + i * 80);
    });
    btn.style.display = 'none';
  });
})();

// ─── TOAST NOTIFICATION ──────────────────────────────
function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── UTILITY ─────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── SMOOTH SECTION TRANSITIONS ──────────────────────
(function initSectionReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  $$('.section-block, .page-hero, .author-hero').forEach(el => {
    observer.observe(el);
  });
})();

// ─── NAVBAR ACTIVE ON SCROLL ─────────────────────────
window.addEventListener('scroll', () => {
  const page = $('.page.active');
  if (!page) return;
  const sections = $$('[id]', page).filter(el => el.offsetTop > 0);
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      // Could highlight nav item here if sections had matching IDs
    }
  });
}, { passive: true });

// ─── KEYBOARD NAVIGATION ─────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const nav = $('#navLinks');
    const ham = $('#hamburger');
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      ham && ham.classList.remove('open');
    }
  }
});

// ─── ACTIVE NAV LINK SYNC ────────────────────────────
// Called after navigate() by clicking footer/CTA links
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-nav]');
  if (!btn) return;
  const page = btn.dataset.nav;
  $$('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
});

// ─── BACK TO TOP SMOOTH ──────────────────────────────
on($('#backToTop'), 'click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── SEO: Update document title on page change ───────
const pageTitles = {
  home:      'Allen Joy | Data Engineer · DevOps · Cloud',
  portfolio: 'Portfolio | Allen Joy',
  blog:      'Blog | Allen Joy',
  author:    'Author | Allen Joy',
  about:     'About | Allen Joy',
  contact:   'Contact | Allen Joy'
};

const navLinks = $$('.nav-link[data-page]');
navLinks.forEach(link => {
  on(link, 'click', () => {
    const page = link.dataset.page;
    if (pageTitles[page]) document.title = pageTitles[page];
  });
});

// ─── MOBILE: close nav on outside click ──────────────
document.addEventListener('click', e => {
  const nav = $('#navLinks');
  const ham = $('#hamburger');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && !ham.contains(e.target)) {
      nav.classList.remove('open');
      ham.classList.remove('open');
    }
  }
});

// ─── FORM VALIDATION ENHANCEMENT ────────────────────
$$('input[type="email"]').forEach(input => {
  on(input, 'blur', () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    input.style.borderColor = input.value
      ? (valid ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)')
      : '';
  });
  on(input, 'focus', () => {
    input.style.borderColor = '';
  });
});

// ─── GOOGLE ANALYTICS STUB ───────────────────────────
// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
(function initGA() {
  const GA_ID = 'G-XXXXXXXXXX';
  if (GA_ID === 'G-XXXXXXXXXX') return; // skip if not configured

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID);
  window.gtag = gtag;
})();

// ─── READY LOG ───────────────────────────────────────
console.log(
  '%c Allen Joy %c Portfolio v1.0 ',
  'background:#7c3aed; color:#fff; padding:4px 8px; border-radius:4px 0 0 4px; font-weight:bold',
  'background:#06b6d4; color:#fff; padding:4px 8px; border-radius:0 4px 4px 0; font-weight:bold'
);
