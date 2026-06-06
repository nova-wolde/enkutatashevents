---
Task ID: pre-deploy-checklist
Agent: Main Agent
Task: Research and implement all pre-deployment checklist items for Enkutatash Event website

Work Log:
- Researched comprehensive pre-deployment requirements using web search and codebase analysis
- Identified 12+ critical, high, and medium priority items
- Implemented all critical (🔴) and high-priority (🟡) items:

1. Caddyfile: Rewrote for enkutatashevents.com with auto-HTTPS (Let's Encrypt), removed dangerous XTransformPort handler, added gzip/zstd compression, structured JSON logging, security headers, and static asset caching
2. Login brute-force protection: Added 5-attempt lockout (15-min cooldown), login-specific rate limiting in middleware (10 req/min), timing-safe password comparison using crypto.timingSafeEqual
3. Cookie consent gating: Analytics (GA4, Meta Pixel) now only load after user explicitly accepts cookies — GDPR compliant. Consent checked via localStorage before script injection.
4. Health check endpoint: Created /api/health with data directory checks, memory stats, uptime, response time
5. API auth protection: All mutating API routes (events POST/PUT/DELETE, bookings GET/PATCH/DELETE, contact GET/PATCH/DELETE, content PUT/PATCH/POST, activities GET/POST) now require session authentication
6. Data backup: Created backup-data.sh script with 30-day retention, tested successfully
7. Rate limiter improvements: Added memory cap (10,000 entries max), login-specific rate limit (10 req/min), proper cleanup
8. Server.js improvements: Graceful shutdown (SIGTERM/SIGINT with 10s force-kill timeout), unhandled rejection/exception handlers, HOSTNAME=0.0.0.0 binding
9. Cookie consent revocation: Added "Cookie Settings" + "Privacy Policy" links in footer, re-shows consent banner on click
10. PM2 setup: Created logs/ directory, ecosystem.config.js verified
11. Removed 6 redundant startup scripts (daemon.js, daemon-server.js, keep-alive.sh, run-server.sh, start-server.sh, watchdog.sh)
12. Built and tested production deployment: all tests passing

Stage Summary:
- Server running on port 3000 with all improvements
- Health check: { status: "healthy", uptime: 3s, memory: 28MB used }
- Login lockout: Works after 5 failed attempts
- API auth: All mutating routes return 401 without session
- Public endpoints: Events GET, Content GET, Contact POST, Bookings POST all working
- Build: Successful, all routes compiled
