#!/bin/bash
# Capture admin UI screenshots (desktop + mobile) in a single session.
# Usage: bash scripts/capture-admin.sh <outdir> [prefix]
set -e
cd /home/z/my-project/enkutatashevents
PORT=8799
OUT=${1:-/home/z/my-project/scripts}
PREFIX=${2:-admin}

# 1) Local redis shim
node scripts/dev-redis-shim.mjs > /tmp/shim.log 2>&1 &
SPID=$!
cleanup() { kill $SPID 2>/dev/null; pkill -f "wrangler dev" 2>/dev/null; true; }
trap cleanup EXIT

# 2) Seed local shim with real prod data (site-content, events, bookings, etc.)
node scripts/seed-local-from-prod.mjs > /tmp/seed.log 2>&1 || echo "seed failed (continuing)"

# 3) vinext dev server (loads .env at runtime — route handlers see process.env)
npx vinext dev --port $PORT > /tmp/wd.log 2>&1 &
for i in $(seq 1 90); do curl -sf "http://localhost:$PORT/" > /dev/null 2>&1 && break; sleep 1; done
curl -sf "http://localhost:$PORT/" > /dev/null || { echo "SERVER FAILED"; tail -30 /tmp/wd.log; exit 1; }
echo "server up after ${i}s"

# 4) Browser: login flow
agent-browser open "http://localhost:$PORT/admin" > /dev/null
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 4000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null
agent-browser wait 1200 > /dev/null
# Dismiss cookie banner if present
cat > /tmp/cookie.js << 'EOF'
(() => {
  const b = [...document.querySelectorAll('button')].find(x => /accept all cookies/i.test(x.textContent));
  if (b) { b.click(); return 'accepted'; }
  return 'no banner';
})()
EOF
agent-browser eval "$(cat /tmp/cookie.js)" > /dev/null
agent-browser wait 600 > /dev/null
agent-browser screenshot $OUT/${PREFIX}-login.png > /dev/null

cat > /tmp/login.js << 'EOF'
const input = document.querySelector('#password');
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
setter.call(input, 'admin-test-2026');
input.dispatchEvent(new Event('input', { bubbles: true }));
'set';
EOF
agent-browser eval "$(cat /tmp/login.js)" > /dev/null
agent-browser wait 300 > /dev/null
cat > /tmp/submit.js << 'EOF'
const btn = [...document.querySelectorAll('button')].find(b => b.textContent.toLowerCase().includes('sign in'));
btn?.click(); 'submitted';
EOF
agent-browser eval "$(cat /tmp/submit.js)" > /dev/null
agent-browser wait 4500 > /dev/null

# 5) Desktop screenshots per view
capture_view() {
  local label=$1
  agent-browser screenshot $OUT/${PREFIX}-${label}.png > /dev/null
}
capture_view dashboard
agent-browser eval "localStorage.setItem('admin-current-view','events'); 'ok'" > /dev/null 2>&1 || true
navigate() {
  local label=$1
  cat > /tmp/nav.js << EOF
(() => {
  const btns = [...document.querySelectorAll('aside button, [role=dialog] button')];
  const b = btns.find(x => x.textContent.trim().toLowerCase().startsWith('${label}'));
  if (b) { b.click(); return 'clicked ${label}'; }
  return 'NOT FOUND ${label}';
})()
EOF
  agent-browser eval "$(cat /tmp/nav.js)"
  agent-browser wait 1500 > /dev/null
}
navigate 'events'
capture_view events
navigate 'bookings'
capture_view bookings
navigate 'messages'
capture_view messages
navigate 'content'
capture_view content
navigate 'analytics'
capture_view analytics
navigate 'settings'
capture_view settings

# 6) Mobile screenshots
agent-browser set viewport 390 844 > /dev/null
agent-browser wait 800 > /dev/null
capture_view mobile-settings
cat > /tmp/mobmenu.js << 'EOF'
const mb = document.querySelector('header button.md\\:hidden, header button');
mb?.click(); 'opened';
EOF
agent-browser eval "$(cat /tmp/mobmenu.js)" > /dev/null
agent-browser wait 800 > /dev/null
capture_view mobile-sidebar
agent-browser close > /dev/null
echo CAPTURE-DONE
