/* ============================================================
   tools/placeholders.js
   Genera un SVG por cada foto que aún no tenemos, con su medida
   escrita encima. Así ninguna página sale rota y se ve de un vistazo
   qué material falta.

   Uso:  node tools/placeholders.js
   Cuando llegue la foto real: guárdala en assets/ y cambia la ruta
   en el src/pages/... correspondiente (de assets/ph/x.svg a assets/x.jpg).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'ph');

const FALTAN = [
  ['fundador',           950, 1024, 'Retrato del fundador',        'Vertical, fondo limpio'],

  /* Las piezas del flyer. Van RECORTADAS, sobre fondo transparente:
     el panel de color se ve por detrás, como en corp-inveca.com. */
  ['sam-grupo',         1400,  900, 'Flyer Tostones Sam',          'PNG transparente · las 3 presentaciones juntas'],
  ['sharitos-grupo',    1400,  900, 'Flyer Sharitos',              'PNG transparente · productos juntos'],
  ['logo-sharitos',     1024,  300, 'Logo Sharitos',               'SVG o PNG transparente, horizontal'],
  ['sharitos-producto',  900, 1100, 'Empaque Sharitos',            'PNG con fondo transparente'],

  /* Las tres presentaciones de Sharitos, para su configurador.
     Mismo encuadre que producto-30g/80g/150g de Tostones Sam. */
  ['sharitos-30',        900,  900, 'Empaque Sharitos 30 g',       'Mismo encuadre que producto-30g.jpg'],
  ['sharitos-80',        900,  900, 'Empaque Sharitos 80 g',       'Mismo encuadre que producto-80g.jpg'],
  ['sharitos-150',       900,  900, 'Empaque Sharitos 150 g',      'Mismo encuadre que producto-150g.jpg'],
  ['equipo',            1600, 1067, 'Equipo en planta',            'Personal trabajando'],
  ['planta',            1600, 1067, 'Vista general de la planta',  'El Vigía, Mérida'],
  ['proceso-01',        1600, 1067, '01 · Selección materia prima','Plátano recién llegado del campo'],
  ['proceso-02',        1600, 1067, '02 · Pesado',                 'Balanza de recepción'],
  ['proceso-03',        1600, 1067, '03 · Pelado',                 'Pelado manual con cuchillo'],
  ['proceso-04',        1600, 1067, '04 · Cortado',                'Cortadora en operación'],
  ['proceso-05',        1600, 1067, '05 · Freído',                 'Freidora industrial'],
  ['proceso-06',        1600, 1067, '06 · Sazonado',               'Aplicación de saborizantes'],
  ['proceso-07',        1600, 1067, '07 · Selección',              'Banda transportadora'],
  ['proceso-08',        1600, 1067, '08 · Empacado',               'Empacadoras digitales'],
  ['proceso-09',        1600, 1067, '09 · Almacenado y despacho',  'Almacén y carga'],
  ['og-social',         1200,  630, 'Imagen para redes sociales',  'Logo + producto'],
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

fs.mkdirSync(OUT, { recursive: true });

for (const [name, w, h, titulo, nota] of FALTAN) {
  const base = Math.min(w, h);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(titulo)} — pendiente">
  <rect width="${w}" height="${h}" fill="#EEF7F2"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none"
        stroke="#1B6B38" stroke-opacity=".35" stroke-width="3" stroke-dasharray="16 12" rx="18"/>
  <g font-family="Inter, system-ui, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h / 2 - base * 0.09}" font-size="${base * 0.055}" font-weight="700"
          fill="#B71C1C" letter-spacing="${base * 0.006}">FALTA ESTA FOTO</text>
    <text x="${w / 2}" y="${h / 2 + base * 0.005}" font-size="${base * 0.062}" font-weight="700"
          fill="#0D381E">${esc(titulo)}</text>
    <text x="${w / 2}" y="${h / 2 + base * 0.075}" font-size="${base * 0.04}"
          fill="#5B6B62">${esc(nota)}</text>
    <text x="${w / 2}" y="${h / 2 + base * 0.15}" font-size="${base * 0.045}" font-weight="600"
          fill="#1B6B38">${w} × ${h} px</text>
  </g>
</svg>
`;
  fs.writeFileSync(path.join(OUT, name + '.svg'), svg, 'utf8');
  console.log(`  ${name}.svg`.padEnd(28) + `${w}×${h}  ${titulo}`);
}

console.log(`\n  ${FALTAN.length} marcadores en assets/ph/\n`);
