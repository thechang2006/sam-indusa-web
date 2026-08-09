(function(){
  "use strict";
  var $$ = SAM.$$;

  /* ============================================================
     FAQ — acordeón con altura animada
     ============================================================ */
  $$(".faq-q").forEach(function(q){
    var panel = document.getElementById(q.getAttribute("aria-controls"));
    q.addEventListener("click", function(){
      var open = q.getAttribute("aria-expanded") === "true";
      /* cerrar el resto */
      $$(".faq-q").forEach(function(o){
        if(o === q) return;
        o.setAttribute("aria-expanded","false");
        document.getElementById(o.getAttribute("aria-controls")).style.height = "0px";
      });
      q.setAttribute("aria-expanded", open ? "false" : "true");
      panel.style.height = open ? "0px" : panel.scrollHeight + "px";
    });
  });
  /* Al cambiar el ancho, el texto reflowea y el panel abierto cambia de alto */
  SAM.onResize(function(){
    $$('.faq-q[aria-expanded="true"]').forEach(function(q){
      var p = document.getElementById(q.getAttribute("aria-controls"));
      p.style.height = p.scrollHeight + "px";
    });
  });
})();
