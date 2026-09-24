#!/bin/bash
# verify-brand.sh — single-call local verification of brand asset swap
cd /home/z/enkutatashevents
PORT=8799
mkdir -p /tmp/brand-shots

# 1) start wrangler dev in background
npx wrangler dev --port $PORT > /tmp/wrangler-dev.log 2>&1 &
WR_PID=$!

# wait for readiness
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "server ready after ${i}s (last code=$code)"

# 2) asset status checks
echo "=== ASSET CHECKS ==="
for path in /favicon.ico /favicon.svg /favicon-16x16.png /favicon-32x32.png /favicon-192.png /favicon-512.png /enkutatash-mark-512.png /enkutatash-mark-512-maskable.png /enkutatash-logo.png /apple-touch-icon.png /manifest.json /sw.js; do
  out=$(curl -s -o /dev/null -w "%{http_code} %{content_type}" "http://localhost:$PORT$path")
  echo "$path -> $out"
done

echo "=== MANIFEST CONTENT ==="
curl -s "http://localhost:$PORT/manifest.json" | head -20

# 3) browser checks
echo "=== BROWSER CHECKS ==="
agent-browser open "http://localhost:$PORT/" --viewport 1440x900 > /dev/null 2>&1
agent-browser wait --networkidle > /dev/null 2>&1
agent-browser set viewport 1440 900 > /dev/null 2>&1
agent-browser screenshot /tmp/brand-shots/01-home-top.png > /dev/null 2>&1
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)" > /dev/null 2>&1
sleep 1
agent-browser screenshot /tmp/brand-shots/02-home-footer.png > /dev/null 2>&1

# header logo rendered size
agent-browser eval "JSON.stringify([...document.querySelectorAll('img')].filter(i=>i.src.includes('enkutatash-logo')).map(i=>({src:i.src.split('/').pop(), w:i.clientWidth, h:i.clientHeight, alt:i.alt})))" 2>/dev/null | head -5

# 4) admin login page
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --networkidle > /dev/null 2>&1
sleep 1
agent-browser screenshot /tmp/brand-shots/03-admin-login.png > /dev/null 2>&1

# 5) login as admin
agent-browser eval "JSON.stringify({pw: !!document.querySelector('input[type=password]')})" 2>/dev/null | head -2
agent-browser set value "local-dev-admin" --selector "input[type=password]" > /dev/null 2>&1 || agent-browser type "local-dev-admin" > /dev/null 2>&1
agent-browser screenshot /tmp/brand-shots/04-admin-filled.png > /dev/null 2>&1
agent-browser press Enter > /dev/null 2>&1
sleep 3
agent-browser wait --networkidle > /dev/null 2>&1
agent-browser screenshot /tmp/brand-shots/05-admin-dashboard.png > /dev/null 2>&1

echo "=== URL NOW ==="
agent-browser eval "location.href" 2>/dev/null | head -2

kill $WR_PID 2>/dev/null
agent-browser close > /dev/null 2>&1
echo "=== DONE ==="
ls -la /tmp/brand-shots/
