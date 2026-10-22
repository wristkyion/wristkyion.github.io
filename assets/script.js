/* ==========================================================
   wristkyion: main script
   Renders content from data.js and drives all motion.
   Content changes belong in data.js, not here.
   ========================================================== */
(() => {
  "use strict";

  const D = window.SITE;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const put = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine   = matchMedia("(pointer: fine)").matches;

  /* ---------- Render ---------- */
  function renderSocials() {
    put("#social-grid", D.socials.map(s =>
      `<a class="social" href="${s.url}" target="_blank" rel="noopener">${s.name}<span aria-hidden="true">↗</span></a>`
    ).join(""));
    put("#footer-socials", D.socials.map(s =>
      `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`
    ).join(""));
  }

  function renderSkills() {
    put("#skill-grid", D.skills.map((s, i) => `
      <div class="skill reveal" style="--d:${i * 0.08}s">
        <span class="skill-idx">0${i + 1}</span>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </div>`).join(""));
  }

  function renderStore(filter = "all") {
    const items = D.store.filter(i => filter === "all" || i.type === filter);
    put("#store-grid", items.map((i, n) => `
      <article class="store-card ${i.featured ? "featured" : ""}" style="--thumb:${i.thumb};--d:${n * 70}ms">
        <div class="store-thumb"><span class="thumb-label">${i.type === "game" ? "Game" : "Software"}</span></div>
        <div class="store-body">
          <div class="store-meta"><span class="pill">${i.tag}</span><span class="rating">★ ${i.rating.toFixed(1)}</span></div>
          <h3>${i.title}</h3>
          <p>${i.desc}</p>
          <div class="store-foot">
            <span class="price">${i.price ? "$" + i.price.toFixed(2) : "Free"}</span>
            <a class="btn btn-primary btn-sm magnetic" href="${i.url}">${i.price ? "Buy" : "Get"}</a>
          </div>
        </div>
      </article>`).join(""));
    bindMagnetic();
  }

  const statusLabel = { live: "Live", wip: "In progress", archived: "Archived" };
  function renderProjects() {
    put("#project-list", D.projects.map((p, n) => `
      <article class="project reveal" style="--d:${n * 0.08}s">
        <span class="project-year">${p.year}</span>
        <div><h3>${p.title}</h3><p>${p.desc}</p></div>
        <span class="status ${p.status}">${statusLabel[p.status]}</span>
        <div class="progress-wrap">
          <div class="progress" style="--p:${p.progress}%"><i></i></div>
          <small>${p.progress}%</small>
        </div>
      </article>`).join(""));
  }

  const catLabel = { art: "Art", design: "Design", video: "Video", code: "Code" };
  function renderPortfolio(filter = "all") {
    const items = D.portfolio.filter(i => filter === "all" || i.cat === filter);
    put("#pf-grid", items.map((i, n) => `
      <figure class="pf-item ${i.size || ""}" style="--thumb:${i.thumb};--d:${n * 70}ms">
        <div class="pf-shade"></div>
        <figcaption class="pf-info">
          <small>${catLabel[i.cat]}</small>
          <h3>${i.title}</h3>
          <p>${i.desc}</p>
        </figcaption>
      </figure>`).join(""));
  }

  /* ---------- Sliding-pill tabs ---------- */
  function setupTabs(groupSel, onChange) {
    const group = $(groupSel);
    if (!group) return;
    const btns = $$(".tab", group);
    const pill = $(".tab-pill", group);
    const place = btn => {
      if (!btn) return;
      pill.style.left  = btn.offsetLeft + "px";
      pill.style.width = btn.offsetWidth + "px";
    };
    requestAnimationFrame(() => place($(".tab.active", group)));
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("active");
      b.setAttribute("aria-selected", "true");
      place(b);
      onChange(b.dataset.filter);
    }));
    addEventListener("resize", () => place($(".tab.active", group)));
  }

  /* ---------- Scroll reveal ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });

  function observeReveals() {
    $$(".reveal:not(.in)").forEach(el => revealIO.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-links a");
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(s => sectionIO.observe(s));

  /* ---------- Menu (mobile) ---------- */
  const nav = $("#nav");
  const menuBtn = $(".menu-btn");
  const links = $(".nav-links");
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll: nav shrink + hero parallax ---------- */
  const heroVisual = $(".hero-visual");
  let ticking = false;
  function onScroll() {
    nav.classList.toggle("scrolled", scrollY > 40);
    if (heroVisual && !reduce) {
      heroVisual.style.transform = `translate3d(0, ${Math.min(scrollY, 900) * 0.12}px, 0)`;
    }
    ticking = false;
  }
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- Pointer effects (desktop only) ---------- */
  const glow = $(".cursor-glow");
  if (glow && fine && !reduce) {
    let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      x += (tx - x) * .12;
      y += (ty - y) * .12;
      glow.style.transform = `translate(${x - 260}px, ${y - 260}px)`;
      requestAnimationFrame(loop);
    })();
  } else if (glow) {
    glow.style.display = "none";
  }

  const card = $(".glass-card");
  const hero = $(".hero");
  if (card && hero && fine && !reduce) {
    hero.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty("--ry", `${px * 16}deg`);
      card.style.setProperty("--rx", `${-py * 12}deg`);
    });
    hero.addEventListener("pointerleave", () => {
      card.style.setProperty("--ry", "-8deg");
      card.style.setProperty("--rx", "4deg");
    });
  }

  function bindMagnetic() {
    if (!fine || reduce) return;
    $$(".magnetic").forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Init ---------- */
  renderSocials();
  renderSkills();
  renderStore();
  renderProjects();
  renderPortfolio();

  setupTabs("#store-tabs", f => renderStore(f));
  setupTabs("#pf-tabs",    f => renderPortfolio(f));

  bindMagnetic();
  observeReveals();
  onScroll();

  setTimeout(() => hero && hero.classList.add("loaded"), 120);
})();
