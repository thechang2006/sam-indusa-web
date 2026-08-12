(function(){
  "use strict";

  /* ============================================================
     CURSOR — puntero personalizado, solo escritorio
     El punto sigue al ratón sin retraso; el anillo llega detrás con
     inercia. Sobre algo pulsable el anillo crece y el punto se va.

     Si algo aquí falla, la clase .cursor-on no llega a ponerse y el
     visitante conserva el cursor del sistema. Nunca se queda sin puntero.
     ============================================================ */

  /* Ratón de verdad, no dedo ni lápiz */
  var finoYConHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  if(!finoYConHover.matches) return;
  if(SAM.reduce) return;

  var raiz = document.documentElement;
  var dot  = document.createElement("div");
  var ring = document.createElement("div");
  dot.className  = "cur-dot";
  ring.className = "cur-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  raiz.classList.add("cursor-on");

  var raton = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var anillo = { x: raton.x, y: raton.y };
  var animando = false;

  /* Qué se considera pulsable */
  /* Solo lo que de verdad se puede pulsar. Los sellos, por ejemplo, tienen
     animación al pasar por encima pero no llevan a ningún sitio: si el
     cursor creciera ahí estaría prometiendo un clic que no existe. */
  var PULSABLE = 'a, button, [role="button"], [role="tab"], [role="radio"],' +
                 ' select, label, summary, .door, .brand-card, .flyer-sheet, .fab';
  var TEXTO = 'input:not([type="button"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]), textarea';
  /* Secciones de fondo oscuro: ahí el anillo cambia a dorado */
  var OSCURO = '.sec--dark, .page-hero:not(.page-hero--light), .flyer--dark, .foot, .hero';

  function marca(clase, si){ raiz.classList.toggle(clase, si); }

  function frame(){
    /* Interpolación: el anillo recorre un 18 % de lo que le falta en cada
       fotograma. Ese resto es la sensación de peso. */
    anillo.x += (raton.x - anillo.x) * 0.18;
    anillo.y += (raton.y - anillo.y) * 0.18;

    dot.style.transform  = "translate3d(" + raton.x + "px," + raton.y + "px,0)";
    ring.style.transform = "translate3d(" + anillo.x + "px," + anillo.y + "px,0)";

    /* Cuando ya ha alcanzado al ratón, se para el bucle: sin esto estaría
       repintando para siempre y gastando batería. */
    if(Math.abs(raton.x - anillo.x) < 0.1 && Math.abs(raton.y - anillo.y) < 0.1){
      anillo.x = raton.x; anillo.y = raton.y;
      ring.style.transform = "translate3d(" + anillo.x + "px," + anillo.y + "px,0)";
      animando = false;
      return;
    }
    requestAnimationFrame(frame);
  }

  function arranca(){
    if(animando) return;
    animando = true;
    requestAnimationFrame(frame);
  }

  document.addEventListener("mousemove", function(e){
    raton.x = e.clientX;
    raton.y = e.clientY;
    raiz.classList.add("cursor-dentro");
    arranca();

    var t = e.target;
    if(t && t.nodeType === 1){
      marca("cursor-activo", !!t.closest(PULSABLE));
      marca("cursor-texto",  !!t.closest(TEXTO));
      marca("cursor-oscuro", !!t.closest(OSCURO));
    }
  }, { passive: true });

  /* Fuera de la ventana, no hay puntero que pintar.
     mouseout con relatedTarget vacío es la señal fiable de que el ratón
     salió del documento; mouseleave sobre document no siempre llega. */
  document.addEventListener("mouseout", function(e){
    if(!e.relatedTarget) marca("cursor-dentro", false);
  });
  window.addEventListener("blur", function(){ marca("cursor-dentro", false); });

  document.addEventListener("mousedown", function(){ marca("cursor-pulsando", true); });
  document.addEventListener("mouseup",   function(){ marca("cursor-pulsando", false); });

  /* Al cambiar de página con el teclado o al hacer scroll el elemento bajo
     el ratón cambia sin que haya mousemove: se revisa en el bucle común. */
  SAM.onScroll(function(){
    var t = document.elementFromPoint(raton.x, raton.y);
    if(t){
      marca("cursor-activo", !!t.closest(PULSABLE));
      marca("cursor-oscuro", !!t.closest(OSCURO));
    }
  });

  /* Si se conecta una pantalla táctil o cambia el tipo de puntero */
  if(finoYConHover.addEventListener){
    finoYConHover.addEventListener("change", function(e){
      raiz.classList.toggle("cursor-on", e.matches);
    });
  }
})();
