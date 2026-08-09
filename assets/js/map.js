(function(){
  "use strict";
  var $ = SAM.$;

  if(!($("#map"))) return;

  /* ============================================================
     MAPA — Leaflet + OpenStreetMap, cargado solo al acercarse
     ============================================================

     La DIRECCIÓN es la real y exacta. Las COORDENADAS están tomadas
     sobre El Vigía, no sobre la puerta de la planta: para afinar el
     marcador, busca la planta en Google Maps, clic derecho → copiar
     coordenadas, y sustituye lat/lng aquí.

     Los enlaces a Google Maps van por dirección, no por coordenadas,
     para que "Cómo llegar" lleve al sitio correcto aunque el pin del
     mapa interactivo esté aproximado.
  */
  var OFICINA = {
    lat: 8.6135,
    lng: -71.6503,
    zoom: 14,
    nombre: "Grupo Indusa — Planta El Vigía",
    direccion: "Carretera vía Los Cañitos, Local La Guadalupana, Barrio Los Pozones, El Vigía, Estado Mérida"
  };

  var destino = encodeURIComponent(OFICINA.direccion + ", Venezuela");

  var mapEl = $("#map"), mapFb = $("#mapFb");
  var gmaps = "https://www.google.com/maps/search/?api=1&query=" + destino;
  var mapDir = $("#mapDir"), mapFbLink = $("#mapFbLink");
  if(mapDir) mapDir.href = "https://www.google.com/maps/dir/?api=1&destination=" + destino;
  if(mapFbLink) mapFbLink.href = gmaps;

  function showMapFallback(){
    if(mapFb) mapFb.hidden = false;
  }

  function loadCss(href){
    return new Promise(function(res, rej){
      var l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href;
      l.onload = res; l.onerror = rej;
      document.head.appendChild(l);
    });
  }
  function loadJs(src){
    return new Promise(function(res, rej){
      var s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function initMap(){
    if(!window.L){ showMapFallback(); return; }
    try{
      var map = L.map(mapEl, {
        center: [OFICINA.lat, OFICINA.lng],
        zoom: OFICINA.zoom,
        scrollWheelZoom: false,   /* no secuestrar el scroll de la página */
        attributionControl: true
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      /* Marcador con el pin de marca en vez del icono azul por defecto */
      var icon = L.divIcon({
        className: "",
        html: '<span class="map-pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>',
        iconSize: [38, 38],
        iconAnchor: [19, 34],
        popupAnchor: [0, -32]
      });
      L.marker([OFICINA.lat, OFICINA.lng], { icon: icon, title: OFICINA.nombre })
        .addTo(map)
        .bindPopup(
          "<strong>" + OFICINA.nombre + "</strong><br>" + OFICINA.direccion +
          '<br><a href="' + gmaps + '" target="_blank" rel="noopener">Ver en Google Maps</a>'
        );

      /* El zoom con rueda se activa al hacer clic, y se desactiva al salir */
      map.on("click", function(){ map.scrollWheelZoom.enable(); });
      map.on("mouseout", function(){ map.scrollWheelZoom.disable(); });
    } catch(e){
      showMapFallback();
    }
  }

  if(mapEl){
    var mapLoaded = false;
    var mapIO = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if(!en.isIntersecting || mapLoaded) return;
        mapLoaded = true;
        obs.unobserve(en.target);
        Promise.all([
          loadCss("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"),
          loadJs("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
        ]).then(initMap).catch(showMapFallback);
      });
    }, { rootMargin: "250px 0px" });
    mapIO.observe(mapEl);
  }
})();
