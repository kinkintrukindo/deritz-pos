# De Ritz — Make Up & Bridal — Product Requirements Document (PRD)

**Version:** 0.2 (draft)
**Date:** 2026-07-03
**Owner:** ekin.njotoatmodjo
**Status:** In review

---

## 1. Overview

**De Ritz (Make Up & Bridal)** is a designer boutique specializing in
**Peranakan / kebaya-style bridal and occasion wear** — richly embroidered
cheongsam-style kebaya, bodice kebaya sets, and matching accessories (per
their "LOOK #" catalogues and bundled "Premium Sets" of bodice + span/skirt +
shawl), alongside bridal makeup services. This project delivers a **public
ecommerce storefront** where clients browse the curated collection, order
pieces **made-to-measure** (or in preset sizes), pay online, and track their
order — paired with a lightweight **admin dashboard** for staff to manage the
catalogue and pricing.

The experience should feel like a **luxury fashion house**, not a generic web
shop — visually immersive, editorial, and restrained, taking UX/layout cues
from [Gentle Monster](https://www.gentlemonster.com/int/en) (big imagery,
minimal chrome, generous whitespace), but expressed in **De Ritz's own palette**
— ivory/cream with deep jewel accents (burgundy + antique gold, drawn from the
logo and catalogue photography) rather than Gentle Monster's black & white, so
the richly colored embroidery and silks stay the visual focus.

### Vision statement
> Give brides the confidence of a couture atelier online: a beautiful, calm
> browsing experience, a made-to-measure ordering flow that feels personal, and
> total transparency on price, shipping, and order status.

---

## 2. Goals & Non-Goals

### Goals (v1 / MVP)
- Publish a striking, image-led storefront for the Deritz gown collection.
- Let customers configure a gown by **size preset (XS/S/M) or custom measurements
  (bust, waist, hip)** via sliders.
- Take real payments through **Midtrans** (sandbox first, then production).
- Provide a **shipping fee estimate** at checkout based on destination.
- Support **multi-currency** display (settlement via Midtrans).
- Give customers **accounts + order history, wishlist, guest checkout, and
  appointment booking**.
- Provide an **admin dashboard** (passcode-gated) to CRUD gowns, images, sizes,
  and prices, and to view/manage orders and appointments.

### Non-Goals (v1)
- No physical in-store POS register / cash drawer / barcode hardware (storefront only).
- No multi-vendor / marketplace features.
- No advanced marketing suite (email campaigns, loyalty points, coupons — *fast-follow*).
- No fully custom "design your own gown from scratch" builder — only measurement
  customization of existing models.
- No mobile native app (responsive web only).

---

## 3. Target Users & Personas

| Persona | Description | Key needs |
|---|---|---|
| **Bride (shopper / client)** | Primary customer, often first-time luxury buyer, browsing on mobile & desktop. | Beautiful browsing, trustworthy sizing, clear price incl. shipping, order tracking, ability to book a fitting. |
| **Guest visitor** | Browsing without an account. | Frictionless browse + guest checkout, save wishlist locally. |
| **Boutique staff / employee (admin)** | Manages the catalogue and fulfilment. | Fast product entry, image upload, price/size management, order & appointment overview. |

---

## 4. Scope: Core User Flows

### 4.1 Browse & discover
1. Land on an immersive homepage (campaign hero video/imagery + featured collections).
2. Navigate collections (e.g., *Bridal Gowns*, *Veils & Accessories*, *New Season*).
3. View a gown detail page: gallery, description, fabric/details, price (in selected currency), size options.

### 4.2 Made-to-measure ordering (the signature flow)
1. On a gown page, choose **Size mode**:
   - **Preset** — XS / S / M (maps to a standard measurement chart).
   - **Custom** — adjust **Bust / Waist / Hip** via sliders (with numeric input + unit toggle cm/in).
2. See any **made-to-measure surcharge / lead-time** note (configurable per gown).
3. Add to cart (cart line stores the chosen measurements/size snapshot).
4. Checkout → enter/confirm shipping address.
5. **Shipping estimator** returns cost + ETA for the destination and currency.
6. Pay via **Midtrans**.
7. Receive confirmation + order-tracking link.

### 4.3 Order tracking
- Customer views order status timeline: *Received → In production → Quality check → Shipped → Delivered*.
- Tracking accessible from account (logged-in) or via order-lookup link (guest).

### 4.4 Appointment booking
- Customer books an in-store/virtual fitting via a calendar (date + time slot).
- Admin sees appointments in the dashboard; customer gets a confirmation.

### 4.5 Wishlist
- Heart/save gowns (Gentle Monster–style). Persisted to account when logged in;
  local storage for guests, merged on login.

### 4.6 Admin catalogue management
1. Employee unlocks the dashboard with **passcode**.
2. Create/edit/delete gowns: name, description, category/collection, images,
   base price, currency, size presets, measurement ranges, made-to-measure
   surcharge, lead time, publish/unpublish.
3. View & update orders (status transitions) and appointments.

---

## 5. Functional Requirements

### 5.1 Storefront
- **FR-1** Homepage with hero media, featured collections, and editorial sections.
- **FR-2** Collection/category listing with responsive product grid, lazy-loaded imagery, wishlist toggle per card.
- **FR-3** Product detail page: image gallery/zoom, description, details, price, size selector, made-to-measure module, add-to-cart, wishlist, "book a fitting" CTA.
- **FR-4** Global currency selector; all prices reflect the selection.
- **FR-5** Search and basic filtering (by collection, price range) — *nice-to-have for MVP*.

### 5.2 Made-to-measure module
- **FR-6** Toggle between preset sizes (XS/S/M) and custom.
- **FR-7** Custom mode exposes Bust/Waist/Hip sliders + numeric fields, min/max constrained per gown (admin-set), with cm/in unit toggle.
- **FR-8** Validation prevents impossible/out-of-range measurements.
- **FR-9** Measurement snapshot stored on the cart line and persisted with the order.
- **FR-10** Optional per-gown made-to-measure surcharge and lead-time displayed before payment.

### 5.3 Cart & checkout
- **FR-11** Cart persists across sessions (account) and locally (guest).
- **FR-12** Checkout supports **guest** and **logged-in** paths.
- **FR-13** Address capture with country selection driving shipping + currency.
- **FR-14** Order summary shows itemized price, made-to-measure surcharge, shipping, taxes (if applicable), and total in selected currency.

### 5.4 Payments (Midtrans)
- **FR-15** Integrate **Midtrans Snap** for checkout (cards, e-wallets, bank transfer as available).
- **FR-16** Handle Midtrans **webhook/notification** to confirm payment and update order status.
- **FR-17** Start in **sandbox**; production keys via environment variables.
- **FR-18** Idempotent order creation; never mark paid without verified notification.

### 5.5 Shipping estimator
- **FR-19** Estimate shipping cost + ETA from destination (country/city) and parcel assumptions.
- **FR-20** Domestic (Indonesia) via a courier rate API (e.g., **RajaOngkir**, free tier); international via configurable **zone-based flat rates** as fallback.
- **FR-21** Estimate shown before payment and stored on the order.

### 5.6 Multi-currency
- **FR-22** Base/settlement currency **IDR** (Midtrans); display in customer-selected currency.
- **FR-23** Convert via a **free FX rate API** (e.g., open.er-api.com), cached daily.
- **FR-24** Show a clear note that final charge is processed in the settlement currency.

### 5.7 Accounts
- **FR-25** Register / log in (email + password via Supabase Auth).
- **FR-26** Account area: profile, saved measurements, order history + tracking, wishlist, appointments.
- **FR-27** Guest order lookup by order number + email.

### 5.8 Appointments
- **FR-28** Calendar-based booking (date/time slot, appointment type, notes).
- **FR-29** Confirmation to customer; visible + manageable in admin.

### 5.9 Admin dashboard
- **FR-30** Passcode gate (`110501`) to access `/admin` (see §9 security note).
- **FR-31** Product CRUD incl. multi-image upload to storage.
- **FR-32** Manage size presets, measurement ranges, prices, surcharges, publish state.
- **FR-33** Orders list with status management and measurement/detail view.
- **FR-34** Appointments list with status management.

---

## 6. Data Model (initial)

- **Product (Gown/Model)**: id, name, slug, description, details, collectionId,
  basePriceIDR, images[], sizePresets (XS/S/M → measurements), measurement ranges
  (bust/waist/hip min/max), madeToMeasureSurcharge, leadTimeDays, published, timestamps.
- **Collection/Category**: id, name, slug, heroMedia, sortOrder.
- **CartLine**: id, cartId, productId, sizeMode (preset|custom), sizePreset?,
  measurements{bust,waist,hip,unit}, unitPrice, surcharge, qty.
- **Order**: id, orderNumber, customer (userId? + guest email/name), items[]
  (measurement snapshots), currency, subtotal, surcharge, shipping, tax, total,
  midtransTransactionId, paymentStatus, fulfillmentStatus, shippingAddress, timestamps.
- **User (Customer)**: id, email, name, savedMeasurements, addresses[].
- **WishlistItem**: id, userId, productId.
- **Appointment**: id, customer info, datetime, type, status, notes.

---

## 7. Design Direction (Gentle Monster UX + De Ritz brand)

- **Palette:** ivory/cream (`#F7F1E8`-ish) base, deep charcoal/grey text, with
  **burgundy** and **antique gold** (from the logo monogram) as accent colors.
  Product photography (jewel-toned kebaya, embroidery) supplies the richness —
  chrome stays quiet so it doesn't compete.
- **Logo:** gold "R" monogram + grey/olive small-caps serif wordmark ("De Ritz",
  "Make Up & Bridal") — see `public/brand/logo.png`. Use the wordmark's serif
  small-caps treatment as the cue for heading typography.
- **Typography:** elegant serif (small-caps for headings/eyebrow labels, echoing
  the logo) + clean sans-serif for body/UI. Large type, wide letter-spacing on labels.
- **Layout:** editorial, grid-based, calm; product cards uniform with model
  photography > specs, matching the catalogue's "LOOK #" full-bleed portrait
  style. Big campaign hero (image/video) on the homepage.
- **Product presentation:** mirror the catalogue convention — look/style name,
  price in IDR (`4.500.000` formatting), and support **bundled "Sets"**
  (e.g., bodice kebaya + span + shawl priced as one item) alongside single pieces.
- **Motion:** subtle, tasteful — slow fades, reveal-on-scroll, gentle image zoom.
  Never busy; motion should feel curated, not gimmicky.
- **Mood:** heritage luxury, atelier, editorial — avant-garde restraint in UX,
  warmth and craftsmanship in imagery.
- **Responsive:** mobile-first; imagery adapts gracefully; touch-friendly sliders.

---

## 8. Tech Stack & Architecture (optimized for free / cheapest)

| Concern | Choice | Why (cost) |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript + Tailwind CSS** | Free; deploys on Vercel Hobby at no cost. |
| Hosting | **Vercel Hobby** | Free tier covers this scale. |
| Database + Auth + Storage | **Supabase (free tier)** | One free service for Postgres + customer auth + image storage. |
| Payments | **Midtrans Snap** (sandbox → prod) | Native to Indonesia; sandbox is free. |
| Shipping (domestic) | **RajaOngkir** free tier | Free courier rates for Indonesia. |
| Shipping (intl) | **Zone-based flat rates** (configurable) | No paid API needed for MVP. |
| FX rates | **open.er-api.com** (free) | Free daily rates for multi-currency display. |
| Admin auth | **Passcode gate** (env var) | Zero-cost MVP; upgrade path noted below. |

- Product images uploaded to Supabase Storage; served via Next.js `<Image>` for optimization.
- Server Actions / Route Handlers for cart, checkout, Midtrans webhook, and admin mutations.
- Secrets (`MIDTRANS_SERVER_KEY`, Supabase keys, `ADMIN_PASSCODE`, etc.) via Vercel env vars — never committed.

---

## 9. Non-Functional Requirements

- **Performance:** fast LCP on image-heavy pages (optimized images, lazy loading, caching).
- **Accessibility:** WCAG-minded — keyboard-operable sliders, alt text, contrast on the b/w theme.
- **Security & privacy:**
  - Never mark an order paid without a verified Midtrans notification.
  - Treat customer PII (measurements, addresses) as confidential; least-privilege DB access.
  - ⚠️ **The hardcoded passcode `110501` is acceptable for an MVP demo but is NOT
    production-grade.** Before launch, move admin behind real authentication
    (Supabase Auth with an admin role, or OAuth) and keep the passcode only as an
    interim gate stored in an env var, never in source.
- **i18n:** currency now; full language localization is a fast-follow.
- **Reliability:** idempotent payment/order handling; graceful failures on 3rd-party APIs (FX, shipping) with sensible fallbacks.

---

## 10. Milestones / Phased Roadmap

- **M0 — Foundation:** Next.js + Tailwind scaffold, Supabase project, base design system, deploy to Vercel.
- **M1 — Catalogue:** data model, admin passcode gate + product CRUD + image upload, storefront listing + product detail.
- **M2 — Made-to-measure + cart:** size presets, measurement sliders, cart with measurement snapshots.
- **M3 — Checkout + payments:** address, shipping estimate, multi-currency display, Midtrans Snap + webhook, order confirmation.
- **M4 — Accounts & tracking:** auth, order history, guest lookup, order status timeline.
- **M5 — Wishlist & appointments:** wishlist (guest + account merge), appointment booking.
- **M6 — Polish:** motion, performance, accessibility, content, production Midtrans + real admin auth.

---

## 11. Open Questions / Risks

1. **International shipping** — is real cross-border courier pricing needed at launch, or are zone-based flat rates acceptable for v1? (Currently assuming flat-rate fallback.)
2. **Taxes/duties** — should the site compute VAT/import duties, or state "duties on delivery"?
3. **Made-to-measure economics** — is there a flat surcharge, or does price scale with customization? Lead times per gown?
4. **Which currencies** to expose in the selector (e.g., IDR, USD, SGD, AUD)?
5. **Returns/alterations policy** for made-to-measure (typically non-returnable) — needs clear messaging.
6. **Appointment logistics** — in-store only, or also virtual? Which locations/timezones?
7. **Production readiness** — timeline for replacing the passcode gate with real admin auth.

---

*Next step: on approval, scaffold M0 (Next.js + Tailwind + Supabase, deployed to Vercel) and stand up the design system + homepage shell.*
