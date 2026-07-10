const EIT_ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: "", // Ejemplo: "G-XXXXXXXXXX"
  CLARITY_PROJECT_ID: "", // Ejemplo: "abc123xyz"
  CONSENT_STORAGE_KEY: "eit-analytics-consent"
};

function hasAnalyticsIds() {
  return Boolean(
    EIT_ANALYTICS_CONFIG.GA_MEASUREMENT_ID ||
    EIT_ANALYTICS_CONFIG.CLARITY_PROJECT_ID
  );
}

function getAnalyticsConsent() {
  return localStorage.getItem(EIT_ANALYTICS_CONFIG.CONSENT_STORAGE_KEY);
}

function setAnalyticsConsent(value) {
  localStorage.setItem(EIT_ANALYTICS_CONFIG.CONSENT_STORAGE_KEY, value);
}

function loadGoogleAnalytics() {
  const measurementId = EIT_ANALYTICS_CONFIG.GA_MEASUREMENT_ID;
  if (!measurementId || window.gtag) return;

  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true
  });
}

function loadMicrosoftClarity() {
  const clarityId = EIT_ANALYTICS_CONFIG.CLARITY_PROJECT_ID;
  if (!clarityId || window.clarity) return;

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", clarityId);
}

function startAnalytics() {
  loadGoogleAnalytics();
  loadMicrosoftClarity();
}

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (typeof window.clarity === "function") {
    window.clarity("event", eventName);
  }
}

function createConsentBanner() {
  if (!hasAnalyticsIds()) return;
  if (getAnalyticsConsent()) return;
  if (document.querySelector(".privacy-banner")) return;

  const banner = document.createElement("div");
  banner.className = "privacy-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Preferencias de analítica");
  banner.innerHTML = `
    <div>
      <strong>Privacidad y analítica</strong>
      <p>Usamos medición anónima para entender qué contenido funciona mejor y mejorar Erick Islas Tech.</p>
    </div>
    <div class="privacy-actions">
      <button type="button" class="btn btn-primary" id="acceptAnalytics">Aceptar</button>
      <button type="button" class="btn btn-secondary" id="rejectAnalytics">Rechazar</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById("acceptAnalytics")?.addEventListener("click", () => {
    setAnalyticsConsent("accepted");
    startAnalytics();
    banner.remove();
  });

  document.getElementById("rejectAnalytics")?.addEventListener("click", () => {
    setAnalyticsConsent("rejected");
    banner.remove();
  });
}

function bindInteractionTracking() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const text = link.textContent.trim().slice(0, 80);
    const isExternal = link.hostname && link.hostname !== window.location.hostname;
    const isCTA = link.classList.contains("btn") || link.closest(".hero-actions");

    if (isExternal) {
      trackEvent("click_enlace_externo", { link_url: link.href, link_text: text });
    }

    if (isCTA) {
      trackEvent("click_cta", { link_url: href, link_text: text });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const consent = getAnalyticsConsent();
  if (consent === "accepted") startAnalytics();
  createConsentBanner();
  bindInteractionTracking();
});

window.EITAnalytics = {
  trackEvent,
  startAnalytics
};
