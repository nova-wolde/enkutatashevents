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
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
};

function serveStatic(req, res, filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch (err) {
    console.error('Static serve error:', err.message);
    return false;
  }
}

async function startServer() {
  const next = require('next');
  const app = next({ dev: false });
  const handle = app.getRequestHandler();

  await app.prepare();
  console.log('Next.js prepared');

  const server = createServer((req, res) => {
    // Handle client disconnection gracefully
    req.on('error', (err) => {
      console.error('Request error:', err.message);
    });
    res.on('error', (err) => {
      console.error('Response error:', err.message);
    });

    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve static files directly
      if (pathname) {
        const filePath = path.join(__dirname, 'public', pathname);
        if (serveStatic(req, res, filePath)) return;
      }

      // Let Next.js handle everything else
      handle(req, res, parsedUrl).catch(err => {
        console.error('Next.js handler error:', err.message);
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

  server.on('error', (err) => {
    console.error('Server error event:', err.message);
  });

  // Keep process alive - log but don't exit on uncaught errors
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err.message, err.stack);
  });
  
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
  });
}

startServer().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
