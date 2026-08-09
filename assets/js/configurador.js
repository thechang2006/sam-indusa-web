(function(){
  "use strict";
  var $ = SAM.$, $$ = SAM.$$, waLink = SAM.waLink;

  if(!($("#prodImg"))) return;

  /* ============================================================
     CONFIGURADOR DE PRODUCTO
     ============================================================ */
  var SIZES = {
    "30":  { label:"30 g",  tag:"Individual", use:"meriendas rápidas, colegios, antojo diario",   img:"assets/producto-30g.jpg" },
    "80":  { label:"80 g",  tag:"Compartir",  use:"reuniones pequeñas, snack de oficina",         img:"assets/producto-80g.jpg" },
    "150": { label:"150 g", tag:"Familiar",   use:"fiestas, reuniones familiares, para acompañar con salsas", img:"assets/producto-150g.jpg" }
  };
  var FLAVORS = {
    natural: { name:"Natural con Sal", color:"#F5A623", desc:"Sal marina y punto justo de fritura. El de siempre, el que no falla." },
    limon:   { name:"Limón",           color:"#FFCA28", desc:"Un toque cítrico que despierta el sabor del plátano frito." },
    ajo:     { name:"Ajo",             color:"#E53935", desc:"Ajito criollo dosificado al detalle. El favorito para compartir." },
    picante: { name:"Picante",         color:"#B71C1C", desc:"Picor real, no solo color: para quienes piden «más pique»." }
  };
  var curSize = "30", curFlavor = "natural";

  var prodImg = $("#prodImg"), sizeBadge = $("#sizeBadge"), ribbon = $("#ribbon");
  var outName = $("#outName"), outDesc = $("#outDesc"), outUse = $("#outUse");
  var prodWa = $("#prodWa"), imgNote = $("#imgNote");

  function render(changedSize){
    var s = SIZES[curSize], f = FLAVORS[curFlavor];

    sizeBadge.textContent = s.label;
    ribbon.style.background = f.color;
    outName.textContent = "Tostón " + f.name + " · " + s.label;
    outDesc.textContent = f.desc;
    outUse.textContent = "Ideal para: " + s.use + ".";
    prodWa.href = waLink("Hola Indusa, me interesa el Tostón " + f.name + " en presentación de " + s.label + ".");
    imgNote.textContent = "La foto muestra el empaque de " + s.label + ". El diseño varía según el sabor.";

    if(changedSize){
      prodImg.style.opacity = "0";
      setTimeout(function(){
        prodImg.src = s.img;
        prodImg.alt = "Empaque de Tostones Sam de " + s.label;
        prodImg.style.opacity = "1";
      }, 170);
    }
  }

  /* Radiogroup accesible: click + flechas + Home/End */
  function wireRadios(container, onPick){
    var radios = $$('[role="radio"]', container);
    function select(i){
      i = (i + radios.length) % radios.length;
      radios.forEach(function(r, j){
        var on = j === i;
        r.setAttribute("aria-checked", on ? "true" : "false");
        r.tabIndex = on ? 0 : -1;
      });
      radios[i].focus();
      onPick(radios[i]);
    }
    radios.forEach(function(r, i){
      r.addEventListener("click", function(){ select(i); });
      r.addEventListener("keydown", function(e){
        var k = e.key;
        if(k === "ArrowRight" || k === "ArrowDown"){ e.preventDefault(); select(i + 1); }
        else if(k === "ArrowLeft" || k === "ArrowUp"){ e.preventDefault(); select(i - 1); }
        else if(k === "Home"){ e.preventDefault(); select(0); }
        else if(k === "End"){ e.preventDefault(); select(radios.length - 1); }
      });
    });
  }
  wireRadios($("#segSize"), function(btn){ curSize = btn.getAttribute("data-size"); render(true); });
  wireRadios($("#segFlavor"), function(btn){ curFlavor = btn.getAttribute("data-flavor"); render(false); });
  render(false);
})();
