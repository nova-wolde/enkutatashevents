#!/bin/bash
# ─── Phase B3: final admin retest — corrected selectors + Radix pointer events ──
cd /home/z/my-project/enkutatashevents
PORT=8799
OUT=/home/z/my-project/scripts
LOG=/tmp/admin3-test.log
: > $LOG

log() { echo "$@" | tee -a $LOG; }
shot() { agent-browser screenshot "$1" > /dev/null 2>&1 || true; }
ev() { agent-browser eval "$1" 2>/dev/null; }
jsblock() { cat > /tmp/j.js; ev "$(cat /tmp/j.js)"; }

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); log "  ✅ PASS: $1"; }
bad()  { FAIL=$((FAIL+1)); log "  ❌ FAIL: $1 — got: $(echo "$2" | head -c 250)"; }
check() {
  local clean="${2//\\/}"
  if [[ "$clean" == *"$3"* ]]; then ok "$1"; else bad "$1" "$2"; fi
}
checkeq() {
  local clean="${2//\\/}"
  if [[ "$clean" == "$3" ]]; then ok "$1"; else bad "$1" "$2"; fi
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

# ════════ LOGIN ════════
log "── LOGIN ──"
agent-browser open "http://localhost:$PORT/admin" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1 || agent-browser wait 4000 > /dev/null
agent-browser set viewport 1440 900 > /dev/null
agent-browser wait 2000 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const inp = document.querySelector('#password');
  if (!inp) return 'already logged in';
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

# ════════ 1) SERVICE LABELS (FIX 2 verification) ════════
log "── 1. SERVICE LABELS IN BOOKING DETAIL ──"
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('bookings')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 1800 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Abebe Kebede/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  card.click(); return 'opened';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  const t = d.innerText;
  return JSON.stringify({ advert: t.includes('Advert & Promotion'), organization: t.includes('Event Organization') });
})()
JSEOF
)
log "  detail: $res | $res2"
check "service badge shows 'Advert & Promotion'" "$res2" '"advert":true'
check "service badge shows 'Event Organization'" "$res2" '"organization":true'
shot $OUT/test3-service-labels.png
jsblock <<JSEOF
(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 'esc'; })()
JSEOF
agent-browser wait 900 > /dev/null

# ════════ 2) DROPDOWN STATUS CHANGE (Radix pointer sequence) ════════
log "── 2. DROPDOWN STATUS CHANGE on Dawit (pending -> confirmed) ──"
res=$(jsblock <<JSEOF
(() => {
  window.rc = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const o = { bubbles: true, cancelable: true, pointerId: 1, isPrimary: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, button: 0 };
    el.dispatchEvent(new PointerEvent('pointerdown', o));
    el.dispatchEvent(new PointerEvent('pointerup', o));
    el.click();
    return true;
  };
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Dawit Haile/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  window.beforeStatus = (card.innerText.match(/Pending|Confirmed|Cancelled|Completed/) || ['?'])[0];
  const trigger = card.querySelector('button.h-8.w-8');
  if (!trigger) return 'trigger NOT FOUND';
  rc(trigger);
  return 'trigger activated, before=' + window.beforeStatus;
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const items = [...document.querySelectorAll('[role="menuitem"]')];
  if (!items.length) return 'NO MENU ITEMS';
  const item = items.find(i => /mark as confirmed/i.test(i.textContent));
  if (!item) return 'items: ' + JSON.stringify(items.map(i => i.textContent.trim()));
  window.rc(item);
  return 'clicked mark-as-confirmed, available=' + JSON.stringify(items.map(i => i.textContent.trim()));
})()
JSEOF
)
agent-browser wait 1800 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Dawit Haile/.test(c.textContent));
  if (!card) return 'card gone';
  return 'after=' + (card.innerText.match(/Pending|Confirmed|Cancelled|Completed/) || ['?'])[0];
})()
JSEOF
)
log "  dropdown: $res | $res2"
check "dropdown status change applies" "$res3" "after=Confirmed"
# restore pending via dropdown again
jsblock <<JSEOF
(() => { const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Dawit Haile/.test(c.textContent)); window.rc(card?.querySelector('button.h-8.w-8')); return 'ok'; })()
JSEOF
agent-browser wait 900 > /dev/null
jsblock <<JSEOF
(() => { const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /mark as pending/i.test(i.textContent)); window.rc(item); return 'restored'; })()
JSEOF
agent-browser wait 1500 > /dev/null

# ════════ 3) SETTINGS SAVE (Save Changes button) ════════
log "── 3. SETTINGS SAVE UI -> SERVER ──"
CJ=/tmp/admin3-cookies.txt
curl -s -c $CJ -X POST "http://localhost:$PORT/api/auth/login" -H "Content-Type: application/json" -d '{"password":"admin-test-2026"}' > /dev/null
BEFORE=$(curl -s -b $CJ "http://localhost:$PORT/api/admin-settings")
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('settings')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 2200 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const switches = [...document.querySelectorAll('main button[role="switch"]')];
  if (switches.length < 4) return 'switches: ' + switches.length;
  window.swBefore = switches[3].getAttribute('aria-checked');
  switches[3].click();
  return 'weeklyDigest ' + window.swBefore + ' -> toggled';
})()
JSEOF
)
agent-browser wait 500 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const btn = [...document.querySelectorAll('main button')].find(b => /save changes/i.test(b.textContent));
  if (!btn) return 'Save Changes NOT FOUND';
  if (btn.disabled) return 'DISABLED';
  btn.click(); return 'save clicked';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
AFTER=$(curl -s -b $CJ "http://localhost:$PORT/api/admin-settings")
log "  toggle: $res | $res2"
if [[ "$BEFORE" == *'"weeklyDigest":true'* && "$AFTER" == *'"weeklyDigest":false'* ]]; then
  ok "UI settings save persists (weeklyDigest true -> false)"
elif [[ "$BEFORE" == *'"weeklyDigest":false'* && "$AFTER" == *'"weeklyDigest":true'* ]]; then
  ok "UI settings save persists (weeklyDigest false -> true)"
else
  bad "settings save did not persist" "before weeklyDigest section: $(echo "$BEFORE" | grep -o '"weeklyDigest":[a-z]*') / after: $(echo "$AFTER" | grep -o '"weeklyDigest":[a-z]*')"
fi
# revert to original
jsblock <<JSEOF
(() => { const s = [...document.querySelectorAll('main button[role="switch"]')]; s[3].click(); return 'toggled back'; })()
JSEOF
agent-browser wait 500 > /dev/null
jsblock <<JSEOF
(() => { const btn = [...document.querySelectorAll('main button')].find(b => /save changes/i.test(b.textContent)); btn?.click(); return 'saved'; })()
JSEOF
agent-browser wait 3000 > /dev/null
RESTORED=$(curl -s -b $CJ "http://localhost:$PORT/api/admin-settings")
if [[ "$BEFORE" == *'"weeklyDigest":true'* && "$RESTORED" == *'"weeklyDigest":true'* ]]; then
  ok "settings reverted to original (weeklyDigest=true)"
elif [[ "$BEFORE" == *'"weeklyDigest":false'* && "$RESTORED" == *'"weeklyDigest":false'* ]]; then
  ok "settings reverted to original (weeklyDigest=false)"
else
  bad "settings revert mismatch" "$(echo "$RESTORED" | grep -o '"weeklyDigest":[a-z]*')"
fi

# ════════ 4) EVENTS CRUD — corrected combobox indices ════════
log "── 4. EVENTS CRUD (corrected) ──"
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('events')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 1600 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('main button')].find(x => /create event/i.test(x.textContent));
  if (!b) return 'Create Event btn NOT FOUND';
  b.click(); return 'dialog opened';
})()
JSEOF
)
agent-browser wait 1200 > /dev/null
res2=$(jsblock <<JSEOF
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
  return 'fields + calendar open';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const days = [...document.querySelectorAll('[role="dialog"] table button, [data-radix-popper-content-wrapper] table button')].filter(b => b.textContent.trim() === '15' && !b.disabled);
  if (!days.length) return 'day 15 NOT FOUND';
  days[0].click(); return 'date picked';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
# venue = combobox[0], category = combobox[1]
res4=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const combos = [...d.querySelectorAll('button[role="combobox"]')];
  if (combos.length < 2) return 'combos: ' + combos.length;
  combos[0].click(); return 'venue combobox opened (' + combos.length + ' combos)';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => /Sheraton/.test(o.textContent));
  opt?.click(); return 'venue picked';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res6=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const combos = [...d.querySelectorAll('button[role="combobox"]')];
  combos[1].click(); return 'category combobox opened';
})()
JSEOF
)
agent-browser wait 800 > /dev/null
res7=$(jsblock <<JSEOF
(() => {
  const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Corporate');
  opt?.click(); return 'category picked';
})()
JSEOF
)
agent-browser wait 700 > /dev/null
res8=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /^create event$/i.test(b.textContent.trim()));
  if (!btn) return 'submit NOT FOUND';
  if (btn.disabled) return 'SUBMIT DISABLED — validation missing field';
  btn.click(); return 'submitted';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
res9=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('main').innerText;
  return JSON.stringify({ listed: t.includes('Test Annual Gala 2026'), dialogClosed: !document.querySelector('[role="dialog"]') });
})()
JSEOF
)
log "  flow: btn=$res fill=$res2 date=$res3 venueOpen=$res4 venue=$res5 catOpen=$res6 cat=$res7 submit=$res8"
check "event created via header button (dialog closed)" "$res9" '"dialogClosed":true'
check "event appears in list" "$res9" '"listed":true'
shot $OUT/test3-event-created.png

# EDIT (row dropdown with pointer sequence)
res=$(jsblock <<JSEOF
(() => {
  const row = [...document.querySelectorAll('main table tbody tr')].find(r => r.textContent.includes('Test Annual Gala 2026'));
  if (!row) return 'row NOT FOUND';
  window.rc = window.rc || ((el) => { if (!el) return false; const r = el.getBoundingClientRect(); const o = { bubbles: true, cancelable: true, pointerId: 1, isPrimary: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2, button: 0 }; el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointerup', o)); el.click(); return true; });
  rc(row.querySelector('button.h-8.w-8'));
  return 'row menu opened';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /edit/i.test(i.textContent));
  if (!item) return 'NO edit item: ' + JSON.stringify([...document.querySelectorAll('[role="menuitem"]')].map(i => i.textContent.trim()));
  window.rc(item); return 'edit clicked';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return 'NO DIALOG';
  const inp = d.querySelector('#event-name');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(inp, 'Test Annual Gala 2027');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  return 'renamed in edit dialog';
})()
JSEOF
)
agent-browser wait 400 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /save changes/i.test(b.textContent));
  if (!btn) return 'Save Changes NOT FOUND';
  if (btn.disabled) return 'DISABLED';
  btn.click(); return 'saved';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('main').innerText;
  return JSON.stringify({ has2027: t.includes('Test Annual Gala 2027'), has2026: t.includes('Test Annual Gala 2026') });
})()
JSEOF
)
log "  edit: menu=$res item=$res2 rename=$res3 save=$res4"
check "event edit persists (2027 shown)" "$res5" '"has2027":true'
check "event edit replaces old name (2026 gone)" "$res5" '"has2026":false'

# DELETE
res=$(jsblock <<JSEOF
(() => {
  const row = [...document.querySelectorAll('main table tbody tr')].find(r => r.textContent.includes('Test Annual Gala 2027'));
  if (!row) return 'row NOT FOUND';
  window.rc(row.querySelector('button.h-8.w-8'));
  return 'menu opened';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(i => /delete/i.test(i.textContent));
  if (!item) return 'NO delete item';
  window.rc(item); return 'delete clicked';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const dlg = document.querySelector('[role="alertdialog"]');
  if (!dlg) return 'NO alertdialog';
  const btn = [...dlg.querySelectorAll('button')].find(b => /delete/i.test(b.textContent));
  if (!btn) return 'confirm btn NOT FOUND';
  btn.click(); return 'delete confirmed';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
res4=$(jsblock <<JSEOF
(() => {
  const t = document.querySelector('main').innerText;
  return t.includes('Test Annual Gala 2027') ? 'STILL LISTED' : 'removed from list';
})()
JSEOF
)
log "  delete: menu=$res item=$res2 confirm=$res3"
checkeq "event deleted (CRUD cycle complete)" "$res4" "removed from list"

# ════════ 5) MESSAGES DROPDOWN (pointer sequence) ════════
log "── 5. MESSAGES MARK UNREAD VIA DROPDOWN ──"
jsblock <<JSEOF
(() => { const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages')); b?.click(); return 'nav'; })()
JSEOF
agent-browser wait 1600 > /dev/null
res=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Selam Ghebremariam/.test(c.textContent));
  if (!card) return 'card NOT FOUND';
  window.rc(card.querySelector('button.h-8.w-8'));
  return 'dropdown opened';
})()
JSEOF
)
agent-browser wait 900 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const items = [...document.querySelectorAll('[role="menuitem"]')];
  if (!items.length) return 'NO MENU ITEMS';
  const item = items.find(i => /mark as unread|mark unread/i.test(i.textContent));
  if (!item) return 'items: ' + JSON.stringify(items.map(i => i.textContent.trim()));
  window.rc(item); return 'mark-unread clicked';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res3=$(jsblock <<JSEOF
(() => {
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages'));
  const m = b?.textContent.match(/\d+/);
  return 'badge=' + (m ? m[0] : 'none');
})()
JSEOF
)
log "  unread: $res | $res2"
check "mark-unread via dropdown increments badge to 2" "$res3" "badge=2"
# re-mark read via detail dialog
res4=$(jsblock <<JSEOF
(() => {
  const card = [...document.querySelectorAll('.cursor-pointer')].find(c => /Selam Ghebremariam/.test(c.textContent));
  card?.click(); return 'detail opened';
})()
JSEOF
)
agent-browser wait 1400 > /dev/null
res5=$(jsblock <<JSEOF
(() => {
  const d = document.querySelector('[role="dialog"]');
  const btn = [...d.querySelectorAll('button')].find(b => /mark read/i.test(b.textContent));
  if (!btn) return 'Mark Read btn NOT FOUND';
  btn.click(); return 'marked read';
})()
JSEOF
)
agent-browser wait 1500 > /dev/null
res6=$(jsblock <<JSEOF
(() => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  const b = [...document.querySelectorAll('aside button')].find(x => x.textContent.trim().toLowerCase().startsWith('messages'));
  const m = b?.textContent.match(/\d+/);
  return 'badge=' + (m ? m[0] : 'none');
})()
JSEOF
)
log "  read: $res4 | $res5"
check "mark-read via detail decrements badge to 1" "$res6" "badge=1"

# ════════ 6) LOGOUT VIA AVATAR (pointer sequence) ════════
log "── 6. LOGOUT VIA AVATAR ──"
res=$(jsblock <<JSEOF
(() => {
  const hdrBtns = [...document.querySelectorAll('header button')];
  const avatar = hdrBtns.find(b => b.querySelector('.lucide-bell'))?.nextElementSibling;
  const target = avatar || hdrBtns[hdrBtns.length - 1];
  if (!target) return 'avatar NOT FOUND';
  window.rc(target);
  return 'avatar menu opened';
})()
JSEOF
)
agent-browser wait 1000 > /dev/null
res2=$(jsblock <<JSEOF
(() => {
  const items = [...document.querySelectorAll('[role="menuitem"]')];
  if (!items.length) return 'NO MENU ITEMS';
  const item = items.find(i => /sign out/i.test(i.textContent));
  if (!item) return 'items: ' + JSON.stringify(items.map(i => i.textContent.trim()));
  window.rc(item); return 'sign out clicked';
})()
JSEOF
)
agent-browser wait 3000 > /dev/null
res3=$(ev "window.location.pathname")
log "  logout: $res | $res2 | path=$res3"
checkeq "logout lands on public site" "$res3" "/"

log ""
log "═══════════════════════════════"
log "PHASE-B3 RESULT: $PASS passed, $FAIL failed"
log "PHASE-B3 DONE"
