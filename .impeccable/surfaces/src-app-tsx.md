---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/index.css","src/components/layout/ThemeBar.tsx"]
---

# Storefront (Seu negócio and its theme variants)

Scope: the whole ordering app (home, menu, item sheet, bag, checkout, orders, offers, profile), plus the demo theme switcher that reskins it. Visitor mode: Operate. Build path: code-led (Operate surface; no image generation available).

Audience and job: hungry Brazilian customer on a phone who wants to find, customize and order food fast, using conventions already learned in delivery apps. Second audience for the switcher: a local business owner evaluating the template, who must see one site become their segment.

Constraints: visual composition pinned by the reference image in docs/; Pizzaria palette, Inter and the name "Seu negócio" pinned by the brief and preserved exactly; the three other themes are brief-pinned directions (palette and type families named in the theme brief) on the same template; no emojis; Unsplash photos; demo data labeled.

## Direction contract

THESIS: A storefront that feels already learned. Delivery-app ordering grammar (search on top, category rail, priced cards with an accent add button, floating bag bar, item sheet with priced options, stepped checkout). One template, four brands: only tokens, type, photos and brand copy change; the structure never does. It refuses four separate sites and refuses the restaurant landing page.

OWN-WORLD: Pizzaria (default, untouched): flour-white #F7F3EF, red #D71935, oven #17110F, Barlow Condensed uppercase plus Inter. Confeitaria "Ateliê Doce": blush ground, raspberry-rose action, wine-chocolate banner, Bodoni Moda with italic accents plus Figtree. Cafeteria "Grão & Prosa": sand ground, copper action, dark-roast banner, Besley (Clarendon) plus Hanken Grotesk. Açaíteria "Roxo Açaí": lavender ground, violet action, açaí-pulp banner with lime highlight, Bricolage Grotesque plus Onest.

STORY: The visitor reads the demo strip, opens "Ver este site como", picks a segment, and watches the same page change palette, type, photos and copy in place, without a reload, then keeps ordering in that brand.

FIRST VIEWPORT: At 390px: a slim ink demo strip (label left, palette-dot select right) above the unchanged header row, search pill, delivery facts, dark hero banner, category rail. Desktop: the strip above the sticky top bar.

FORM: Brief-pinned composition and brief-pinned theme directions (no roll). Signature move: the brand morph, registered color tokens transitioning together while every photo crossfades from the old brand to the new.
seed: none (no roll: every theme direction and the composition are pinned by the brief)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
