#!/bin/bash
# verify-brand-3.sh — admin dashboard dark-context check via real Redis (read-only browsing)
cd /home/z/enkutatashevents
PORT=8799

# kill stale workerd/wrangler on the port
pkill -f "wrangler dev --port $PORT" 2>/dev/null; pkill -f "workerd" 2>/dev/null; sleep 2

export OWNER_PASSWORD="local-dev-admin"
export UPSTASH_REDIS_REST_URL="https://meowdis.enkutatashevents.workers.dev"
export UPSTASH_REDIS_REST_TOKEN="2047b34adb2c09b5e2cf9d7ec5845adaf2919d2d24ca12f9b5f3a66b2de8e956"

npx wrangler dev --port $PORT > /tmp/wrangler-dev3.log 2>&1 &
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
  [ "$code" = "200" ] && break; sleep 1
done
echo "ready (${i}s)"

# verify login API works now
echo "=== LOGIN API ==="
curl -s -c /tmp/cookies.txt -X POST "http://localhost:$PORT/api/auth/login" \
  -H "Content-Type: application/json" -d '{"password":"local-dev-admin"}' | head -2

# browser login → dashboard
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --networkidle > /dev/null 2>&1
sleep 1
agent-browser click "input[type=password]" > /dev/null 2>&1
agent-browser type "local-dev-admin" > /dev/null 2>&1
agent-browser eval "[...document.querySelectorAll('button')].find(b=>/sign in/i.test(b.textContent))?.click(); 'ok'" > /dev/null 2>&1
sleep 4
agent-browser wait --networkidle > /dev/null 2>&1
echo "URL NOW: $(agent-browser eval 'location.href' 2>/dev/null | head -1)"
agent-browser set viewport 1440 900 > /dev/null 2>&1
agent-browser screenshot /tmp/brand-shots/08-admin-dash-dark.png > /dev/null 2>&1

# mobile admin dashboard (sidebar drawer)
agent-browser set viewport 390 844 > /dev/null 2>&1
sleep 1
agent-browser screenshot /tmp/brand-shots/09-admin-mobile.png > /dev/null 2>&1

kill %1 2>/dev/null; pkill -f "workerd" 2>/dev/null
agent-browser close > /dev/null 2>&1
echo DONE
