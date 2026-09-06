/**
 * ProjectRashak — Dashboard UI logic
 * All rendering here reads from js/data.js and js/state-data.js.
 * Kept modular (one init function per section) so this file can later
 * be split per-component or swapped to fetch from a FastAPI backend
 * without touching markup or CSS.
 */

document.addEventListener("DOMContentLoaded", () => {
  const inits = [
    initMobileNav,
    initSlider,
    initStats,
    initSectorExplorer,
    initSectorChart,
    initFeaturedProjects,
    initIndiaMap
  ];
  // Each section initializes independently so one failure never blocks the rest.
  inits.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`ProjectRashak: ${fn.name} failed`, err);
    }
  });
});

/* ------------------------------- Mobile nav ------------------------------ */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-mobile");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  menu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => menu.classList.remove("is-open"));
  });
}

/* --------------------------------- Slider --------------------------------- */
function initSlider() {
  const track = document.querySelector("[data-slider-track]");
  const dotsWrap = document.querySelector("[data-slider-dots]");
  const prevBtn = document.querySelector("[data-slider-prev]");
  const nextBtn = document.querySelector("[data-slider-next]");
  if (!track) return;

  track.innerHTML = sliderImages
    .map(
      (slide, i) => `
      <div class="slider__slide${i === 0 ? " is-active" : ""}" data-index="${i}">
        <img class="slider__img" src="${slide.image}" alt="${slide.title}" loading="${i === 0 ? "eager" : "lazy"}">
        <div class="slider__scrim"></div>
        <div class="slider__caption">
          <div class="slider__caption-inner">
            <span class="slider__eyebrow">${slide.category}</span>
            <h2 class="slider__title">${slide.title}</h2>
            <p class="slider__desc">${slide.description}</p>
            <div class="slider__meta">
              <span>Location <strong>${slide.location}</strong></span>
              <span>Sector <strong>${slide.sector}</strong></span>
              <span>Status <strong>${slide.status}</strong></span>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");

  dotsWrap.innerHTML = sliderImages
    .map(
      (_, i) =>
        `<button class="slider__dot${i === 0 ? " is-active" : ""}" data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`
    )
    .join("");

  const slides = track.querySelectorAll(".slider__slide");
  const dots = dotsWrap.querySelectorAll(".slider__dot");
  let current = 0;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 3500);
  }

  prevBtn.addEventListener("click", () => { prev(); startAuto(); });
  nextBtn.addEventListener("click", () => { next(); startAuto(); });
  dots.forEach((dot) =>
    dot.addEventListener("click", () => { goTo(Number(dot.dataset.dot)); startAuto(); })
  );

  const slider = document.querySelector(".slider");
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", startAuto);

  startAuto();
}

/* -------------------------------- Stats card ------------------------------ */
function initStats() {
  const map = {
    "stat-total": dashboardData.totalProjects.toLocaleString("en-IN"),
    "stat-ongoing": dashboardData.ongoingProjects.toLocaleString("en-IN"),
    "stat-sectors": dashboardData.sectors,
    "stat-ministries": dashboardData.ministries,
    "stat-original": dashboardData.originalCost,
    "stat-revised": dashboardData.revisedCost,
    "stat-expenditure": dashboardData.expenditure
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

/* ---------------------------- Sector Explorer ----------------------------- */
const sectorIcons = {
  road: '<path d="M4 20 L9 4 M15 4 L20 20 M9 20 L15 20 M11 12h2" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  railway: '<rect x="5" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M5 12h14M9 17l-2 3M15 17l2 3M8 8h2M14 8h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  power: '<path d="M13 2 5 13h6l-1 9 8-12h-6l1-8z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
  mining: '<path d="M3 20h18M6 20l3-9 3 4 2-5 3 10" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
  petroleum: '<path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  port: '<path d="M5 18h14M7 18V9l5-3 5 3v9M10 12h4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  airport: '<path d="M3 13l7-2 4-9 2 1-2 8 6-1 2 2-8 3-1 5-2-1 .5-4-6 1z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
  urban: '<path d="M4 21V9l4-3 4 3v12M12 21V5l4-2 4 2v16M4 21h16" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linejoin="round"/>',
  water: '<path d="M12 3c3 4 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 3-7 6-11z" stroke="currentColor" stroke-width="1.7" fill="none"/>',
  industrial: '<path d="M4 21V11l4 3v-3l4 3v-3l4 3V6l4 3v12H4z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
  telecom: '<path d="M12 3v6M7 8a7 7 0 0 1 10 0M4 5a11 11 0 0 1 16 0M10 21h4l-2-6z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  other: '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
};

function initSectorExplorer() {
  const list = document.querySelector("[data-sector-list]");
  const panel = document.querySelector("[data-sector-panel]");
  if (!list || !panel) return;

  const keys = Object.keys(sectorData);

  list.innerHTML = keys
    .map(
      (key, i) => `
      <button class="sector-chip${i === 0 ? " is-active" : ""}" data-sector="${key}" aria-pressed="${i === 0}">
        <svg class="sector-chip__icon" viewBox="0 0 24 24" aria-hidden="true">${sectorIcons[sectorData[key].icon] || sectorIcons.other}</svg>
        <span>${sectorData[key].name}</span>
      </button>`
    )
    .join("");

  function renderPanel(key) {
    const s = sectorData[key];
    panel.innerHTML = `
      <div class="sector-panel__head">
        <div class="sector-panel__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">${sectorIcons[s.icon] || sectorIcons.other}</svg>
        </div>
        <div>
          <h3 class="sector-panel__title">${s.name}</h3>
          <p class="sector-panel__sub">National-level sector summary</p>
        </div>
      </div>
      <div class="sector-metrics">
        <div class="sector-metric">
          <div class="sector-metric__value">${s.projects}</div>
          <div class="sector-metric__label">No. of Projects</div>
        </div>
        <div class="sector-metric">
          <div class="sector-metric__value">${s.originalCost}</div>
          <div class="sector-metric__label">Original Cost</div>
        </div>
        <div class="sector-metric">
          <div class="sector-metric__value">${s.revisedCost}</div>
          <div class="sector-metric__label">Latest Revised Cost</div>
        </div>
        <div class="sector-metric">
          <div class="sector-metric__value">${s.expenditure}</div>
          <div class="sector-metric__label">Cumulative Expenditure</div>
        </div>
        <div class="sector-metric">
          <div class="sector-metric__value">${s.completedProjects}</div>
          <div class="sector-metric__label">Completed Projects</div>
        </div>
      </div>`;
  }

  let current = 0;
  let timer = null;
  let isVisible = false;
  let isPaused = false;

  function selectSector(index) {
    current = (index + keys.length) % keys.length;
    list.querySelectorAll(".sector-chip").forEach((c) => {
      c.classList.remove("is-active");
      c.setAttribute("aria-pressed", "false");
    });
    const activeButton = list.querySelector(`[data-sector="${keys[current]}"]`);
    activeButton.classList.add("is-active");
    activeButton.setAttribute("aria-pressed", "true");
    if (isVisible) {
      activeButton.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
    renderPanel(keys[current]);
  }

  function startAuto() {
    clearInterval(timer);
    if (!isVisible || isPaused) return;
    timer = setInterval(() => selectSector(current + 1), 3500);
  }

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".sector-chip");
    if (!btn) return;
    selectSector(keys.indexOf(btn.dataset.sector));
    startAuto();
  });

  list.addEventListener("mouseenter", () => {
    isPaused = true;
    clearInterval(timer);
  });
  list.addEventListener("mouseleave", () => {
    isPaused = false;
    startAuto();
  });
  list.addEventListener("focusin", () => {
    isPaused = true;
    clearInterval(timer);
  });
  list.addEventListener("focusout", (e) => {
    if (!list.contains(e.relatedTarget)) {
      isPaused = false;
      startAuto();
    }
  });

  selectSector(0);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        startAuto();
      } else {
        clearInterval(timer);
      }
    },
    { threshold: 0.2 }
  );
  visibilityObserver.observe(list);
}

/* ------------------------------- Sector chart ------------------------------ */
function initSectorChart() {
  const wrap = document.querySelector("[data-sector-chart]");
  if (!wrap) return;
  const max = sectorDistribution[0].projects;

  wrap.innerHTML = sectorDistribution
    .map(
      (s) => `
      <div class="chart-row">
        <div class="chart-row__label">${s.name}</div>
        <div class="chart-row__track"><div class="chart-row__fill" data-width="${(s.projects / max) * 100}"></div></div>
        <div class="chart-row__value">${s.projects}</div>
      </div>`
    )
    .join("");

  const fills = wrap.querySelectorAll(".chart-row__fill");
  if (typeof IntersectionObserver === "undefined") {
    fills.forEach((f) => (f.style.width = f.dataset.width + "%"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fills.forEach((f) => (f.style.width = f.dataset.width + "%"));
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(wrap);
}

/* ------------------------------ Featured projects --------------------------- */
function initFeaturedProjects() {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  grid.innerHTML = featuredProjects
    .map(
      (p) => `
      <article class="project-card">
        <div class="project-card__media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
        <div class="project-card__body">
          <div class="project-card__id">Project ID: ${p.id}</div>
          <h3 class="project-card__title">${p.name}</h3>
          <div class="project-card__meta">
            <span>Sector: ${p.sector}</span>
            <span>Location: ${p.location}</span>
          </div>
          <span class="status-pill">${p.status}</span>
          <div class="project-card__footer">
            <a class="btn btn--ghost btn--sm btn--block" href="/dashboard/src/frontend/projects/project-view.html?id=${encodeURIComponent(p.id)}" data-project-id="${p.id}">View Project</a>
          </div>
        </div>
      </article>`
    )
    .join("");
}
