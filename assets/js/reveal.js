(function(){
  "use strict";
  var $ = SAM.$, $$ = SAM.$$, reduce = SAM.reduce;

  /* ============================================================
     REVEALS + STAGGER + CONTADORES (un solo observer)
     ============================================================ */
  var revealIO = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      en.target.classList.add("is-in");
      obs.unobserve(en.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal]").forEach(function(el){ revealIO.observe(el); });

  /* Stagger automático dentro de grupos que no lo declaran a mano */
  $$(".zones, .values, .map-data").forEach(function(group){
    $$("[data-reveal]", group).forEach(function(el, i){
      if(!el.style.getPropertyValue("--i")) el.style.setProperty("--i", i);
    });
  });

  function animateNum(el){
    var to = parseFloat(el.getAttribute("data-to")) || 0;
    if(reduce || to === 0){ el.textContent = to; return; }
    var dur = 1400, t0 = performance.now();
    (function step(now){
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if(p < 1) requestAnimationFrame(step);
    })(t0);
  }
  var numIO = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      animateNum(en.target);
      obs.unobserve(en.target);
    });
  }, { threshold: 0.6 });
  $$(".num").forEach(function(n){ numIO.observe(n); });

  /* ---------- Timeline progresiva ---------- */
  var tlSteps = $$(".tl-step"), tlFill = $("#tlFill");
  var vertical = function(){ return window.innerWidth <= 980; };
  var tlIO = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting) en.target.classList.add("is-on");
    });
    var done = tlSteps.filter(function(s){ return s.classList.contains("is-on"); }).length;
    var pct = (done / tlSteps.length) * 100;
    if(vertical()){ tlFill.style.setProperty("--fill", pct + "%"); tlFill.style.height = pct + "%"; }
    else { tlFill.style.width = pct + "%"; tlFill.style.height = "100%"; }
  }, { threshold: 0.5 });
  tlSteps.forEach(function(s){ tlIO.observe(s); });

  /* ============================================================
     PARALLAX (rAF, transform-only)
     ============================================================ */
  function parallax(){ /* el hero ya no lleva parallax: el vídeo lo ocupa entero */ }
})();
