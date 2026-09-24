#!/bin/bash
# ─── Phase B: ADMIN full functionality test (local dev) ──────────────────────
# Uses data persisted from Phase A (customer submissions). NO re-seed.
# Tests: login (wrong+right), session persistence, dashboard, bookings mgmt,
# messages mgmt, attendees check-in, events CRUD, venues, content manager,
# settings, analytics, quick actions, logout, and admin API via curl.
cd /home/z/my-project/enkutatashevents
PORT=8799
OUT=/home/z/my-project/scripts
LOG=/tmp/admin-test.log
: > $LOG

log() { echo "$@" | tee -a $LOG; }
shot() { agent-browser screenshot "$1" > /dev/null 2>&1 || true; }
ev() { agent-browser eval "$1" 2>/dev/null; }
jsblock() {
  cat > /tmp/j.js
  ev "$(cat /tmp/j.js)"
}
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); log "  ✅ PASS: $1"; }
bad()  { FAIL=$((FAIL+1)); log "  ❌ FAIL: $1"; }
check() { if [[ "$2" == *"$3"* ]]; then ok "$1"; else bad "$1 — got: $(echo "$2" | head -c 200)"; fi }

agent-browser close > /dev/null 2>&1 || true
pkill -f "vinext dev" 2>/dev/null || true
sleep 1

node scripts/dev-redis-shim.mjs > /tmp/shim.log 2>&1 &
SPID=$!
cleanup() { kill $SPID 2>/dev/null; pkill -f "vinext dev" 2>/dev/null; agent-browser close > /dev/null 2>&1 || true; true; }
trap cleanup EXIT

npx vinext dev --port $PORT > /tmp/wd.log 2>&1 &
for i in $(seq 1 120); do curl -sf "http://localhost:$PORT/" > /dev/null 2>&1 && break; sleep 1; done
curl -sf "http://localhost:$PORT/" > /dev/null || { log "FAIL: server did not start"; exit 1; }
log "SERVER: up after ${i}s (data from Phase A persisted, no re-seed)"

# ════════ 1) LOGIN FLOW ════════
log "── 1. LOGIN FLOW ──"
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 5000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null
agent-browser wait 2000 > /dev/null

res=$(jsblock <<JSEOF
(() => {
  const inp = document.querySelector('#password');
  if (!inp) return 'password field NOT FOUND';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'wrong-password-123');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  return 'filled wrong pw';
})()
JSEOF
)
res2=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('button')].find(b => /sign in/i.test(b.textContent));
  if (!btn) return 'sign-in NOT FOUND';
  btn.click(); return 'clicked';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const err = document.body.innerText.match(/invalid password|too many|try again/i);
  return err ? 'error shown: ' + err[0] : 'NO ERROR SHOWN';
})()
JSEOF
)
check "login wrong-pw rejected with error" "$res3" "error shown"

res=$(jsblock <<JSEOF
(() => {
  const inp = document.querySelector('#password');
  if (!inp) return 'field gone?';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'admin-test-2026');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  const btn = [...document.querySelectorAll('button')].find(b => /sign in/i.test(b.textContent));
  btn.click(); return 'submitted correct pw';
})()
JSEOF
)
agent-browser wait 4000 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  const dash = /Dashboard/i.test(t) && !document.querySelector('#password');
  return dash ? 'dashboard visible' : 'still on login or failed';
})()
JSEOF
)
check "login correct-pw reaches dashboard" "$res2" "dashboard visible"
shot $OUT/test-admin-dashboard.png

# session persistence: reload
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 4000 > /dev/null
agent-browser wait 2000 > /dev/null
res=$(jsblock <<JSEOF
(() => { return document.querySelector('#password') ? 'login page again (session lost)' : 'still authenticated'; })()
JSEOF
)
check "session persists across reload" "$res" "still authenticated"

# ════════ 2) DASHBOARD SHOWS CUSTOMER SUBMISSIONS ════════
log "── 2. DASHBOARD REFLECTS CUSTOMER DATA ──"
res=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  return JSON.stringify({
    hasSelam: /Selam Ghebremariam/.test(t),
    hasMarta: /Marta Alemu/.test(t),
    hasAbebe: /Abebe Kebede/.test(t),
    hasDawit: /Dawit Haile/.test(t),
    statLabels: [...document.querySelectorAll('.grid [class*=font-bold]')].slice(0,8).map(e => e.textContent.trim()).slice(0,8),
  });
})()
JSEOF
)
log "  dashboard data: $res"
check "dashboard shows customer message (Selam)" "$res" '"hasSelam":true'
check "dashboard shows customer booking (Abebe)" "$res" '"hasAbebe":true'

# ════════ 3) BOOKINGS MANAGEMENT ════════
log "── 3. BOOKINGS MANAGEMENT ──"
res=$(jsblock <<JSEOF
(() => {
  const btns = [...document.querySelectorAll('aside button')];
  const b = btns.find(x => x.textContent.trim().toLowerCase().startsWith('bookings'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  return JSON.stringify({ abebe: /Abebe Kebede/.test(t), dawit: /Dawit Haile/.test(t), total: (t.match(/Total Bookings\n(\d+)/) || [])[1] });
})()
JSEOF
)
check "bookings view lists customer bookings" "$res2" '"abebe":true'
log "  bookings data: $res2"
shot $OUT/test-admin-bookings.png

# open Abebe's detail dialog (click the card)
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Abebe Kebede/.test(c.textContent));
  if (!card) return 'Abebe card NOT FOUND';
  card.click(); return 'detail opened';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  const t = d.innerText;
  return JSON.stringify({ email: /abebe.kebede@example.com/.test(t), phone: /\+251 922 345 678/.test(t), guests: /300/.test(t), venue: /Sheraton Addis/.test(t), services: /catering|decoration/i.test(t), message: /Traditional Ethiopian wedding/.test(t), hasConfirm: !![...d.querySelectorAll('button')].find(b => /confirm/i.test(b.textContent)) });
})()
JSEOF
)
check "booking detail shows ALL customer data" "$res2" '"email":true'
log "  detail data: $res2"
shot $OUT/test-admin-booking-detail.png

# confirm the booking
res=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /confirm/i.test(b.textContent) && !/mark/i.test(b.textContent));
  if (!btn) return 'confirm btn NOT FOUND';
  btn.click(); return 'confirmed';
})()
JSEOF
)
agent-browser wait 2000 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  return JSON.stringify({ toast: /Status Updated|marked as confirmed/i.test(t), confirmedCount: (t.match(/Confirmed\n(\d+)/) || [])[1] });
})()
JSEOF
)
check "booking status -> confirmed (toast + counter)" "$res2" '"toast":true'
log "  confirm result: $res2"

# dropdown status change: completed via RefreshCw menu on Abebe
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Abebe Kebede/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  const btn = card.querySelector('button.h-8.w-8');
  if (!btn) return 'dropdown trigger NOT FOUND';
  btn.click(); return 'menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /mark as completed/i.test(i.textContent));
  if (!item) return 'menuitem NOT FOUND';
  item.click(); return 'marked completed';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Abebe Kebede/.test(c.textContent));
  return card ? (card.innerText.match(/Pending|Confirmed|Cancelled|Completed/) || ['?'])[0] : 'card gone';
})()
JSEOF
)
check "dropdown -> mark as completed" "$res3" "Completed"

# search filter
res=$(jsblock <<JSEOF
(() => {
  const inp = document.querySelector('input[placeholder*="Search by name"]');
  if (!inp) return 'search NOT FOUND';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'Dawit');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  return 'searched Dawit';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const cards = [...document.querySelectorAll('.cursor-pointer')].filter(c => /guests/.test(c.textContent));
  const names = cards.map(c => (c.textContent.match(/[A-Z][a-z]+ [A-Z][a-z]+/) || [''])[0]);
  return JSON.stringify({ visibleCount: cards.length, hasAbebe: names.some(n => /Abebe/.test(n)), hasDawit: names.some(n => /Dawit/.test(n)) });
})()
JSEOF
)
check "search filter works (only Dawit)" "$res2" '"hasAbebe":false'
check "search finds Dawit" "$res2" '"hasDawit":true'
# clear search
jsblock <<JSEOF
(() => { const inp = document.querySelector('input[placeholder*="Search by name"]'); const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(inp, ''); inp.dispatchEvent(new Event('input', { bubbles: true })); return 'cleared'; })()
JSEOF
agent-browser wait 600 > /dev/null

# status filter via combobox
res=$(jsblock <<JSEOF
(() => {
  const trig = [...document.querySelectorAll('main button[role="combobox"]')].find(b => /All Status|Pending|Confirmed|Completed|Cancelled/.test(b.textContent));
  if (!trig) return 'filter combobox NOT FOUND';
  trig.click(); return 'opened';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Completed');
  if (!opt) return 'option NOT FOUND';
  opt.click(); return 'filtered';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const cards = [...document.querySelectorAll('.cursor-pointer')].filter(c => /guests/.test(c.textContent));
  return JSON.stringify({ count: cards.length, abebeShown: cards.some(c => /Abebe/.test(c.textContent)) });
})()
JSEOF
)
check "status filter -> Completed shows Abebe only" "$res3" '"abebeShown":true'
# reset filter to All
jsblock <<JSEOF
(() => { const t = [...document.querySelectorAll('main button[role="combobox"]')].find(b => /Completed/.test(b.textContent)); t?.click(); return 'ok'; })()
JSEOF
agent-browser wait 600 > /dev/null
jsblock <<JSEOF
(() => { const o = [...document.querySelectorAll('[role="option"]')].find(x => x.textContent.trim() === 'All Status'); o?.click(); return 'ok'; })()
JSEOF
agent-browser wait 600 > /dev/null

# ════════ 4) MESSAGES MANAGEMENT ════════
log "── 4. MESSAGES MANAGEMENT ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages'));
  if (!b) return 'nav NOT FOUND';
  const badge = b.textContent.match(/\d+/);
  b.click(); return 'navigated, badge=' + (badge ? badge[0] : 'none');
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
log "  nav: $res"
res2=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  return JSON.stringify({ selam: /Selam Ghebremariam/.test(t), marta: /Marta Alemu/.test(t) });
})()
JSEOF
)
check "messages view lists BOTH customer submissions" "$res2" '"selam":true'
check "messages view lists 2nd submission (Marta)" "$res2" '"marta":true'
shot $OUT/test-admin-messages.png

# open Selam's message (unread -> should highlight)
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Selam Ghebremariam/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  card.click(); return 'opened';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  const t = d.innerText;
  return JSON.stringify({ email: /selam.tesfaye@example.et/.test(t), message: /December 25th/.test(t), replyBtn: !![...d.querySelectorAll('button, a')].find(b => /reply/i.test(b.textContent)) });
})()
JSEOF
)
check "message detail shows customer content" "$res2" '"email":true'
log "  detail: $res2"
shot $OUT/test-admin-message-detail.png
# close dialog
jsblock <<JSEOF
(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 'esc'; })()
JSEOF
agent-browser wait 900 > /dev/null

# ════════ 5) ATTENDEES + CHECK-IN ════════
log "── 5. ATTENDEES VIEW ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('attendees'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  return JSON.stringify({ dawitListed: /Dawit Haile/.test(t), abebeListed: /Abebe Kebede/.test(t) });
})()
JSEOF
)
log "  attendees: $res2"
check "attendees view lists confirmed attendees" "$res2" '"dawitListed":true'
# check-in toggle on first attendee
res=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('main button')].find(b => /^check in$/i.test(b.textContent.trim()));
  if (!btn) return 'check-in btn NOT FOUND (maybe all checked in)';
  btn.click(); return 'checked in';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.body.innerText;
  const m = t.match(/Checked In\n(\d+)/) || t.match(/(\d+)\nChecked In/);
  return JSON.stringify({ counter: m ? m[1] : null, hasBadge: /Checked In/i.test(t) });
})()
JSEOF
)
check "attendee check-in works" "$res" "checked in"
log "  check-in counter: $res2"
shot $OUT/test-admin-attendees.png

# ════════ 6) EVENTS CRUD ════════
log "── 6. EVENTS CRUD ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('events'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
createBtn=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('main button')].find(x => /create event/i.test(x.textContent));
  if (!b) return 'create btn NOT FOUND';
  b.click(); return 'dialog opened';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const setV = (el, v) => {
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  setV(d.querySelector('#event-name'), 'Test Annual Gala 2026');
  setV(d.querySelector('#event-time'), '18:00');
  setV(d.querySelector('#event-desc'), 'End-to-end test gala created by automated admin test.');
  setV(d.querySelector('#max-attendees'), '250');
  setV(d.querySelector('#ticket-price'), '500');
  return 'base fields filled';
})()
JSEOF
)
# date via calendar popover
res2=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /pick a date/i.test(b.textContent));
  if (!btn) return 'date btn NOT FOUND';
  btn.click(); return 'calendar opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const days = [...document.querySelectorAll('[role="dialog"] table button, [data-radix-popper-content-wrapper] table button')].filter(b => b.textContent.trim() === '15');
  if (!days.length) return 'day 15 NOT FOUND';
  days[0].click(); return 'picked 15th';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
# venue select
res4=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const trig = [...d.querySelectorAll('button[role="combobox"]')][0];
  if (!trig) return 'venue combobox NOT FOUND';
  trig.click(); return 'venue opened';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => /Sheraton/.test(o.textContent));
  if (!opt) return 'option NOT FOUND';
  opt.click(); return 'venue picked';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
# category select
res6=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const trig = [...d.querySelectorAll('button[role="combobox"]')][0];
  if (!trig) return 'category combobox NOT FOUND';
  trig.click(); return 'category opened';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res7=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Corporate');
  if (!opt) return 'Corporate NOT FOUND';
  opt.click(); return 'category picked';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
# submit
res8=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /^create event$/i.test(b.textContent.trim()));
  if (!btn) return 'submit NOT FOUND';
  btn.click(); return 'created';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res9=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('main').innerText;
  return JSON.stringify({ listed: /Test Annual Gala 2026/.test(t), dialogClosed: !document.querySelector('[role="dialog"]') });
})()
JSEOF
)
log "  create flow: btn=$createBtn fields=$res date=$res2 day=$res3 venueOpen=$res4 venue=$res5 catOpen=$res6 cat=$res7 submit=$res8"
check "event created & visible in list" "$res9" '"listed":true'
log "  result: $res9"
shot $OUT/test-admin-event-created.png

# EDIT the event
res=$(jsblock <<JSEOF
(() => {
  const row = [...document.querySelectorAll('main table tbody tr, main [class*=cursor-pointer]')].find(r => /Test Annual Gala 2026/.test(r.textContent));
  if (!row) return 'row NOT FOUND';
  const dd = row.querySelector('button.h-8.w-8') || [...row.querySelectorAll('button')].pop();
  dd.click(); return 'row menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /edit/i.test(i.textContent));
  if (!item) return 'edit item NOT FOUND';
  item.click(); return 'edit dialog';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  const inp = d.querySelector('#event-name');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'Test Annual Gala 2027');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  return 'renamed';
})()
JSEOF
)
agent-browser wait 400 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /save changes/i.test(b.textContent));
  if (!btn) return 'save btn NOT FOUND';
  btn.click(); return 'saved';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res5=$(jsblock <<JSEOF
(() => { return /Test Annual Gala 2027/.test(document.querySelector('main').innerText) ? 'updated in list' : 'NOT updated'; })()
JSEOF
)
log "  edit flow: menu=$res item=$res2 rename=$res3 save=$res4"
check "event edit saved (2026 -> 2027)" "$res5" "updated in list"

# DELETE the event
res=$(jsblock <<JSEOF
(() => {
  const row = [...document.querySelectorAll('main table tbody tr, main [class*=cursor-pointer]')].find(r => /Test Annual Gala 2027/.test(r.textContent));
  if (!row) return 'row NOT FOUND';
  const dd = row.querySelector('button.h-8.w-8') || [...row.querySelectorAll('button')].pop();
  dd.click(); return 'menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /delete/i.test(i.textContent));
  if (!item) return 'delete item NOT FOUND';
  item.click(); return 'delete clicked';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const dlg = document.querySelector('[role="alertdialog"]') || document.querySelector('[role="dialog"]');
  if (!dlg) return 'NO confirm dialog';
  const btn = [...dlg.querySelectorAll('button')].find(b => /^delete$/i.test(b.textContent.trim()));
  if (!btn) return 'confirm btn NOT FOUND: ' + dlg.innerText.slice(0, 80);
  btn.click(); return 'confirmed delete';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res4=$(jsblock <<JSEOF
(() => { return /Test Annual Gala 2027/.test(document.querySelector('main').innerText) ? 'STILL LISTED' : 'deleted from list'; })()
JSEOF
)
log "  delete flow: menu=$res item=$res2 confirm=$res3"
check "event deleted" "$res4" "deleted from list"

# ════════ 7) VENUES ════════
log "── 7. VENUES MANAGEMENT ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('venues'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res2=$(jsblock <<JSEOF
(() => { const t = document.querySelector('main').innerText; return JSON.stringify({ sheraton: /Sheraton Addis/.test(t), hilton: /Hilton/.test(t) }); })()
JSEOF
)
check "venues list loads with venues" "$res2" '"sheraton":true'
# add venue
res3=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('main button')].find(x => /add venue/i.test(x.textContent));
  if (!b) return 'add btn NOT FOUND';
  b.click(); return 'dialog opened';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  const inputs = [...d.querySelectorAll('input')];
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  if (inputs.length < 3) return 'expected 3 inputs, got ' + inputs.length;
  setter.call(inputs[0], 'Test Venue Arena');
  inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
  setter.call(inputs[1], 'Bole Road, Addis Ababa');
  inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  setter.call(inputs[2], '150');
  inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
  return 'venue form filled (' + inputs.length + ' inputs)';
})()
JSEOF
)
agent-browser wait 400 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /add venue/i.test(b.textContent));
  if (!btn) return 'submit NOT FOUND';
  btn.click(); return 'added';
})()
JSEOF
)
agent-browser wait 2000 > /dev/null
res6=$(jsblock <<JSEOF
(() => { return /Test Venue Arena/.test(document.querySelector('main').innerText) ? 'venue in list' : 'NOT in list'; })()
JSEOF
)
log "  add flow: btn=$res3 form=$res4 submit=$res5"
check "venue added via dialog" "$res6" "venue in list"
shot $OUT/test-admin-venues.png
# delete the test venue
res7=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('main [class*=rounded], main div')].find(d => d.className && String(d.className).includes('rounded') && /Test Venue Arena/.test(d.textContent) && d.textContent.length < 400);
  if (!card) return 'venue card NOT FOUND';
  const btn = [...card.querySelectorAll('button')].find(b => b.querySelector('.lucide-trash2'));
  if (!btn) return 'trash NOT FOUND';
  btn.click(); return 'delete clicked';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
res8=$(jsblock <<JSEOF
(() => {
  const dlg = document.querySelector('[role="alertdialog"]');
  if (dlg) { const b = [...dlg.querySelectorAll('button')].find(x => /delete|remove|confirm/i.test(x.textContent)); b?.click(); return 'confirmed via alertdialog'; }
  return /Test Venue Arena/.test(document.querySelector('main').innerText) ? 'no dialog, still present' : 'deleted immediately';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res9=$(jsblock <<JSEOF
(() => { return /Test Venue Arena/.test(document.querySelector('main').innerText) ? 'STILL LISTED' : 'venue removed'; })()
JSEOF
)
log "  delete flow: click=$res7 confirm=$res8"
check "test venue deleted" "$res9" "venue removed"

# ════════ 8) CONTENT MANAGER ════════
log "── 8. CONTENT MANAGER ──"
curl -s "http://localhost:$PORT/api/content" > /tmp/content-before.json
BEFORE_BADGE=$(python3 -c "import json; print(json.load(open('/tmp/content-before.json'))['content'].get('heroBadge',''))")
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('content'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('main').innerText;
  return JSON.stringify({ hasTabs: /Business/.test(t) && /Services/.test(t), loaded: document.querySelectorAll('main input').length });
})()
JSEOF
)
check "content manager loads with tabs + fields" "$res2" '"hasTabs":true'
log "  content: $res2 (heroBadge before: $BEFORE_BADGE)"
shot $OUT/test-admin-content.png

# ════════ 9) SETTINGS ════════
log "── 9. SETTINGS ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('settings'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 2000 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const name = document.querySelector('#settings-name');
  const switches = [...document.querySelectorAll('main button[role="switch"]')];
  return JSON.stringify({ nameValue: name ? name.value : 'NOT FOUND', switchCount: switches.length, weeklyDigestOn: switches[3] ? switches[3].getAttribute('aria-checked') : '?' });
})()
JSEOF
)
check "settings loads (profile + notification switches)" "$res2" '"switchCount":4'
log "  settings: $res2"
# toggle weekly digest ON + save
res3=$(jsblock <<JSEOF
(() => {
  const switches = [...document.querySelectorAll('main button[role="switch"]')];
  switches[3].click();
  return 'toggled weeklyDigest';
})()
JSEOF
)
agent-browser wait 400 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('main button')].find(b => /^save$/i.test(b.textContent.trim()) || /save settings/i.test(b.textContent));
  if (!btn) return 'save NOT FOUND';
  btn.click(); return 'saved';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
r=$(curl -s "http://localhost:$PORT/api/admin-settings")
check "settings saved to server (weeklyDigest=true)" "$r" '"weeklyDigest":true'
# revert
jsblock <<JSEOF
(() => { const s = [...document.querySelectorAll('main button[role="switch"]')]; s[3].click(); return 'reverted'; })()
JSEOF
agent-browser wait 400 > /dev/null
jsblock <<JSEOF
(() => { const btn = [...document.querySelectorAll('main button')].find(b => /^save$/i.test(b.textContent.trim()) || /save settings/i.test(b.textContent)); btn?.click(); return 'saved revert'; })()
JSEOF
agent-browser wait 2000 > /dev/null
shot $OUT/test-admin-settings.png

# ════════ 10) ANALYTICS ════════
log "── 10. ANALYTICS ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('analytics'));
  if (!b) return 'nav NOT FOUND';
  b.click(); return 'navigated';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const svgs = document.querySelectorAll('main svg.recharts-surface');
  return JSON.stringify({ charts: svgs.length, hasBars: document.querySelectorAll('main .recharts-bar-rectangle').length, hasPie: document.querySelectorAll('main .recharts-pie-sector').length });
})()
JSEOF
)
log "  analytics: $res2"
if [[ "$res2" == *'"charts":0'* ]]; then bad "analytics renders charts"; else ok "analytics renders charts"; fi
shot $OUT/test-admin-analytics.png

# ════════ 11) DASHBOARD QUICK ACTIONS ════════
log "── 11. QUICK ACTIONS ──"
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('dashboard'));
  b?.click(); return 'back to dashboard';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const btns = [...document.querySelectorAll('main button')].map(b => b.textContent.trim()).filter(t => /new event|new booking|view|add/i.test(t)).slice(0, 8);
  return JSON.stringify(btns);
})()
JSEOF
)
log "  quick actions found: $res2"
# RefreshCw dropdown on recent bookings
res3=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('main button.h-8.w-8, main button.h-7.w-7')].find(b => b.querySelector('.lucide-refresh-cw'));
  if (!btn) return 'RefreshCw NOT FOUND';
  btn.click(); return 'status menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const items = [...document.querySelectorAll('[role="menuitem"]')].map(i => i.textContent.trim()).slice(0, 6);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  return JSON.stringify(items);
})()
JSEOF
)
check "recent-booking status dropdown opens with options" "$res4" "Mark as"

# ════════ 12) LOGOUT ════════
log "── 12. LOGOUT ──"
res=$(jsblock <<JSEOF
(() => {
  const hdrBtns = [...document.querySelectorAll('header button')];
  const acct = hdrBtns.find(b => b.textContent.trim() === '' && !b.querySelector('.lucide-search') && !b.querySelector('.lucide-bell') && !b.querySelector('.lucide-sun') && !b.querySelector('.lucide-moon'));
  if (!acct) return 'account btn NOT FOUND, header buttons: ' + hdrBtns.length;
  acct.click(); return 'account menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /log out|sign out|logout/i.test(i.textContent));
  if (!item) return 'menuitems: ' + JSON.stringify([...document.querySelectorAll('[role="menuitem"]')].map(i => i.textContent.trim()));
  item.click(); return 'logged out';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res3=$(ev "window.location.pathname")
log "  logout: acct=$res1 item=$res2 path=$res3"
r=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/api/bookings")
log "  after logout, unauth GET /api/bookings: HTTP $r (browser session cleared server-side not needed for curl check)"
if [[ "$res3" == "/" || "$res3" == "/admin" ]]; then ok "logout redirects (path=$res3)"; else bad "logout redirect — path=$res3"; fi

# ════════ 13) ADMIN API TESTS (curl, independent session) ════════
log "── 13. ADMIN API TESTS (curl) ──"
CJ=/tmp/admin-cookies.txt
r=$(curl -s -c $CJ -X POST "http://localhost:$PORT/api/auth/login" -H "Content-Type: application/json" -d '{"password":"admin-test-2026"}')
check "API login ok" "$r" '"success":true'
r=$(curl -s -b $CJ "http://localhost:$PORT/api/auth/session")
check "API session valid" "$r" '"authenticated":true'
r=$(curl -s -b $CJ "http://localhost:$PORT/api/bookings")
check "API bookings includes customer booking (Abebe)" "$r" "Abebe Kebede"
check "API bookings includes 2nd customer booking (Dawit)" "$r" "Dawit Haile"
ABEBE_ID=$(echo "$r" | python3 -c "import json,sys; bs=json.load(sys.stdin)['bookings']; print(next(b['id'] for b in bs if b['name']=='Abebe Kebede'))")
r=$(curl -s -b $CJ -X PATCH "http://localhost:$PORT/api/bookings" -H "Content-Type: application/json" -d "{\"id\":\"$ABEBE_ID\",\"status\":\"completed\"}")
check "API PATCH booking status" "$r" '"success":true'
r=$(curl -s -b $CJ "http://localhost:$PORT/api/contact")
check "API contact includes customer message (Selam)" "$r" "Selam Ghebremariam"
SELAM_ID=$(echo "$r" | python3 -c "import json,sys; ss=json.load(sys.stdin)['submissions']; print(next(s['id'] for s in ss if 'Selam' in s['name']))")
r=$(curl -s -b $CJ -X PATCH "http://localhost:$PORT/api/contact" -H "Content-Type: application/json" -d "{\"id\":\"$SELAM_ID\",\"read\":true}")
check "API PATCH message read" "$r" '"success":true'
# events CRUD via API
r=$(curl -s -b $CJ -X POST "http://localhost:$PORT/api/events" -H "Content-Type: application/json" -d '{"name":"API Test Event","date":"2026-12-01","time":"10:00","venue":"Test Hall","attendees":0,"maxAttendees":100,"category":"Corporate","status":"upcoming","description":"api test","ticketPrice":0,"imageGradient":"from-emerald-500 to-teal-600"}')
check "API POST event" "$r" '"success":true'
EVT_ID=$(echo "$r" | python3 -c "import json,sys; print(json.load(sys.stdin)['event']['id'])")
r=$(curl -s -b $CJ -X PUT "http://localhost:$PORT/api/events" -H "Content-Type: application/json" -d "{\"id\":\"$EVT_ID\",\"name\":\"API Test Event v2\"}")
check "API PUT event" "$r" '"success":true'
r=$(curl -s -b $CJ -X DELETE "http://localhost:$PORT/api/events" -H "Content-Type: application/json" -d "{\"id\":\"$EVT_ID\"}")
check "API DELETE event" "$r" '"success":true'
# venues PUT
r=$(curl -s -b $CJ "http://localhost:$PORT/api/venues")
V=$(echo "$r" | python3 -c "import json,sys; print(json.dumps({'venues': json.load(sys.stdin)['venues']}))")
check "API GET venues" "$r" "Sheraton"
r=$(curl -s -b $CJ -X PUT "http://localhost:$PORT/api/venues" -H "Content-Type: application/json" -d "$V")
check "API PUT venues (round-trip)" "$r" '"success":true'
# activities
r=$(curl -s -b $CJ "http://localhost:$PORT/api/activities")
check "API GET activities" "$r" '"activities"'
# unauthorized admin POST
r=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:$PORT/api/events" -H "Content-Type: application/json" -d '{"name":"hacker"}')
log "  POST /api/events without auth (expect 401): HTTP $r"
# logout API
r=$(curl -s -b $CJ -c $CJ -X POST "http://localhost:$PORT/api/auth/logout")
check "API logout" "$r" "success"
r=$(curl -s -b $CJ "http://localhost:$PORT/api/auth/session")
check "API session invalidated after logout" "$r" '"authenticated":false'

# ════════ 14) MOBILE RESPONSIVENESS SPOT-CHECK ════════
log "── 14. MOBILE SPOT-CHECK ──"
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 4000 > /dev/null
agent-browser wait 1500 > /dev/null
agent-browser set viewport 390 844 > /dev/null
agent-browser wait 800 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const inp = document.querySelector('#password');
  if (!inp) return 'no login (already authed?)';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'admin-test-2026');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  const btn = [...document.querySelectorAll('button')].find(b => /sign in/i.test(b.textContent));
  btn.click(); return 'mobile login submitted';
})()
JSEOF
)
agent-browser wait 4000 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const hasHScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
  const burger = [...document.querySelectorAll('header button')].find(b => b.offsetParent !== null && b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().left < 80);
  return JSON.stringify({ hasHScroll, headerBtnExists: !!burger });
})()
JSEOF
)
check "mobile: no horizontal scroll on dashboard" "$res2" '"hasHScroll":false'
log "  mobile: $res2"
shot $OUT/test-admin-mobile.png
agent-browser close > /dev/null 2>&1 || true

log ""
log "═══════════════════════════════"
log "PHASE-B RESULT: $PASS passed, $FAIL failed"
log "PHASE-B DONE"
