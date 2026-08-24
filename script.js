"use strict";

/*
  Responsive Internship Board
  No framework required.
*/

const internships = [
  {
    id: "intern-001",
    title: "Frontend Development Intern",
    company: "TechNova Labs",
    domain: "Full Stack Development",
    mode: "Remote",
    location: "India",
    duration: "3 months",
    openings: 3,
    stipend: "₹8,000/month",
    skills: ["HTML", "CSS", "JavaScript"],
    description:
      "Work with a product team to build responsive and accessible web interfaces."
  },
  {
    id: "intern-002",
    title: "Python Developer Intern",
    company: "CodeCraft Solutions",
    domain: "Software Development",
    mode: "Hybrid",
    location: "Chennai, India",
    duration: "4 months",
    openings: 2,
    stipend: "₹10,000/month",
    skills: ["Python", "Git", "APIs"],
    description:
      "Build Python-based applications and work with REST APIs and development tools."
  },
  {
    id: "intern-003",
    title: "UI/UX Design Intern",
    company: "PixelWorks Studio",
    domain: "Design",
    mode: "Remote",
    location: "India",
    duration: "3 months",
    openings: 2,
    stipend: "₹7,000/month",
    skills: ["Figma", "Wireframing", "Prototyping"],
    description:
      "Create user-friendly interfaces, prototypes and design systems for digital products."
  },
  {
    id: "intern-004",
    title: "Data Science Intern",
    company: "DataSphere Analytics",
    domain: "Data Science",
    mode: "On-site",
    location: "Bengaluru, India",
    duration: "6 months",
    openings: 4,
    stipend: "₹12,000/month",
    skills: ["Python", "Pandas", "Machine Learning"],
    description:
      "Analyse datasets and create machine learning solutions for real-world business problems."
  },
  {
    id: "intern-005",
    title: "AI/ML Intern",
    company: "IntelliCore AI",
    domain: "Artificial Intelligence",
    mode: "Hybrid",
    location: "Hyderabad, India",
    duration: "5 months",
    openings: 2,
    stipend: "₹15,000/month",
    skills: ["Python", "Scikit-learn", "Machine Learning"],
    description:
      "Assist in developing machine learning models and intelligent data-driven applications."
  }
];

/*
  DOM elements
*/

const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const modeFilter = document.getElementById("modeFilter");
const clearFilters = document.getElementById("clearFilters");

const internshipGrid = document.getElementById("internshipGrid");
const resultsCount = document.getElementById("resultsCount");

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");

const retryButton = document.getElementById("retryButton");
const emptyClearButton = document.getElementById("emptyClearButton");

const detailsModal = document.getElementById("detailsModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const closeModalButton = document.getElementById("closeModal");

let lastFocusedElement = null;

/*
  Initialize
*/

document.addEventListener("DOMContentLoaded", () => {
  initializeFilters();

  setTimeout(() => {
    hideLoading();
    renderInternships(internships);
  }, 500);
});

/*
  Create domain options dynamically
*/

function initializeFilters() {
  const domains = [
    ...new Set(internships.map((internship) => internship.domain))
  ].sort();

  domains.forEach((domain) => {
    const option = document.createElement("option");

    option.value = domain;
    option.textContent = domain;

    domainFilter.appendChild(option);
  });
}

/*
  Filter internships
*/

function getFilteredInternships() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedDomain = domainFilter.value;
  const selectedMode = modeFilter.value;

  return internships.filter((internship) => {
    const searchableText = [
      internship.title,
      internship.company,
      internship.domain,
      internship.location,
      ...internship.skills
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchTerm || searchableText.includes(searchTerm);

    const matchesDomain =
      selectedDomain === "all" ||
      internship.domain === selectedDomain;

    const matchesMode =
      selectedMode === "all" ||
      internship.mode === selectedMode;

    return matchesSearch && matchesDomain && matchesMode;
  });
}

/*
  Render internship cards
*/

function renderInternships(items) {
  internshipGrid.innerHTML = "";

  if (items.length === 0) {
    internshipGrid.hidden = true;
    emptyState.hidden = false;

    resultsCount.textContent = "0 internships found";
    return;
  }

  internshipGrid.hidden = false;
  emptyState.hidden = true;

  resultsCount.textContent =
    `${items.length} internship${items.length === 1 ? "" : "s"} found`;

  const fragment = document.createDocumentFragment();

  items.forEach((internship) => {
    const card = createInternshipCard(internship);
    fragment.appendChild(card);
  });

  internshipGrid.appendChild(fragment);
}

/*
  Create reusable internship card
*/

function createInternshipCard(internship) {
  const article = document.createElement("article");

  article.className = "internship-card";

  article.innerHTML = `
    <div class="card-top">
      <p class="company">${escapeHTML(internship.company)}</p>
      <span class="domain-badge">
        ${escapeHTML(internship.domain)}
      </span>
    </div>

    <h3>${escapeHTML(internship.title)}</h3>

    <p class="card-description">
      ${escapeHTML(internship.description)}
    </p>

    <ul class="meta-list">
      <li>
        <span aria-hidden="true">●</span>
        ${escapeHTML(internship.mode)}
      </li>

      <li>
        <span aria-hidden="true">●</span>
        ${escapeHTML(internship.location)}
      </li>

      <li>
        <span aria-hidden="true">●</span>
        ${escapeHTML(internship.duration)}
      </li>

      <li>
        <span aria-hidden="true">●</span>
        ${internship.openings} openings
      </li>
    </ul>

    <div class="skills" aria-label="Required skills">
      ${internship.skills
        .map(
          (skill) =>
            `<span class="skill">${escapeHTML(skill)}</span>`
        )
        .join("")}
    </div>

    <div class="card-actions">
      <button
        type="button"
        class="primary-button details-button"
        data-id="${escapeHTML(internship.id)}"
        aria-label="View details for ${escapeHTML(internship.title)}"
      >
        View details
      </button>
    </div>
  `;

  return article;
}

/*
  Search and filters
*/

searchInput.addEventListener("input", updateResults);
domainFilter.addEventListener("change", updateResults);
modeFilter.addEventListener("change", updateResults);

function updateResults() {
  const filtered = getFilteredInternships();
  renderInternships(filtered);
}

/*
  Event delegation for card buttons
*/

internshipGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".details-button");

  if (!button) {
    return;
  }

  const internshipId = button.dataset.id;

  const internship = internships.find(
    (item) => item.id === internshipId
  );

  if (internship) {
    openModal(internship, button);
  }
});

/*
  Clear filters
*/

function resetFilters() {
  searchInput.value = "";
  domainFilter.value = "all";
  modeFilter.value = "all";

  updateResults();

  searchInput.focus();
}

clearFilters.addEventListener("click", resetFilters);
emptyClearButton.addEventListener("click", resetFilters);

/*
  Modal
*/

function openModal(internship, triggerElement) {
  lastFocusedElement = triggerElement;

  modalBody.innerHTML = `
    <p class="modal-company">
      ${escapeHTML(internship.company)}
    </p>

    <h2 id="modalTitle">
      ${escapeHTML(internship.title)}
    </h2>

    <div class="detail-grid">

      <div class="detail-item">
        <strong>Domain</strong>
        <span>${escapeHTML(internship.domain)}</span>
      </div>

      <div class="detail-item">
        <strong>Work mode</strong>
        <span>${escapeHTML(internship.mode)}</span>
      </div>

      <div class="detail-item">
        <strong>Location</strong>
        <span>${escapeHTML(internship.location)}</span>
      </div>

      <div class="detail-item">
        <strong>Duration</strong>
        <span>${escapeHTML(internship.duration)}</span>
      </div>

      <div class="detail-item">
        <strong>Openings</strong>
        <span>${internship.openings}</span>
      </div>

      <div class="detail-item">
        <strong>Stipend</strong>
        <span>${escapeHTML(internship.stipend)}</span>
      </div>

    </div>

    <p class="modal-description">
      ${escapeHTML(internship.description)}
    </p>

    <h3>Required skills</h3>

    <div class="modal-skills">
      ${internship.skills
        .map(
          (skill) =>
            `<span class="skill">${escapeHTML(skill)}</span>`
        )
        .join("")}
    </div>

    <button
      type="button"
      class="primary-button"
      id="applyButton"
    >
      Apply now
    </button>
  `;

  detailsModal.hidden = false;
  document.body.classList.add("modal-open");

  closeModalButton.focus();
}

function closeModal() {
  detailsModal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

closeModalButton.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

/*
  Escape key + modal keyboard support
*/

document.addEventListener("keydown", (event) => {
  if (detailsModal.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key === "Tab") {
    trapModalFocus(event);
  }
});

function trapModalFocus(event) {
  const focusableElements = detailsModal.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement =
    focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}

/*
  Apply button
*/

document.addEventListener("click", (event) => {
  if (event.target.id === "applyButton") {
    alert(
      "Application flow placeholder. Connect this button to your application form or API."
    );
  }
});

/*
  Loading state
*/

function hideLoading() {
  loadingState.hidden = true;
}

/*
  Retry simulation
*/

retryButton.addEventListener("click", () => {
  errorState.hidden = true;
  loadingState.hidden = false;
  internshipGrid.hidden = true;

  setTimeout(() => {
    loadingState.hidden = true;
    internshipGrid.hidden = false;

    renderInternships(getFilteredInternships());
  }, 500);
});

/*
  Escape HTML helper
*/

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
