#!/bin/bash
# ─── Phase B2: retest of fixed items + previously ambiguous results ──────────
# Fixes under test: (1) events view Create Event button, (2) service labels
# in booking detail, (3) contact form label. Plus: dropdown status change,
# status filter, logout, settings save verification (authed curl).
cd /home/z/my-project/enkutatashevents
PORT=8799
OUT=/home/z/my-project/scripts
LOG=/tmp/admin2-test.log
: > $LOG

log() { echo "$@" | tee -a $LOG; }
shot() { agent-browser screenshot "$1" > /dev/null 2>&1 || true; }
ev() { agent-browser eval "$1" 2>/dev/null; }
jsblock() { cat > /tmp/j.js; ev "$(cat /tmp/j.js)"; }

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); log "  ✅ PASS: $1"; }
bad()  { FAIL=$((FAIL+1)); log "  ❌ FAIL: $1 — got: $(echo "$2" | head -c 220)"; }
# agent-browser eval returns JSON-escaped strings (\" instead of ") — strip backslashes
check() {
  local clean="${2//\\/}"
  if [[ "$clean" == *"$3"* ]]; then ok "$1"; else bad "$1" "$2"; fi
}

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
log "SERVER: up after ${i}s"

# ════════ 0) VERIFY FIX 3: contact form label ════════
log "── 0. CONTACT FORM LABEL FIX (public site) ──"
agent-browser open "http://localhost:$PORT/#contact" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 4000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null
agent-browser wait 1500 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const form = document.querySelector('#contact form');
  if (!form) return 'form NOT FOUND';
  const labels = [...form.querySelectorAll('label')].map(l => l.textContent.trim());
  return JSON.stringify(labels);
})()
JSEOF
)
check "contact form shows Event Type label (not Event Date)" "$res" "Event Type"
if [[ "$res" == *"Event Date"* ]]; then bad "old Event Date label still present" "$res"; else ok "old 'Event Date' label removed"; fi

# ════════ 1) LOGIN ════════
log "── 1. LOGIN ──"
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 4000 > /dev/null
agent-browser wait 2000 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const inp = document.querySelector('#password');
  if (!inp) return 'already logged in?';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'admin-test-2026');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  const btn = [...document.querySelectorAll('button')].find(b => /sign in/i.test(b.textContent));
  btn.click(); return 'logged in';
})()
JSEOF
)
agent-browser wait 4000 > /dev/null
log "  login: $res"

# ════════ 2) SERVICE LABELS IN BOOKING DETAIL (FIX 2) ════════
log "── 2. SERVICE LABELS IN BOOKING DETAIL (FIX 2) ──"
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('bookings')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 1500 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Abebe Kebede/.test(c.textContent));
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
  const badges = [...d.querySelectorAll('[role="dialog"] .text-\\[10px\\], [role="dialog"] span')].map(s => s.textContent.trim());
  const t = d.innerText;
  return JSON.stringify({ advertLabel: /Advert & Promotion/.test(t), orgLabel: /Event Organization/.test(t), rawAdvert: /(^|\n)advert(\n|$)/.test(t) });
})()
JSEOF
)
log "  detail badges: $res2"
check "service label 'Advert & Promotion' shown" "$res2" '"advertLabel":true'
check "service label 'Event Organization' shown" "$res2" '"orgLabel":true'
jsblock <<JSEOF
(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 'esc'; })()
JSEOF
agent-browser wait 900 > /dev/null
shot $OUT/test2-booking-service-labels.png

# ════════ 3) DROPDOWN STATUS CHANGE (retest) ════════
log "── 3. DROPDOWN STATUS CHANGE (retest on Dawit: pending -> confirmed) ──"
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Dawit Haile/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  const before = (card.innerText.match(/Pending|Confirmed|Cancelled|Completed/) || ['?'])[0];
  const btn = card.querySelector('button.h-8.w-8');
  if (!btn) return 'dropdown trigger NOT FOUND, status=' + before;
  btn.click();
  return 'opened, status before=' + before;
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /mark as confirmed/i.test(i.textContent));
  if (!item) return 'menuitems: ' + JSON.stringify([...document.querySelectorAll('[role="menuitem"]')].map(i => i.textContent.trim()));
  item.click(); return 'clicked mark-as-confirmed';
})()
JSEOF
)
agent-browser wait 1800 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Dawit Haile/.test(c.textContent));
  if (!card) return 'card gone';
  return 'status after=' + (card.innerText.match(/Pending|Confirmed|Cancelled|Completed/) || ['?'])[0];
})()
JSEOF
)
log "  dropdown: $res | $res2"
check "dropdown status change applies (Confirmed)" "$res3" "status after=Confirmed"
# restore to pending
jsblock <<JSEOF
(() => { const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Dawit Haile/.test(c.textContent)); card?.querySelector('button.h-8.w-8')?.click(); return 'ok'; })()
JSEOF
agent-browser wait 700 > /dev/null
jsblock <<JSEOF
(() => { const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /mark as pending/i.test(i.textContent)); item?.click(); return 'restored'; })()
JSEOF
agent-browser wait 1500 > /dev/null

# ════════ 4) STATUS FILTER (retest: Completed -> Abebe) ════════
log "── 4. STATUS FILTER (retest) ──"
res=$(jsblock <<JSEOF
(() => {
  const trig = [...document.querySelectorAll('main button[role="combobox"]')].find(b => /All Status|Pending|Confirmed|Completed|Cancelled/.test(b.textContent));
  if (!trig) return 'combobox NOT FOUND';
  trig.click(); return 'opened';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Completed');
  if (!opt) return 'NOT FOUND';
  opt.click(); return 'filtered Completed';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const cards = [...document.querySelectorAll('.cursor-pointer')].filter(c => /guests/.test(c.textContent));
  return JSON.stringify({ count: cards.length, names: cards.map(c => (c.innerText.match(/([A-Z][a-z]+ [A-Z][a-z]+)/) || [''])[0]) });
})()
JSEOF
)
log "  filter: $res | $res2 | $res3"
check "status filter Completed shows Abebe (completed via API)" "$res3" "Abebe"
# reset
jsblock <<JSEOF
(() => { const t = [...document.querySelectorAll('main button[role="combobox"]')].find(b => /Completed/.test(b.textContent)); t?.click(); return 'ok'; })()
JSEOF
agent-browser wait 600 > /dev/null
jsblock <<JSEOF
(() => { const o = [...document.querySelectorAll('[role="option"]')].find(x => x.textContent.trim() === 'All Status'); o?.click(); return 'ok'; })()
JSEOF
agent-browser wait 600 > /dev/null

# ════════ 5) EVENTS CRUD VIA NEW CREATE BUTTON (FIX 1) ════════
log "── 5. EVENTS CRUD (with new Create Event button) ──"
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('events')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 1500 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('main button')].find(x => /create event/i.test(x.textContent));
  if (!b) return 'Create Event button STILL NOT FOUND';
  b.click(); return 'dialog opened via header button';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
check "events view now has working Create Event button" "$res" "dialog opened"

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
  setV(d.querySelector('#event-desc'), 'E2E test gala.');
  setV(d.querySelector('#max-attendees'), '250');
  setV(d.querySelector('#ticket-price'), '500');
  const dateBtn = [...d.querySelectorAll('button')].find(b => /pick a date/i.test(b.textContent));
  dateBtn?.click();
  return 'fields filled + calendar opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const days = [...document.querySelectorAll('[role="dialog"] table button, [data-radix-popper-content-wrapper] table button')].filter(b => b.textContent.trim() === '15' && !b.disabled);
  if (!days.length) return 'day 15 NOT FOUND';
  days[0].click(); return 'picked 15th';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const trig = [...d.querySelectorAll('button[role="combobox"]')][0];
  trig?.click(); return trig ? 'venue opened' : 'combobox NOT FOUND';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => /Sheraton/.test(o.textContent));
  opt?.click(); return 'venue picked';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const trig = [...d.querySelectorAll('button[role="combobox"]')][0];
  trig?.click(); return 'category opened';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res6=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Corporate');
  opt?.click(); return 'category picked';
})()
JSEOF
)
agent-browser wait 600 > /dev/null
res7=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /^create event$/i.test(b.textContent.trim()));
  if (!btn) return 'submit NOT FOUND';
  btn.click(); return 'submitted';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res8=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('main').innerText;
  return JSON.stringify({ listed: /Test Annual Gala 2026/.test(t), dialogClosed: !document.querySelector('[role="dialog"]') });
})()
JSEOF
)
log "  flow: fill=$res day=$res2 venueOpen=$res3 venue=$res4 catOpen=$res5 cat=$res6 submit=$res7"
check "event created via header button" "$res8" '"listed":true'
shot $OUT/test2-event-created.png

# edit
res=$(jsblock <<JSEOF
(() => {
  const row = [...document.querySelectorAll('main table tbody tr')].find(r => /Test Annual Gala 2026/.test(r.textContent));
  if (!row) return 'row NOT FOUND';
  const dd = row.querySelector('button.h-8.w-8');
  if (!dd) return 'row dropdown NOT FOUND';
  dd.click(); return 'menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /edit/i.test(i.textContent));
  item?.click(); return 'edit clicked';
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
  if (!btn) return 'save NOT FOUND';
  btn.click(); return 'saved';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res5=$(jsblock <<JSEOF
(() => { return /Test Annual Gala 2027/.test(document.querySelector('main').innerText) ? 'updated' : 'NOT updated'; })()
JSEOF
)
log "  edit: menu=$res item=$res2 rename=$res3 save=$res4"
check "event edit persists (2026 -> 2027)" "$res5" "updated"

# delete
res=$(jsblock <<JSEOF
(() => {
  const row = [...document.querySelectorAll('main table tbody tr')].find(r => /Test Annual Gala 2027/.test(r.textContent));
  if (!row) return 'row NOT FOUND';
  row.querySelector('button.h-8.w-8')?.click(); return 'menu opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /delete/i.test(i.textContent));
  item?.click(); return 'delete clicked';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const dlg = document.querySelector('[role="alertdialog"]');
  if (!dlg) return 'NO alertdialog';
  const btn = [...dlg.querySelectorAll('button')].find(b => /delete/i.test(b.textContent));
  if (!btn) return 'confirm NOT FOUND: ' + dlg.innerText.slice(0, 100);
  btn.click(); return 'confirmed';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
res4=$(jsblock <<JSEOF
(() => { return /Test Annual Gala 2027/.test(document.querySelector('main').innerText) ? 'STILL LISTED' : 'deleted'; })()
JSEOF
)
log "  delete: menu=$res item=$res2 confirm=$res3"
check "event deleted (full CRUD cycle)" "$res4" "deleted"

# ════════ 6) SETTINGS SAVE VERIFIED WITH AUTH COOKIE ════════
log "── 6. SETTINGS SAVE (verified via authed API) ──"
CJ=/tmp/admin2-cookies.txt
curl -s -c $CJ -X POST "http://localhost:$PORT/api/auth/login" -H "Content-Type: application/json" -d '{"password":"admin-test-2026"}' > /dev/null
BEFORE=$(curl -s -b $CJ "http://localhost:$PORT/api/admin-settings")
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('settings')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 2000 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const switches = [...document.querySelectorAll('main button[role="switch"]')];
  const weekly = switches[3];
  const before = weekly.getAttribute('aria-checked');
  weekly.click();
  return 'weeklyDigest before=' + before + ', toggled';
})()
JSEOF
)
agent-browser wait 400 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('main button')].find(b => /^save$/i.test(b.textContent.trim()));
  if (!btn) return 'save btn NOT FOUND';
  btn.click(); return 'save clicked';
})()
JSEOF
)
agent-browser wait 2500 > /dev/null
AFTER=$(curl -s -b $CJ "http://localhost:$PORT/api/admin-settings")
log "  toggle: $res | $res2"
if [[ "$BEFORE" == *'"weeklyDigest":true'* && "$AFTER" == *'"weeklyDigest":false'* ]]; then
  ok "UI settings save persists to server (true -> false)"
elif [[ "$BEFORE" == *'"weeklyDigest":false'* && "$AFTER" == *'"weeklyDigest":true'* ]]; then
  ok "UI settings save persists to server (false -> true)"
else
  bad "settings save did not persist" "before=$BEFORE after=$AFTER"
fi
# revert
BEFORE2="$AFTER"
jsblock <<JSEOF
(() => { const s = [...document.querySelectorAll('main button[role="switch"]')]; s[3].click(); return 'reverted'; })()
JSEOF
agent-browser wait 400 > /dev/null
jsblock <<JSEOF
(() => { const btn = [...document.querySelectorAll('main button')].find(b => /^save$/i.test(b.textContent.trim())); btn?.click(); return 'saved'; })()
JSEOF
agent-browser wait 2500 > /dev/null
AFTER2=$(curl -s -b $CJ "http://localhost:$PORT/api/admin-settings")
if [[ "$BEFORE2" == *'"weeklyDigest":true'* && "$AFTER2" == *'"weeklyDigest":false'* ]] || [[ "$BEFORE2" == *'"weeklyDigest":false'* && "$AFTER2" == *'"weeklyDigest":true'* ]]; then
  ok "settings revert also persists"
else
  bad "settings revert did not persist" "$AFTER2"
fi

# ════════ 7) MESSAGES MARK UNREAD/READ ROUND-TRIP (UI) ════════
log "── 7. MESSAGES MARK UNREAD/READ (UI) ──"
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 1500 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Selam Ghebremariam/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  card.querySelector('button.h-8.w-8')?.click();
  return 'dropdown opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /mark as unread/i.test(i.textContent));
  if (!item) return 'menuitems: ' + JSON.stringify([...document.querySelectorAll('[role="menuitem"]')].map(i => i.textContent.trim()));
  item.click(); return 'marked unread';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages'));
  const badge = b?.textContent.match(/\d+/);
  return 'unread badge=' + (badge ? badge[0] : 'none');
})()
JSEOF
)
log "  unread: $res | $res2 | $res3"
check "mark-as-unread increments badge" "$res3" "unread badge=2"
# mark back read via detail
res4=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Selam Ghebremariam/.test(c.textContent));
  card?.click(); return 'opened detail';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /mark read/i.test(b.textContent));
  if (!btn) return 'mark-read btn NOT FOUND';
  btn.click(); return 'marked read';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res6=$(jsblock <<JSEOF
(() => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages'));
  const badge = b?.textContent.match(/\d+/);
  return 'badge after read=' + (badge ? badge[0] : 'none');
})()
JSEOF
)
log "  read: $res4 | $res5 | $res6"
check "mark-as-read via detail dialog decrements badge" "$res6" "badge after read=1"

# ════════ 8) LOGOUT VIA AVATAR ════════
log "── 8. LOGOUT VIA AVATAR ──"
res=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('header button')].find(b => b.querySelector('.lucide-bell'))?.nextElementSibling || [...document.querySelectorAll('header button')].pop();
  if (!btn) return 'avatar NOT FOUND';
  btn.click(); return 'account menu opened';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /sign out/i.test(i.textContent));
  if (!item) return 'items: ' + JSON.stringify([...document.querySelectorAll('[role="menuitem"]')].map(i => i.textContent.trim()));
  item.click(); return 'sign out clicked';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
res3=$(ev "window.location.pathname")
log "  logout: $res | $res2 | path=$res3"
check "logout returns to public site" "$res3" "/"

log ""
log "═══════════════════════════════"
log "PHASE-B2 RESULT: $PASS passed, $FAIL failed"
log "PHASE-B2 DONE"
