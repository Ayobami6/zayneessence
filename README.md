# zayneessence

A mobile-first, installable PWA luxury e-commerce web application for **zayneessence**, a Nigerian house formulating skincare with unrefined northern Nigerian shea, cold-pressed baobab and moringa for melanin-rich skin, alongside aged pure oud oils, attar roll-ons and fine perfume.

---

## Architecture & Tech Stack

- **Monorepo (`apps/web` + `apps/api`)**:
  - `apps/web`: **Next.js 14 (App Router)** with strict **TypeScript** and **Material UI v6**.
  - `apps/api`: **TypeScript + NestJS** backend architecture with **PostgreSQL** (`apps/api/sql/schema.sql`), Row Level Security (RLS) on all 12 tables, idempotent catalogue seed script (`apps/api/sql/seed.ts`), and HMAC-SHA512 verified Paystack webhook handler (`apps/api/src/webhooks/paystack.controller.ts`).
- **Design System — Glow framework** (`apps/web/src/theme`, `apps/web/src/components/glow`):
  - Blush canvas `#F6EAF3`, white surfaces, petal tiles `#EFDCEB`, ink `#150C14` pill actions and an orchid `#9C3F71` accent, with a derived dark mode and a persisted sun/moon toggle. Tokens live in `theme/tokens.ts` and are exposed as `theme.palette.glow`.
  - **Plus Jakarta Sans** (400–800, italic accents) for everything; **Italiana** only for the lowercase `zayneessence` wordmark (`<Wordmark />`).
  - Shared primitives: `AccentHeading`, `RingGauge` and `ArcGauge` (used only for real progress: free delivery, order stage, ritual steps, oud age), `PhotoTile`/`InfoPanel`, `CircleIconButton`, `StatDisc`, `QuantityStepper`, and a floating pill nav on phones.
- **Catalogue**: seven categories (`CATEGORY_META` in `types/domain.ts`), including **Bakhoor & turaren wuta** and **Supplements**, with `/shop/[category]` pages and a `/consultation` ritual builder. The eight Bakhoor / Supplements products are flagged `is_sample: true` and must be replaced before launch.
- **Payments & Notifications**:
  - **Paystack** (card, bank transfer, USSD) as primary payment gateway, with **Flutterwave** as fallback. All prices are stored in integer **kobo** and formatted in `en-NG` (`₦185,000`).
  - **Resend** transactional email + feature-flagged **WhatsApp Business Cloud API** order updates (`NEXT_PUBLIC_ENABLE_WHATSAPP_UPDATES`).

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example apps/web/.env.local
```
By default (`NEXT_PUBLIC_DATA_MODE="mock"`), the storefront, cart, wishlist, account OTP/magic-link sign-in, interactive Paystack/Flutterwave test checkout modal, and `/admin` dashboard work out-of-the-box with zero external keys required.

### 3. Run the development server
```bash
npm run dev
```
Open `http://localhost:3000`.

### 4. Generate / run the catalogue seed script
```bash
npm run seed
```
This reads the 12 luxury products from `apps/web/src/data/seed-catalogue.ts` and writes idempotent PostgreSQL `INSERT ... ON CONFLICT DO UPDATE` statements to `apps/api/sql/seed.sql`. To apply the schema and seed data to a live PostgreSQL / Supabase database:
```bash
psql "$DATABASE_URL" -f apps/api/sql/schema.sql
psql "$DATABASE_URL" -f apps/api/sql/seed.sql
```

---

## Paystack & Flutterwave Test Keys

To test with live Paystack or Flutterwave test popups instead of the built-in interactive test modal:
1. Obtain your test keys from the Paystack Dashboard (`Settings -> API Keys & Webhooks`).
2. Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."` and `PAYSTACK_SECRET_KEY="sk_test_..."` in `.env.local`.
3. Configure your Paystack webhook URL to point to `/api/webhooks/paystack`. Payment status in PostgreSQL (`payments.status = 'verified'`) is only ever updated after `verifyPaystackWebhookSignature` validates the `x-paystack-signature` HMAC-SHA512 header.

---

## How to Add Products & Replace Product Photography

1. **Via the Studio Admin UI (`/admin`)**:
   - Navigate to `http://localhost:3000/admin` and click **Enter studio admin**.
   - Click **Add new product** or **Edit piece** on any existing item.
   - Upload portrait `4:5` JPEG studio photos (minimum `2000px` on the long edge, soft blush backdrop close to `#EFDCEB`), reorder images with the up/down arrows, and edit the accessibility `alt` text for each view.
   - Add or update size variants, prices (in Naira, automatically stored in kobo), stock counts, scent notes (`Top`, `Heart`, `Base`) or skincare `Key ingredients`, and publish/unpublish.
2. **Replacing the stand-in photography**:
   - Product photos live in `apps/web/public/products/<slug>/1.jpg`; editorial photos in `apps/web/public/images/`. They are free Unsplash stand-ins (credits in `apps/web/public/products/CREDITS.md`) showing other people's products.
   - Replace them with real zayneessence photography in Supabase Storage or the same folders, then update the URLs in `/admin` or `apps/web/src/data/seed-catalogue.ts`.
   - Existing databases need `apps/api/sql/migrations/001_glow_categories.sql` before seeding the new categories.

---

## Testing & Verification

```bash
# TypeScript strict check
npm run typecheck

# Unit tests (Vitest)
npm run test

# Production build
npm run build

# End-to-End tests (Playwright)
npm run test:e2e
```

---

## Deployment (Vercel)

1. Import the repository into **Vercel** and set the **Root Directory** to `apps/web`.
2. Add the environment variables documented in `.env.example`.
3. Deploy — `next/image` AVIF/WebP optimization, `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` are configured automatically.
