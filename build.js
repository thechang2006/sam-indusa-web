/* ============================================================
   build.js — Grupo Indusa
   Estampa los parciales de src/partials en cada página de src/pages
   y escribe HTML estático en dist/. Sin dependencias: solo Node.

   Uso:  node build.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT     = __dirname;
const SRC      = path.join(ROOT, 'src');
const PARTIALS = path.join(SRC, 'partials');
const PAGES    = path.join(SRC, 'pages');
const DIST     = path.join(ROOT, 'dist');

const SITE = {
  url:      'https://grupoindusa.com',
  name:     'Grupo Indusa',
  /* Provisional hasta que llegue el og-social.jpg definitivo de 1200×630.
     Las redes sociales no aceptan SVG, así que aquí no vale un marcador. */
  ogImage:  'assets/campo-a-mesa.jpg',
  locale:   'es_VE'
};

/* CSS y JS que carga TODA página. Lo específico se declara en el
   bloque <!--meta--> de cada página. */
const CORE_CSS = ['tokens', 'base', 'layout', 'buttons', 'nav', 'footer', 'reveal'];
const CORE_JS  = ['core', 'nav', 'reveal'];

const AVISO = '<!-- GENERADO POR build.js · NO EDITAR ·'
            + ' edita src/ y ejecuta: node build.js -->';

/* ---------- utilidades ---------- */
const read = f => fs.readFileSync(f, 'utf8');

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    entry.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

/* Lee el bloque <!--meta { ... } --> del principio de una página */
function parsePage(raw, file) {
  const m = raw.match(/^\s*<!--\s*meta\s*([\s\S]*?)-->/);
  if (!m) throw new Error(`${file}: falta el bloque <!--meta ... --> al principio`);
  let meta;
  try {
    meta = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`${file}: el bloque meta no es JSON válido — ${e.message}`);
  }
  return { meta, body: raw.slice(m[0].length).trim() };
}

/* Marca el enlace activo del menú sin una línea de JavaScript */
function markCurrent(header, navKey) {
  if (!navKey) return header;
  return header.replace(
    new RegExp(`(<a\\b[^>]*\\bdata-nav="${navKey}")`, 'g'),
    '$1 aria-current="page"'
  );
}

/* ---------- construcción ---------- */
function build() {
  const head    = read(path.join(PARTIALS, 'head.html'));
  const icons   = read(path.join(PARTIALS, 'icons.html'));
  const header  = read(path.join(PARTIALS, 'header.html'));
  const footer  = read(path.join(PARTIALS, 'footer.html'));

  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  const files = fs.readdirSync(PAGES).filter(f => f.endsWith('.html') && !f.startsWith('_'));
  if (!files.length) throw new Error('No hay páginas en src/pages/');

  const built = [];

  for (const file of files) {
    const { meta, body } = parsePage(read(path.join(PAGES, file)), file);
    const slug = file.replace(/\.html$/, '');

    const cssFiles = CORE_CSS.concat(meta.css || []);
    const jsFiles  = CORE_JS.concat(meta.js  || []);

    const cssTags = cssFiles
      .map(n => `<link rel="stylesheet" href="assets/css/${n}.css">`)
      .join('\n  ');
    const jsTags = jsFiles
      .map(n => `<script src="assets/js/${n}.js" defer></script>`)
      .join('\n  ');

    const canonical = slug === 'index' ? SITE.url + '/' : `${SITE.url}/${slug}`;

    const filledHead = head
      .replace(/\{\{TITLE\}\}/g,       meta.title)
      .replace(/\{\{DESCRIPTION\}\}/g, meta.description)
      .replace(/\{\{CANONICAL\}\}/g,   canonical)
      .replace(/\{\{ROBOTS\}\}/g,      meta.noindex ? '<meta name="robots" content="noindex">' : '')
      .replace(/\{\{OG_IMAGE\}\}/g,    `${SITE.url}/${meta.ogImage || SITE.ogImage}`)
      .replace(/\{\{SITE_NAME\}\}/g,   SITE.name)
      .replace(/\{\{LOCALE\}\}/g,      SITE.locale)
      .replace(/\{\{CSS\}\}/g,         cssTags)
      .replace(/\{\{JS\}\}/g,          jsTags)
      .replace(/\{\{SCHEMA\}\}/g,      meta.schema
        ? `<script type="application/ld+json">\n${read(path.join(PARTIALS, meta.schema))}\n</script>`
        : '');

    const html = [
      '<!DOCTYPE html>',
      '<html lang="es-VE">',
      AVISO,
      '<head>',
      filledHead.trim(),
      '</head>',
      `<body${meta.bodyClass ? ` class="${meta.bodyClass}"` : ''}>`,
      '',
      '<a class="skip" href="#main">Saltar al contenido</a>',
      '',
      icons.trim(),
      '',
      markCurrent(header, meta.nav).trim(),
      '',
      '<main id="main">',
      body,
      '</main>',
      '',
      footer.trim(),
      '',
      '</body>',
      '</html>',
      ''
    ].join('\n');

    fs.writeFileSync(path.join(DIST, file), html, 'utf8');
    built.push({ slug, canonical, bytes: Buffer.byteLength(html) });
  }

  /* Recursos y archivos de raíz tal cual */
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
  const STATIC = path.join(SRC, 'static');
  if (fs.existsSync(STATIC)) {
    for (const f of fs.readdirSync(STATIC)) {
      fs.copyFileSync(path.join(STATIC, f), path.join(DIST, f));
    }
  }

  /* Sitemap generado a partir de las páginas reales: nunca se queda obsoleto.
     Se excluyen 404 y las legales, que no aportan nada en búsqueda. */
  const FUERA = new Set(['404', 'privacidad', 'terminos']);
  const urls = built
    .filter(b => !FUERA.has(b.slug))
    .map(b => `  <url>\n    <loc>${b.canonical}</loc>\n    <priority>${b.slug === 'index' ? '1.0' : '0.8'}</priority>\n  </url>`)
    .join('\n');
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8'
  );

  return built;
}

try {
  const built = build();
  console.log(`\n  dist/ — ${built.length} páginas\n`);
  for (const b of built) {
    console.log(`  ${(b.slug + '.html').padEnd(22)} ${String(Math.round(b.bytes / 1024)).padStart(4)} KB   ${b.canonical}`);
  }
  console.log('');
} catch (e) {
  console.error('\n  ✗ ' + e.message + '\n');
  process.exit(1);
}
