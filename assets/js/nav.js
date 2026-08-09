(function(){
  "use strict";
  var $ = SAM.$, $$ = SAM.$$, reduce = SAM.reduce;

  /* ============================================================
     NAV: sticky, scroll-spy, progreso, menú móvil
     ============================================================ */
  var nav = $("#nav"), burger = $("#burger"), burgerIcon = $("#burgerIcon");
  var navProgress = $("#navProgress"), toTop = $("#toTop");

  burger.addEventListener("click", function(){
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    burgerIcon.firstElementChild.setAttribute("href", open ? "#i-close" : "#i-menu");
    document.body.style.overflow = open ? "hidden" : "";
  });
  function closeNav(){
    if(!nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded","false");
    burger.setAttribute("aria-label","Abrir menú");
    burgerIcon.firstElementChild.setAttribute("href","#i-menu");
    document.body.style.overflow = "";
  }
  $$("#navLinks a, .nav-cta a").forEach(function(a){ a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeNav(); });

  var docH = 0;
  function measure(){ docH = document.documentElement.scrollHeight - window.innerHeight; }
  measure();

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("is-on", y > 700);
    if(docH > 0) navProgress.style.transform = "scaleX(" + Math.min(1, y / docH) + ")";
  }
  toTop.addEventListener("click", function(){
    window.scrollTo({ top:0, behavior: reduce ? "auto" : "smooth" });
  });

  /* Scroll-spy */
  var secs = $$("main section[id]");
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      var id = en.target.id;
      $$("#navLinks a").forEach(function(a){
        a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(function(s){ spy.observe(s); });

  /* Scroll suave con offset de nav */
  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(e){
      var id = a.getAttribute("href");
      if(id === "#" || id.length < 2) return;
      var t = document.querySelector(id);
      if(!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - (id === "#inicio" ? 0 : 66);
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Desplegable "Nuestras marcas" ----------
     En escritorio el hover lo resuelve el CSS. Esto cubre teclado y táctil,
     que es donde el menú de INVECA se queda en un href="#" muerto. */
  $$(".has-sub").forEach(function(li){
    var btn = $(".sub-toggle", li);
    var sub = $(".subnav", li);
    if(!btn || !sub) return;

    function setOpen(open){
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    btn.addEventListener("click", function(e){
      e.preventDefault();
      var open = !li.classList.contains("is-open");
      $$(".has-sub").forEach(function(o){ if(o !== li) o.classList.remove("is-open"); });
      setOpen(open);
    });

    /* Se cierra al salir con el tabulador del último enlace */
    li.addEventListener("focusout", function(e){
      if(!li.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener("click", function(e){
      if(!li.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") setOpen(false);
    });
  });

  /* Un solo punto de enganche al bucle compartido de core.js */
  SAM.onResize(measure);
  SAM.onScroll(onScroll);
})();
