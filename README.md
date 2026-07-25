# Tostones Sam — Web oficial

Web de una sola página para **Tostones Sam**, marca de **Indusa, C.A.** — plátano chips y snacks salados naturales, Estado Zulia, Venezuela.

Un único `index.html` autocontenido: CSS y JS en línea. Recursos externos: Google Fonts y Leaflet (este último solo se descarga cuando el mapa entra en pantalla).

## Estructura

```
index.html          La web completa (HTML + CSS + JS)
assets/
  logo.png          Logo Sam / Indusa
  favicon.png       Icono de pestaña
  producto-30g.jpg  Empaque 30 g
  producto-80g.jpg  Empaque 80 g
  producto-150g.jpg Empaque 150 g
  abanico.jpg       Póster del vídeo del hero
  campo-a-mesa.jpg  Imagen para compartir en redes (og:image)
  hero.mp4          (opcional) vídeo del hero — ver abajo
```

## Orden de las secciones

El producto va primero; la empresa después.

1. **Hero** — vídeo scroll-driven
2. **¿En qué podemos ayudarte?** — canal mayorista / catálogo
3. **Productos** — configurador de presentación y sabor
4. **Proceso** — trazabilidad en 5 pasos + especificaciones
5. **Quiénes somos** — bio corporativa, valores y mapa de oficinas
6. **Portal mayorista** — formulario de cotización
7. **Preguntas frecuentes**

## Cómo verla

Abre `index.html` en el navegador. No necesita servidor.

## El hero con vídeo

El hero está montado con el efecto scroll-driven tipo Apple: el vídeo avanza fotograma a fotograma con el scroll.

Para activarlo, coloca el vídeo en **`assets/hero.mp4`**. El JS lo detecta solo:

- **Con vídeo** → hero de 420vh, el vídeo se sincroniza con el scroll y aparece la barra de progreso.
- **Sin vídeo** → cae automáticamente a un hero de 100vh con degradado verde y luz dorada. No se rompe nada.
- **En móvil** → el vídeo se reproduce en bucle silenciado (el scroll-driven no funciona bien en táctil).
- **Con `prefers-reduced-motion`** → hero estático.

La velocidad se ajusta con el `height` de `.hero` en el CSS: menos altura = el vídeo avanza más rápido.

## El mapa de oficinas

Está en la sección **Quiénes somos**, hecho con **Leaflet + OpenStreetMap**. No necesita clave de API y no se descarga hasta que el usuario se acerca a esa parte de la página (`IntersectionObserver` con 250 px de margen). Si no hay conexión o el CDN está bloqueado, se muestra automáticamente una tarjeta con la dirección y un enlace a Google Maps.

⚠️ **Las coordenadas son aproximadas** — están centradas en Maracaibo porque falta la dirección exacta. Para corregirlo, edita el objeto `OFICINA` en el JS de `index.html`:

```js
var OFICINA = {
  lat: 10.6545,      // ← sustituir
  lng: -71.6425,     // ← sustituir
  zoom: 13,
  nombre: "Indusa, C.A. — Tostones Sam",
  direccion: "Estado Zulia, Venezuela"   // ← sustituir
};
```

Para obtener las coordenadas reales: busca la dirección en Google Maps, clic derecho sobre el punto exacto → copiar coordenadas.

El zoom con la rueda del ratón está desactivado hasta que se hace clic en el mapa, para que no secuestre el scroll de la página.

## Datos pendientes de rellenar

Están marcados en la web con fondo amarillo (`<mark>`) para que se vean. Busca `<mark>` en `index.html`:

- [ ] Dirección completa (footer y sección Quiénes somos)
- [ ] Coordenadas reales de las oficinas (objeto `OFICINA` en el JS)
- [ ] Pedido mínimo al mayor (FAQ y formulario)
- [ ] Tiempos de entrega: Zulia / resto del país (FAQ)
- [ ] Formas de pago aceptadas (formulario)

## Fotos pendientes

Los tres empaques disponibles son del sabor **ajo**. La web lo indica de forma honesta ("el diseño varía según el sabor"). Cuando haya fotos de natural, limón y picante, se puede mostrar el empaque real de cada combinación ampliando el objeto `SIZES`/`FLAVORS` del JS.

También conviene una **imagen social dedicada de 1200×630 px** para `og:image`; ahora usa una foto vertical que las redes recortan.

## Contacto configurado

- WhatsApp / teléfono: `+58 424 5057479`
- Correo: `mayoristas@samindusa.com`
- Horario: 8:00 a. m. – 8:00 p. m.
- Instagram: [@TostonesSam](https://instagram.com/TostonesSam)
- Facebook: [TostonesSam88](https://facebook.com/TostonesSam88)

El formulario mayorista envía por **Formspree** (`https://formspree.io/f/xwvgweja`) y tiene botón de WhatsApp como alternativa.

## Decisiones de contenido

- **Sin precios**, a propósito: el enfoque es cotización mayorista por escala.
- **Sin testimonios**: los de la versión anterior eran contenido de relleno, no reseñas reales.
- **Sin sellos de certificación**: los anteriores eran iconos genéricos sin acreditación ni número de registro sanitario.
- **Leaflet con carga diferida**: la versión anterior lo cargaba de forma bloqueante en el `<head>`, aunque el mapa estuviera al final de la página. Aquí solo se descarga al acercarse, y tiene fallback.
- **Tono corporativo**: se retiró el eslogan «el auténtico crujido zuliano» en favor de una presentación más seria y orientada a distribuidores.

## Publicar en GitHub Pages

Con `index.html` en la raíz, basta activar Pages en la rama principal. Antes de publicar conviene:

1. Rellenar los `<mark>` pendientes.
2. Añadir `og:url` y `<link rel="canonical">` con el dominio definitivo.
3. Añadir `robots.txt` y `sitemap.xml` apuntando a ese dominio.
