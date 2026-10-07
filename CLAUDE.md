# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal static personal website deployed to Cloudflare Workers via Wrangler. No build tools, no package manager, no JavaScript framework — hand-written HTML, embedded CSS, and a small amount of vanilla JS.

## Development Commands

Requires [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed globally (`npm install -g wrangler`).

```bash
# Local development server
wrangler dev

# Deploy to Cloudflare Workers
wrangler deploy
```

## Architecture

- **[public/index.html](public/index.html)** — the home page; embedded CSS, only external dependency is Google Fonts. It is the reference implementation of the site's design system, documented in [docs/design-system.md](docs/design-system.md) — follow it for new pages and visual changes (the demo still uses the previous dark style and is pending migration)
- **[public/automatizacion-ia/index.html](public/automatizacion-ia/index.html)** — landing page for the AI automation service. Embedded CSS; loads the shared [public/js/th-track.js](public/js/th-track.js) plus a small inline `<script>` with its page-specific events (see below). Content is driven by [docs/landing_page_automatizacion_IA.md](docs/landing_page_automatizacion_IA.md); the execution plan is [docs/plan_landing_y_mvp_demo.md](docs/plan_landing_y_mvp_demo.md). Its `#demo` section links to the demo.
- **[public/automatizacion-ia/demo/](public/automatizacion-ia/demo/)** — the demo: pick a sample document, watch it being read and validated, and see the outputs. Plan: [docs/plan-demo-automatizacion-ia.md](docs/plan-demo-automatizacion-ia.md). The page has embedded CSS like the rest of the site, plus plain ES modules in `demo/js/` (no build). `validators.js`, `templates.js`, `formato.js` and `catalog.js` must stay free of DOM and Worker APIs: the Worker of the demo's Phase 2 will import them. Samples are JSON in `demo/samples/`. **The landing's prices are hardcoded in its HTML in three places (price cards, the FAQ answer and the JSON-LD `offers`): a price change means updating all three.**
- **[public/privacidad/index.html](public/privacidad/index.html)** — privacy and data-handling page, linked from the landing and home footers; uses the home's design system
- **[wrangler.jsonc](wrangler.jsonc)** — Cloudflare Workers config; serves assets from `public/`

The site is served as static assets by Cloudflare Workers from `assets.directory: "./public"`. **Only `public/` is published**: `public/` maps to the site root (`public/automatizacion-ia/index.html` → `/automatizacion-ia/`), and everything outside it (`docs/`, `CLAUDE.md`, `.git/`, future Worker code) stays private. [public/.assetsignore](public/.assetsignore) excludes `.DS_Store` files. Do not point `assets.directory` back at the repo root: it publishes `.git/` and makes `wrangler dev` reload in an endless loop, because Wrangler writes its local state into `.wrangler/` inside the watched folder.

## Conversion tracking (landing page)

**Current decision: Cloudflare Web Analytics only — no tag manager.** Zaraz and GA4 are deliberately
not installed. The reasoning and the criteria for revisiting this are in
[docs/plan_landing_y_mvp_demo.md](docs/plan_landing_y_mvp_demo.md) §4.1; do not add a tag manager
without reading it first.

How the funnel is measured today:

| Step | Source |
|---|---|
| Visits to `/automatizacion-ia/` | Cloudflare Web Analytics (beacon auto-injected; the site does not send `no-transform`) |
| Conversations started | The owner's WhatsApp inbox, counted by hand |
| Which section converted | The `(ref: <section>)` suffix carried in each `wa.me` link's pre-filled text |

That `(ref: ...)` suffix is the primary attribution mechanism, not a nice-to-have: the click leaves the
site, so nothing else can attribute an incoming WhatsApp conversation to a section. **Keep it on every
new `wa.me` link.**

### The event instrumentation is present but dormant

[public/js/th-track.js](public/js/th-track.js), loaded by the landing and the demo, is deliberately **provider-agnostic**: it sends
events to `window.zaraz.track` or `window.gtag` if either is loaded, and otherwise queues them.
No provider is loaded, so **nothing is recorded right now** — that is expected, not a bug. It stays in
place so the page does not have to be re-instrumented when a destination is eventually connected.

- Clickable elements are instrumented by adding `data-ev="<event>"` and `data-ev-loc="<section>"`. The click handler is delegated, so new CTAs need no JS changes.
- Events implemented: `cta_whatsapp` (the primary conversion metric), `cta_email`, `ver_como_funciona`, `ver_demo`, `scroll_precios`, `faq_abierta` (landing); `demo_iniciada`, `demo_completada` (demo).
- UTM parameters and the referrer are captured and attached to every event — but with no destination connected they are not stored anywhere. Traffic source is read from the Web Analytics *Referer* dimension instead.
- `window.thTrack(name, props)` is exposed so pages record their own non-click events (the landing's inline script and the demo's `app.js` use it).

Connecting a destination is a Phase 3 / paid-campaign decision: either GA4 via Zaraz, or a
self-hosted events endpoint on the Worker that Phase 3 introduces.

## Key Config Details

- `compatibility_date`: must stay up-to-date with Wrangler requirements
- `nodejs_compat` flag is enabled
- Observability is enabled (Cloudflare Workers logs/metrics)
- `.wrangler/` is gitignored (local build output)
