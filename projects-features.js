/**
 * projects-features.js
 *
 * Adds three features to the portfolio projects section:
 *   1. Click a project card → open a detailed modal
 *   2. Toggle button to switch between carousel and grid/gallery view
 *   3. Category filter buttons (visible in grid view)
 *
 * HOW TO USE:
 *   Add  <script src="projects-features.js"></script>
 *   AFTER  <script src="main.js"></script>  at the bottom of index.html
 */

(function () {
  "use strict";

  // ─── Project Data ────────────────────────────────────────────────────────────
  const PROJECTS = [
    {
      id: 1,
      title: "Smart Waste Management System",
      category: "Hardware / IoT",
      year: "2025",
      shortDescription:
        "Smart bin with sensors to monitor trash and improve waste segregation.",
      description:
        "Smart Waste Management is a waste bin project that utilizes sensors and electronics to help monitor and detect trash. This makes the bin smart in detecting and managing trash for effective segregation.",
      image: "../static/smart1.jpeg",
      alt: "Smart Waste Management",
    },
    {
      id: 2,
      title: "Smart Gas Leak Detection and Safety System",
      category: "Hardware / IoT",
      year: "2026",
      shortDescription:
        "Smart detector for smoke and gas leaks with safety alerts.",
      description:
        "A prototype of a smart smoke detector aimed at detecting smoke and ensuring fire safety. It makes use of sensors that detect any presence of smoke and sends alerts for immediate actions.",
      image: "../static/gas.jpg",
      alt: "Gas Leak Detection",
    },
    {
      id: 3,
      title: "Travel Blog Website: Batangas Tourist Spots",
      category: "Web Development",
      year: "2026",
      shortDescription:
        "Travel blog showcasing famous tourist spots in Batangas.",
      description:
        "This is a travel blog website showcasing famous tourist spots in Batangas. The website has been developed using a neat and organized interface design that provides useful information about various tourist spots in Batangas.",
      image: "../static/bats.jpeg",
      alt: "Batangas Tourist Spots",
    },
    {
      id: 4,
      title: "Travel Blog Website: Explore Japan",
      category: "Web Development",
      year: "2026",
      shortDescription:
        "Tourism site highlighting Japan's attractions, culture, and travel.",
      description:
        "A tourism website that features different tourist spots and places in Japan. It aims to highlight different attractions, cultural values, and experiences to be gained in exploring Japan.",
      image: "../static/japan.jpeg",
      alt: "Explore Japan",
    },
    {
      id: 6,
      title: "Online Store",
      category: "Web Development",
      year: "2026",
      shortDescription:
        "E-commerce storefront with browsing, cart, and checkout.",
      description:
        "A responsive e-commerce storefront with product browsing, cart, and checkout flow.",
      image: "../static/japan.jpeg",
      alt: "Online Store",
    },
  ];

  // ─── Icons ───────────────────────────────────────────────────────────────────
  const GRID_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>`;

  const CAROUSEL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><polyline points="16 2 12 6 8 2"/>
  </svg>`;

  const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;

  // ─── State ───────────────────────────────────────────────────────────────────
  let isGridView = false;
  let activeFilter = "All";

  // ─── DOM References (set up on DOMContentLoaded) ─────────────────────────────
  let projectsSection, swiperBox, gridView, filterBar, toggleBtn, modalOverlay, modal;

  // ─── Bootstrap ───────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    setupDOM();
    syncCarouselShortDescriptions();
    buildGridView();
    buildModal();
    attachCarouselCardListeners();
    attachToggle();
    attachFilterListeners();
    attachModalClose();
  });

  // ─── 1. Setup DOM ─────────────────────────────────────────────────────────────
  function setupDOM() {
    projectsSection = document.getElementById("projects");

    // Wrap the existing section title in .projects-header
    const existingTitle = projectsSection.querySelector(".section-title-light.slide-up");
    if (existingTitle) {
      const header = document.createElement("div");
      header.className = "projects-header";

      // Move title into header
      existingTitle.parentNode.insertBefore(header, existingTitle);
      header.appendChild(existingTitle);

      // Add toggle button
      toggleBtn = document.createElement("button");
      toggleBtn.className = "view-toggle-btn";
      toggleBtn.setAttribute("aria-label", "Switch to grid view");
      toggleBtn.innerHTML = GRID_ICON;
      header.appendChild(toggleBtn);
    }

    // Locate swiper box
    swiperBox = projectsSection.querySelector(".box");

    // Create a wrapper for relative positioning
    const sectionContainer = projectsSection.querySelector(".section-container");
    const viewsWrapper = document.createElement("div");
    viewsWrapper.className = "projects-views-wrapper";
    sectionContainer.appendChild(viewsWrapper);

    // Move swiperBox into wrapper
    if (swiperBox) {
      viewsWrapper.appendChild(swiperBox);
    }

    // Filter bar
    filterBar = document.createElement("div");
    filterBar.className = "filter-bar";
    filterBar.innerHTML = `
      <button class="filter-btn active" data-filter="All">All</button>
      <button class="filter-btn" data-filter="Hardware / IoT">Hardware / IoT</button>
      <button class="filter-btn" data-filter="Web Development">Web Development</button>
    `;
    viewsWrapper.insertBefore(filterBar, swiperBox);

    // Grid view container
    gridView = document.createElement("div");
    gridView.className = "projects-grid-view";
    viewsWrapper.appendChild(gridView);
  }

  // ─── Sync short text on carousel cards (full text only in modal) ─────────────
  function syncCarouselShortDescriptions() {
    const section = document.getElementById("projects");
    if (!section) return;

    PROJECTS.forEach((project) => {
      const card = section.querySelector(`[data-project-id="${project.id}"]`);
      const descEl = card?.querySelector(".description");
      if (descEl) descEl.textContent = project.shortDescription;
    });
  }

  // ─── 2. Build Grid View ───────────────────────────────────────────────────────
  function buildGridView() {
    gridView.innerHTML = "";
    PROJECTS.forEach((project) => {
      const card = document.createElement("div");
      card.className = "grid-card";
      card.dataset.category = project.category;
      card.dataset.id = project.id;
      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${project.image}" alt="${project.alt}" class="image1">
        </div>
        <h2 class="P1">${project.title}</h2>
        <p class="description">${project.shortDescription}</p>
        <div class="grid-card-meta">
          <span class="badge badge-year">${project.year}</span>
          <span class="badge badge-cat">${project.category}</span>
        </div>
      `;
      card.addEventListener("click", () => openModal(project.id));
      gridView.appendChild(card);
    });
  }

  // ─── 3. Build Modal ───────────────────────────────────────────────────────────
  function buildModal() {
    modalOverlay = document.createElement("div");
    modalOverlay.className = "project-modal-overlay";
    modalOverlay.setAttribute("role", "dialog");
    modalOverlay.setAttribute("aria-modal", "true");

    modal = document.createElement("div");
    modal.className = "project-modal";
    modal.innerHTML = `
      <button class="modal-close" aria-label="Close modal">${CLOSE_ICON}</button>
      <div class="modal-image-gallery">
        <span class="modal-img-placeholder">Project Preview</span>
      </div>
      <div class="modal-badges"></div>
      <h2 class="modal-title"></h2>
      <p class="modal-description"></p>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
  }

  // ─── 4. Attach listeners to existing swiper carousel cards ───────────────────
  function attachCarouselCardListeners() {
    // Use event delegation so it still works after Swiper clones slides
    const swiperWrapper = projectsSection.querySelector(".swiper-wrapper");
    if (!swiperWrapper) return;

    swiperWrapper.addEventListener("click", (e) => {
      const card = e.target.closest(".card-item");
      if (!card) return;

      const projectId = parseInt(card.dataset.projectId, 10);
      if (!projectId) return;

      const imgSrc = card.querySelector(".image1")?.getAttribute("src") || null;
      openModal(projectId, imgSrc);
    });
  }

  // ─── 5. Toggle between Carousel and Grid ─────────────────────────────────────
  function attachToggle() {
    if (!toggleBtn) return;
    toggleBtn.addEventListener("click", () => {
      isGridView = !isGridView;

      if (isGridView) {
        // Switch to grid
        toggleBtn.innerHTML = CAROUSEL_ICON;
        toggleBtn.setAttribute("aria-label", "Switch to carousel view");
        swiperBox.classList.add("is-hidden");
        gridView.classList.add("is-visible");
        filterBar.classList.add("is-visible");
        applyFilter(activeFilter);
      } else {
        // Switch back to carousel
        toggleBtn.innerHTML = GRID_ICON;
        toggleBtn.setAttribute("aria-label", "Switch to grid view");
        swiperBox.classList.remove("is-hidden");
        gridView.classList.remove("is-visible");
        filterBar.classList.remove("is-visible");
      }
    });
  }

  // ─── 6. Filter Logic ─────────────────────────────────────────────────────────
  function attachFilterListeners() {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilter(activeFilter);
    });
  }

  function applyFilter(filter) {
    const cards = gridView.querySelectorAll(".grid-card");
    cards.forEach((card) => {
      const match = filter === "All" || card.dataset.category === filter;
      if (match) {
        card.classList.remove("is-hidden");
      } else {
        card.classList.add("is-hidden");
      }
    });
  }

  // ─── 7. Modal Open / Close ────────────────────────────────────────────────────
  function openModal(id, imageOverride) {
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) return;

    const imageSrc = imageOverride || project.image;

    // Populate modal
    const gallery = modal.querySelector(".modal-image-gallery");
    gallery.innerHTML = `<img src="${imageSrc}" alt="${project.alt}" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'modal-img-placeholder\\'>Project Preview</span>'">`;

    const badgesEl = modal.querySelector(".modal-badges");
    badgesEl.innerHTML = `
      <span class="badge badge-year">${project.year}</span>
      <span class="badge badge-cat">${project.category}</span>
    `;

    modal.querySelector(".modal-title").textContent = project.title;
    modal.querySelector(".modal-description").textContent = project.description;

    // Animate open
    document.body.style.overflow = "hidden";
    modalOverlay.classList.add("is-open");
    modal.scrollTop = 0;
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function attachModalClose() {
    // Close button
    modal.querySelector(".modal-close").addEventListener("click", closeModal);

    // Click outside modal panel
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) closeModal();
    });
  }
})();