ARC // CTO
Plain-English tech advisory, practical AI, and part-time technical leadership for small business — built on 26 years of hands-on low-voltage, security, and IT integration experience.
Project Overview
This repository hosts the storefront for ARC // CTO (`arccto.com`), a venture of RSE LLC (Ritter Strategic Enterprises), ARC // CTO gives small businesses the same caliber of tech advice mid-to-large commercial clients pay $300/hour for, without the buzzwords or the sales pitch. Core service lines:
Consulting — unbiased tech and vendor advice, systems reviews, and quote second opinions.
Training — getting more out of Microsoft 365 Copilot, Google Workspace/Gemini, and other tools businesses already pay for.
Operations — custom workflows, estimating tools, and part-time/fractional technical executive partnership.
Ground Truth: Quarterly Checkup — a $29 self-guided printable guide, sold via Lemon Squeezy.
MCA, the AI assistant embedded on the site, handles initial discovery and qualification by chat so visitors aren't required to get on a call.
Technical Architecture
Frontend: Responsive HTML5 and Tailwind CSS (CDN), with a shared design-token system (`/style.css`) driving both light and dark themes via the `data-theme` attribute on `<html>`, auto-detected from the visitor's OS preference in `/main.js`.
Shared includes: `/nav.html`, `/footer.html`, and `/modal.html` are injected client-side by `/main.js` into placeholder divs (`#nav-placeholder`, `#footer-placeholder`, `#modal-placeholder`).
Booking: The discovery-call modal posts to a Google Apps Script webhook to reserve calendar time.
MCA Agent: Deployed as a Cloud Run app, embedded via iframe, theme-synced to the site's light/dark mode.
Branding (Grunge/Brutalist Palette):
Gold (`#EAB308`) — Consulting / Main Street accent
Cyan (`#00A8E8`) — Operations / Integrator accent
White (`#FFFFFF`) — Training / Investor accent
Crimson (`#DC2626` / `#7F1D1D`) — background gradient accent
Black surfaces with frosted-glass cards, offset "brutalist" box-shadows, and Courier Prime monospace headers
Other RSE LLC Ventures
RSE LLC also holds Ritter Remote Notary and other ventures David takes on — not part of this repository.
Deployment
Deployed via the `main` branch to GitHub Pages (or equivalent static host). No server-side rendering; all dynamic behavior is client-side JS plus the Cloud Run MCA backend and the Google Apps Script booking webhook.
---
© 2026 ARC // CTO.
