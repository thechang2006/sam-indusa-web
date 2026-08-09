# Grupo Indusa — Web oficial

Sitio corporativo de **Grupo Indusa**, con sus marcas **Tostones Sam** y **Sharitos**.
Plátano chips y snacks salados naturales, producidos en El Vigía, Estado Mérida, Venezuela.

Sitio estático: HTML, CSS y JavaScript sin frameworks ni dependencias externas.
Lo único que necesita es Node para construir. Recursos externos: Google Fonts y
Leaflet (este último solo se descarga cuando el mapa entra en pantalla).

Dominio previsto: **grupoindusa.com** · Alojamiento: **Hostinger**

## Empezar

```bash
node build.js
```

```bash
node tools/serve.js
```

Abre http://localhost:4173

## Comprobar antes de subir

```bash
node tools/check.js
```

## Publicar la vista previa en GitHub Pages

```bash
node build.js && node tools/check.js && node tools/publish.js
```

GitHub Pages publica desde la **raíz de `main`**, así que `publish.js` copia ahí
los HTML construidos. Por eso los `.html` de la raíz **son salida generada**:
no se editan a mano, se edita `src/` y se reconstruye.

Vista previa: https://thechang2006.github.io/sam-indusa-web/

Para Hostinger no se usa la raíz sino el contenido de `dist/`, que además
incluye el `.htaccess` con las URLs limpias.

## Páginas

| URL | Qué contiene |
|---|---|
| `/` | Vídeo hero, las dos marcas, resumen del proceso, sobre nosotros |
| `/marcas` | Hub con las dos marcas |
| `/tostones-sam` | Configurador de presentación y sabor, sellos, preguntas |
| `/sharitos` | Ficha de marca |
| `/elaboracion` | Los 9 pasos del proceso productivo, con foto por paso |
| `/mayoristas` | Formulario de cotización y preguntas de distribución |
| `/nosotros` | Historia, valores, equipo y planta |
| `/contacto` | Direcciones, mapa y vías de contacto |
| `/privacidad` `/terminos` | Legales |
| `/404` | Página de error con mapa del sitio |

## Dónde tocar cada cosa

Está todo en **[ARQUITECTURA.md](ARQUITECTURA.md)**, con una tabla de
«quiero cambiar X → toca Y». Empieza siempre por ahí.

Regla corta: **nunca edites `dist/`**, se regenera en cada build.
El menú y el pie viven en `src/partials/`, una sola vez para las 11 páginas.

## El hero con vídeo

Solo la portada. Vídeo a pantalla completa (100dvh) en bucle infinito, silenciado
y sin texto superpuesto, porque el propio vídeo lleva su rotulación incrustada.

Hay dos archivos y **solo se descarga uno**: `assets/js/hero.js` elige según el
ancho de pantalla, con el umbral en 860 px.

| | Archivo | Resolución |
|---|---|---|
| Escritorio | `hero.mp4` | 1866×864 |
| Móvil | `hero-mobile.mp4` | 900×1598 |

Si el autoplay se bloquea queda el póster y se reintenta a la primera interacción.
Si el vídeo no carga, degradado verde. Con `prefers-reduced-motion`, póster fijo.

> **Pendiente de optimizar:** los dos vídeos pesan ~5 MB cada uno. Conviene
> recomprimirlos a ≤2,5 MB y añadir versión `.webm` antes de publicar.

## Fotos pendientes

Las páginas muestran marcadores con la medida escrita encima donde falta material.
`node tools/check.js` lleva la cuenta. Para regenerarlos o añadir uno nuevo:
`node tools/placeholders.js`.

## `_legacy/`

La web anterior de una sola página, guardada por si hiciera falta consultar algo.
No se publica.
