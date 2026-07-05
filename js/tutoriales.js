// Sprint 8 - Sistema de tutoriales estático
const tutorialState = {
  items: [],
  category: "Todas",
  level: "Todos",
  query: ""
};

function normalizeTutorialText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getFilteredTutorials() {
  const query = normalizeTutorialText(tutorialState.query);
  return tutorialState.items.filter((item) => {
    const matchesCategory = tutorialState.category === "Todas" || item.categoria === tutorialState.category;
    const matchesLevel = tutorialState.level === "Todos" || item.nivel === tutorialState.level;
    const searchable = normalizeTutorialText(`${item.titulo} ${item.resumen} ${item.serie} ${item.categoria} ${item.nivel} ${(item.etiquetas || []).join(" ")}`);
    return matchesCategory && matchesLevel && (!query || searchable.includes(query));
  });
}

function renderTutorialFilters() {
  const categoriesContainer = document.getElementById("tutorialCategories");
  const levelsContainer = document.getElementById("tutorialLevels");

  if (categoriesContainer) {
    const categories = ["Todas", ...new Set(tutorialState.items.map((item) => item.categoria))];
    categoriesContainer.innerHTML = categories.map((category) => `
      <button class="filter-chip${category === tutorialState.category ? " active" : ""}" type="button" data-category="${category}">
        ${category}
      </button>
    `).join("");

    categoriesContainer.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        tutorialState.category = button.dataset.category;
        renderTutorials();
      });
    });
  }

  if (levelsContainer) {
    const levels = ["Todos", ...new Set(tutorialState.items.map((item) => item.nivel))];
    levelsContainer.innerHTML = levels.map((level) => `
      <button class="filter-chip${level === tutorialState.level ? " active" : ""}" type="button" data-level="${level}">
        ${level}
      </button>
    `).join("");

    levelsContainer.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        tutorialState.level = button.dataset.level;
        renderTutorials();
      });
    });
  }
}

function renderTutorialStats() {
  const total = document.getElementById("tutorialTotal");
  const series = document.getElementById("tutorialSeries");
  const beginner = document.getElementById("tutorialBeginner");

  if (total) total.textContent = tutorialState.items.length;
  if (series) series.textContent = new Set(tutorialState.items.map((item) => item.serie)).size;
  if (beginner) beginner.textContent = tutorialState.items.filter((item) => normalizeTutorialText(item.nivel).includes("principiante")).length;
}

function renderTutorials() {
  const grid = document.getElementById("tutorialGrid");
  const counter = document.getElementById("tutorialCounter");
  if (!grid) return;

  renderTutorialFilters();
  const filtered = getFilteredTutorials();
  if (counter) counter.textContent = `${filtered.length} tutorial${filtered.length === 1 ? "" : "es"} encontrado${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otra palabra, categoría o nivel.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map((item) => `
    <article class="tutorial-card" data-category="${item.categoria}" data-level="${item.nivel}">
      <div class="tutorial-card-top">
        <span class="news-category">${item.categoria}</span>
        <span>${item.nivel}</span>
      </div>
      <p class="tutorial-series">${item.serie}</p>
      <h2>${item.titulo}</h2>
      <p>${item.resumen}</p>
      <div class="news-tags">
        ${(item.etiquetas || []).map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <div class="news-card-footer">
        <span>${item.duracion}</span>
        <a href="${item.url}" aria-label="Abrir tutorial ${item.titulo}">Ver tutorial</a>
      </div>
    </article>
  `).join("");
}

async function initTutorialSystem() {
  const grid = document.getElementById("tutorialGrid");
  if (!grid) return;

  try {
    const response = await fetch("../data/tutoriales.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar tutoriales.json");
    tutorialState.items = await response.json();
    renderTutorialStats();
    renderTutorials();
  } catch (error) {
    console.warn(error);
    grid.innerHTML = `<div class="empty-state"><h2>No se pudieron cargar los tutoriales</h2><p>Revisa el archivo data/tutoriales.json.</p></div>`;
  }

  document.getElementById("tutorialSearch")?.addEventListener("input", (event) => {
    tutorialState.query = event.target.value;
    renderTutorials();
  });
}

document.addEventListener("DOMContentLoaded", initTutorialSystem);
