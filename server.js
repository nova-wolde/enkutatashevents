const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Static file serving
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

function serveStatic(req, res, filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

async function startServer() {
  const next = require('next');
  const app = next({ dev: false });
  const handle = app.getRequestHandler();

  await app.prepare();
  console.log('Next.js prepared');

  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve static files directly
      if (pathname) {
        const filePath = path.join(__dirname, 'public', pathname);
        if (serveStatic(req, res, filePath)) return;
      }

      // Let Next.js handle everything else
      handle(req, res).catch(err => {
        console.error('Next.js error:', err.message);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      });
    } catch (err) {
      console.error('Server error:', err.message);
      if (!res.headersSent) {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    }
  });

  server.listen(3000, '0.0.0.0', () => {
    console.log('> Server ready on http://localhost:3000');
  });

  // Keep process alive
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err.message);
  });
  
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
  });
}

startServer().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
