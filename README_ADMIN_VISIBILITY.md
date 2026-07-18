# Admin visibility / backend services visibility

## Current behavior
- **Frontend (public services page)** uses `src/db.js` (then stored in localStorage).
- **Backend API public services** uses `backend/db.json`:
  - `GET /api/services` reads `backend/db.json` → `services`.
  - Admin dashboard in the UI uses **frontend localStorage** via `src/db.js`.

## Important note for your request
- If you want the **backend to “show services”** (for logged-in admin dashboards that call backend APIs), you must keep `backend/db.json` in sync with `src/db.js`.

## Next step
- Sync `backend/db.json.services` so that all services are visible.
- Update backend UI logic (if needed) to fetch from backend instead of localStorage.

