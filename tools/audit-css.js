/* ============================================================
   tools/audit-css.js — trampas de CSS que solo se notan en el móvil

   Busca dos cosas:
   1. Reglas :hover que esconden o desactivan algo.
   2. Reglas :hover que ganan a una regla de estado (.is-open, aria-*)
      sobre el mismo elemento.

   Por qué importa: en un teléfono, al tocar un elemento el :hover se
   queda pegado. Si esa regla pesa más que la del estado, el componente
   deja de funcionar. Así se rompió el submenú «Nuestras marcas»:
   `.has-sub:hover .subnav:not(.is-open){display:none}` pesaba (0,4,0),
   por encima de `.has-sub.is-open .subnav` (0,3,0) — el :not() suma.

   Uso:  node tools/audit-css.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'assets', 'css');

/* Especificidad [ids, clases/pseudoclases/atributos, elementos] */
function esp(sel) {
  const s = sel.replace(/:not\(([^)]*)\)/g, ' $1 ');   // :not() aporta lo de dentro
  return [
    (s.match(/#[\w-]+/g) || []).length,
    (s.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) || []).length,
    (s.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length
  ];
}
const mayor = (a, b) => a[0] !== b[0] ? a[0] > b[0]
                      : a[1] !== b[1] ? a[1] > b[1]
                      : a[2] > b[2];

/* El elemento al que apunta la regla: el último compuesto, normalizado.
   Se quitan las pseudo-clases (:hover, :not(...)) para poder comparar
   «.subnav» con «.subnav:hover» y ver que son el mismo elemento. */
function sujeto(sel) {
  const ultimo = (sel.trim().split(/\s*[>+~]\s*|\s+/).pop() || '')
    .replace(/::?[\w-]+(\([^)]*\))?/g, '');
  return (ultimo.match(/^[a-z][\w-]*|\.[\w-]+|#[\w-]+|\[[^\]]+\]/gi) || [])
    .sort().join('');
}

/* ¿Es una regla de ESTADO? Solo si la clase de estado está fuera de :not().
   Dentro de :not() significa justo lo contrario y no es un estado. */
function esEstado(sel) {
  const sinNot = sel.replace(/:not\([^)]*\)/g, '');
  return /\.is-open|\[aria-(selected|expanded|current)/.test(sinNot);
}

const props = cuerpo => [...cuerpo.matchAll(/(^|;)\s*([a-z-]+)\s*:/g)].map(m => m[2]);

const hallazgos = [];

for (const file of fs.readdirSync(DIR).filter(f => f.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(DIR, file), 'utf8')
                .replace(/\/\*[\s\S]*?\*\//g, '');

  const reglas = [];
  let orden = 0;
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (m[1].trim().startsWith('@') || !m[2].trim()) continue;
    for (const sel of m[1].split(',')) {
      reglas.push({ orden: orden++, sel: sel.trim().replace(/\s+/g, ' '), cuerpo: m[2].trim() });
    }
  }

  for (const h of reglas) {
    if (!/:hover/.test(h.sel)) continue;

    if (/display\s*:\s*none|visibility\s*:\s*hidden|pointer-events\s*:\s*none/.test(h.cuerpo)) {
      hallazgos.push(`${file}: un :hover esconde algo → ${h.sel}`);
    }

    const sh = sujeto(h.sel), ph = props(h.cuerpo);
    for (const e of reglas) {
      if (e === h || /:hover/.test(e.sel) || !esEstado(e.sel)) continue;
      if (sujeto(e.sel) !== sh) continue;
      const choque = ph.filter(p => props(e.cuerpo).includes(p));
      if (!choque.length) continue;
      const a = esp(h.sel), b = esp(e.sel);
      if (mayor(a, b) || (!mayor(b, a) && h.orden > e.orden)) {
        hallazgos.push(
          `${file}: el :hover gana al estado en «${choque.join(', ')}»\n` +
          `      hover  [${a}] ${h.sel}\n` +
          `      estado [${b}] ${e.sel}\n` +
          `      → en táctil el :hover se queda pegado y anula el estado`
        );
      }
    }
  }
}

console.log(hallazgos.length
  ? '\n' + [...new Set(hallazgos)].map(x => '  ✗ ' + x).join('\n') + '\n'
  : '\n  ✓ ningún :hover esconde nada ni pisa a una regla de estado\n');
process.exit(hallazgos.length ? 1 : 0);
