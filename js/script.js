// Erick Islas Tech - JS base estable
(function(){
  function setupMenu(){
    const button = document.getElementById("menuToggle");
    const menu = document.getElementById("navMenu");
    if(!button || !menu) return;

    button.addEventListener("click", function(){
      const isOpen = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    menu.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        menu.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  function setupSafeEffects(){
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    if(progressFill && progressText){
      let progress = 0;
      const target = Number(progressFill.dataset.target || 72);
      const interval = setInterval(function(){
        if(progress >= target){ clearInterval(interval); return; }
        progress++;
        progressFill.style.width = progress + "%";
        progressText.textContent = progress + "%";
      }, 24);
    }

    const heroCard = document.querySelector(".hero-card");
    if(heroCard){
      document.addEventListener("mousemove", function(event){
        const x = (event.clientX / window.innerWidth - 0.5) * 20;
        const y = (event.clientY / window.innerHeight - 0.5) * 20;
        heroCard.style.transform = `perspective(1000px) rotateY(${x * 0.15}deg) rotateX(${-y * 0.15}deg)`;
      });
    }
  }

  document.addEventListener("eit:components-loaded", setupMenu);
  document.addEventListener("DOMContentLoaded", function(){
    setupMenu();
    setupSafeEffects();
  });
})();
