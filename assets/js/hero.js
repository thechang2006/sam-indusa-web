(function(){
  "use strict";
  var $ = SAM.$, reduce = SAM.reduce;

  if(!($("#inicio") && $("#heroVideo"))) return;

  /* ============================================================
     HERO — vídeo a pantalla completa en bucle infinito
     ============================================================ */
  var hero = $("#inicio"), video = $("#heroVideo");
  var MQ_MOBILE = "(max-width: 860px)";
  var isMobile = window.matchMedia(MQ_MOBILE).matches;
  var loadedSrc = null;

  var SRC = {
    desktop: { video: "assets/hero.mp4",        poster: "assets/hero-poster.jpg" },
    mobile:  { video: "assets/hero-mobile.mp4", poster: "assets/hero-poster-mobile.jpg" }
  };

  function noVideo(){ hero.classList.add("no-video"); }

  /* Carga la versión que toca. Solo se descarga una de las dos. */
  function loadHeroVideo(){
    var pick = isMobile ? SRC.mobile : SRC.desktop;
    if(loadedSrc === pick.video) return;
    loadedSrc = pick.video;
    video.poster = pick.poster;
    video.src = pick.video;
    video.load();
    tryPlay();
  }

  /* El autoplay puede rechazarse (modo ahorro de energía en iOS, ajustes del
     navegador). Si pasa, dejamos el póster visible en vez de un hueco negro. */
  function tryPlay(){
    var p = video.play();
    if(p && typeof p.catch === "function"){
      p.catch(function(){
        /* Reintento tras la primera interacción del usuario */
        var retry = function(){
          video.play().catch(function(){});
          document.removeEventListener("touchstart", retry);
          document.removeEventListener("click", retry);
        };
        document.addEventListener("touchstart", retry, { once: true, passive: true });
        document.addEventListener("click", retry, { once: true });
      });
    }
  }

  if(reduce){
    /* Sin animación: se queda el póster fijo, sin reproducir */
    video.removeAttribute("autoplay");
    video.poster = isMobile ? SRC.mobile.poster : SRC.desktop.poster;
    hero.classList.remove("no-video");
  } else {
    video.addEventListener("error", noVideo);
    /* canplay = hay datos suficientes para pintar: recién ahí quitamos el fallback */
    video.addEventListener("canplay", function(){
      hero.classList.remove("no-video");
      tryPlay();
    });
    /* Cinturón: si el navegador pausa el vídeo por su cuenta, lo reanudamos */
    video.addEventListener("pause", function(){
      if(!document.hidden && !video.ended) tryPlay();
    });
    /* loop es un atributo del <video>, pero algunos navegadores lo ignoran
       si el archivo trae metadatos raros; esto lo garantiza. */
    video.addEventListener("ended", function(){
      video.currentTime = 0;
      tryPlay();
    });
    document.addEventListener("visibilitychange", function(){
      if(!document.hidden) tryPlay();
    });
    loadHeroVideo();
    setTimeout(function(){ if(video.readyState < 2) noVideo(); }, 6000);
  }

  /* Solo recarga el vídeo si se cruzó el umbral de 860 px: así girar el móvil
     no vuelve a descargar 5 MB. */
  SAM.onResize(function(){
    var wasMobile = isMobile;
    isMobile = window.matchMedia(MQ_MOBILE).matches;
    if(wasMobile !== isMobile && !reduce) loadHeroVideo();
  });
})();
