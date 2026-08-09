(function(){
  "use strict";
  var $ = SAM.$, $$ = SAM.$$, waLink = SAM.waLink;

  if(!($("#prodImg"))) return;

  /* ============================================================
     CONFIGURADOR DE PRODUCTO
     El catálogo NO vive aquí: cada página lleva el suyo en un bloque
     <script type="application/json" id="catalogo">. Así la misma pieza
     sirve para Tostones Sam, para Sharitos y para la marca que venga,
     y cambiar un sabor o una presentación es editar solo esa página.
     ============================================================ */
  var datos = $("#catalogo");
  if(!datos){
    console.warn("Configurador: falta el bloque JSON #catalogo en la página.");
    return;
  }

  var CAT;
  try{
    CAT = JSON.parse(datos.textContent);
  }catch(e){
    console.warn("Configurador: el bloque #catalogo no es JSON válido —", e.message);
    return;
  }

  var SIZES   = CAT.presentaciones;
  var FLAVORS = CAT.sabores;
  var MARCA   = CAT.marca    || "";
  var PIEZA   = CAT.producto || "";

  var curSize   = Object.keys(SIZES)[0];
  var curFlavor = Object.keys(FLAVORS)[0];

  var prodImg = $("#prodImg"), sizeBadge = $("#sizeBadge"), ribbon = $("#ribbon");
  var outName = $("#outName"), outDesc = $("#outDesc"), outUse = $("#outUse");
  var prodWa = $("#prodWa"), imgNote = $("#imgNote");

  function render(changedSize){
    var s = SIZES[curSize], f = FLAVORS[curFlavor];

    sizeBadge.textContent = s.label;
    ribbon.style.background = f.color;
    outName.textContent = (PIEZA ? PIEZA + " " : "") + f.name + " · " + s.label;
    outDesc.textContent = f.desc;
    outUse.textContent = "Ideal para: " + s.use + ".";
    prodWa.href = waLink(
      "Hola Grupo Indusa, me interesa " + MARCA + " " + f.name +
      " en presentación de " + s.label + "."
    );
    imgNote.textContent = "La foto muestra el empaque de " + s.label + ". El diseño varía según el sabor.";

    if(changedSize){
      prodImg.style.opacity = "0";
      setTimeout(function(){
        prodImg.src = s.img;
        prodImg.alt = "Empaque de " + MARCA + " de " + s.label;
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
