/**
 * Dasa–Bhukti Report — Application Script
 * Light/Dark Theme Switcher, Mobile Nav Drawer, Level 1 -> Level 2 -> Level 3
 * Nested Accordion, Live Countdown, Form Validation & Smooth Controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initMobileNav();
  initBirthForm();
  initTimelineAccordion();
  initLiveCountdown();
  initFAQAccordion();
  initBackToTop();
});

/* ==========================================================================
   Theme Switcher (Light / Dark Mode)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('astrodasa-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeButtonIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('astrodasa-theme', nextTheme);
      updateThemeButtonIcon(nextTheme);
    });
  }
}

function updateThemeButtonIcon(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  if (theme === 'light') {
    themeToggleBtn.textContent = '☀️';
    themeToggleBtn.title = 'Switch to Dark Theme';
  } else {
    themeToggleBtn.textContent = '🌙';
    themeToggleBtn.title = 'Switch to Light Theme';
  }
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('main-nav');
  const backdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('#nav-links a');

  if (!toggleBtn || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    toggleBtn.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close the drawer whenever a nav link is tapped
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close the drawer automatically if the viewport is resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

/* ==========================================================================
   Planetary Data & Vimshottari Sample Dataset
   ========================================================================== */
const PLANETS_DATA = [
  { name: 'Jupiter', symbol: '♃', color: '#6868f9', years: 16 },
  { name: 'Saturn', symbol: '♄', color: '#818cf8', years: 19 },
  { name: 'Mercury', symbol: '☿', color: '#34d399', years: 17 },
  { name: 'Ketu', symbol: '☋', color: '#f43f5e', years: 7 },
  { name: 'Venus', symbol: '♀', color: '#f97316', years: 20 },
  { name: 'Sun', symbol: '☉', color: '#fb923c', years: 6 },
  { name: 'Moon', symbol: '☽', color: '#e2e8f0', years: 10 },
  { name: 'Mars', symbol: '♂', color: '#ef4444', years: 7 },
  { name: 'Rahu', symbol: '☊', color: '#a855f7', years: 18 }
];

const DASA_TIMELINE_DATA = [
  {
    planet: 'Jupiter',
    startDate: 'December 20, 2017',
    endDate: 'December 19, 2033',
    isCurrent: true,
    bhuktis: [
      { planet: 'Jupiter', startDate: 'Dec 20, 2017', endDate: 'Feb 07, 2020', isCurrent: false },
      { planet: 'Saturn', startDate: 'Feb 07, 2020', endDate: 'Aug 20, 2022', isCurrent: false },
      { planet: 'Mercury', startDate: 'Aug 21, 2022', endDate: 'Nov 25, 2024', isCurrent: false },
      { planet: 'Ketu', startDate: 'Nov 26, 2024', endDate: 'Nov 01, 2025', isCurrent: false },
      {
        planet: 'Venus',
        startDate: 'Nov 02, 2025',
        endDate: 'Jul 01, 2028',
        isCurrent: true,
        antaras: [
          { planet: 'Venus', startDate: 'Nov 02, 2025', endDate: 'Apr 10, 2026', isCurrent: false },
          { planet: 'Sun', startDate: 'Apr 11, 2026', endDate: 'May 28, 2026', isCurrent: false },
          { planet: 'Moon', startDate: 'May 29, 2026', endDate: 'Aug 18, 2026', isCurrent: false },
          { planet: 'Mars', startDate: 'Aug 19, 2026', endDate: 'Oct 14, 2026', isCurrent: false },
          { planet: 'Rahu', startDate: 'Oct 15, 2026', endDate: 'Mar 08, 2027', isCurrent: true },
          { planet: 'Jupiter', startDate: 'Mar 09, 2027', endDate: 'Jul 16, 2027', isCurrent: false },
          { planet: 'Saturn', startDate: 'Jul 17, 2027', endDate: 'Dec 18, 2027', isCurrent: false },
          { planet: 'Mercury', startDate: 'Dec 19, 2027', endDate: 'Apr 28, 2028', isCurrent: false },
          { planet: 'Ketu', startDate: 'Apr 29, 2028', endDate: 'Jul 01, 2028', isCurrent: false }
        ]
      },
      { planet: 'Sun', startDate: 'Jul 02, 2028', endDate: 'Apr 20, 2029', isCurrent: false },
      { planet: 'Moon', startDate: 'Apr 21, 2029', endDate: 'Aug 20, 2030', isCurrent: false },
      { planet: 'Mars', startDate: 'Aug 21, 2030', endDate: 'Jul 27, 2031', isCurrent: false },
      { planet: 'Rahu', startDate: 'Jul 28, 2031', endDate: 'Dec 20, 2033', isCurrent: false }
    ]
  },
  {
    planet: 'Saturn',
    startDate: 'December 19, 2033',
    endDate: 'December 18, 2052',
    isCurrent: false,
    bhuktis: [
      { planet: 'Saturn', startDate: 'Dec 19, 2033', endDate: 'Dec 22, 2036', isCurrent: false },
      { planet: 'Mercury', startDate: 'Dec 22, 2036', endDate: 'Aug 31, 2039', isCurrent: false },
      { planet: 'Ketu', startDate: 'Aug 31, 2039', endDate: 'Oct 09, 2040', isCurrent: false },
      { planet: 'Venus', startDate: 'Oct 09, 2040', endDate: 'Dec 09, 2043', isCurrent: false },
      { planet: 'Sun', startDate: 'Dec 09, 2043', endDate: 'Nov 21, 2044', isCurrent: false },
      { planet: 'Moon', startDate: 'Nov 21, 2044', endDate: 'Jun 22, 2046', isCurrent: false },
      { planet: 'Mars', startDate: 'Jun 22, 2046', endDate: 'Jul 31, 2047', isCurrent: false },
      { planet: 'Rahu', startDate: 'Jul 31, 2047', endDate: 'Jun 06, 2050', isCurrent: false },
      { planet: 'Jupiter', startDate: 'Jun 06, 2050', endDate: 'Dec 18, 2052', isCurrent: false }
    ]
  },
  {
    planet: 'Mercury',
    startDate: 'December 18, 2052',
    endDate: 'December 18, 2069',
    isCurrent: false,
    bhuktis: [
      { planet: 'Mercury', startDate: 'Dec 18, 2052', endDate: 'May 17, 2055', isCurrent: false },
      { planet: 'Ketu', startDate: 'May 17, 2055', endDate: 'May 13, 2056', isCurrent: false },
      { planet: 'Venus', startDate: 'May 14, 2056', endDate: 'Mar 14, 2059', isCurrent: false },
      { planet: 'Sun', startDate: 'Mar 15, 2059', endDate: 'Jan 19, 2060', isCurrent: false },
      { planet: 'Moon', startDate: 'Jan 19, 2060', endDate: 'Jun 19, 2061', isCurrent: false },
      { planet: 'Mars', startDate: 'Jun 19, 2061', endDate: 'Jun 16, 2062', isCurrent: false },
      { planet: 'Rahu', startDate: 'Jun 16, 2062', endDate: 'Jan 02, 2065', isCurrent: false },
      { planet: 'Jupiter', startDate: 'Jan 03, 2065', endDate: 'Apr 10, 2067', isCurrent: false },
      { planet: 'Saturn', startDate: 'Apr 10, 2067', endDate: 'Dec 18, 2069', isCurrent: false }
    ]
  }
];

/* ==========================================================================
   Form Handling
   ========================================================================== */
function initBirthForm() {
  const form = document.getElementById('birth-details-form');
  const resetBtn = document.getElementById('form-reset-btn');
  const resultsSection = document.getElementById('report-results-section');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const birthDate = document.getElementById('birth-date').value;
    const birthTime = document.getElementById('birth-time').value;
    const birthCountry = document.getElementById('birth-country').value;
    const birthLocation = document.getElementById('birth-location').value;

    if (!birthDate || !birthTime || !birthCountry || !birthLocation) return;

    const submitBtn = document.getElementById('form-submit-btn');
    const origHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Calculating Cycles...';

    await new Promise(r => setTimeout(r, 700));

    document.getElementById('summary-date').textContent = birthDate;
    document.getElementById('summary-time').textContent = birthTime;
    document.getElementById('summary-country').textContent = birthCountry;
    document.getElementById('summary-location').textContent = birthLocation;

    submitBtn.disabled = false;
    submitBtn.innerHTML = origHTML;

    if (resultsSection) {
      resultsSection.classList.add('active');
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (resultsSection) resultsSection.classList.remove('active');
    });
  }
}

/* ==========================================================================
   Nested Timeline Accordion (Level 1 Dasa -> Level 2 Bhukti -> Level 3 Antara)
   ========================================================================== */
function initTimelineAccordion() {
  const container = document.getElementById('nested-timeline-accordion');
  if (!container) return;

  container.innerHTML = '';

  DASA_TIMELINE_DATA.forEach((dasaItem, dIdx) => {
    const pInfo = PLANETS_DATA.find(p => p.name === dasaItem.planet) || { symbol: '★', years: 16 };

    const l1 = document.createElement('div');
    l1.className = `acc-level-1 ${dasaItem.isCurrent ? 'is-current open' : ''}`;

    l1.innerHTML = `
      <div class="acc-level-1-head">
        <div style="display:flex; align-items:center; gap:1rem;">
          <span style="font-size:1.5rem;">${pInfo.symbol}</span>
          <div>
            <div style="font-weight:800; font-size:1.15rem;">
              ${dasaItem.planet} Dasa
              ${dasaItem.isCurrent ? '<span class="badge-tag" style="margin-left:0.5rem; font-size:0.7rem;">Active Dasa</span>' : ''}
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              ${dasaItem.startDate} – ${dasaItem.endDate} (${pInfo.years} Years)
            </div>
          </div>
        </div>
        <div>▼</div>
      </div>

      <div class="acc-level-1-body">
        <div style="font-weight:700; font-size:0.85rem; color:var(--accent-orange); text-transform:uppercase; margin-bottom:1rem;">
          ✦ Minor Bhukti Periods:
        </div>
        <div class="acc-level-2-grid" id="l2-box-${dIdx}"></div>
      </div>
    `;

    container.appendChild(l1);

    const l2Box = l1.querySelector(`#l2-box-${dIdx}`);
    if (dasaItem.bhuktis) {
      dasaItem.bhuktis.forEach(bhukti => {
        const bpInfo = PLANETS_DATA.find(p => p.name === bhukti.planet) || { symbol: '✦' };

        const l2 = document.createElement('div');
        l2.className = `acc-level-2 ${bhukti.isCurrent ? 'is-current open' : ''}`;

        let antarasContent = '';
        if (bhukti.antaras) {
          antarasContent = bhukti.antaras.map(antara => `
            <div class="antara-row ${antara.isCurrent ? 'is-current' : ''}">
              <div style="font-weight:700;">
                ${dasaItem.planet}–${bhukti.planet}–${antara.planet}
                ${antara.isCurrent ? '<span class="badge-tag" style="font-size:0.65rem; padding:0.1rem 0.4rem; margin-left:0.4rem;">Active Antara</span>' : ''}
              </div>
              <div style="color:var(--text-muted); font-size:0.82rem;">${antara.startDate} to ${antara.endDate}</div>
            </div>
          `).join('');
        } else {
          antarasContent = `<div style="font-size:0.85rem; color:var(--text-muted);">Sub-minor Antara periods active for ${bhukti.planet} Bhukti.</div>`;
        }

        l2.innerHTML = `
          <div class="acc-level-2-head">
            <div style="font-weight:700; display:flex; align-items:center; gap:0.5rem;">
              <span>${bpInfo.symbol}</span> ${bhukti.planet} Bhukti
              ${bhukti.isCurrent ? '<span class="badge-tag" style="font-size:0.65rem; padding:0.15rem 0.5rem;">Current Bhukti</span>' : ''}
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted);">${bhukti.startDate} – ${bhukti.endDate}</div>
          </div>
          <div class="acc-level-2-body">
            ${antarasContent}
          </div>
        `;

        l2Box.appendChild(l2);

        l2.querySelector('.acc-level-2-head').addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = l2.classList.contains('open');
          l2Box.querySelectorAll('.acc-level-2').forEach(c => c.classList.remove('open'));
          if (!isOpen) l2.classList.add('open');
        });
      });
    }

    l1.querySelector('.acc-level-1-head').addEventListener('click', () => {
      const isOpen = l1.classList.contains('open');
      container.querySelectorAll('.acc-level-1').forEach(c => c.classList.remove('open'));
      if (!isOpen) l1.classList.add('open');
    });
  });
}

/* ==========================================================================
   Live Countdown Timer
   ========================================================================== */
function initLiveCountdown() {
  const targetDate = new Date('July 1, 2028 21:08:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('count-days');
    const hEl = document.getElementById('count-hours');
    const mEl = document.getElementById('count-mins');
    const sEl = document.getElementById('count-secs');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* FAQ & Scroll */
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}