const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');

const child = spawn('node', [serverPath], {
  cwd: __dirname,
  env: { ...process.env, PORT: '3000' },
  detached: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fs = require('fs');
const logStream = fs.createWriteStream('/tmp/enkutatash-server.log', { flags: 'w' });
child.stdout.pipe(logStream);
child.stderr.pipe(logStream);

child.unref();

console.log(`Daemon started, server PID: ${child.pid}`);
