# 3D portfolio redesign

The React/Vite frontend in `portfolio/` now presents a responsive portfolio for Gathpa Narsimulu, with a Three.js orbital sculpture, pointer-following reveal inspired by the supplied screen recordings, perspective project cards, category filters, keyboard-accessible project dialogs, and a mobile navigation menu.

## Run locally

```sh
cd portfolio
npm ci
npm run dev
```

For a production build, run `npm run build`. Vercel should retain `portfolio` as the project root, `npm run build` as its build command, and `dist` as its output directory.

## Content and integrations

- The public page reads the existing profile, resume, contact, projects, skills, certificates, and about endpoints. Backend data replaces relevant fallback content when available.
- Four curated project summaries are bundled as fallbacks so an unavailable backend does not leave an empty portfolio. Edit `portfolio/src/components/portfolio/Portfolio.jsx` to update these summaries and the education/experience timeline.
- Project source/live links are shown only when supplied by the CMS; the curated summaries do not invent project URLs.
- The contact section uses email and clipboard actions, without requiring a message service.
- The existing `/admin` route remains available and loads separately from the public page. Authentication and database operations were not changed.
- A monogram replaces the repository's unverified fallback portrait. Add a verified personal photo in a later update if desired.
- `VITE_API_BASE` can be set to the deployed backend. The Vite configuration no longer forces localhost into production builds; without an override, the existing production API resolver is used.

## Accessibility and performance

The 3D module is loaded separately. The scene has a static CSS fallback for WebGL failure, a pause control, reduced-motion support, a bounded pixel ratio, resource cleanup, and visibility-aware rendering. Touch devices do not use pointer reveals or card tilt. All content and navigation remain independent of the decorative canvas. Project dialogs support Escape and restore focus to their trigger.

## Reference interpretation

The three supplied videos informed the bold editorial typography, dark presentation, cursor reveal, and tactile depth. The design uses original geometric visuals and personal project content, rather than other people's portraits.

## Validation

- Production build: passed.
- ESLint on the new components and App.jsx: passed.
- `git diff --check`: passed.
- Vite reports an expected large optional Three.js chunk (approximately 192 KB gzip), loaded on demand.
- Chromium desktop (1440 px) and mobile (390 px): no uncaught page errors or horizontal overflow; verified project filters, dialog open/Escape, pause control, responsive menu, reduced-motion navigation, and admin login rendering.
- Desktop and mobile full-page screenshots were visually inspected.
