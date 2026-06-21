document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  initServiceTabs();
  initTheme();
  initNavbar();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
});

/* ----------------------------------------------------------------
   THEME (dark mode)
   ---------------------------------------------------------------- */
function initTheme() {
  const saved = localStorage.getItem('maison-theme');
  if (saved === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('maison-theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('maison-theme', 'dark');
  }
}

/* ----------------------------------------------------------------
   NAVBAR SCROLL SHADOW
   ---------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ----------------------------------------------------------------
   HAMBURGER MENU
   ---------------------------------------------------------------- */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('nav-menu');
  const links = menu.querySelectorAll('.nav-link');

  function openMenu() {
    btn.classList.add('open');
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Zavřít menu');
  }

  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Otevřít menu');
  }

  btn.addEventListener('click', () => {
    if (btn.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach(link => link.addEventListener('click', closeMenu));
}

/* ----------------------------------------------------------------
   SMOOTH SCROLL
   ---------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------------------------------
   SERVICES — render from window.SERVICES
   ---------------------------------------------------------------- */
function renderServices() {
  const container = document.getElementById('services-container');
  if (!container || !Array.isArray(window.SERVICES) || window.SERVICES.length === 0) return;

  const tabControls = document.createElement('div');
  tabControls.className = 'tab-controls';
  tabControls.setAttribute('role', 'tablist');
  tabControls.setAttribute('aria-label', 'Kategorie služeb');

  const tabPanelsWrapper = document.createElement('div');
  tabPanelsWrapper.className = 'tab-panels';

  window.SERVICES.forEach((tab, index) => {
    /* Tab button */
    const btn = document.createElement('button');
    btn.className    = 'tab-btn' + (index === 0 ? ' active' : '');
    btn.dataset.tab  = tab.tabId;
    btn.textContent  = tab.tabLabel;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', 'tab-' + tab.tabId);
    tabControls.appendChild(btn);

    /* Tab panel */
    const panel = document.createElement('div');
    panel.className = 'tab-panel' + (index === 0 ? ' active' : '');
    panel.id        = 'tab-' + tab.tabId;
    panel.setAttribute('role', 'tabpanel');

    const grid = document.createElement('div');
    grid.className = 'services__grid';
    grid.setAttribute('data-reveal-stagger', '');

    (tab.categories || []).forEach(category => {
      grid.innerHTML += buildServiceCard(category);
    });

    panel.appendChild(grid);

    if (tab.note) {
      const note = document.createElement('p');
      note.className   = 'services__note';
      note.textContent = tab.note;
      panel.appendChild(note);
    }

    tabPanelsWrapper.appendChild(panel);
  });

  container.appendChild(tabControls);
  container.appendChild(tabPanelsWrapper);

  const cta = document.createElement('div');
  cta.className = 'services__cta';
  cta.innerHTML = '<a href="#booking" class="btn btn--accent btn--large">Rezervovat termín</a>';
  container.appendChild(cta);
}

function buildServiceCard(category) {
  const items = (category.items || []).map(item =>
    `<li class="service-item">
       <span class="service-item__name">${escapeHtml(item.name)}</span>
       <span class="service-item__price">${escapeHtml(item.price)}</span>
     </li>`
  ).join('');

  return `
    <div class="service-card" data-reveal>
      <div class="service-card__header">
        <div class="service-card__icon" aria-hidden="true">${category.icon || '✦'}</div>
        <h3 class="service-card__title">${escapeHtml(category.title)}</h3>
      </div>
      <ul class="service-card__list">${items}</ul>
      <a href="#booking" class="btn btn--outline btn--sm">Rezervovat</a>
    </div>`;
}

/* ----------------------------------------------------------------
   SERVICE TABS — switch panels
   ---------------------------------------------------------------- */
function initServiceTabs() {
  const container = document.getElementById('services-container');
  if (!container) return;

  container.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const tabId = btn.dataset.tab;

    container.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    container.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'tab-' + tabId);
    });

    /* Animate cards in the newly activated panel on first show */
    const activePanel = container.querySelector('#tab-' + tabId);
    if (activePanel) {
      requestAnimationFrame(() => {
        activePanel.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
          el.classList.add('revealed');
        });
      });
    }
  });
}

/* ----------------------------------------------------------------
   SCROLL REVEAL
   ---------------------------------------------------------------- */
function initScrollReveal() {
  document.documentElement.classList.add('reveal-ready');

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const parent = el.closest('[data-reveal-stagger]');
    if (parent) {
      const siblings = Array.from(parent.querySelectorAll(':scope > [data-reveal]'));
      const i = siblings.indexOf(el);
      el.style.transitionDelay = `${i * 0.09}s`;
    }
    observer.observe(el);
  });
}

/* ----------------------------------------------------------------
   UTILITY
   ---------------------------------------------------------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
