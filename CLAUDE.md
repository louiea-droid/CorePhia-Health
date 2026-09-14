# Corephia Health — project context

Marketing site + patient intake for **Corephia**, a physician-built weight loss program based in
**Tampa, Florida**, founded by **Dr. Daniel Antonious, MD** (double board certified in Internal
Medicine and Nephrology; currently *pursuing* a critical care fellowship — he has not completed it,
do not describe him as a fellow).

The program has three pillars, in his own words: **dietitian services, exercise prescriptions, and
weight loss medication when clinically appropriate.**

---

## Non-negotiable: how medication may be described

Per Dr. Antonious (Feb 2026): *"I'm not selling medication. This idea of you give me 50 bucks and I
give you this medication is now considered illegal. What we're selling is a program, and that
program includes a medication."*

This is a compliance boundary, not a style preference. Nothing on the site may read as
**pay money → receive medication**. Medication is always framed as one part of a program,
prescribed by a licensed provider only when clinically appropriate.

Already removed for this reason — do not reintroduce:
- A "Medication Included / All FDA-approved medications included" pricing badge (now
  "Medication When Appropriate", with a clinical-appropriateness qualifier).
- A shopping cart icon and a "Track orders" account perk (e-commerce framing).
- A large GLP-1 injector pen illustration as the main image for medical support (now `CareShieldArt`).
- Hero copy "The weight loss breakthrough is here" — miracle-product language he explicitly built against.

The site is a **program**, never a storefront.

---

## Commands

```bash
npm run dev      # vite dev server (usually :5173, falls back to :5174 if occupied)
npm run build    # vite production build -> dist/
npm run lint     # oxlint
npm run preview  # serve the built dist/
```

Deployed via Firebase Hosting (`firebase.json` → `public: "dist"`, SPA rewrite to `/index.html`).
Firebase project is `corephia-health`. Last actual deploy was 2026-09-04 — everything since is
unreleased.

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · react-router-dom v7 · react-helmet-async · oxlint.
No TypeScript, no test suite.

## Architecture

Client-rendered SPA, no SSR or prerendering.

```
src/main.jsx          HelmetProvider > BrowserRouter > App
src/App.jsx           ScrollManager + Header + <Routes> + Footer
src/pages/            Home, About, Contact
src/components/       PatientIntakeForm (the /intake route) + all homepage sections
src/hooks/            useIntro (timed reveal), useReveal (IntersectionObserver reveal)
```

Routes: `/` · `/about` · `/contact` · `/intake`

`ScrollManager` in `App.jsx` handles scroll on navigation: scrolls to top on a new route, honours a
`#hash` target (the browser can't — React hasn't rendered the section when the hash resolves), and
leaves back/forward alone so the browser restores position.

### Design system

All colour lives in `@theme` in `src/index.css`. Changing those tokens re-themes the whole site.

| token | value | use |
|---|---|---|
| `ink-950/900/800/700` | `#0d1a3d` … | navy text and dark sections |
| `paper-50/100/200` | `#f5f7fb` … | light backgrounds |
| `accent` / `accent-dark` | `#60a5fa` / `#2563eb` | highlights, CTAs |
| `brand` / `brand-dark` | `#3b5bdb` / `#1e3a8a` | card gradients |

Fonts: Fraunces (serif, headings) + Inter (sans, body), via Google Fonts.

**Inline SVGs in `Artwork.jsx` use hardcoded hex and do NOT inherit these tokens.** Any palette
change must update them by hand — this has been missed twice already.

**Watch contrast on `brand` gradients.** Dark text on `from-brand to-brand-dark` fails WCAG AA
(measured as low as 1.44:1). Card text on those gradients must be `paper-50` / `paper-100`, which
measures 4.78–8.74:1.

---

## Current state

Done: pivot from a multi-vertical Rx marketplace to a weight-loss-program site · blue/navy re-theme ·
react-router with About/Contact/intake routes · per-route SEO metadata, JSON-LD, sitemap, OG image ·
expanded EMR-shaped intake form · compliance copy fixes · accessibility and visual pass.

### Blockers before the next deploy

1. **The intake form has no destination.** `submitIntakeRecord()` in `PatientIntakeForm.jsx` is a
   stub — it returns the record and sends nothing. Meanwhile the confirmation screen tells the
   patient a care team will contact them within one business day. The form collects DOB, address,
   medications, conditions, cancer and family history, and a typed legal signature under a HIPAA
   acknowledgement. **It must not ship in this state.** The Contact form is the same.
   The intended destination is an EMR that has not been selected yet (still at vendor-pricing
   stage). Note a plain Firestore write is not sufficient for PHI — that needs a BAA.
   `buildIntakeRecord()` deliberately groups fields to mirror standard EMR intake sections
   (demographics / emergencyContact / insurance / vitals / medicalHistory / familyHistory /
   socialHistory / nutrition / visit / consent) so the mapping is direct when a vendor exists.
2. **Canonical domain is unresolved.** Canonicals and OG tags say `www.corephia.com`, the footer
   says `corephiahealth.com`, the Firebase project is `corephia-health`. Pick one — a wrong
   canonical actively deindexes the site.
3. **Placeholder contact details are on a public page.** `(000) 123-4567` and
   `hello@corephia.com` in `Contact.jsx` and `Footer.jsx` (marked with TODOs). Tampa is real.

### Waiting on assets from the client

- A real headshot of Dr. Antonious. Deliberately left as an illustrated `PersonAvatar` placeholder
  until then — do not fabricate a photo. The site has **no photography at all**, which is its
  biggest remaining visual weakness.
- A logo without orange in it. `cp-health.png` still contains orange from the old palette and
  clashes on blue. It is also 335 KB for a ~56px-tall render; `cp-logo.png` is a **1.28 MB favicon**.

### Known remaining gaps

- Dead anchors with no pages behind them: `#privacy-choices`, `#forgot-password`, `#create-account`.
  Footer entries without a `to`/`href` render as muted plain text by design, not broken links.
- No Privacy Policy or Terms pages exist (needed for a health site).
- Unsourced claims: "Members lose up to 20% body weight*" has a footnote with no study, N, or date.
  "Evidence Based" and "Proven Results" badges have nothing behind them. YMYL/E-E-A-T liability.
- No FAQ anywhere, and the site never answers: is it safe, who qualifies, which states, how fast,
  is insurance accepted. This is the biggest AEO gap — answer engines have little to extract.
- No "medically reviewed by" attribution or last-updated dates.
- A "Certified" badge in the footer that does not say certified by whom.

---

## Conventions and gotchas

- **Verify UI changes in a real browser.** Playwright is installed in the session scratchpad
  (chromium-cli is not available on this Windows machine). Drive the dev server with a small
  `.mjs` script.
- **Screenshots need scrolling first.** `useIntro`/`useReveal` start elements at `opacity-0`. A
  `fullPage` screenshot captures below-fold sections *blank* because the IntersectionObserver never
  fired. Scroll the page in steps with waits, then capture — otherwise you will report phantom bugs.
- **Isolate scroll tests.** Residual scroll from a previous assertion bleeds into the next and
  produces nonsense offsets. Use a fresh browser context per deep-link test.
- **Measure contrast against the painted background.** `getComputedStyle().backgroundColor` is
  transparent on gradient elements, so naive walking-up reports the wrong colour. Compute against
  the gradient stops.
- Port 5173 is often already occupied by a stray dev server; clean up with `netstat -ano` +
  `Stop-Process -Force`.
- Repeating a CTA down a long page is fine; **inconsistent labels for the same action are not.**
  The canonical label is "Start your intake" ("Get started" in the header, "Choose {plan}" on
  pricing cards, which pass `?plan=` and preselect in the form).
