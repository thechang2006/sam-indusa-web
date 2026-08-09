/* ============================================================
   tools/serve.js — servidor local para ver dist/ como se verá online
   Reproduce las URLs limpias del .htaccess (/nosotros → nosotros.html)
   para que lo que pruebas en local sea lo que verás en Hostinger.

   Uso:  node build.js && node tools/serve.js   →  http://localhost:4173
   ============================================================ */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8'
};

if (!fs.existsSync(DIST)) {
  console.error('No existe dist/. Ejecuta primero: node build.js');
  process.exit(1);
}

http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split('?')[0]);
  if (ruta === '/') ruta = '/index.html';

  let archivo = path.join(DIST, ruta);

  /* URL limpia: /nosotros → nosotros.html, igual que hará el .htaccess */
  if (!path.extname(archivo) && fs.existsSync(archivo + '.html')) archivo += '.html';

  /* Nunca salir de dist/ */
  if (!archivo.startsWith(DIST)) {
    res.writeHead(403).end('403');
    return;
  }

  if (!fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
    const p404 = path.join(DIST, '404.html');
    if (fs.existsSync(p404)) {
      res.writeHead(404, { 'Content-Type': TIPOS['.html'] }).end(fs.readFileSync(p404));
    } else {
      res.writeHead(404, { 'Content-Type': TIPOS['.html'] })
         .end('<h1>404</h1><p>No existe ' + ruta + '</p>');
    }
    return;
  }

  res.writeHead(200, {
    'Content-Type': TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(archivo).pipe(res);
}).listen(PORT, () => {
  console.log(`\n  Grupo Indusa en  http://localhost:${PORT}\n  (Ctrl+C para parar)\n`);
});
