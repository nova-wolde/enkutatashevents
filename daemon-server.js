const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PID_FILE = '/tmp/enkutatash-server.pid';
const LOG_FILE = '/tmp/enkutatash-server.log';

// Check if already running
try {
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
  try { process.kill(pid, 0); console.log(`Server already running (PID ${pid})`); process.exit(0); } catch(e) {}
} catch(e) {}

// Spawn the actual server as a detached child
const child = spawn('node', [path.join(__dirname, 'server.js')], {
  cwd: __dirname,
  env: { ...process.env, PORT: '3000' },
  detached: true,
  stdio: ['ignore', fs.openSync(LOG_FILE, 'a'), fs.openSync(LOG_FILE, 'a')],
});

fs.writeFileSync(PID_FILE, String(child.pid));
child.unref();

console.log(`Server daemonized (PID ${child.pid})`);
