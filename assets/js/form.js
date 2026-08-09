(function(){
  "use strict";
  var $ = SAM.$, $$ = SAM.$$, FORMSPREE = SAM.FORMSPREE;

  if(!($("#b2bForm"))) return;

  /* ============================================================
     FORMULARIO MAYORISTA
     ============================================================ */
  var form = $("#b2bForm"), formOk = $("#formOk"), formBad = $("#formBad");
  var submitBtn = $("#submitBtn"), tier = $("#tier"), tierTxt = $("#tierTxt");
  var TIERS = {
    "Menos de 500 unidades":"Nivel inicial",
    "500 – 2.000 unidades":"Nivel intermedio",
    "2.000 – 10.000 unidades":"Nivel alto",
    "Más de 10.000 unidades":"Nivel distribuidor"
  };
  $("#f-volumen").addEventListener("change", function(){
    var t = TIERS[this.value];
    if(t){ tierTxt.textContent = t + " — cotización por escala"; tier.hidden = false; }
    else tier.hidden = true;
  });
  $("#f-origen").value = "web-grupoindusa";

  /* Atajo a WhatsApp junto al botón de enviar */
  var formWa = $("#formWa");
  if(formWa) formWa.href = SAM.waLink("Hola Grupo Indusa, quiero cotizar al mayor.");

  function setErr(input, msg){
    var box = document.getElementById("e-" + input.id.replace("f-",""));
    if(msg){
      input.setAttribute("aria-invalid","true");
      if(box) box.textContent = msg;
    } else {
      input.removeAttribute("aria-invalid");
      if(box) box.textContent = "";
    }
  }
  function validate(){
    var ok = true, first = null;
    [["f-empresa","Indica el nombre del negocio."],
     ["f-contacto","Indica una persona de contacto."],
     ["f-email","Indica un correo válido."],
     ["f-tel","Indica un teléfono de contacto."],
     ["f-ciudad","Indica la ciudad o municipio."]].forEach(function(pair){
      var el = document.getElementById(pair[0]);
      var val = el.value.trim();
      var bad = !val || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val));
      setErr(el, bad ? pair[1] : "");
      if(bad){ ok = false; if(!first) first = el; }
    });
    if(first) first.focus();
    return ok;
  }
  $$("#b2bForm input").forEach(function(el){
    el.addEventListener("input", function(){ if(el.getAttribute("aria-invalid")) setErr(el, ""); });
  });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    formOk.classList.remove("is-on");
    formBad.classList.remove("is-on");
    if(!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    fetch(FORMSPREE, {
      method:"POST",
      headers:{ "Accept":"application/json" },
      body:new FormData(form)
    }).then(function(r){
      if(!r.ok) throw new Error("bad response");
      form.reset();
      tier.hidden = true;
      formOk.classList.add("is-on");
    }).catch(function(){
      formBad.classList.add("is-on");
    }).finally(function(){
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar solicitud <svg><use href="#i-arrow"></use></svg>';
    });
  });
})();
