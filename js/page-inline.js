(function(){
  const logoPath = "assets/images/logos/logo-erick-islas-tech.png";

  function applyHeaderLogo(){
    const candidates = document.querySelectorAll(
      ".site-logo, .brand, .logo, .nav-brand, header a[href='index.html'], header a[href='./'], header a[href='/']"
    );

    for (const el of candidates) {
      const text = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

      if (
        el.closest("header") &&
        !el.querySelector(".eit-header-logo-img") &&
        (
          text.includes("erick islas") ||
          text.includes("tech") ||
          el.classList.contains("site-logo") ||
          el.classList.contains("brand") ||
          el.classList.contains("logo") ||
          el.classList.contains("nav-brand")
        )
      ) {
        el.classList.add("eit-logo-image-link");
        el.setAttribute("aria-label", "Erick Islas Tech - Inicio");
        el.innerHTML = '<img class="eit-header-logo-img" src="' + logoPath + '" alt="Erick Islas Tech" loading="eager" decoding="async">' +
          '<span class="eit-header-brand-text" aria-hidden="true">' +
            '<span class="eit-header-brand-main">ERICK ISLAS</span>' +
            '<span class="eit-header-brand-tech">TECH</span>' +
          '</span>';
        return true;
      }
    }

    return false;
  }

  document.addEventListener("DOMContentLoaded", function(){
    if (applyHeaderLogo()) return;

    let attempts = 0;
    const watcher = setInterval(function(){
      attempts++;
      if (applyHeaderLogo() || attempts >= 40) {
        clearInterval(watcher);
      }
    }, 100);
  });
})();

(function(){
  const intro = document.getElementById('eitOsIntro');
  const skip = document.getElementById('eitSkipIntro');
  const boot = document.getElementById('eitBootText');
  if(!intro || !boot) return;

  document.body.classList.add('eit-intro-lock');

  const lines = [
    '[BOOT] Initializing Erick Islas Tech OS...',
    '[OK] Loading Reviews module...',
    '[OK] Loading Tutorials module...',
    '[OK] Loading News engine...',
    '[OK] Connecting Community hub...',
    '[OK] Checking security headers...',
    '[OK] Starting PWA service...',
    '[OK] Synchronizing assets...',
    '[OK] Building user experience...',
    '[SYS] Fake CPU temperature: 34°C...',
    '[SYS] Memory allocation: 42%...',
    '[SYS] Network link: 128 Mbps...',
    '[STATUS] Website under active construction...',
    '[ACCESS] GRANTED',
    '[ONLINE] Tecnología sin mentiras.'
  ];

  const text = lines.join('\n');
  let index = 0;
  const typeSpeed = 38;
  const startDelay = 650;
  const totalDuration = 30000;

  const tempEl = document.getElementById('eitFakeTemp');
  const cpuEl = document.getElementById('eitFakeCpu');
  const ramEl = document.getElementById('eitFakeRam');
  const netEl = document.getElementById('eitFakeNet');
  const tempMeter = document.getElementById('eitTempMeter');

  const fakeTemps = [34, 35, 36, 38, 37, 39, 41, 40, 38, 36, 35, 34];
  const fakeCpu = [18, 24, 31, 45, 62, 54, 48, 37, 29, 22];
  const fakeRam = [42, 44, 47, 52, 58, 55, 51, 49, 46, 43];
  const fakeNet = [128, 256, 512, 384, 768, 420, 300, 144];

  let metricTick = 0;
  const metricTimer = setInterval(function(){
    metricTick++;
    const temp = fakeTemps[metricTick % fakeTemps.length];
    const cpu = fakeCpu[metricTick % fakeCpu.length];
    const ram = fakeRam[metricTick % fakeRam.length];
    const net = fakeNet[metricTick % fakeNet.length];

    if(tempEl){
      tempEl.textContent = temp;
      tempEl.classList.toggle('eit-os-temp-hot', temp >= 39);
    }

    if(cpuEl) cpuEl.textContent = cpu + '%';
    if(ramEl) ramEl.textContent = ram + '%';
    if(netEl) netEl.textContent = net + ' Mbps';
    if(tempMeter) tempMeter.style.setProperty('--w', Math.min(92, 28 + temp) + '%');
  }, 900);

  function type(){
    if(index <= text.length){
      boot.innerHTML = text.slice(0, index)
        .replace(/\[OK\]/g, '<b>[OK]</b>')
        .replace(/\[ACCESS\]/g, '<b>[ACCESS]</b>')
        .replace(/\[ONLINE\]/g, '<b>[ONLINE]</b>')
        .replace(/\[STATUS\]/g, '<b>[STATUS]</b>')
        .replace(/\[SYS\]/g, '<b>[SYS]</b>');
      index++;
      setTimeout(type, typeSpeed);
    }
  }

  function closeIntro(){
    clearInterval(metricTimer);
    intro.classList.add('is-hidden');
    document.body.classList.remove('eit-intro-lock');
    setTimeout(function(){ intro.remove(); }, 1300);
  }

  setTimeout(type, startDelay);
  setTimeout(closeIntro, totalDuration);
  skip && skip.addEventListener('click', closeIntro);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeIntro();
  });
})();

(function () {
  const form = document.getElementById("eitContactForm");
  const status = document.getElementById("formStatus");
  const CONTACT_FORM_ENDPOINT = "https://formspree.io/f/mdarvabo";

  const RATE_LIMIT_MS = 60000;

  function showStatus(message, type) {
    status.textContent = message;
    status.className = "form-status is-visible " + (type === "success" ? "is-success" : "is-error");
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isEndpointConfigured() {
    return CONTACT_FORM_ENDPOINT && CONTACT_FORM_ENDPOINT.startsWith("https://formspree.io/f/");
  }

  function getPayload() {
    return {
      nombre: cleanText(form.nombre.value),
      email: cleanText(form.email.value),
      tipo: cleanText(form.tipo.value),
      asunto: cleanText(form.asunto.value),
      mensaje: cleanText(form.mensaje.value),
      origen: "Comunidad Erick Islas Tech",
      fecha: new Date().toISOString(),
      _subject: "Nuevo mensaje desde Comunidad - Erick Islas Tech"
    };
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (form.empresa.value) {
      showStatus("No se pudo enviar el mensaje.", "error");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      showStatus("Revisa los campos obligatorios antes de enviar.", "error");
      return;
    }

    if (!isEndpointConfigured()) {
      showStatus("Formulario listo. Falta configurar el endpoint seguro en el código para recibir mensajes reales.", "error");
      return;
    }

    const lastSent = Number(localStorage.getItem("eit_contact_last_sent") || 0);
    if (Date.now() - lastSent < RATE_LIMIT_MS) {
      showStatus("Espera un momento antes de enviar otro mensaje.", "error");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(getPayload())
      });

      if (!response.ok) {
        throw new Error("Respuesta no válida del servidor.");
      }

      localStorage.setItem("eit_contact_last_sent", String(Date.now()));
      form.reset();
      showStatus("Mensaje enviado correctamente. Gracias por contactar a Erick Islas Tech.", "success");
    } catch (error) {
      showStatus("No fue posible enviar el mensaje. Inténtalo más tarde.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar mensaje";
    }
  });
})();

(function(){
  const buttons = document.querySelectorAll(".category-filter");
  const cards = document.querySelectorAll(".review-card");
  const searchInput = document.getElementById("reviewSearch");
  const emptyState = document.getElementById("emptyReviews");
  let activeFilter = "todas";

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function applyFilters() {
    const query = normalize(searchInput ? searchInput.value : "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = normalize(card.dataset.category);
      const searchText = normalize(card.innerText + " " + (card.dataset.search || ""));
      const categoryMatch = activeFilter === "todas" || categories.includes(activeFilter);
      const searchMatch = !query || searchText.includes(query);
      const shouldShow = categoryMatch && searchMatch;

      card.style.display = shouldShow ? "" : "none";
      if (shouldShow) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount ? "none" : "block";
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      activeFilter = button.dataset.filter || "todas";
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
})();
