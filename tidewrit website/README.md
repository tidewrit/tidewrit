# Tidewrit - Deploy Guide (GitHub + Cloudflare Pages)

## What goes where
PUBLIC (push to GitHub):
- index.html, services.html, pricing.html, reviews.html, faq.html, about.html
- plan.html, mytrips.html, style.css, shared.js
- functions/api/chat.js, functions/api/mytrips.js, functions/api/trip.js

PRIVATE (keep on your computer ONLY, never push):
- tidewrit-os.html
- admin-generator.html
- admin-encrypt.html

## Your photos (drop into an images/ folder in the repo)
Compress each at squoosh.app (under 250KB). Exact filenames:
- images/hero.jpg        - homepage top background (wide, 1920px+, calm left side)
- images/zanzibar.jpg    - destination card
- images/jinja.jpg       - destination card
- images/diani.jpg       - destination card
- images/capetown.jpg    - destination card
- images/services.jpg    - What you get page banner
- images/pricing.jpg     - Pricing page banner
- images/reviews.jpg     - Reviews page banner
- images/faq.jpg         - FAQ page banner
- images/about.jpg       - About page banner
- images/mytrips.jpg     - My Trips page banner
- images/cta.jpg         - blue call-to-action background (all pages)
- images/plan-cover.jpg  - default trip page cover (used when a trip has no custom cover)
Missing any? No problem: that spot shows a clean brand gradient until you add it.

Country photos (optional, add over time): put photos in images/countries/
named by country in lowercase with hyphens - e.g. images/countries/japan.jpg,
images/countries/south-africa.jpg, images/countries/cote-d-ivoire.jpg.
Each country's Destinations panel automatically shows its photo once the file
exists; until then it shows the country flag on the brand gradient.

## One-time setup (~20 minutes)
1. Create a GitHub account → New repository (private is fine) → upload the PUBLIC files.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
   Build settings: Framework = None, Build command = (empty), Output directory = /
3. Deploy. Your site is live at yourproject.pages.dev (add a custom domain in Pages → Custom domains).
4. AI assistant: Pages project → Settings → Environment variables → add
   ANTHROPIC_API_KEY = (your key from console.anthropic.com) → redeploy.
5. Form: create a free form at formspree.io → in index.html, wire the Send button to your
   Formspree endpoint (or ask Claude to wire it when you have the ID).
6. Payments: create 3 Flutterwave payment links (Outline $20 / Full $50 / Concierge $120).
   Keep them in Tidewrit OS → Templates → Payment link field.

## One-time KV setup (5 minutes, no code)
1. Cloudflare dashboard → Workers & Pages → KV → Create namespace: TRIPS
2. Your Pages project → Settings → Functions → KV namespace bindings →
   Variable name: TRIPS → select the namespace → Save. Redeploy once.

## Per-customer routine (no uploads, no commits)
1. Tidewrit OS → add customer → send payment template.
2. Payment confirms (Flutterwave emails you).
3. OS → Generator → fill trip → Generate. It gives you two KV entries.
4. Cloudflare dashboard → KV → TRIPS → Add entry:
   paste Entry 1 (key trip:..., value = blob), then Entry 2 (key user:email,
   value = trips list). If the customer already has trips, edit their user:
   entry and add the new trip to the list. Live instantly.
5. Generator → Send on WhatsApp + Send by Email. Done.

## Notes
- Every commit auto-deploys. You can do all of this from your phone in the GitHub app/website.
- Data in Tidewrit OS lives in your browser: export a backup weekly.
- Keep each trip's data + passcode saved in your records; encrypted pages cannot be recovered without the passcode.
