# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript + Tailwind CSS, Lucide React for icons, React Router for pages (pinned by the brief). Mobile first.

## Users

Brazilian customers ordering food for delivery or pickup from a single local store, mostly on a phone, often hungry and in a hurry. The site doubles as a sales demo: a local business owner switches it between segments (pizzaria, confeitaria, cafeteria, açaíteria) to see the same template become their brand. Most already know the iFood ordering flow (Opinion Box 2023, cited by iFood in 07/2025: 96% know the app, 94% use it), but the store must also work for someone who never used a delivery app.

## Product Purpose

The store's own ordering site: find a product, customize it, add it to the bag, and reach checkout without friction. Success is a first-time visitor completing the flow without instructions and without surprises in price, fees or delivery time.

## Positioning

A single store's own channel that keeps the ordering conventions customers already learned in delivery apps, under the store's own brand.

## Operating Context

- Search by partial name, category browsing, filters (category, price range, sort).
- Product customization: size, crust, stuffed crust, second flavor, extras, removals, quantity, notes.
- Persistent bag (localStorage), coupon, separated subtotal / delivery fee / discount / total.
- Checkout in steps: contact, delivery or pickup with address, payment, review, confirmation.

## Capabilities and Constraints

- No backend yet. Orders, payments and order status are demonstrative and must be labeled as such. No real charge, no real tracking.
- Payment is prepared for a provider integration (Pix, card on delivery, cash) but never simulates a real transaction.
- Catalog, categories, banners and brand copy live per theme in `src/themes/<id>/`; shared store data and coupons in `src/data/`. Both can be replaced by an API.
- Brazilian Portuguese everywhere; BRL currency format.

## Brand Commitments

- The default theme, Pizzaria, is "Seu negócio", tagline "Sabor que chega até você.", and is preserved exactly. Every visit starts on it.
- Demonstration themes use fictional names: Confeitaria "Ateliê Doce", Cafeteria "Grão & Prosa", Açaíteria "Roxo Açaí". They share the template's structure and behavior; only tokens, type, photos and brand copy change (see DESIGN.md, Themes).
- Original typographic logo with a small food symbol. No Pizza Hut or iFood names, logos or packaging.
- Palette pinned by the brief: red #D71935, dark red #B8102B, ground #F7F3EF, cards #FFFFFF, text #202020, secondary text #777777 (may be adjusted for contrast), borders #EAE5E0.
- Inter (or similar) for UI text.
- Visual composition follows the reference image at `docs/754f44008a8eeda26b9c8d0d94da24da.jpg`.
- No emojis anywhere (project CLAUDE.md); icons from Lucide.
- Photography from Unsplash.

## Evidence on Hand

- Product names, descriptions and prices in the brief are demonstrative.
- Ratings in the brief are demonstrative. No real ratings, review counts, sales volume or popularity data exist; never present them as real.
- The 30% combo discount, delivery time (30–40 min) and benefit claims are demonstrative until the store validates them.

## Product Principles

1. Familiar before novel: use the ordering conventions customers know from delivery apps.
2. Price transparency: every paid option shows its price, totals update live, fees and discounts are separated, the total is visible before confirming.
3. Speed for hungry people: no sign-up to browse, no interrupting pop-ups, short forms, quick add when nothing must be chosen.
4. Honest demo: anything simulated says so.
5. Mistakes are cheap: quantities, choices and checkout data are editable without restarting.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, visible focus, full keyboard use, labeled icon buttons, errors tied to fields, 44px touch targets, reduced motion respected, states never conveyed by color alone.
