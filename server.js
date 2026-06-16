const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
};

const server = http.createServer((req, res) => {
    // Decode URL to handle spaces and accents (e.g. cumplea_os_animado_squadgoals)
    let decodedUrl;
    try {
        decodedUrl = decodeURIComponent(req.url);
    } catch (e) {
        decodedUrl = req.url;
    }

    // Default to index.html
    let filePath = decodedUrl === '/' ? '/index.html' : decodedUrl;
    let fullPath = path.join(__dirname, filePath);

    // Security check: ensure path is within the workspace directory
    if (!fullPath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Acceso denegado (Forbidden)');
        return;
    }

    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Archivo no encontrado (404 Not Found)');
            return;
        }

        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(fullPath);
        stream.on('error', (streamErr) => {
            console.error(`Error de lectura en stream: ${streamErr.message}`);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Error interno del servidor (500)');
            }
        });
        stream.pipe(res);
    });
});

function startServer(portToTry) {
    server.listen(portToTry, () => {
        console.log('\n==================================================');
        console.log('   🚀 SQUADGOALS PORTAL - SERVIDOR LOCAL ACTIVO   ');
        console.log('==================================================');
        console.log(`\nServidor corriendo correctamente en:\n`);
        console.log(`   👉  http://localhost:${portToTry}`);
        console.log(`   👉  http://127.0.0.1:${portToTry}`);
        console.log('\nPresiona Ctrl+C para detener el servidor.');
        console.log('==================================================\n');
    });
}

// Error handling for port in use
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Puerto ${PORT} en uso. Probando con puerto ${PORT + 1}...`);
        PORT++;
        startServer(PORT);
    } else {
        console.error('❌ Error del servidor:', err.message);
    }
});

// Start checking from base port
startServer(PORT);
