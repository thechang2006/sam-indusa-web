/* ============================================================
   tools/publish.js — copia la web construida a la raíz del repo
   para que GitHub Pages la sirva.

   GitHub Pages de este repositorio publica desde la raíz de `main`,
   no desde dist/. Este paso copia solo lo que Pages necesita:
   las páginas HTML y los archivos de raíz. `assets/` ya vive en la
   raíz y es el mismo del que bebe el build, así que no se duplica.

   Uso:  node build.js && node tools/publish.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST)) {
  console.error('\n  ✗ No existe dist/. Ejecuta primero: node build.js\n');
  process.exit(1);
}

/* .htaccess NO se copia: es de Apache/Hostinger y en Pages no hace nada. */
const copiar = fs.readdirSync(DIST).filter(f =>
  f.endsWith('.html') || f === 'robots.txt' || f === 'sitemap.xml'
);

for (const f of copiar) {
  fs.copyFileSync(path.join(DIST, f), path.join(ROOT, f));
}

/* Sin esto, GitHub pasa el sitio por Jekyll y puede alterar archivos. */
fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');

console.log(`\n  ${copiar.length} archivos a la raíz para GitHub Pages:\n`);
for (const f of copiar) console.log('  ' + f);
console.log('\n  Recuerda: la raíz es SALIDA. Se edita src/ y se ejecuta el build.\n');
