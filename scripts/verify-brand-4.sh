#!/bin/bash
# verify-brand-4.sh — admin dashboard (dark emerald sidebar) via vinext dev + shim + prod-seeded data
cd /home/z/enkutatashevents
PORT=8799
pkill -f "vinext dev" 2>/dev/null; pkill -f "workerd" 2>/dev/null; pkill -f "dev-redis-shim" 2>/dev/null; sleep 2

# 1) local redis shim
node scripts/dev-redis-shim.mjs > /tmp/shim.log 2>&1 &
SHIM_PID=$!
sleep 1

# 2) seed shim with prod data (read-only from prod)
node scripts/seed-local-from-prod.mjs > /tmp/seed.log 2>&1 && echo "seeded OK" || { echo "seed FAILED"; tail -5 /tmp/seed.log; }

# 3) vinext dev with env vars
export OWNER_PASSWORD="local-dev-admin"
export UPSTASH_REDIS_REST_URL="http://127.0.0.1:8379"
export UPSTASH_REDIS_REST_TOKEN="local-dev-shim-token"
export NODE_ENV="development"
npx vinext dev --port $PORT > /tmp/vinext-dev.log 2>&1 &
for i in $(seq 1 90); do curl -sf "http://localhost:$PORT/" > /dev/null 2>&1 && break; sleep 1; done
curl -sf "http://localhost:$PORT/" > /dev/null && echo "server up (${i}s)" || { echo "SERVER FAILED"; tail -20 /tmp/vinext-dev.log; exit 1; }

# 4) login API sanity
echo "=== LOGIN API ==="
curl -s -X POST "http://localhost:$PORT/api/auth/login" -H "Content-Type: application/json" -d '{"password":"local-dev-admin"}' | head -c 200; echo

# 5) browser: login → dashboard desktop
agent-browser close > /dev/null 2>&1
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 3000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null 2>&1
agent-browser wait 1500 > /dev/null
agent-browser eval "(() => { const inp = document.querySelector('#password'); if (!inp) return 'already in'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(inp,'local-dev-admin'); inp.dispatchEvent(new Event('input',{bubbles:true})); [...document.querySelectorAll('button')].find(b=>/sign in/i.test(b.textContent))?.click(); return 'submitted'; })()" 2>/dev/null | head -2
agent-browser wait 4000 > /dev/null
echo "URL NOW: $(agent-browser eval 'location.href' 2>/dev/null | head -1)"
agent-browser screenshot /tmp/brand-shots/08-admin-dash-dark.png > /dev/null 2>&1

# 6) mobile admin
agent-browser set viewport 390 844 > /dev/null 2>&1
agent-browser wait 1200 > /dev/null
agent-browser screenshot /tmp/brand-shots/09-admin-mobile.png > /dev/null 2>&1

kill $SHIM_PID 2>/dev/null; pkill -f "vinext dev" 2>/dev/null
agent-browser close > /dev/null 2>&1
echo DONE
