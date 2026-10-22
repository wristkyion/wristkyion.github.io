/* ==========================================================
   wristkyion: main script
   Renders content from data.js and drives the sliding panels.
   Content changes belong in data.js, not here.
   ========================================================== */
(() => {
  "use strict";

  const D = window.SITE;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ---------- Static blocks ---------- */
  function renderAbout() {
    $("#skills").innerHTML = D.skills.map((s, i) => `
      <div class="skill reveal" style="--d:${i * .08}s">
        <span class="n">0${i + 1}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>`).join("");

    $("#socials").innerHTML = D.socials.map(s =>
      `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`).join("");

    $("#footer-socials").innerHTML = D.socials.map(s =>
      `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");
  }

  const statusLabel = { live: "Live", wip: "In progress", archived: "Archived" };
  function renderProjects() {
    $("#project-list").innerHTML = D.projects.map((p, n) => `
      <article class="project reveal" style="--d:${n * .08}s">
        <span class="project-year">${esc(p.year)}</span>
        <div><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div>
        <span class="status ${esc(p.status)}">${statusLabel[p.status] || esc(p.status)}</span>
        <div class="progress-wrap">
          <div class="progress" style="--p:${Number(p.progress)}%"><i></i></div>
          <small>${Number(p.progress)}%</small>
        </div>
      </article>`).join("");
  }

  /* ---------- Item templates ---------- */
  const catLabel = { art: "Art", design: "Design", video: "Video", code: "Code" };
  const empty = () => `<p class="empty">Nothing here yet.</p>`;

  const storeCard = (item, n) => `
    <article class="item" style="--thumb:${item.thumb};--d:${n * 70}ms">
      <div class="item-thumb"><span class="item-tag">${esc(item.tag)}</span></div>
      <div class="item-body">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
        <div class="item-foot">
          <span>★ ${Number(item.rating).toFixed(1)} · ${item.price ? "$" + Number(item.price).toFixed(2) : "Free"}</span>
          <a class="item-cta" href="${esc(item.url)}">${item.price ? "Buy" : "Get"}</a>
        </div>
      </div>
    </article>`;

  const pfCard = (item, n) => `
    <figure class="pf-item ${esc(item.size || "")}" style="--thumb:${item.thumb};--d:${n * 70}ms">
      <figcaption class="pf-cap">
        <small>${esc(catLabel[item.cat] || item.cat)}</small>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
      </figcaption>
    </figure>`;

  /* ---------- Sweep: one panel per category, slides left/right ---------- */
  function setupSweep(root, build) {
    const tabs     = $$(".sweep-tab", root);
    const ink      = $(".sweep-ink", root);
    const viewport = $(".sweep-viewport", root);
    const track    = $(".sweep-track", root);
    let current    = Math.max(0, tabs.findIndex(t => t.classList.contains("active")));

    // fill each panel with its own items
    $$(".sweep-panel", root).forEach(panel => {
      const { html, count } = build(panel.dataset.cat);
      $("[data-list]", panel).innerHTML = html;
      $("[data-count]", panel).textContent = count + (count === 1 ? " item" : " items");
    });

    const placeInk = idx => {
      const t = tabs[idx];
      if (!t) return;
      ink.style.left  = t.offsetLeft + "px";
      ink.style.width = t.offsetWidth + "px";
    };

    const slideTo = idx => {
      track.style.transform = `translate3d(${-idx * 100}%,0,0)`;
    };

    tabs.forEach((tab, idx) => tab.addEventListener("click", () => {
      if (idx === current) return;
      // moving to a later tab slides content left; earlier tab slides right
      const dir = idx > current ? "wipe-left" : "wipe-right";
      current = idx;
      tabs.forEach((t, i) => {
        t.classList.toggle("active", i === idx);
        t.setAttribute("aria-selected", String(i === idx));
      });
      slideTo(idx);
      placeInk(idx);
      viewport.classList.remove("wipe-left", "wipe-right");
      void viewport.offsetWidth;                 // restart the wash animation
      if (!reduce) viewport.classList.add(dir);
    }));

    slideTo(current);
    placeInk(current);
    addEventListener("resize", () => placeInk(current));
    if (document.fonts) document.fonts.ready.then(() => placeInk(current));
  }

  /* ---------- Scroll reveal ---------- */
  const revealIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      revealIO.unobserve(e.target);
    }
  }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  const observeReveals = () => $$(".reveal:not(.in)").forEach(el => revealIO.observe(el));

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".menu a");
  const sectionIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(s => sectionIO.observe(s));

  /* ---------- Mobile menu ---------- */
  const menu    = $("#menu");
  const menuBtn = $(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", e => {
    if (e.target.closest("a")) {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll: topbar state + figure drift ---------- */
  const topbar = $("#topbar");
  const figure = $("#figure");
  let ticking = false;
  function onScroll() {
    topbar.classList.toggle("scrolled", scrollY > 40);
    if (figure && !reduce) {
      figure.style.transform = `translate3d(0,${Math.min(scrollY, 800) * .15}px,0)`;
    }
    ticking = false;
  }
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- Init ---------- */
  renderAbout();
  renderProjects();

  setupSweep($('[data-sweep="store"]'), cat => {
    const list = D.store.filter(i => i.type === cat);
    return { count: list.length, html: list.map(storeCard).join("") || empty() };
  });

  setupSweep($('[data-sweep="portfolio"]'), cat => {
    const list = D.portfolio.filter(i => i.cat === cat);
    return { count: list.length, html: list.map(pfCard).join("") || empty() };
  });

  observeReveals();
  onScroll();
  setTimeout(() => $("#top").classList.add("loaded"), 150);
})();
