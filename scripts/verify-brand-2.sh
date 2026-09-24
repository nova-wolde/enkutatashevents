#!/bin/bash
# verify-brand-2.sh — admin dashboard (dark context) + mobile viewport
cd /home/z/enkutatashevents
PORT=8799
npx wrangler dev --port $PORT > /tmp/wrangler-dev2.log 2>&1 &
WR_PID=$!
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
  [ "$code" = "200" ] && break; sleep 1
done
echo "ready (${i}s)"

agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --networkidle > /dev/null 2>&1
sleep 1
# click input, type, click submit by text
agent-browser click "input[type=password]" > /dev/null 2>&1
agent-browser type "local-dev-admin" > /dev/null 2>&1
agent-browser eval "[...document.querySelectorAll('button')].find(b=>/sign in/i.test(b.textContent))?.click(); 'clicked'" 2>/dev/null | head -2
sleep 3
agent-browser wait --networkidle > /dev/null 2>&1
echo "URL NOW: $(agent-browser eval 'location.href' 2>/dev/null | head -1)"
agent-browser screenshot /tmp/brand-shots/06-admin-dash-loggedin.png > /dev/null 2>&1

# mobile viewport homepage
agent-browser open "http://localhost:$PORT/" > /dev/null 2>&1
agent-browser set viewport 390 844 > /dev/null 2>&1
agent-browser wait --networkidle > /dev/null 2>&1
sleep 1
agent-browser screenshot /tmp/brand-shots/07-mobile-home.png > /dev/null 2>&1

# favicon effective link tags in HTML head
echo "=== ICON LINKS IN HEAD ==="
agent-browser eval "JSON.stringify([...document.querySelectorAll('link[rel*=icon],link[rel=apple-touch-icon],link[rel=manifest]')].map(l=>({rel:l.rel,href:l.href})))" 2>/dev/null | head -4

kill $WR_PID 2>/dev/null
agent-browser close > /dev/null 2>&1
echo DONE; ls -la /tmp/brand-shots/ | tail -4
