#!/bin/bash
# verify-live-brand.sh — live production verification of brand swap
CB=$RANDOM$RANDOM
BASE="https://enkutatashevents.com"
echo "=== LIVE ASSET CHECKS (cache-busted) ==="
for path in /favicon.ico /favicon-32x32.png /favicon-192.png /enkutatash-mark-512.png /enkutatash-mark-512-maskable.png /enkutatash-logo.png /apple-touch-icon.png /manifest.json; do
  out=$(curl -s -o /dev/null -w "%{http_code} %{size_download}B %{content_type}" "$BASE$path?cb=$CB")
  echo "$path -> $out"
done
echo "=== LIVE MANIFEST ICONS ==="
curl -s "$BASE/manifest.json?cb=$CB" | python3 -c "import json,sys; m=json.load(sys.stdin); print('theme_color:', m['theme_color']); [print(' icon:', i['src'], i['sizes'], i['purpose']) for i in m['icons']]"
echo "=== LIVE HEAD LINKS ==="
curl -s "$BASE/?cb=$CB" | rg -o '<link rel="(icon|apple-touch-icon|manifest)"[^>]*>' | head -8
