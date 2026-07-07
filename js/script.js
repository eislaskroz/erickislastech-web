// Erick Islas Tech - JS base estable + efectos premium seguros
(function(){
  function setupMenu(){
    const button = document.getElementById("menuToggle");
    const menu = document.getElementById("navMenu");
    if(!button || !menu) return;

    if(button.dataset.eitReady === "1") return;
    button.dataset.eitReady = "1";

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
      }, { passive:true });
    }
  }

  function setupRevealEffects(){
    const items = document.querySelectorAll(".service-card-premium, .process-step, .service-stat, .services-cta");
    if(!items.length) return;

    if(!("IntersectionObserver" in window)){
      items.forEach(function(item){ item.classList.add("is-visible"); });
      return;
    }

    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:0.16, rootMargin:"0px 0px -40px 0px" });

    items.forEach(function(item){ observer.observe(item); });
  }

  function setupServiceCardGlow(){
    const cards = document.querySelectorAll(".service-card-premium, .process-step, .service-stat, .eit-footer-card");
    cards.forEach(function(card){
      card.addEventListener("pointermove", function(event){
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      }, { passive:true });
    });
  }

  function init(){
    setupMenu();
    setupSafeEffects();
    setupRevealEffects();
    setupServiceCardGlow();
  }

  document.addEventListener("eit:components-loaded", init);
  document.addEventListener("DOMContentLoaded", init);
})();
