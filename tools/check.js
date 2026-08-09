/* ============================================================
   tools/check.js — revisa dist/ antes de subir a Hostinger
   Comprueba: enlaces internos rotos, imágenes que no existen,
   iconos del sprite que no están definidos e ids duplicados.

   Uso:  node build.js && node tools/check.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
let fallos = 0;

if (!fs.existsSync(DIST)) {
  console.error('\n  ✗ No existe dist/. Ejecuta primero: node build.js\n');
  process.exit(1);
}

const paginas = fs.readdirSync(DIST).filter(f => f.endsWith('.html'));
const existe = f => fs.existsSync(path.join(DIST, decodeURIComponent(f)));

for (const pagina of paginas) {
  const bruto = fs.readFileSync(path.join(DIST, pagina), 'utf8');
  /* Los comentarios llevan ejemplos de código («sustituye por src="…"»)
     que no son rutas reales. Se descartan antes de comprobar nada. */
  const html = bruto.replace(/<!--[\s\S]*?-->/g, '');
  const problemas = [];

  /* --- enlaces internos --- */
  for (const m of html.matchAll(/\bhref="([^"#:]+\.html)(#[^"]*)?"/g)) {
    if (!existe(m[1])) problemas.push(`enlace roto → ${m[1]}`);
  }

  /* --- anclas dentro de la misma página --- */
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/\bhref="#([^"]+)"/g)) {
    if (m[1] && !ids.has(m[1])) problemas.push(`ancla inexistente → #${m[1]}`);
  }

  /* --- ids duplicados --- */
  const vistos = new Set(), dup = new Set();
  for (const m of html.matchAll(/\bid="([^"]+)"/g)) {
    if (vistos.has(m[1])) dup.add(m[1]);
    vistos.add(m[1]);
  }
  for (const d of dup) problemas.push(`id duplicado → ${d}`);

  /* --- imágenes --- */
  for (const m of html.matchAll(/\bsrc="(assets\/[^"]+)"/g)) {
    if (!existe(m[1])) problemas.push(`imagen ausente → ${m[1]}`);
  }

  /* --- iconos del sprite --- */
  const simbolos = new Set([...html.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/<use href="#(i-[^"]+)"/g)) {
    if (!simbolos.has(m[1])) problemas.push(`icono no definido → #${m[1]}`);
  }

  /* --- marcadores pendientes, como aviso --- */
  const pendientes = (html.match(/<mark>/g) || []).length;
  const placeholders = (html.match(/assets\/ph\//g) || []).length;

  const unicos = [...new Set(problemas)];
  if (unicos.length) {
    fallos += unicos.length;
    console.log(`\n  ✗ ${pagina}`);
    for (const p of unicos) console.log(`      ${p}`);
  } else {
    let nota = '';
    if (pendientes)   nota += `  ${pendientes} dato(s) por confirmar`;
    if (placeholders) nota += `  ${placeholders} foto(s) pendiente(s)`;
    console.log(`  ✓ ${pagina.padEnd(22)}${nota}`);
  }
}

console.log(fallos ? `\n  ${fallos} problema(s)\n` : '\n  Todo correcto\n');
process.exit(fallos ? 1 : 0);
