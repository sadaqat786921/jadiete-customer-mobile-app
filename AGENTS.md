# Jadeite Systems · Customer app (mobile, Figma Make)

Clickable prototype of **My Jadeite**, the customer's phone app for Jadeite Glazing (windows, doors, bifolds, orangeries) — the same customers, jobs and flows as the Customer web portal, on the platform shared with the Office Admin, Sales portal, Surveyor and Installer apps.
React 19 + Vite + TypeScript, running inside Figma Make. Phone size **375 × 812**. On a desktop it shows inside a phone frame, centred on the page; on a real phone it fills the screen.

Customers only see their own job — never internal notes. Three demo customers (chosen on the sign-in screen). Demo "today" is Friday 16 Oct 2026.
- **Sarah & David Smith** (JG-10482) — before fitting: frames on the way (delivery Tue 20 Oct), fitting Thu 22 – Fri 23 Oct with Dan, Lee and Chris, stage payment £2,512 due.
- **Mrs Patel** (JG-10471) — fitted 8 – 9 Oct; Amir fixed both snags this morning; she checks and signs in the app, then the £802 final payment is released and the guarantee is published.
- **Mr Khan** (JG-10455) — orangery roof finished and paid; guarantee to 14 Oct 2036; aftercare.

## Development server
A Vite dev server is already running on `$PORT` (default 8443). Changes hot-reload in the preview.

## Structure
- `src/main.tsx` – entry: HashRouter → StoreProvider → App. Imports Sora font, `src/index.css`, `src/styles/app.css`.
- `src/App.tsx` – all routes, wrapped in the phone `Device` and a sign-in guard.
- `src/ui/kit.tsx` – phone frame, status bar, `Screen`, `Header`, bottom `TabBar` (Home, Dates, Payments, Messages, More), bottom `Sheet`, toasts, Tag, Avatar, Field, Check, Switch, Seg, Steps, SignaturePad, PhotoGrid.
- `src/ui/sheets.tsx` – the pop-ups: Pay (card or bank transfer), Ask to change the date, Review, Sign out.
- `src/lib/customer.tsx` – where the job is up to, things to do, getting-ready list, update icons, downloads (document, calendar).
- `src/pages/` – Auth (sign in, code, sign-in paused, invite email, welcome), Home, Dates (+ getting ready), Money (My order, Payments), Documents (+ document view), Messages, Help (help and aftercare, report a problem, request, check the repairs), More (+ my details, how we contact you, signing in, notifications).
- `src/data/portal.ts` – the three customers; `src/data/store.tsx` – demo state and every customer action (saved in sessionStorage; "Reset demo data" in More clears it).
- `public/images` – property photos and the Jadeite J logo (relative paths like `images/house.jpg`).

## Customer flow (matches the platform)
Office confirms contract & money → customer invited by email → sign in with email + one-time code (no password; 3 wrong codes pauses sign-in) → welcome, check details and how we contact you → Home: where the job is up to (Order agreed → Final survey → Being made → Delivery → Fitting → Final checks → All done), things to do, coming up → pay the stage payment (card or bank transfer; receipt in Documents) → confirm the fitting dates or ask to change them (office calls back; request can be cancelled) → add to calendar → getting-ready checklist → fitting (handover signed on site) → snags fixed on a return visit → customer checks each repair (Fixed / Not yet) and signs, or says what is not fixed (final payment stays on hold) → final payment released and paid → guarantee, FENSA certificate and care guide published → review → aftercare: report a problem with photos, track it (Received → Looking into it → Visit booked → Fixed), add to it or cancel it. Messages with the office at any time. Problems phoned in are logged by the office and show here too.

## Design system (do not drift)
- Font: Sora (400–700). Plain CSS tokens in `src/styles/app.css` (same as the Surveyor and Installer mobile apps).
- Colours: primary `#00c7a1`, primary-dark `#0b6e5c`, deep `#0b1f1b`, tint `#ebf7f3`, page `#f6f8f7`, border `#e3e9e7`, text `#0f1414` / `#3a4a4a` / `#6b7a78`, ok `#1f9d5b`, warn `#e0a100`, error `#d64545` (use red sparingly).
- Sizes (keep consistent): text only 11px to 20px; buttons 48px for main actions and 40px for everything else (icon buttons, chips, tabs, Fixed/Not yet), all with 12px corners; inputs 48px; cards, notes and files have 16px corners. Bottom sheets for every pop-up. Calm, simple, jargon-free wording (many customers are 60+). Real property photos.
- Tailwind utilities are available, but Tailwind's base reset is intentionally not loaded.

## Demo sign-in
Any email · security code **482193** (3 wrong codes pauses sign-in).

## Code quality
- Use double quotes for strings containing apostrophes, or escape them.
- Keep JSX balanced; pages export components used in `App.tsx`.
