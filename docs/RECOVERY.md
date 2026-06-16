# Enkutatash Events — Recovery & Operations Guide

> Read this if you're coming back to this project after months or years and need to remember how everything fits together. This document does **not** contain secrets — it tells you where each secret lives and how to retrieve or rotate it.

**Site:** https://enkutatashevents.com
**Repo:** https://github.com/nova-wolde/enkutatashevents
**Owner email (everything):** enkutatashevents@gmail.com

---

## 1. What this project is

A bilingual (English + Amharic) website for Enkutatash Event, an Addis Ababa event organizer (weddings, corporate events, concerts, cultural celebrations, stage/tent/sound/lighting rental, catering, decoration).

It has two faces:

- **Public landing page** at `/` — marketing site, booking dialog, contact form.
- **Owner dashboard** at `/?` (after login) — manage events, view messages and bookings, edit content. There is no link to it on the public site; the owner reaches it through the hidden entry points below.

### Tech stack at a glance

| Piece | What it is | Where it runs |
|---|---|---|
| Framework | **Vinext** (Next.js 16 App Router compiled for Cloudflare Workers via Vite) | n/a (dev tool) |
| Hosting | **Cloudflare Workers** (free tier — 100k requests/day) | `enkutatashevents.com` (custom domain) + `enkutatashevents.enkutatashevents.workers.dev` |
| Storage | **Upstash Redis** (free tier — 10k commands/day, 256 MB) | Cloud — host `more-stork-42589.upstash.io` |
| Auth | Owner-only password login → session cookie, session stored in Redis (7-day TTL) | Worker + Redis |
| Build | `vinext build` → produces `dist/client` (static assets) + `worker/index.ts` (server) | Local |

There's also a local SQLite database file (`db/custom.db`) referenced by `DATABASE_URL` in `.env`, but the live site does **not** use it — production runs entirely on Redis. The SQLite path is a legacy local-dev artifact.

---

## 2. Accounts you need

If you lose access to any of these, recovery is hard. **Make sure these emails and passwords are in a password manager.**

| Account | Login | Used for | Recovery |
|---|---|---|---|
| **Gmail** `enkutatashevents@gmail.com` | this is the *master* account — Cloudflare, Upstash, and the GitHub owner account all use it | everything | Google account recovery — make sure recovery phone + backup codes are saved |
| **GitHub** `nova-wolde` | (associated with the above Gmail) | owns the repo `nova-wolde/enkutatashevents` | github.com/settings/security — keep 2FA backup codes |
| **GitHub** `L3von36` | (associated with `rediwanjemal2018@gmail.com`) | this is what `git` and `gh` are configured with on this machine — **does NOT have push access to `nova-wolde/enkutatashevents`**; either invite this user as a collaborator or switch local auth to `nova-wolde` | n/a |
| **Cloudflare** | enkutatashevents@gmail.com — Account ID `7e044ab8735ed969385a6db2bf1ece04` | hosts the Worker, owns the `enkutatashevents.com` domain | dash.cloudflare.com — same Google login |
| **Upstash** | enkutatashevents@gmail.com | the Redis instance (`more-stork-42589`) | console.upstash.com — same Google login |
| **Domain registrar** | wherever `enkutatashevents.com` is registered (likely Cloudflare Registrar) | check `dash.cloudflare.com → Domains` | if separate from Cloudflare, log into the registrar and ensure NS records point to Cloudflare |

### Phone numbers shown on the site

`+251910977371` (primary, Call Us button), `+251915895757`, `+251915843131`. Set in `src/app/layout.tsx` (JSON-LD) and several components — search for `+251` to find all usages.

---

## 3. Where every secret lives

**Nothing sensitive should ever be committed to git.** Local `.env` was previously tracked by mistake — that was fixed in this session, but the file still exists on disk locally. If you re-clone, you'll need to recreate it.

### 3.1 Production secrets — Cloudflare Worker

Set via `wrangler secret put` against the `production` environment. To list (values are hidden):

```bash
npx wrangler secret list --env production
```

| Secret | What it is | How to set |
|---|---|---|
| `OWNER_PASSWORD` | password you type on the owner login screen | `npx wrangler secret put OWNER_PASSWORD --env production` |
| `UPSTASH_REDIS_REST_URL` | `https://more-stork-42589.upstash.io` | `npx wrangler secret put UPSTASH_REDIS_REST_URL --env production` |
| `UPSTASH_REDIS_REST_TOKEN` | the long token from Upstash console → DB → REST API tab | `npx wrangler secret put UPSTASH_REDIS_REST_TOKEN --env production` |

To rotate a secret, just run the `put` command again and paste the new value.

### 3.2 Local development — `.env` file

The file lives at `enkutatashevents/.env` and is **gitignored**. If `git status` ever shows `.env` modified, double-check with `git ls-files .env` — if it returns the path, the file is tracked and you must run `git rm --cached .env` before committing anything.

Minimum contents for local dev to work end-to-end:

```env
DATABASE_URL=file:./db/custom.db

# Owner login (local only — prod uses wrangler secret)
OWNER_PASSWORD=<pick-anything-for-local>

# Upstash Redis — same values as prod secrets, or a separate dev DB
UPSTASH_REDIS_REST_URL=https://more-stork-42589.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token-from-upstash-console>

# Social links (public — safe in .env)
NEXT_PUBLIC_INSTAGRAM=https://www.instagram.com/enkutatashevents/
NEXT_PUBLIC_FACEBOOK=https://web.facebook.com/profile.php?id=61590503624575
NEXT_PUBLIC_YOUTUBE=https://www.youtube.com/@Enkutatashevents
NEXT_PUBLIC_TELEGRAM=https://t.me/httpenkutatashevent
NEXT_PUBLIC_WHATSAPP=https://whatsapp.com/channel/0029VbDBLNS6WaKf4RGzel3r
```

> ⚠️ Pointing local dev at the production Upstash DB means every login attempt, rate-limit increment, and content write hits live data. For safer dev, create a second free Upstash DB and use those creds locally.

---

## 4. How to log in as the owner

There is **no Owner Login button** on the public site (intentional — added in commit "hide Owner Login from public nav"). Three ways in:

1. Visit `https://enkutatashevents.com/mesfin` — flips to login screen and redirects to `/`.
2. From the landing page, press `Ctrl+Shift+L` (or `Cmd+Shift+L` on Mac).
3. Visit `/admin` (existing route, still works).

Password: whatever was set as `OWNER_PASSWORD` in Cloudflare Worker secrets. If you don't remember it, run `npx wrangler secret put OWNER_PASSWORD --env production` to set a new one — there is no way to read the existing value.

---

## 5. Coming back after a long time — full recovery

Follow this in order. Assumes a fresh machine with nothing installed.

### 5.1 Install prerequisites

- **Node.js 20+** — https://nodejs.org
- **Git** — https://git-scm.com
- **GitHub CLI** (optional, helpful) — https://cli.github.com

### 5.2 Get the code

```bash
gh auth login                                    # log in as nova-wolde
gh repo clone nova-wolde/enkutatashevents
cd enkutatashevents
npm install                                      # ~20 min the first time
```

### 5.3 Get the secrets back

If you don't have local `.env` saved:

1. Cloudflare console → Workers & Pages → `enkutatashevents` → Settings → Variables — confirms the three secret names exist (values hidden).
2. Upstash console → your DB → REST API tab — copy `UPSTASH_REDIS_REST_URL` and the token. Paste into local `.env`.
3. For `OWNER_PASSWORD` locally, pick anything. The prod password lives only in the Cloudflare Worker secret; if you forgot it, set a new one with `npx wrangler secret put OWNER_PASSWORD --env production`.

### 5.4 Verify local works

```bash
npm run dev
# open http://localhost:3000 — should show landing page
# open http://localhost:3000/mesfin — should bounce to login screen
```

### 5.5 Deploy

```bash
npx wrangler login         # if not already logged in
npm run build              # builds dist/client + worker
npm run deploy             # uploads worker to Cloudflare
```

After deploy, verify `https://enkutatashevents.com/` loads and `/mesfin` shows the login.

---

## 6. Day-to-day operations

### Update site content

Log in as owner → "Content" tab in the dashboard. Changes are saved to Redis. No redeploy needed.

### Change the owner password

```bash
npx wrangler secret put OWNER_PASSWORD --env production
# type new value at prompt
```

Existing sessions in Redis stay valid until they expire (7 days) — to invalidate them immediately, flush the relevant Redis keys via `npx wrangler` or the Upstash console.

### Add or change a phone number / social link

- **Phone numbers** are mostly hardcoded — search for `+251` and `tel:` across `src/`.
- **Social links** are env-driven (`NEXT_PUBLIC_*` in `.env` for local, same vars set as plain Worker vars on Cloudflare for prod). Update in both places, then redeploy.

### Add a new admin route

Create `src/app/<route>/page.tsx` as a Next.js App Router page. If it should be auth-protected, mirror what `src/app/admin/page.tsx` does (it gates on the session cookie).

### Push code to GitHub

The local `main` may be ahead of `origin/main`. To push:

```bash
git push origin main
```

If you get `403 denied to L3von36` (or similar), your local gh auth is the wrong account. Fix:

```bash
gh auth switch            # if both accounts logged in
# or
gh auth login             # add the nova-wolde account
```

---

## 7. Cost & quota watch-points

Everything is free tier today. The site will quietly start failing if any of these run out:

- **Cloudflare Workers** — 100k requests/day. Check `dash.cloudflare.com → Workers & Pages → enkutatashevents → Metrics`.
- **Upstash Redis** — 10k commands/day, 256 MB. Each login = ~3 commands; each content fetch = ~1; rate-limit checks = ~2/request. Check `console.upstash.com → DB → Details`.
- **Domain renewal** — `enkutatashevents.com` renewal date — see Cloudflare → Domains. Set an auto-renew alarm.

---

## 8. If things break

| Symptom | Likely cause | Fix |
|---|---|---|
| Login returns "Invalid password" no matter what | `OWNER_PASSWORD` secret not set, or you're typing the local-dev one against prod | `npx wrangler secret list --env production` to confirm; `put` to reset |
| Login returns 503 "Upstash Redis is not configured" | `UPSTASH_REDIS_REST_URL/TOKEN` secrets missing or wrong | reset both secrets, verify against Upstash console values |
| Landing page shows fallback hardcoded data | API can't reach Redis | check Upstash quota, REST URL/token correctness |
| Build fails locally but worked before | `node_modules` mismatch — delete and reinstall | `rm -rf node_modules && npm install` |
| `wrangler deploy` says not logged in | OAuth token expired | `npx wrangler login` |
| Push to GitHub gets 403 | wrong account active in `gh` | `gh auth switch` or `gh auth login` |

---

## 9. Important files to know

| Path | What it does |
|---|---|
| `src/app/page.tsx` | Top-level switch between `landing` / `login` / `app` views. Hosts the `Ctrl+Shift+L` keyboard shortcut. |
| `src/app/mesfin/page.tsx` | Hidden owner-login entry: flips to login state and redirects to `/`. |
| `src/app/admin/page.tsx` | Alternate admin entry. |
| `src/app/api/auth/login/route.ts` | Login endpoint — checks `OWNER_PASSWORD`, creates Redis session, sets cookie. |
| `src/components/event-organizer/landing-page.tsx` | The public marketing page. |
| `src/components/event-organizer/login-page.tsx` | Owner login screen. |
| `src/components/event-organizer/store.ts` | Zustand store — holds `appView`, events, messages, bookings. |
| `src/lib/kv-data.ts` | All Redis read/write helpers. Returns null/no-op if Redis isn't configured. |
| `src/lib/auth-helpers.ts` | Password compare (Web Crypto), rate limiting, session token generation. |
| `wrangler.toml` | Cloudflare Worker config — environments, custom domain, vars. |
| `package.json` | Scripts: `dev`, `build`, `deploy`, `start`. |
| `.env` | Local env vars (gitignored). |
| `docs/Enkutatash_Events_Deployment_Guide.docx` | Older deployment doc. ⚠️ Contains live credential values — treat as sensitive. |

---

## 10. Security notes worth remembering

- The older `docs/Enkutatash_Events_Deployment_Guide.docx` was committed in commit `5ed1397` and contains a **live Cloudflare API token** and other secrets. Anyone with repo read access can extract them. If the repo is ever made public — or you suspect leak — **rotate that Cloudflare API token first** at `dash.cloudflare.com/profile/api-tokens`, then rotate the Upstash REST token, then change `OWNER_PASSWORD`.
- `.env` was tracked in git until this session. The version in old commits (`git show HEAD~1:.env`) does not contain secrets — only the `DATABASE_URL` path and public social URLs — so no rotation needed for that file specifically.
- Session cookie (`enkutatash_session`) is HTTP-only, secure, and SameSite=lax. Stored in Redis with 7-day TTL.

---

*Last updated: June 2026 — Owner Login was moved off the public nav; access is now via `/mesfin`, `Ctrl+Shift+L`, or `/admin`.*
