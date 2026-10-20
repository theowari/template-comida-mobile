---
name: Seu negócio
description: Mobile-first ordering storefront for a pizzeria, warm flour-white ground with pizzeria red for every action.
colors:
  pizzeria-red: "#D71935"
  pizzeria-red-deep: "#B8102B"
  pizzeria-red-bright: "#EE2B45"
  red-wash: "#FDF0F2"
  red-wash-strong: "#FADCE1"
  flour-ground: "#F7F3EF"
  flour-ground-deep: "#EFE9E3"
  plate-white: "#FFFFFF"
  ink: "#202020"
  ink-muted: "#6E6862"
  crumb-line: "#EAE5E0"
  crumb-line-strong: "#D9D1C9"
  oven-black: "#17110F"
  promo-blush: "#FBE7E4"
  basil-green: "#1E7F4F"
  basil-wash: "#E8F5EE"
  amber-warning: "#8F5400"
  amber-wash: "#FFF4E0"
  star-amber: "#E39A00"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "29px"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  display-desktop:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  wordmark:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "27px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
  display-tablet:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "38px"
    fontWeight: 800
    lineHeight: 0.92
  promo-title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 0.92
  promo-title-tablet:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: 0.92
  promo-title-desktop:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "52px"
    fontWeight: 800
    lineHeight: 0.92
  sticker:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1
  sticker-desktop:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1
  sticker-off-desktop:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1
  page-title-desktop:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  step-title-desktop:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-large:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-small:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  total:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "tnum"
  body-large:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.35
  title:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.35
  price:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-compact:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  body-small:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.35
  meta:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3
  caption:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
  label:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  field: "12px"
  tile: "14px"
  card: "16px"
  dialog: "20px"
  banner: "22px"
  sheet: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  gutter: "16px"
  section: "20px"
  section-desktop: "32px"
components:
  button-primary:
    backgroundColor: "{colors.pizzeria-red}"
    textColor: "{colors.plate-white}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.pizzeria-red-deep}"
  button-secondary:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
  button-ghost:
    textColor: "{colors.pizzeria-red-deep}"
    rounded: "{rounded.pill}"
    height: "40px"
  icon-tile:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    size: "44px"
  chip:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.pizzeria-red-deep}"
    rounded: "{rounded.pill}"
    height: "40px"
  badge:
    backgroundColor: "{colors.pizzeria-red}"
    textColor: "{colors.plate-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  text-field:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "48px"
  product-card:
    backgroundColor: "{colors.plate-white}"
    rounded: "{rounded.card}"
    padding: "8px"
  promo-banner:
    backgroundColor: "{colors.oven-black}"
    textColor: "{colors.plate-white}"
    rounded: "{rounded.banner}"
  bag-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate-white}"
    rounded: "{rounded.card}"
    height: "56px"
  bottom-nav:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.ink-muted}"
    rounded: "22px"
    height: "64px"
---

# Design System: Seu negócio

## Overview

**Creative North Star: "The Neighborhood Pizzeria Counter"**

The interface is the counter of a busy neighborhood pizzeria translated into the ordering grammar Brazilians already know from delivery apps. The ground is flour-white and warm; everything the customer touches sits on it as a white plate: rounded tiles, cards and sheets lifted by soft, warm shadows. Pizzeria red is the only loud color and it always means "do this" or "this is chosen". The one dark surface, the oven-black promotional banner, is where the brand raises its voice with condensed uppercase lettering.

Density is that of a working app, not a landing page: search first, a category rail, a two-column grid of priced cards on phones, a fixed bottom bar, and a floating bag bar that rises once something is in the bag. Expression lives in a few precise details (the condensed display face, the red raised center of the bottom bar, real food photography) and never in layout tricks. Familiar beats novel; every control is a standard one.

**Key Characteristics:**
- Warm flour-white ground, white "plates" for every interactive surface.
- One accent, pizzeria red, reserved for action, selection and price-critical state.
- Condensed extrabold uppercase for promotional headlines and the wordmark only; Inter for everything operable.
- Real food photography in rounded frames; no illustrations, no emoji.
- Mobile first: bottom bar plus floating bag bar on phones; top bar with inline nav and search on desktop.

## Colors

A restrained warm palette: one saturated red over flour-white neutrals, with a single near-black field for promotions.

### Primary
- **Pizzeria Red** (#D71935): primary buttons, the add-to-bag "+" buttons, badges ("Mais vendido", "Popular", selos), the raised center of the bottom bar, selected category rings, focus of attention. White text on it passes 5.2:1.
- **Pizzeria Red Deep** (#B8102B): hover and pressed state of red buttons; red text on light grounds (links, "Editar", errors, selected chip labels), where it holds 5.6:1 even on the blush promo field.
- **Pizzeria Red Bright** (#EE2B45): only for red lettering on the oven-black banner (second headline line), where the base red falls under 4.5:1.
- **Red Wash** (#FDF0F2) and **Red Wash Strong** (#FADCE1): background of selected chips and mode/payment cards, ghost-button hover, text selection.

### Neutral
- **Flour Ground** (#F7F3EF): page background and sticky bars.
- **Flour Ground Deep** (#EFE9E3): second neutral layer: image placeholders, inline notices, hover of list rows.
- **Plate White** (#FFFFFF): cards, tiles, sheets, fields.
- **Ink** (#202020): body text and headings; also the floating bag bar and the "Obrigatório" pill.
- **Ink Muted** (#6E6862): secondary text, placeholders, inactive nav labels. Darkened from the brief's #777777 so it holds 5.0:1 on the ground.
- **Crumb Line** (#EAE5E0) and **Crumb Line Strong** (#D9D1C9): dividers, field and chip outlines.
- **Oven Black** (#17110F): the promotional hero banner only.
- **Promo Blush** (#FBE7E4): the combo banner field.

### Status
- **Basil Green** (#1E7F4F) on **Basil Wash** (#E8F5EE): applied coupon, satisfied required group ("Ok"), discount lines, order success.
- **Amber Warning** (#8F5400) on **Amber Wash** (#FFF4E0): demo notices, minimum-order shortfall, coupon saved but not yet valid.
- **Star Amber** (#E39A00): the rating star glyph only (decorative; the number carries the information).

### Named Rules
**The Red Means Act Rule.** Pizzeria red is never decoration. If it is red, it is an action, a selection, or a badge. Inactive states are ink or ink-muted, never pale red.

**The Never Color Alone Rule.** Every state pairs color with a second signal: a check icon on selected chips, a ring plus bold label on the active category, an indicator bar plus bold label on the active tab, an icon plus text on errors.

## Typography

**Display Font:** Barlow Condensed 800 (with Arial Narrow)
**Body Font:** Inter Variable (with system-ui)

**Character:** A loud condensed poster voice for the oven banner and the wordmark, set against a calm, highly legible workhorse sans for everything the customer reads and operates.

### Hierarchy
- **Display** (800, 29px phone / 38px tablet / 64px desktop, line-height 0.92, uppercase): promotional banner headlines, two lines (white, then red).
- **Promo title** (800, 30 / 36 / 52px, uppercase): the combo banner title. **Sticker** (800, 26px number and 14px "OFF"; 40px and 20px on desktop).
- **Wordmark** (800 italic, 27px; 32px large): "Seu negócio" next to the slice mark; "negócio" in red.
- **Headlines** (Inter 700, tracking -0.015 to -0.02em): section titles 20px phone / 24px desktop; page titles and the product sheet name 22px phone / 32px desktop; checkout step titles 22px / 26px.
- **Total** (Inter 700, 18px, tabular): the total next to a bottom-pinned action.
- **Price** (Inter 700, 17px, tabular figures): every price; always Brazilian format "R$ 42,90". A "a partir de" qualifier (11px caption) sits above when a required option changes the price.
- **Body large** (Inter 600, 16px): titles inside selectable cards (delivery mode, payment method).
- **Title / Body** (Inter, 15px; 600 for names, 400 at line-height 1.6 for running text): product names, option rows, descriptions in sheets.
- **Body compact** (14px), **Body small** (13px), **Meta** (12px): list secondary text, card descriptions (clamped to two lines), hints, taglines.
- **Caption** (Inter 500, 11px): nav labels, price qualifiers. **Label** (Inter 700, 10–11px, uppercase, tracking 0.06em): badges and selos only.

The UI ramp steps by 1px between 11 and 18px on purpose: a dense ordering screen needs fine distinctions between price, name and meta without jumping sizes. Do not add half steps.

### Named Rules
**The Poster Stays On The Banner Rule.** Barlow Condensed never appears in controls, prices, forms or navigation. If it is clickable or must be read in a hurry, it is Inter.

**The Tabular Price Rule.** Prices, totals, quantities and counts use tabular figures so columns of values align.

## Layout

Mobile first. Phones use a 16px side gutter, a fixed bottom bar (64px plus the safe-area inset) and, when the bag has items, a floating bag bar 10px above it; page content reserves both heights so nothing is hidden. Sections are separated by 20px on phones and 32px on desktop.

Product grids: two columns on phones (12px gap), three from 640px, three or four from 1024px (home "Mais pedidos" uses three; the full menu uses four). On the menu page phones switch to full-width rows (text left, 108px photo right) for scanning. Category rails scroll horizontally edge to edge with the gutter preserved inside.

Desktop (1024px and up): a sticky 76px top bar with the logo, the same five navigation items as the bottom bar, search, favorites, notifications and a red bag button showing the subtotal; content is centered at 1240px max with 32px side padding; the checkout becomes a form column plus a sticky order summary (360px). Sheets become centered dialogs (product, filters) or a right-side drawer (bag).

## Elevation & Depth

Depth is ambient and warm: soft shadows with a vertical offset and a brown-tinted blur, never hard edges. Surfaces declare elevation once: a card has a shadow and no border; a field has a border and no shadow.

### Shadow Vocabulary
- **Tile** (`0 6px 18px -8px rgb(74 44 26 / 0.22), 0 1px 2px rgb(74 44 26 / 0.06)`): header tiles, category tiles, search pill.
- **Card** (`0 10px 24px -14px rgb(74 44 26 / 0.24), 0 1px 3px rgb(74 44 26 / 0.06)`): product cards, review cards, benefits strip.
- **Raised** (`0 12px 22px -8px rgb(184 16 43 / 0.5)`): the red center of the bottom bar and the "30% OFF" sticker.
- **Bar** (`0 -8px 24px -12px rgb(74 44 26 / 0.18)`): bottom-pinned action bars.

### Named Rules
**The Plate Rule.** Anything interactive is a white plate lifted off the flour ground. Flat text never pretends to be a button.

## Shapes

Generous, consistent rounding: fields 12px, tiles 14px, cards 16px, desktop dialogs and summary panels 20px, banners 22px, sheet tops 24px. Pills (full radius) are only for buttons, chips, badges and the search field. Food photos sit inside rounded frames (12px inside cards). The only custom geometry is the logo mark: a pizza slice with a crust line and three pepperoni dots in a red rounded square.

## Components

### Buttons
- **Shape:** full pill.
- **Primary:** pizzeria red, white 600-weight label, 48px (56px for the main sheet and checkout actions); the price goes inside the button when it confirms a purchase ("Adicionar R$ 52,90", "Confirmar pedido").
- **Hover / Press / Focus:** hover deepens to red deep; press scales to 0.97 in 160ms; focus shows a 2px ink outline offset by 2px (white on the dark banner); disabled drops to 45% opacity; loading swaps in a spinner and a "Registrando..." label.
- **Secondary:** white with a 1px strong crumb line. **Ghost:** red-deep text, red-wash hover, for inline actions ("Editar", "Usar", "Desfazer").
- **Add (+):** 40px red circle with a white plus, hit area extended to 48px; it adds directly when no choice is required and opens the product sheet otherwise.

### Chips
- **Style:** white pill, 40px, strong crumb outline.
- **State:** selected turns red-wash with a red outline, red-deep label and a leading check. Active filters under the search are removable red-wash chips with an "x".

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** plate white on the flour ground.
- **Shadow Strategy:** Card shadow (see Elevation); no border.
- **Internal Padding:** 8px around the photo, 6–12px for text.
- **Product card content order (fixed everywhere):** photo with optional badge and heart, name, two-line description, demo rating, price with "a partir de" when needed, red add button.

### Inputs / Fields
- **Style:** 48px, white, 1.5px strong crumb border, 12px radius, 16px text (prevents iOS zoom).
- **Focus:** border turns ink with a soft 3px ink halo.
- **Error:** red border and a red-deep message with an alert icon below, tied with aria-describedby. Optional fields say "Opcional" on the label line.

### Navigation
- **Bottom bar (phones):** floating white bar, 22px radius, five items (Início, Cardápio, Pedidos, Ofertas, Perfil). Inactive: ink-muted icon and label. Active: red icon, bold red-deep label and a 3px red bar on top. The center item is a 66px raised red circle with icon and label inside, ringed by the ground color.
- **Top bar (desktop):** the same five items as pills; active is red-wash with a red-deep label.
- **Header tiles (phones):** 44px white tiles for menu, notifications and bag; counts show as a red badge ringed in the ground color, only when there is something to count.

### Floating Bag Bar (signature)
Ink-black bar, 56px, 16px radius, rising 24px into place when the bag first gets an item: a red bag square, "Ver sacola" with the item count, and the subtotal. It is the one-tap path to the bag on every store page.

### Sheets
Native dialogs. Phones: bottom sheet with 24px top radius, sticky footer for the primary action. Desktop: centered dialog (product, filters) or a right drawer (bag). Open with a 400ms iOS-like drawer curve; reduced motion keeps only a 200ms fade. Required option groups have sticky headers with an "Obrigatório" pill that turns into a green "Ok".

## Do's and Don'ts

### Do:
- **Do** keep pizzeria red (#D71935) for actions, selection and badges only.
- **Do** show every paid option's price next to it ("+ R$ 10,00") and the live total on the confirming button.
- **Do** separate subtotal, delivery fee and discount on their own lines before the total.
- **Do** label demo data as demo where a customer could mistake it for real (ratings "· demo", "Desconto demonstrativo", demo order notices).
- **Do** use Lucide icons at 1.8–2.2 stroke for every icon.
- **Do** keep touch targets at 44px or larger and inputs at 16px text.

### Don't:
- **Don't** use emoji anywhere, including the greeting; use a Lucide icon instead.
- **Don't** put Barlow Condensed in buttons, prices, forms or navigation.
- **Don't** add small uppercase eyebrow text above headings; a promotional label is a red pill selo instead.
- **Don't** show counts or badges with invented numbers (notifications stay empty until a real feed exists).
- **Don't** use Pizza Hut or iFood names, logos, roof shapes or packaging.
- **Don't** stack a border and a wide shadow on the same card.
