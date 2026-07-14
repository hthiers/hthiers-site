# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal static personal website (single HTML file) deployed to Cloudflare Workers via Wrangler. No build tools, no package manager, no JavaScript framework — pure HTML and CSS.

## Development Commands

Requires [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed globally (`npm install -g wrangler`).

```bash
# Local development server
wrangler dev

# Deploy to Cloudflare Workers
wrangler deploy
```

## Architecture

- **[index.html](index.html)** — the entire site; single page with embedded CSS, no external dependencies
- **[wrangler.jsonc](wrangler.jsonc)** — Cloudflare Workers config; serves assets from the project root directory

The site is served as a static asset by Cloudflare Workers. The `assets.directory: "."` in `wrangler.jsonc` means Wrangler serves files directly from the repo root.

## Key Config Details

- `compatibility_date`: must stay up-to-date with Wrangler requirements
- `nodejs_compat` flag is enabled
- Observability is enabled (Cloudflare Workers logs/metrics)
- `.wrangler/` is gitignored (local build output)
