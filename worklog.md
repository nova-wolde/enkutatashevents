---
Task ID: 2
Agent: full-stack-developer
Task: Remove all hardcoded data, make everything dynamic with admin management

Work Log:
- Created /api/content CRUD API (route.ts) with full seed data for all site content
- Created /api/events CRUD API for dashboard events management
- Created /api/activities API for activity feed
- Created content-manager.tsx admin view with 8 tabs (Business, Hero & About, Services, Testimonials, Portfolio, Stats, Venues, Team)
- Updated landing-page.tsx to fetch all content from /api/content instead of hardcoded arrays
- Added icon lookup mapping for dynamic icon resolution
- Updated page.tsx to fetch events/activities from APIs and added Content view
- Updated sidebar.tsx to add Content nav item
- Updated store.ts to add 'content' ViewTab
- Updated settings-view.tsx to fetch venues/categories from /api/content
- Updated create-event-dialog.tsx to fetch venues/categories from /api/content
- Updated venues-view.tsx to fetch venues from /api/content
- Removed data.ts dependency from all components
- Seeded initial content with all current hardcoded values
- Build succeeded and all APIs tested successfully

Stage Summary:
- All data is now dynamic and managed from admin
- Landing page fetches from /api/content on mount with loading state
- Admin Content Manager allows full CRUD for all site content
- Site looks identical after migration - all seed data preserved
- 3 new API endpoints: /api/content, /api/events, /api/activities
- New Content Manager view accessible from sidebar
