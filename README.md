# Tostones Sam — Web oficial

Web de una sola página para **Tostones Sam**, marca de **Indusa, C.A.** — plátano chips y snacks salados naturales, Estado Zulia, Venezuela.

Un único `index.html` autocontenido: CSS y JS en línea. Recursos externos: Google Fonts y Leaflet (este último solo se descarga cuando el mapa entra en pantalla).

## Estructura

```
index.html                  La web completa (HTML + CSS + JS)
assets/
  hero.mp4                  Vídeo del hero, escritorio (1866×864)
  hero-mobile.mp4           Vídeo del hero, móvil (900×1598)
  hero-poster.jpg           Primer fotograma, escritorio
  hero-poster-mobile.jpg    Primer fotograma, móvil
  logo.png                  Logo Sam / Indusa
  favicon.png               Icono de pestaña
  producto-30g.jpg          Empaque 30 g
  producto-80g.jpg          Empaque 80 g
  producto-150g.jpg         Empaque 150 g
  abanico.jpg               Imagen del producto (JSON-LD)
  campo-a-mesa.jpg          Imagen para compartir en redes (og:image)
```

## Orden de las secciones

El producto va primero; la empresa después.

1. **Hero** — vídeo a pantalla completa en bucle
2. **¿En qué podemos ayudarte?** — canal mayorista / catálogo
3. **Productos** — configurador de presentación y sabor
4. **Proceso** — trazabilidad en 5 pasos + especificaciones
5. **Quiénes somos** — bio corporativa, valores y mapa de oficinas
6. **Portal mayorista** — formulario de cotización
7. **Preguntas frecuentes**

## Cómo verla

Abre `index.html` en el navegador. No necesita servidor.

## El hero con vídeo

El hero es un vídeo a pantalla completa (100dvh) en **bucle infinito**, silenciado y sin texto superpuesto, porque el propio vídeo lleva su rotulación incrustada.

Hay dos archivos y **solo se descarga uno**: el JS elige según el ancho de pantalla antes de cargar, con el umbral en 860 px.

| | Archivo | Resolución |
|---|---|---|
| Escritorio | `hero.mp4` | 1866×864 |
| Móvil | `hero-mobile.mp4` | 900×1598 |

Comportamiento:

- **Bucle** garantizado por triple vía: atributo `loop`, evento `ended` que reinicia, y evento `pause` que reanuda si el navegador lo detiene por su cuenta.
- **Si el autoplay se bloquea** (modo ahorro de energía en iOS, ajustes del navegador), queda el póster visible y se reintenta en la primera interacción del usuario.
- **Si el vídeo no carga** → degradado verde con luz dorada. No se rompe nada.
- **Al volver a la pestaña** se reanuda la reproducción.
- **Con `prefers-reduced-motion`** → póster fijo, sin reproducir.
- **Velo superior** para que el nav en blanco se lea sobre zonas claras del vídeo.

Como el `<h1>` visible desapareció, hay un `<h1 class="sr">` oculto: sin él la página perdería su encabezado principal para buscadores y lectores de pantalla.

### Si cambias los vídeos

Comprime antes de subirlos. Los originales pesaban 90 MB cada uno; así quedaron en ~5 MB:

```bash
# Escritorio
ffmpeg -i original.mp4 -an -vf "scale=-2:864,fps=25" \
  -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart hero.mp4

# Móvil
ffmpeg -i original-vertical.mp4 -an -vf "scale=900:-2,fps=25" \
  -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart hero-mobile.mp4

# Pósters
ffmpeg -i hero.mp4 -frames:v 1 -q:v 6 hero-poster.jpg
```

`-an` quita el audio (el autoplay solo funciona en silencio) y `+faststart` permite que empiece a reproducirse antes de descargarse completo.

### Aviso sobre el vídeo actual

El metraje montado es **provisional, para presentación interna**. Dos cosas a corregir en el definitivo:

1. Rotula **«Mérida - Venezuela»**, cuando la empresa es del **Zulia**, que es lo que dice toda la web.
2. **No incrustes texto en el vídeo.** El rótulo centrado se recorta en móvil, porque los teléfonos son más estrechos (9:19.5) que el vídeo (9:16) y `object-fit: cover` come los laterales. Si el texto va en HTML en lugar de quemado en el vídeo, se mantiene nítido, no se recorta nunca y los buscadores lo leen.

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
