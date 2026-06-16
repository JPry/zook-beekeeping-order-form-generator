# Zook Beekeeping Order Form Generator

A single-page order form for the Peter Zook / Cypress Bee Supply 2026 pricelist. Pick items and quantities, see the live subtotal with KY 6% sales tax and grand total, then print a clean order sheet showing only the lines you selected.

**Live site:** <https://gh.jpry.com/zook-beekeeping-order-form-generator/>

## Features

- Every catalog section from the 2026 pricelist, organized into collapsible groups
- Variant toggles for items with assembled/unassembled or solid/screened options
- Tiered pricing for unassembled frames (1–49 / 50–4999 / 5000+)
- Live totals with KY 6% sales tax
- Print view that hides empty sections, shows column headers, and removes UI chrome
- Form state (quantities, variants, customer info, section open/closed state) persists to `localStorage`

## Tech

- [Vite](https://vitejs.dev/) + TypeScript
- Three light-DOM web components — `bee-variant-toggle`, `bee-item-row`, `bee-totals`
- No runtime dependencies; deployed as static files

## Develop

```sh
npm install
npm run dev      # Vite dev server with HMR
npm run build    # type-check + bundle to dist/
npm run preview  # preview the production bundle
```

## Deploy

`main` is built and published to GitHub Pages by `.github/workflows/deploy.yml` on every push. Pages is configured at the JPry.github.io repo with the `gh.jpry.com` custom domain, so project sites are served under that domain automatically.

## Code style

- Tabs for indentation in all files where valid (YAML uses spaces — the spec forbids tabs)
- JS/TS: WordPress JavaScript standards, minus the extra inner-paren spaces — `foo(bar)` not `foo( bar )`
- Single quotes by default in JS/TS
