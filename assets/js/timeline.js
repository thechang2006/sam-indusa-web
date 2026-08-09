(function(){
  "use strict";
  var $ = SAM.$, $$ = SAM.$$;

  /* ============================================================
     TIMELINE — línea de tiempo interactiva
     Patrón de pestañas del estándar WAI-ARIA: solo el año activo
     entra en el tabulador; entre años se navega con las flechas.
     Añadir un hito en el HTML no requiere tocar este archivo.
     ============================================================ */
  $$(".tline").forEach(function(tline){
    var rail  = $(".tline-rail", tline);
    var years = $$('[role="tab"]', rail);
    if(!rail || years.length === 0) return;

    function activar(i, mover){
      i = Math.max(0, Math.min(years.length - 1, i));

      years.forEach(function(y, n){
        var activo = n === i;
        y.setAttribute("aria-selected", activo ? "true" : "false");
        y.tabIndex = activo ? 0 : -1;

        var panel = document.getElementById(y.getAttribute("aria-controls"));
        if(!panel) return;
        if(activo) panel.setAttribute("data-activo", "");
        else panel.removeAttribute("data-activo");
      });

      /* Relleno del raíl hasta el año elegido */
      var avance = years.length > 1 ? i / (years.length - 1) : 1;
      tline.style.setProperty("--progreso", avance.toFixed(3));

      if(mover) years[i].focus();
    }

    years.forEach(function(y, i){
      y.addEventListener("click", function(){ activar(i, false); });

      y.addEventListener("keydown", function(e){
        var salto = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key];
        if(salto){ e.preventDefault(); activar(i + salto, true); return; }
        if(e.key === "Home"){ e.preventDefault(); activar(0, true); }
        if(e.key === "End"){  e.preventDefault(); activar(years.length - 1, true); }
      });
    });

    /* Estado inicial: el que venga marcado en el HTML, o el primero */
    var inicial = years.findIndex(function(y){
      return y.getAttribute("aria-selected") === "true";
    });
    activar(inicial < 0 ? 0 : inicial, false);
  });
})();
