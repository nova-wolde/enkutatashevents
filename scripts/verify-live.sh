#!/bin/bash
# ─── LIVE verification on enkutatashevents.com ───────────────────────────────
# 1) Public pages healthy  2) contact-form label fix live
# 3) Submit REAL test contact + booking on prod (clearly labeled E2E TEST)
# 4) Read prod KV to prove submissions are visible to the admin backend
# 5) /admin login page renders
set -e
cd /home/z/my-project/enkutatashevents
OUT=/home/z/my-project/scripts
LOG=/tmp/live-test.log
: > $LOG
log() { echo "$@" | tee -a $LOG; }

BASE="https://enkutatashevents.com"
CB="?cb=$RANDOM$RANDOM"

# 1) pages
for p in "/" "/services" "/blog" "/locations" "/privacy" "/terms" "/admin"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p$CB")
  log "LIVE PAGE $p: HTTP $code"
done
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/health")
log "LIVE /api/health: HTTP $code"

# 2) contact form label fix live (SSR HTML contains the section)
agent-browser close > /dev/null 2>&1 || true
agent-browser open "$BASE/$CB" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 6000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null
agent-browser wait 2500 > /dev/null
# accept cookies if asked
agent-browser eval "(() => { const b = [...document.querySelectorAll('button')].find(x => /accept all cookies/i.test(x.textContent)); b?.click(); return 'ok'; })()" > /dev/null 2>&1
agent-browser wait 500 > /dev/null
res=$(agent-browser eval "(() => { const f = document.querySelector('#contact form'); return f ? JSON.stringify([...f.querySelectorAll('label')].map(l => l.textContent.trim())) : 'no form'; })()" 2>/dev/null)
log "LIVE contact labels: $res"
agent-browser eval "document.querySelector('#contact')?.scrollIntoView({behavior:'instant'})" > /dev/null 2>&1
agent-browser wait 1500 > /dev/null
agent-browser screenshot $OUT/live-contact-form.png > /dev/null 2>&1 || true

# 3) submit REAL test forms on prod (labeled E2E TEST)
r=$(curl -s -X POST "$BASE/api/contact" -H "Content-Type: application/json" -d '{"name":"E2E TEST — Customer Journey","email":"e2e-test@enkutatashevents.com","phone":"+251 900 000 000","eventType":"Wedding (test)","message":"AUTOMATED E2E TEST submission from the site QA run — verifying the admin panel receives live form submissions. Safe to delete."}')
log "LIVE POST /api/contact: $r"
r=$(curl -s -X POST "$BASE/api/bookings" -H "Content-Type: application/json" -d '{"name":"E2E TEST — Booking Flow","email":"e2e-test@enkutatashevents.com","phone":"+251 900 000 000","eventType":"Corporate (test)","eventDate":"2026-12-31","guestCount":10,"venue":"Other / Not decided","services":["catering"],"message":"AUTOMATED E2E TEST booking from the site QA run — verifying the admin bookings pipeline. Safe to delete."}')
log "LIVE POST /api/bookings: $r"

# 4) prove the submissions reached the same KV store the admin reads
python3 - <<'PYEOF'
import json, urllib.request

URL = "https://meowdis.enkutatashevents.workers.dev"
TOKEN = "2047b34adb2c09b5e2cf9d7ec5845adaf2919d2d24ca12f9b5f3a66b2de8e956"

def redis(cmd):
    req = urllib.request.Request(URL, data=json.dumps(cmd).encode(), headers={
        "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["result"]

for key, name in [("data:contact-submissions", "contact"), ("data:bookings", "bookings")]:
    raw = redis(["GET", key])
    items = json.loads(raw) if raw else []
    tests = [i for i in items if "E2E TEST" in i.get("name", "")]
    newest = items[0] if items else {}
    print(f"PROD KV {key}: {len(items)} total, {len(tests)} E2E test entries; newest: {newest.get('name','?')} | read={newest.get('read','?')} status={newest.get('status','-')}")
PYEOF

# 5) /admin login renders live
agent-browser open "$BASE/admin$CB" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 5000 > /dev/null
agent-browser wait 2000 > /dev/null
res=$(agent-browser eval "(() => JSON.stringify({ hasPasswordField: !!document.querySelector('#password'), hasSignIn: [...document.querySelectorAll('button')].some(b => /sign in/i.test(b.textContent)) }))()" 2>/dev/null)
log "LIVE /admin login: $res"
agent-browser set viewport 390 844 > /dev/null 2>&1
agent-browser wait 800 > /dev/null
agent-browser screenshot $OUT/live-admin-mobile.png > /dev/null 2>&1 || true
agent-browser close > /dev/null 2>&1 || true

log "LIVE VERIFICATION DONE"
