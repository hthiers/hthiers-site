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

- **[index.html](index.html)** — the home page; embedded CSS, no external dependencies
- **[automatizacion-ia/index.html](automatizacion-ia/index.html)** — landing page for the AI automation service. Embedded CSS plus one inline `<script>` at the end of `<body>` that records conversion events (see below). Content is driven by [docs/landing_page_automatizacion_IA.md](docs/landing_page_automatizacion_IA.md); the execution plan is [docs/plan_landing_y_mvp_demo.md](docs/plan_landing_y_mvp_demo.md)
- **[privacidad/index.html](privacidad/index.html)** — privacy and data-handling page, linked from the landing footer
- **[wrangler.jsonc](wrangler.jsonc)** — Cloudflare Workers config; serves assets from the project root directory

The site is served as a static asset by Cloudflare Workers. The `assets.directory: "."` in `wrangler.jsonc` means Wrangler serves files directly from the repo root.

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

The landing page carries an inline `<script>` that is deliberately **provider-agnostic**: it sends
events to `window.zaraz.track` or `window.gtag` if either is loaded, and otherwise queues them.
No provider is loaded, so **nothing is recorded right now** — that is expected, not a bug. It stays in
place so the page does not have to be re-instrumented when a destination is eventually connected.

- Clickable elements are instrumented by adding `data-ev="<event>"` and `data-ev-loc="<section>"`. The click handler is delegated, so new CTAs need no JS changes.
- Events implemented: `cta_whatsapp` (the primary conversion metric), `cta_email`, `ver_como_funciona`, `scroll_precios`, `faq_abierta`.
- UTM parameters and the referrer are captured and attached to every event — but with no destination connected they are not stored anywhere. Traffic source is read from the Web Analytics *Referer* dimension instead.
- `window.thTrack(name, props)` is exposed for future sections (the demo in Phase 2) to record their own events.

Connecting a destination is a Phase 3 / paid-campaign decision: either GA4 via Zaraz, or a
self-hosted events endpoint on the Worker that Phase 3 introduces.

## Key Config Details

- `compatibility_date`: must stay up-to-date with Wrangler requirements
- `nodejs_compat` flag is enabled
- Observability is enabled (Cloudflare Workers logs/metrics)
- `.wrangler/` is gitignored (local build output)
