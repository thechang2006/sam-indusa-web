# Arquitectura — Grupo Indusa

Guía rápida para tocar el sitio sin tener que abrirlo entero.
**Empieza siempre por la tabla de abajo.**

---

## Quiero cambiar… → toca este archivo

| Quiero cambiar | Archivo |
|---|---|
| Un color, la tipografía, sombras, redondeos | `assets/css/tokens.css` |
| Cualquier botón | `assets/css/buttons.css` |
| Los paneles de marca (los flyers) | `assets/css/flyer.css` |
| La línea de tiempo de `/nosotros` | `src/pages/nosotros.html` (solo HTML) |
| El crédito de autoría del pie | `src/partials/footer.html` |
| El menú, sus enlaces o el desplegable de marcas | `src/partials/header.html` + `assets/css/nav.css` |
| El pie de página | `src/partials/footer.html` + `assets/css/footer.css` |
| Dirección, teléfono, correo, horario | `src/partials/footer.html` y `src/pages/contacto.html` |
| El texto de una página concreta | `src/pages/<esa-pagina>.html` |
| Título y descripción para Google de una página | bloque `<!--meta-->` al principio de esa página |
| Los sabores o presentaciones del configurador | `assets/js/configurador.js` |
| Los 9 pasos del proceso | `src/pages/elaboracion.html` |
| Las coordenadas del mapa | `assets/js/map.js` (objeto `OFICINA`) |
| A dónde llega el formulario | `assets/js/core.js` (constante `FORMSPREE`) |
| El número de WhatsApp | `assets/js/core.js` (constante `WA`) |
| Los datos de empresa para Google (schema) | `src/partials/schema-org.json` |
| Redirecciones, caché, HTTPS | `src/static/.htaccess` |
| Las fotos que faltan | `tools/placeholders.js` |

**Nunca edites `dist/`.** Se borra y se regenera en cada build.

---

## Los tres comandos

```bash
node build.js
```
Genera `dist/` a partir de `src/` + `assets/`. Es lo que se sube a Hostinger.

```bash
node tools/serve.js
```
Sirve `dist/` en http://localhost:4173 imitando las URLs limpias de Hostinger.

```bash
node tools/check.js
```
Busca enlaces rotos, imágenes que faltan, iconos no definidos e ids duplicados.
Sale con error si encuentra algo, así que sirve para no subir nada roto.

---

## Cómo está organizado

```
src/
  partials/          Se estampan en TODAS las páginas
    head.html          <head> con marcadores {{TITLE}}, {{CSS}}, {{JS}}…
    header.html        El menú. Se edita UNA vez.
    footer.html        El pie. Se edita UNA vez.
    icons.html         Sprite SVG (todos los iconos <use href="#i-…">)
    schema-org.json    Datos de empresa para buscadores
  pages/             Solo el contenido de <main> de cada página
  static/            Se copian tal cual a dist/ (.htaccess, robots.txt)

assets/
  css/               Un archivo por responsabilidad (ver tabla arriba)
  js/                Un archivo por función
  ph/                Marcadores de las fotos que faltan

build.js             Motor de construcción, sin dependencias
tools/               serve.js · check.js · placeholders.js
dist/                GENERADO — no editar
_legacy/             La web anterior de una sola página, por si acaso
```

### El bloque `<!--meta-->`

Cada página de `src/pages/` empieza con uno. Es lo que decide su `<title>`,
su descripción y qué CSS y JS carga:

```html
<!--meta
{
  "title": "…",              título en la pestaña y en Google
  "description": "…",        descripción en Google
  "nav": "nosotros",         marca el enlace activo del menú
  "bodyClass": "has-hero",   solo la portada, que lleva vídeo a pantalla completa
  "css": ["page-hero"],      además de los comunes
  "js": ["map"],             además de los comunes
  "schema": "schema-org.json",
  "noindex": true            para páginas que no deben salir en Google
}
-->
```

Comunes en todas las páginas: CSS `tokens, base, layout, buttons, nav, footer, reveal`
y JS `core, nav, reveal`. Se definen arriba de `build.js`.

### Cómo funciona el JavaScript

`core.js` publica `window.SAM` con las utilidades (`$`, `$$`, `waLink`, `reduce`)
y **un solo bucle de scroll y resize** para toda la página. Cada módulo se apunta
con `SAM.onScroll(fn)` / `SAM.onResize(fn)` en vez de registrar su propio listener.

Cada módulo empieza declarando lo que usa:

```js
var $ = SAM.$, $$ = SAM.$$, waLink = SAM.waLink;
```

Si añades un módulo y usas algo de `SAM` sin declararlo ahí, fallará en tiempo
de ejecución. Todos los `<script>` van con `defer`, así que el DOM ya está listo.

---

## Los flyers de marca

Son los paneles de color a sangre completa de la portada y de `/marcas`.
Copian el patrón de corp-inveca.com: fondo de color de borde a borde, producto
**recortado y sin marco**, logo de la marca como imagen y texto real al lado.

```html
<section class="flyer flyer--sam" aria-labelledby="sam-t">
  <div class="wrap flyer-in">
    <div class="flyer-copy">
      <p class="eyebrow">Nuestras marcas</p>
      <h2 class="flyer-logo" id="sam-t"><img src="assets/logo.png" alt="Tostones Sam"></h2>
      <p class="lede">…</p>
      <ul class="seals">…</ul>
      <div class="btn-row"><a class="btn" href="…">Conoce más</a></div>
    </div>
    <div class="flyer-art">
      <img class="flyer-pack" src="assets/sam-grupo.png" alt="…">
    </div>
  </div>
</section>
```

El logo va **dentro del `<h2>`**: se ve la marca y el encabezado sigue existiendo
para Google. INVECA no tiene encabezados en esos bloques; esto es mejor.

### Modificadores

| Clase | Qué hace |
|---|---|
| `flyer--sam` · `flyer--sharitos` | Colores de esa marca. Para una marca nueva, copia uno de los dos bloques al final de `flyer.css` |
| `flyer--dark` | Texto claro sobre panel oscuro. Ajusta también los sellos |
| `flyer--art-left` | Pone el arte a la izquierda. No depende del orden en el HTML |
| `flyer--bleed` | El producto se sale del panel por el lado, como el bodegón de Salseritos |
| `flyer-pack--knockout` | Recorte de emergencia para fotos con **fondo blanco**: `mix-blend-mode` hace desaparecer el blanco. Solo sobre paneles claros |
| `flyer--full` | El panel entero es **una sola imagen** ya diseñada. El texto se mantiene oculto en HTML para SEO |

### El hueco del diseñador (portada)

En la portada, cada bloque de marca **es entero la pieza del diseñador**, de
borde a borde. No hay media columna de texto y media de imagen: la imagen
ocupa todo. El texto va oculto en el HTML para que Google y los lectores de
pantalla sí lo lean.

Hacen falta **dos archivos por marca**, porque la proporción cambia mucho:

| | Tamaño | Formato |
|---|---|---|
| PC | **2400 × 1100 px** | Horizontal, la banda completa |
| Móvil | **1080 × 1350 px** | Vertical, ocupa el ancho de la pantalla |

JPG o PNG, 72 ppp, menos de 500 KB cada uno. El corte entre uno y otro está
en 900 px de ancho de pantalla.

Cuando lleguen, se sustituye todo el `<div class="flyer-slot flyer-slot--full">`
por esto, que sirve la versión que toque:

```html
<picture>
  <source media="(max-width:900px)" srcset="assets/flyer-sam-movil.png">
  <img src="assets/flyer-sam.png" alt="Tostones Sam — plátano chips en cuatro sabores">
</picture>
```

El bloque entero es un enlace a la página de la marca, así que **el flyer no
necesita llevar botón dibujado**: al pulsar en cualquier punto se navega.

En `/marcas` los bloques sí mantienen texto al lado e imagen de producto,
para que ahí se pueda leer el detalle de cada marca.

### Motivos decorativos

Los adornos sueltos que INVECA reparte alrededor (trompeta, maracas, güiro).
El CSS ya los soporta; se colocan con variables en el propio HTML:

```html
<img class="flyer-motif" src="assets/motivo-hoja.svg" alt="" aria-hidden="true"
     style="--x:6%; --y:14%; --w:120px; --r:-12deg; --o:.85">
```

`--x` `--y` posición · `--w` ancho · `--r` giro · `--o` opacidad.
Se ocultan solos en móvil. Mientras no haya archivos, el panel usa un
degradado de luz por CSS, así que no se ve vacío.

### Si prefieres diseñar el flyer entero en Canva

Usa `flyer--full` y una sola imagen de 2400 px de ancho. Pierdes que el texto
se adapte al móvil y que Google lo lea como texto, así que solo lo recomiendo
para campañas puntuales, no para los bloques permanentes.

---

## La línea de tiempo de /nosotros

Es interactiva: cada año es una pestaña que abre su panel. Funciona con ratón,
con teclado (flechas, Inicio, Fin) y con lector de pantalla.

**Para añadir o cambiar un hito solo se toca el HTML** de `src/pages/nosotros.html`.
Un botón en el raíl y su panel, enlazados por `id`:

```html
<!-- en .tline-rail -->
<button class="tline-year" role="tab" id="y-2027"
        aria-controls="h-2027" aria-selected="false" tabindex="-1">2027</button>

<!-- en .tline-panels -->
<div class="tline-panel" role="tabpanel" id="h-2027" aria-labelledby="y-2027" tabindex="0">
  <span class="tline-badge">2027</span>
  <h3>Título del hito</h3>
  <p>Qué pasó.</p>
</div>
```

`assets/js/timeline.js` los recoge solos: no hay que tocarlo. El relleno de
color del raíl se calcula según cuántos años haya.

La clase `tline-year--pend` marca los años que aún no tienen texto (punto de
línea discontinua). Quítala cuando lo redactes.

---

## Sustituir una foto pendiente

Las páginas apuntan a `assets/ph/<algo>.svg`, que son marcadores con la medida
escrita encima. Cuando tengas la foto real:

1. Guárdala en `assets/` con el nombre que quieras, p. ej. `assets/fundador.jpg`.
2. Busca `assets/ph/fundador.svg` en `src/pages/` y cámbialo por `assets/fundador.jpg`.
3. `node build.js`

`node tools/check.js` te dice cuántas fotos siguen pendientes en cada página.

---

## Subir a Hostinger

1. `node build.js && node tools/check.js`
2. Sube **el contenido de `dist/`** a `public_html` (no la carpeta `dist` en sí).
3. Incluye el `.htaccess` — el gestor de archivos de Hostinger oculta los
   archivos que empiezan por punto; actívalos en su menú de opciones.

`src/`, `tools/`, `build.js` y `_legacy/` **no** se suben.

---

## Pendiente de confirmar

Todo lo que hay que rellenar está marcado en amarillo en la web y aparece en
`node tools/check.js` como «dato(s) por confirmar»:

- Formas de pago aceptadas y pedido mínimo (`src/pages/mayoristas.html`)
- Coordenadas exactas de la planta (`assets/js/map.js`)
- Fecha y revisión legal de privacidad y términos (`src/pages/privacidad.html`, `terminos.html`)
- Correo definitivo: ahora `mayoristas@grupoindusa.com`
