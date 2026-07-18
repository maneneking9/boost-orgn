# Ayaba Shop — Services Expansion Plan

## Gathered information
- Frontend: `src/pages/Services.jsx` renders services from `src/db.js` using `localStorage`.
- `src/db.js` holds default services list (`DEFAULTS`) with ids 1–15.
- `src/pages/Services.jsx` currently hardcodes MTN/Airtel/BK/Equity sub-options using `SUB_OPTIONS` keyed by service id.
- Backend (`backend/server.js`) also supports CRUD for services at `/api/admin/services`, but the current UI does not appear to use it (it uses localStorage).

## Plan
1. Expand `DEFAULTS` in `src/db.js` by adding new service entries for the requested categories:
   - Irembo, MTN, Airtel, Artel agent, Bank agent, RRA, etc. (some already exist; add the missing ones)
   - Logo & image design
   - Mobile application & web designing
   - Printing & scanner
   - Films & songs sale
   - Photograph (photo services)
   - Video editing (enhance features)
   - Smaller electric devices sales
   - Kwiyigisha amategeko yumuhanda (road safety education)
   - Prime / subscription
   - Business maker / design & analysis
   - DJ mixer
   - Network installation
   - Install mobile application
   - Education in mobiles phone and computer
   - Live streaming
   - Hosting business into browser (web hosting)
2. Update `src/pages/Services.jsx` only if we introduce new services with `hasOptions` (sub-choice UI).
3. Ensure consistent UI rendering:
   - Add `photo: null` (optional) for new services.
   - Add `features` arrays for each new service.
4. Run `npm run lint` and `npm run build` to ensure everything works.


## Dependent files to edit
- `src/db.js`
- `src/pages/Services.jsx`

## Followup steps
- Run `npm run lint` and `npm run build`.
- Open `/services` page to verify new services show and modal works.

