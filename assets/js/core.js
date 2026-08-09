/* ============================================================
   CORE — utilidades compartidas y bucle único de scroll/resize
   Se carga antes que cualquier otro módulo. Todos asumen SAM disponible.
   Todos los <script> van con defer, así que el DOM ya está listo.
   ============================================================ */
window.SAM = (function(){
  "use strict";

  var api = {
    WA: "584245057479",
    FORMSPREE: "https://formspree.io/f/xwvgweja",
    reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  api.$  = function(s,c){ return (c||document).querySelector(s); };
  api.$$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
  api.waLink = function(msg){ return "https://wa.me/" + api.WA + "?text=" + encodeURIComponent(msg); };

  /* Un único listener de scroll y uno de resize para toda la página.
     Cada módulo se apunta con onScroll/onResize en lugar de registrar el suyo:
     así no se acumulan handlers al crecer el sitio. */
  var scrollFns = [], resizeFns = [], ticking = false;

  function frame(){
    for(var i = 0; i < scrollFns.length; i++) scrollFns[i]();
    ticking = false;
  }
  function remeasure(){
    for(var i = 0; i < resizeFns.length; i++) resizeFns[i]();
  }

  api.frame    = frame;
  api.onScroll = function(fn){ scrollFns.push(fn); };
  api.onResize = function(fn){ resizeFns.push(fn); };

  window.addEventListener("scroll", function(){
    if(!ticking){ requestAnimationFrame(frame); ticking = true; }
  }, { passive: true });

  var rzT;
  window.addEventListener("resize", function(){
    clearTimeout(rzT);
    rzT = setTimeout(function(){ remeasure(); frame(); }, 200);
  });

  /* Primer pintado, y re-medida cuando las imágenes ya ocupan su alto real */
  requestAnimationFrame(frame);
  window.addEventListener("load", function(){ remeasure(); frame(); });

  return api;
})();

/* ---------- Piezas comunes a todas las páginas ---------- */
(function(){
  "use strict";
  var $ = SAM.$;

  var year = $("#year");
  if(year) year.textContent = new Date().getFullYear();

  var waFab = $("#waFab");
  if(waFab) waFab.href = SAM.waLink("Hola Grupo Indusa, quiero información sobre sus productos.");
})();
