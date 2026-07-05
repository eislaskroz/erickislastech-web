// Sprint 7 - Sistema de noticias estático
const newsState = {
  items: [],
  category: "Todas",
  query: ""
};

const formatDate = (dateString) => new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric"
}).format(new Date(`${dateString}T12:00:00`));

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getFilteredNews() {
  const query = normalizeText(newsState.query);
  return newsState.items.filter((item) => {
    const matchesCategory = newsState.category === "Todas" || item.categoria === newsState.category;
    const searchable = normalizeText(`${item.titulo} ${item.resumen} ${item.categoria} ${(item.etiquetas || []).join(" ")}`);
    return matchesCategory && (!query || searchable.includes(query));
  });
}

function renderCategories() {
  const container = document.getElementById("newsCategories");
  if (!container) return;

  const categories = ["Todas", ...new Set(newsState.items.map((item) => item.categoria))];
  container.innerHTML = categories.map((category) => `
    <button class="filter-chip${category === newsState.category ? " active" : ""}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join("");

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      newsState.category = button.dataset.category;
      renderNews();
    });
  });
}

function renderFeatured(item) {
  const container = document.getElementById("featuredNews");
  if (!container || !item) return;

  container.innerHTML = `
    <article class="featured-news-card">
      <div>
        <span class="badge small-badge">Nota destacada</span>
        <h2>${item.titulo}</h2>
        <p>${item.resumen}</p>
        <div class="news-meta">
          <span>${formatDate(item.fecha)}</span>
          <span>${item.categoria}</span>
          <span>${item.tiempo}</span>
        </div>
      </div>
      <a class="btn btn-primary" href="${item.url}" aria-label="Leer ${item.titulo}">Leer análisis</a>
    </article>
  `;
}

function renderNews() {
  const grid = document.getElementById("newsGrid");
  const counter = document.getElementById("newsCounter");
  if (!grid) return;

  renderCategories();
  const filtered = getFilteredNews();
  if (counter) counter.textContent = `${filtered.length} nota${filtered.length === 1 ? "" : "s"} encontrada${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otra palabra o categoría.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map((item) => `
    <article class="news-card" data-category="${item.categoria}">
      <div class="news-card-top">
        <span class="news-category">${item.categoria}</span>
        <time datetime="${item.fecha}">${formatDate(item.fecha)}</time>
      </div>
      <h2>${item.titulo}</h2>
      <p>${item.resumen}</p>
      <div class="news-tags">
        ${(item.etiquetas || []).map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <div class="news-card-footer">
        <span>${item.tiempo} de lectura</span>
        <a href="${item.url}" aria-label="Leer ${item.titulo}">Leer más</a>
      </div>
    </article>
  `).join("");
}

async function initNewsSystem() {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;

  try {
    const response = await fetch("../data/noticias.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar noticias.json");
    newsState.items = await response.json();
    newsState.items.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    renderFeatured(newsState.items.find((item) => item.destacado) || newsState.items[0]);
    renderNews();
  } catch (error) {
    console.warn(error);
    grid.innerHTML = `<div class="empty-state"><h2>No se pudieron cargar las noticias</h2><p>Revisa el archivo data/noticias.json.</p></div>`;
  }

  document.getElementById("newsSearch")?.addEventListener("input", (event) => {
    newsState.query = event.target.value;
    renderNews();
  });
}

document.addEventListener("DOMContentLoaded", initNewsSystem);
