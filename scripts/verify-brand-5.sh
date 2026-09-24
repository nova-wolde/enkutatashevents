#!/bin/bash
# verify-brand-5.sh — browser-only rerun (server stack assumed started fresh here)
cd /home/z/enkutatashevents
PORT=8799
pkill -f "vinext dev" 2>/dev/null; pkill -f "dev-redis-shim" 2>/dev/null; sleep 1

node scripts/dev-redis-shim.mjs > /tmp/shim.log 2>&1 &
SHIM_PID=$!
sleep 1
node scripts/seed-local-from-prod.mjs > /tmp/seed.log 2>&1 && echo "seeded"

export OWNER_PASSWORD="local-dev-admin"
export UPSTASH_REDIS_REST_URL="http://127.0.0.1:8379"
export UPSTASH_REDIS_REST_TOKEN="local-dev-shim-token"
export NODE_ENV="development"
npx vinext dev --port $PORT > /tmp/vinext-dev.log 2>&1 &
for i in $(seq 1 90); do curl -sf "http://localhost:$PORT/" > /dev/null 2>&1 && break; sleep 1; done
echo "server up (${i}s)"

agent-browser open "http://localhost:$PORT/admin" 2>&1 | head -2
agent-browser wait --load networkidle 2>&1 | head -1 || agent-browser wait 3000 > /dev/null
agent-browser set viewport 1440 900 2>&1 | head -1
agent-browser wait 2000 > /dev/null
echo "PAGE: $(agent-browser eval 'location.href + " | pw:" + !!document.querySelector("#password")' 2>/dev/null | head -1)"
agent-browser eval "(() => { const inp = document.querySelector('#password'); if (!inp) return 'already in'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(inp,'local-dev-admin'); inp.dispatchEvent(new Event('input',{bubbles:true})); [...document.querySelectorAll('button')].find(b=>/sign in/i.test(b.textContent))?.click(); return 'submitted'; })()" 2>/dev/null | head -2
agent-browser wait 4000 > /dev/null
echo "AFTER LOGIN: $(agent-browser eval 'location.href' 2>/dev/null | head -1)"
agent-browser screenshot /tmp/brand-shots/08-admin-dash-dark.png > /dev/null 2>&1
agent-browser set viewport 390 844 > /dev/null 2>&1
agent-browser wait 1200 > /dev/null
agent-browser screenshot /tmp/brand-shots/09-admin-mobile.png > /dev/null 2>&1
kill $SHIM_PID 2>/dev/null; pkill -f "vinext dev" 2>/dev/null
agent-browser close > /dev/null 2>&1
echo DONE
