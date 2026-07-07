// Sprint 6 - Componentes reutilizables para Erick Islas Tech
// Carga header/footer desde /components para evitar código duplicado en cada página.

async function loadComponent(target) {
  const componentName = target.dataset.component;
  const rootPath = document.body.dataset.root || "";
  const response = await fetch(`${rootPath}components/${componentName}.html`, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el componente: ${componentName}`);
  }

  const html = await response.text();
  target.innerHTML = html.replaceAll("{{ROOT}}", rootPath);
}

function setActiveNavigation() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

async function loadSiteComponents() {
  const targets = document.querySelectorAll("[data-component]");

  try {
    await Promise.all([...targets].map(loadComponent));
    setActiveNavigation();
    document.dispatchEvent(new CustomEvent("eit:components-loaded"));
  } catch (error) {
    console.warn("Error al cargar componentes del sitio:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadSiteComponents);
