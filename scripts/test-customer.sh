#!/bin/bash
# ─── Phase A: CUSTOMER journey test on local dev (v2 — safe heredocs) ─────────
set -e
cd /home/z/my-project/enkutatashevents
PORT=8799
OUT=/home/z/my-project/scripts
LOG=/tmp/customer-test.log
: > $LOG

log() { echo "$@" | tee -a $LOG; }
shot() { agent-browser screenshot "$1" > /dev/null 2>&1 || true; }
ev() { agent-browser eval "$1" 2>/dev/null; }
# jsblock <resultvar> — JS read from heredoc into /tmp/j.js, then eval'd
jsblock() {
  cat > /tmp/j.js
  ev "$(cat /tmp/j.js)"
}

agent-browser close > /dev/null 2>&1 || true
pkill -f "vinext dev" 2>/dev/null || true
sleep 1
rm -f db/shim-data.json

node scripts/dev-redis-shim.mjs > /tmp/shim.log 2>&1 &
SPID=$!
cleanup() { kill $SPID 2>/dev/null; pkill -f "vinext dev" 2>/dev/null; agent-browser close > /dev/null 2>&1 || true; true; }
trap cleanup EXIT

node scripts/seed-local-from-prod.mjs > /tmp/seed.log 2>&1 && log "SEED: ok" || log "SEED: FAILED (continuing)"
npx vinext dev --port $PORT > /tmp/wd.log 2>&1 &
for i in $(seq 1 120); do curl -sf "http://localhost:$PORT/" > /dev/null 2>&1 && break; sleep 1; done
curl -sf "http://localhost:$PORT/" > /dev/null || { log "FAIL: server did not start"; tail -30 /tmp/wd.log; exit 1; }
log "SERVER: up after ${i}s"

# ════════ 1) HOMEPAGE ════════
agent-browser open "http://localhost:$PORT/" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 5000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null
agent-browser wait 1500 > /dev/null

res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('button')].find(x => /accept all cookies/i.test(x.textContent));
  if (b) { b.click(); return 'accepted'; }
  return 'no banner';
})()
JSEOF
)
log "COOKIE-BANNER: $res"
agent-browser wait 600 > /dev/null

res=$(jsblock <<JSEOF
(() => {
  const ids = ['about','vision','portfolio','testimonials','contact'];
  const missing = ids.filter(id => !document.getElementById(id));
  return JSON.stringify({ missing, sections: document.querySelectorAll('section').length });
})()
JSEOF
)
log "HOME-SECTIONS: $res"
shot $OUT/test-home.png

# theme toggle (find by svg class containing sun/moon)
res=$(jsblock <<JSEOF
(() => {
  const btns = [...document.querySelectorAll('nav button')];
  const themeBtn = btns.find(b => { const c = b.querySelector('svg'); return c && /lucide-sun|lucide-moon/.test(c.getAttribute('class') || ''); });
  if (!themeBtn) {
    const all = btns.map(b => (b.querySelector('svg')?.getAttribute('class') || '').slice(0, 40));
    return 'NOT FOUND: ' + JSON.stringify(all);
  }
  themeBtn.click();
  return 'clicked theme';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
cls=$(ev "document.documentElement.className")
log "THEME-TOGGLE: $res htmlClass=$cls"
shot $OUT/test-home-dark.png
jsblock <<JSEOF
(() => { const t = [...document.querySelectorAll('nav button')].find(b => { const c = b.querySelector('svg'); return c && /lucide-sun|lucide-moon/.test(c.getAttribute('class') || ''); }); t?.click(); return 'ok'; })()
JSEOF
agent-browser wait 600 > /dev/null

# language toggle EN -> AM
res=$(jsblock <<JSEOF
(() => {
  const g = [...document.querySelectorAll('nav button')].find(b => b.querySelector('.lucide-globe'));
  if (!g) return 'globe NOT FOUND';
  g.click(); return 'clicked';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const hasAm = /[\u1200-\u137F]/.test(document.body.innerText);
  return JSON.stringify({ amharicVisible: hasAm });
})()
JSEOF
)
log "LANG-TOGGLE: $res amharic=$res2"
shot $OUT/test-home-amharic.png
jsblock <<JSEOF
(() => { const g = [...document.querySelectorAll('nav button')].find(b => b.querySelector('.lucide-globe')); g?.click(); return 'ok'; })()
JSEOF
agent-browser wait 700 > /dev/null

# ════════ 2) CONTACT FORM (UI) ════════
jsblock <<JSEOF
(() => { document.querySelector('#contact')?.scrollIntoView({behavior:'instant', block:'start'}); return 'scrolled'; })()
JSEOF
agent-browser wait 1200 > /dev/null
shot $OUT/test-contact-form.png

jsblock <<JSEOF
(() => {
  const setV = (el, v) => {
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const form = document.querySelector('#contact form');
  if (!form) return 'form NOT FOUND';
  const inputs = [...form.querySelectorAll('input')];
  const ta = form.querySelector('textarea');
  setV(inputs[0], 'Selam Ghebremariam');
  setV(inputs[1], 'selam.tesfaye@example.et');
  setV(inputs[2], '+251 911 234 567');
  setV(inputs[3], 'Wedding');
  setV(ta, 'We are planning a wedding for December 25th at Sheraton Addis for 300 guests. We need full catering, decoration and sound. Please contact us.');
  return 'filled ' + inputs.length + ' inputs + message';
})()
JSEOF
agent-browser wait 400 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('#contact form button')].find(b => /send message/i.test(b.textContent));
  if (!btn) return 'submit NOT FOUND';
  btn.click(); return 'submit clicked';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('#contact').innerText;
  return JSON.stringify({ success: /Message Sent/i.test(t), formGone: !document.querySelector('#contact form') });
})()
JSEOF
)
log "CONTACT-FORM-UI: click=$res result=$res2"
shot $OUT/test-contact-submitted.png

# ════════ 3) BOOKING DIALOG (UI, 3 steps) ════════
res=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('nav button')].find(b => /book an event/i.test(b.textContent));
  if (!btn) return 'nav booking btn NOT FOUND';
  btn.click(); return 'dialog opened';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
log "BOOKING-OPEN: $res"

jsblock <<JSEOF
(() => {
  const setV = (el, v) => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const name = document.querySelector('#bk-name');
  const email = document.querySelector('#bk-email');
  const phone = document.querySelector('#bk-phone');
  if (!name || !email) return 'step1 fields NOT FOUND';
  setV(name, 'Abebe Kebede');
  setV(email, 'abebe.kebede@example.com');
  setV(phone, '+251 922 345 678');
  return 'step1 filled';
})()
JSEOF
agent-browser wait 400 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const next = [...document.querySelectorAll('[role="dialog"] button')].find(b => /^next/i.test(b.textContent.trim()));
  if (!next) return 'next NOT FOUND';
  if (next.disabled) return 'next DISABLED';
  next.click(); return 'went to step2';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
log "BOOKING-STEP1: next=$res2"
shot $OUT/test-booking-step2.png

res=$(jsblock <<JSEOF
(() => {
  const trigger = document.querySelector('[role="dialog"] button[role="combobox"]');
  if (!trigger) return 'combobox NOT FOUND';
  trigger.click(); return 'opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Wedding');
  if (!opt) return 'Wedding option NOT FOUND';
  opt.click(); return 'selected Wedding';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const setV = (el, v) => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  setV(document.querySelector('#bk-date'), '2026-12-25');
  setV(document.querySelector('#bk-guests'), '300');
  return 'date+guests filled';
})()
JSEOF
)
agent-browser wait 400 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const next = [...document.querySelectorAll('[role="dialog"] button')].find(b => /^next/i.test(b.textContent.trim()));
  if (!next || next.disabled) return 'NOT FOUND/DISABLED';
  next.click(); return 'went to step3';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
log "BOOKING-STEP2: open=$res select=$res2 fill=$res3 next=$res4"
shot $OUT/test-booking-step3.png

res=$(jsblock <<JSEOF
(() => {
  const boxes = [...document.querySelectorAll('[role="dialog"] button[role="checkbox"]')];
  if (boxes.length < 2) return 'checkboxes NOT FOUND (' + boxes.length + ')';
  boxes[0].click(); boxes[1].click();
  return 'toggled 2 of ' + boxes.length;
})()
JSEOF
)
agent-browser wait 500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('[role="dialog"] button[role="combobox"]');
  if (!t) return 'venue combobox NOT FOUND';
  t.click(); return 'opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => /sheraton/i.test(o.textContent));
  if (!opt) return 'Sheraton NOT FOUND';
  opt.click(); return 'selected Sheraton Addis';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const setV = (el, v) => {
    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const ta = document.querySelector('#bk-message');
  if (!ta) return 'message NOT FOUND';
  setV(ta, 'Traditional Ethiopian wedding. Need Amharic-speaking MC, live band, and vegetarian menu options.');
  return 'message filled';
})()
JSEOF
)
agent-browser wait 300 > /dev/null
shot $OUT/test-booking-step3-filled.png
res5=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('[role="dialog"] button')].find(b => /submit booking/i.test(b.textContent));
  if (!btn) return 'submit NOT FOUND';
  btn.click(); return 'submitted';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
res6=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('[role="dialog"]')?.innerText || '';
  return JSON.stringify({ submitted: /Booking Submitted|Thank You/i.test(t), errorShown: /error|wrong|failed/i.test(t) });
})()
JSEOF
)
log "BOOKING-STEP3: svc=$res venueOpen=$res2 venueSel=$res3 msg=$res4 submit=$res5 result=$res6"
shot $OUT/test-booking-submitted.png
jsblock <<JSEOF
(() => { const d = [...document.querySelectorAll('[role="dialog"] button')].find(b => /^done$/i.test(b.textContent.trim())); d?.click(); return 'closed'; })()
JSEOF
agent-browser wait 800 > /dev/null

# ════════ 4) PUBLIC PAGES ════════
for p in "/services" "/services/catering" "/locations" "/blog" "/privacy" "/terms"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT$p")
  log "PAGE $p: HTTP $code"
done
agent-browser open "http://localhost:$PORT/services" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 3000 > /dev/null
agent-browser wait 1200 > /dev/null
shot $OUT/test-services.png
res=$(ev "JSON.stringify({h1: (document.querySelector('h1')?.textContent||'').slice(0,60), serviceLinks: document.querySelectorAll('a[href*=\"/services/\"]').length})")
log "SERVICES-PAGE: $res"

agent-browser open "http://localhost:$PORT/blog" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 3000 > /dev/null
agent-browser wait 1000 > /dev/null
shot $OUT/test-blog.png
res=$(ev "JSON.stringify({h1: (document.querySelector('h1')?.textContent||'').slice(0,60), postLinks: document.querySelectorAll('a[href*=\"/blog/\"]').length})")
log "BLOG-PAGE: $res"

code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/nonexistent-page-xyz")
log "PAGE 404-check (expect 404): HTTP $code"

# ════════ 5) API VALIDATION TESTS ════════
r=$(curl -s -o /tmp/r1.json -w "%{http_code}" -X POST "http://localhost:$PORT/api/contact" -H "Content-Type: application/json" -d '{"name":"X","email":"bad","message":"hi"}')
log "API contact invalid (expect 400): HTTP $r body=$(head -c 120 /tmp/r1.json)"

r=$(curl -s -o /tmp/r2.json -w "%{http_code}" -X POST "http://localhost:$PORT/api/bookings" -H "Content-Type: application/json" -d '{"name":"Test","email":"t@t.com","eventType":"Wedding"}')
log "API booking missing-date (expect 400): HTTP $r body=$(head -c 120 /tmp/r2.json)"

r=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/api/bookings")
log "API GET bookings unauth (expect 401): HTTP $r"
r=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/api/contact")
log "API GET contact unauth (expect 401): HTTP $r"
r=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/api/venues")
log "API GET venues unauth (expect 401): HTTP $r"

r=$(curl -s -X POST "http://localhost:$PORT/api/contact" -H "Content-Type: application/json" -d '{"name":"Marta Alemu","email":"marta.alemu@example.com","phone":"+251 933 456 789","eventType":"Corporate","message":"Annual general meeting for 150 people, need projector and sound system at Millennium Hall."}')
log "API contact valid #2: $r"
r=$(curl -s -X POST "http://localhost:$PORT/api/bookings" -H "Content-Type: application/json" -d '{"name":"Dawit Haile","email":"dawit.haile@example.com","phone":"+251 944 567 890","eventType":"Conference","eventDate":"2026-11-15","guestCount":150,"venue":"Millennium Hall","services":["sound","catering"],"message":"Tech conference with live streaming."}')
log "API booking valid #2: $r"

r=$(curl -s -o /tmp/r3.json -w "%{http_code}" -X POST "http://localhost:$PORT/api/auth/login" -H "Content-Type: application/json" -d '{"password":"wrong-password"}')
log "API login WRONG password (expect 401): HTTP $r body=$(head -c 100 /tmp/r3.json)"

# ════════ 6) SHIM DATA VERIFICATION ════════
c=$(curl -s -X POST "http://127.0.0.1:8379" -H "Authorization: Bearer local-dev-shim-token" -H "Content-Type: application/json" -d '["GET","data:contact-submissions"]' | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(json.loads(d['result'])))" 2>/dev/null || echo ERR)
log "SHIM contact-submissions count: $c"
b=$(curl -s -X POST "http://127.0.0.1:8379" -H "Authorization: Bearer local-dev-shim-token" -H "Content-Type: application/json" -d '["GET","data:bookings"]' | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(json.loads(d['result'])))" 2>/dev/null || echo ERR)
log "SHIM bookings count: $b"

agent-browser close > /dev/null 2>&1 || true
log "PHASE-A DONE"
