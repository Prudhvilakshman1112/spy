# Brand 2 Brand — Storefront (Customer-Facing Website)

> **Vizag's premier men's fashion e-commerce store** — built with Next.js 16, React 19, Supabase, and GSAP. A cinematic, premium shopping experience for clothing, footwear, and accessories.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Flow & Database](#data-flow--database)
- [Supabase Database Schema](#supabase-database-schema)
- [How Data Gets to the Storefront](#how-data-gets-to-the-storefront)
- [Routing & Pages](#routing--pages)
- [Components](#components)
- [State Management](#state-management)
- [Discount System & WhatsApp Checkout](#discount-system--whatsapp-checkout)
- [Atmosphere System](#atmosphere-system)
- [Middleware](#middleware)
- [SEO & Analytics](#seo--analytics)
- [Custom 404 Page](#custom-404-page)
- [Styling & Design System](#styling--design-system)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
- [Relationship with Admin Panel](#relationship-with-admin-panel)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    BRAND 2 BRAND ECOSYSTEM                      │
├──────────────────────────────┬──────────────────────────────────┤
│   STOREFRONT (this project)  │   ADMIN PANEL (separate project) │
│   Port: 3000                 │   Port: 3001                     │
│   d:\Brand2Brand\            │   d:\Brand2Brand-Admin\          │
│   Customer-facing website    │   Product management dashboard   │
└──────────────┬───────────────┴──────────────┬──────────────────┘
               │                              │
               ▼                              ▼
        ┌─────────────────────────────────────────┐
        │          SUPABASE (Shared Backend)       │
        │  ┌─────────┐  ┌──────────┐  ┌────────┐  │
        │  │PostgreSQL│  │ Storage  │  │  Auth   │  │
        │  │   (DB)   │  │ (Images) │  │(Login)  │  │
        │  └─────────┘  └──────────┘  └────────┘  │
        └─────────────────────────────────────────┘
```

Both the storefront and admin panel connect to the **same Supabase project**. The admin adds/edits/deletes products, and the storefront reads and displays them. They are **completely decoupled** — separate folders, separate `node_modules`, separate deployments.

---

## Tech Stack

| Technology       | Purpose                                       |
|-----------------|-----------------------------------------------|
| **Next.js 16**   | React framework — App Router, SSR, file-based routing |
| **React 19**     | UI component library                          |
| **Supabase**     | Backend-as-a-Service — PostgreSQL database, image storage, authentication |
| **@supabase/ssr**| Server-side Supabase client for Next.js       |
| **GSAP**         | GreenSock Animation Platform — hero animations, scroll effects |
| **Vanilla CSS**  | Full design system — no Tailwind, pure CSS with custom properties |
| **@vercel/analytics** | Vercel Web Analytics — page views, visitor metrics |
| **@vercel/speed-insights** | Vercel Speed Insights — Core Web Vitals monitoring |

---

## Project Structure

```
d:\Brand2Brand\
├── .env.local                 # Supabase connection keys
├── next.config.mjs            # Next.js config (image remote patterns, allowed origins)
├── jsconfig.json              # Path aliases (@/ → src/)
├── package.json               # Dependencies & scripts
│
├── public/                    # Static assets
│   ├── images/                # Atmosphere backgrounds, hero images, brand story visual
│   └── products/              # Local product images (legacy)
│
├── src/
│   ├── proxy.js               # Next.js middleware — session refresh
│   │
│   ├── lib/
│   │   ├── queries.js         # ALL database query functions (server-side)
│   │   ├── discounts.js       # Category discount engine + WhatsApp message builder
│   │   └── supabase/
│   │       ├── client.js      # Browser-side Supabase client
│   │       └── server.js      # Server-side Supabase client (with cookies)
│   │
│   ├── context/
│   │   ├── CartContext.js     # Shopping cart + discount-aware totals
│   │   └── AtmosphereContext.js # Theme switching (colors per category)
│   │
│   ├── components/
│   │   ├── Header.js          # Two-row nav: logo+cart row + mobile nav bar
│   │   ├── Footer.js          # Footer with 2-col store info layout
│   │   ├── ProductCard.js     # Product card with colour-thumb gallery + touch swipe
│   │   ├── CartDrawer.js      # Cart with bill breakdown + WhatsApp checkout
│   │   ├── VizagIntro.js      # Cinematic intro animation on first load
│   │   └── WhatsAppWidget.js  # Floating WhatsApp button (auto-hides when cart open)
│   │
│   ├── data/
│   │   └── products.js        # Legacy static product data (fallback)
│   │
│   └── app/                   # Next.js App Router pages
│       ├── layout.js          # Root layout — providers, header, footer, analytics
│       ├── page.js            # Homepage — server component
│       ├── HomeClient.js      # Homepage — hero, discount banner, brand story
│       ├── globals.css        # ENTIRE design system (64KB+)
│       ├── sitemap.js         # Dynamic sitemap (static pages + all active products)
│       ├── robots.js          # robots.txt generation
│       ├── not-found.js       # Custom branded 404 page
│       │
│       ├── clothing/
│       │   ├── page.js        # Clothing listing (server component)
│       │   └── ClothingClient.js  # Tab filtering (client component)
│       │
│       ├── footwear/
│       │   ├── page.js        # Gender selection (Men/Women split hero)
│       │   └── [gender]/
│       │       └── page.js    # Gender-filtered product listing
│       │
│       ├── accessories/
│       │   ├── page.js        # Accessories (server component)
│       │   └── AccessoriesClient.js  # Grouped display (watches, bags)
│       │
│       ├── product/
│       │   └── [id]/
│       │       ├── page.js            # Product detail (server) + dynamic SEO metadata
│       │       └── ProductDetailClient.js  # Gallery, size/colour pickers, WhatsApp enquiry
│       │
│       └── contact/
│           └── page.js        # Hero, feedback form, Google Maps, WhatsApp CTA
```

---

## Data Flow & Database

### How data flows from Admin → Database → Storefront:

```
┌──────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│   ADMIN PANEL    │     │     SUPABASE        │     │    STOREFRONT    │
│  (Port 3001)     │     │                     │     │   (Port 3000)    │
│                  │     │  ┌──────────────┐   │     │                  │
│  Admin adds a    │────▶│  │  products    │   │────▶│  Server Component│
│  new product     │     │  │  table       │   │     │  calls query.js  │
│  with images     │     │  └──────────────┘   │     │  function        │
│                  │     │                     │     │                  │
│  Images uploaded │────▶│  ┌──────────────┐   │     │  Images served   │
│  to storage      │     │  │  Storage     │   │     │  via public URLs │
│                  │     │  │  Bucket      │   │     │                  │
└──────────────────┘     │  └──────────────┘   │     └──────────────────┘
                         └────────────────────┘
```

### Step-by-step data lifecycle:

1. **Admin creates a product** at `http://localhost:3001/products/new`
   - Fills in: name, brand, price, description, sizes, colors, category, subcategory, badge
   - Uploads product images (stored in Supabase Storage bucket `product-images`)
   - Product row inserted into `products` table, image URLs into `product_images` table

2. **Storefront page loads** (e.g., `/clothing`)
   - Next.js **Server Component** executes `getProductsByCategory('clothing')` from `src/lib/queries.js`
   - This creates a **server-side Supabase client** using the service cookies
   - Queries the `products` table with JOINs on `subcategories`, `categories`, and `product_images`
   - Returns shaped product objects to the page component

3. **Data is shaped** by `shapeProduct()` in `queries.js`
   - Flattens the nested Supabase response into a clean object:
     ```js
     {
       id, name, brand, category, subcategory, gender,
       price, originalPrice, description, sizes, colors,
       badge, atmosphere, images: [url1, url2, ...]
     }
     ```

4. **React renders** the product using `ProductCard` component
   - Images loaded from Supabase Storage public URLs
   - Cart interactions handled client-side via `CartContext`

---

## Supabase Database Schema

### Tables

```
┌──────────────────┐      ┌────────────────────┐      ┌──────────────────┐
│   categories     │      │   subcategories     │      │    products      │
├──────────────────┤      ├────────────────────┤      ├──────────────────┤
│ id (uuid, PK)    │─────▶│ id (uuid, PK)      │─────▶│ id (uuid, PK)   │
│ name (text)      │  1:N │ category_id (FK)    │  1:N │ subcategory_id  │
│ slug (text)      │      │ name (text)         │      │ name (text)     │
│ created_at       │      │ slug (text)         │      │ brand (text)    │
└──────────────────┘      │ created_at          │      │ gender (text)   │
                          └────────────────────┘      │ price (numeric) │
                                                      │ original_price  │
                                                      │ description     │
┌──────────────────┐                                  │ sizes (jsonb)   │
│  product_images  │                                  │ colors (jsonb)  │
├──────────────────┤                                  │ badge (text)    │
│ id (uuid, PK)    │◀─────────────────────────────────│ atmosphere_theme│
│ product_id (FK)  │  N:1                             │ is_active (bool)│
│ image_url (text) │                                  │ created_at      │
│ display_order    │                                  └──────────────────┘
└──────────────────┘
```

### Relationships:
- **categories** → **subcategories** (one-to-many): e.g., "Clothing" has "Shirts", "Jeans", "Hoodies"
- **subcategories** → **products** (one-to-many): e.g., "Shirts" has product "Floral Beach Shirt"
- **products** → **product_images** (one-to-many): each product has multiple images with display order

### Key Fields:
- `badge`: Values like `BESTSELLER`, `TRENDING`, `NEW`, `EXCLUSIVE` — used for featured sections
- `is_active`: Boolean toggle — only active products appear on storefront
- `atmosphere_theme`: Controls the visual theme when viewing a product (`clothing`, `footwear`, `accessories`)
- `sizes`: JSON array like `["S", "M", "L", "XL"]`
- `colors`: JSON array like `["Black", "Navy", "White"]`
- `slug`: URL-friendly version of names (e.g., "Men's Clothing" → `mens-clothing`)

### Storage:
- Bucket: `product-images`
- Images uploaded by admin with public URLs
- URL format: `https://xpmudrchipnbmvlawsuw.supabase.co/storage/v1/object/public/product-images/{path}`

---

## Colour Variant System (`colorImages`)

> **This is a major feature** — all new products should be added with colour-image tagging via the Admin Panel.

### Concept

Each product can have **multiple colour variants** (e.g. a shirt in Black, Navy, White). The storefront displays:

1. A **large hero image carousel** with **dot navigation + ← → arrows** at the top.
2. **Colour swatch chips** below the carousel — coloured circles with the colour name. Clicking one **jumps** the carousel to the image specifically tagged for that colour.
3. Image `display_order = 0` is always the **cover photo** — the all-colours / best-angle shot shown by default.
4. All other images are tagged with a specific colour via `color_tag`.

### Database Column

```
product_images table
├── id              (uuid, PK)
├── product_id      (FK → products)
├── image_url       (text)
├── display_order   (integer) — 0 = cover, 1, 2, 3... = colour variants
└── color_tag       (text, nullable) — exact colour name matching colors[] array
                                       e.g. "Black", "Navy", "White/Blue"
```

> **IMPORTANT for Admin Panel agent:** The `color_tag` column must exist in the `product_images` table in Supabase. If it does not exist, run this migration:
> ```sql
> ALTER TABLE product_images ADD COLUMN IF NOT EXISTS color_tag TEXT DEFAULT NULL;
> ```

### Data Shape (storefront)

The `shapeProduct()` function in `src/lib/queries.js` builds a `colorImages` map:

```js
// Product object shape:
{
  id: 'shirt-001',
  colors: ['Black', 'Navy'],         // plain array of colour names
  images: ['/url/cover.jpg', '/url/black.jpg', '/url/navy.jpg'],
  colorImages: {
    'Black': 1,   // images[1] = the Black variant
    'Navy':  2,   // images[2] = the Navy variant
  }
}
```

- `colorImages[colorName]` is an **integer index** into the `images[]` array.
- A colour with no tagged image will not appear in `colorImages` (the swatch will still show but won't navigate).
- If `colorImages` is empty `{}`, swatches are shown but none trigger navigation.

### Admin Workflow (how to add a new product with colour variants)

1. Go to **Admin Panel → Products → New Product**
2. Fill in Name, Price, Category, Subcategory, etc.
3. Add colours in the **Colors** field (e.g. type "Black" → Enter, "Navy" → Enter)
4. Upload images:
   - **Image 1 (first uploaded)** = Cover photo — shown by default. Labelled "🖼 Cover" in the UI.
   - **Image 2+** = Colour variant photos. A **"Tag Colour"** dropdown appears on each image — select which colour this photo represents.
5. Save the product. The `color_tag` is saved on each `product_images` row.
6. The storefront automatically reads `color_tag` and builds the `colorImages` map.

### Admin Edit Workflow

The same colour-tagging UI should also appear on the **Edit Product** page (`/products/[id]/edit`). When loading existing images, fetch `color_tag` alongside `image_url` and `display_order`. Allow re-tagging images via the same dropdown.

### Static Data Fallback (`src/data/products.js`)

For products defined in the static fallback file (before Supabase data exists), `colorImages` is declared directly:

```js
{
  id: 'shirt-001',
  images: ['/img/cover.jpg', '/img/black.jpg', '/img/navy.jpg'],
  colorImages: {
    'Black': 1,
    'Navy':  2,
  }
}
```

This is the **same shape** produced by `shapeProduct()` — components work identically with both sources.

### Colour CSS Lookup

The storefront uses a built-in colour name → CSS value table in `ProductCard.js` and `ProductDetailClient.js` to render the swatch circles. If a new colour is added that doesn't appear in this table, the swatch circle will be grey. The table is in the `COLOR_CSS` constant at the top of each file. Add new entries as needed:

```js
const COLOR_CSS = {
  'black':       '#1A1A1A',
  'navy':        '#1B3A6B',
  'mint':        '#98D4C4',
  // add new colours here...
};
```

---

## How Data Gets to the Storefront

### Server-Side Data Fetching (queries.js)

All product data is fetched **server-side** using Next.js Server Components. The `src/lib/queries.js` file contains all query functions:

| Function | Used By | What It Fetches |
|----------|---------|-----------------|
| `getFeaturedProducts()` | Homepage | Products with badge `BESTSELLER` or `TRENDING` |
| `getNewArrivals()` | Homepage | Products with badge `NEW` or `EXCLUSIVE` |
| `getProductsByCategory(slug)` | Clothing page | All active products in a category |
| `getProductsBySubcategory(cat, sub)` | Filtered views | Products in a specific subcategory |
| `getProductsByGender(gender)` | Footwear gender page | Products filtered by gender |
| `getFootwearByGender(gender)` | Footwear page | Footwear products by gender |
| `getProductById(id)` | Product detail page | Single product with all details |
| `getRelatedProducts(id, cat)` | Product detail page | Related products in same category |
| `getCategories()` | Various | All categories with subcategories |
| `getSubcategories(slug)` | Clothing page | Subcategories for tab filters |
| `getAccessoriesGrouped()` | Accessories page | Grouped by watches (men/women) & bags |

### Supabase Client Configuration

**Server-side** (`src/lib/supabase/server.js`):
- Uses `createServerClient` from `@supabase/ssr`
- Reads cookies from `next/headers` for session management
- Used in Server Components and server-side query functions

**Browser-side** (`src/lib/supabase/client.js`):
- Uses `createBrowserClient` from `@supabase/ssr`
- Used in Client Components if needed (currently not used in storefront)

---

## Routing & Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server + Client | Homepage — hero animation, featured products, new arrivals, brand story |
| `/clothing` | Server + Client | All clothing products with subcategory tab filters |
| `/footwear` | Client | Gender selection split-screen hero (Men / Women) |
| `/footwear/[gender]` | Server | Gender-filtered footwear products (men, women) |
| `/accessories` | Server + Client | Accessories grouped by type (watches, bags) |
| `/product/[id]` | Server | Product detail page with image gallery, sizes, colors, related products |
| `/contact` | Server | Store location, Google Maps embed, WhatsApp link |

### Server vs Client Components:

- **Server Components** (page.js files): Fetch data from Supabase during SSR, pass as props to client components
- **Client Components** (XxxClient.js files): Handle interactivity — animations, filtering, cart, atmosphere switching

Pattern used throughout:
```
page.js (Server) → fetches data → passes to XxxClient.js (Client) → renders UI
```

### Homepage Sections (`HomeClient.js`)

The homepage is composed of these sections in order:

1. **Hero Section** — Full-viewport cinematic hero with GSAP-animated text (badge → h1 → subtitle → CTAs), floating particle dots, and scroll indicator
2. **Discount Banner** — Auto-scrolling ticker showing all three category offers
3. **Explore Our Worlds** — Three atmosphere cards (Clothing, Footwear, Accessories) linking to category pages, each with a background image + overlay
4. **Trending Now** — Featured products grid (`badge = BESTSELLER` or `TRENDING`), colour thumbs hidden
5. **New Arrivals** — New products grid (`badge = NEW` or `EXCLUSIVE`), colour thumbs hidden
6. **Brand Story** — Two-column layout: full-width image on left/top + "Born in the City of Destiny" narrative with CTA to Google Maps

### Product Detail Page (`/product/[id]`)

**Server component** (`page.js`):
- Fetches product via `getProductById(id)` + related products via `getRelatedProducts()`
- Generates dynamic SEO metadata (title, description, og:image, twitter card)
- Calls `notFound()` if product doesn't exist

**Client component** (`ProductDetailClient.js`):
- **Breadcrumb**: Home / Category / Product Name
- **Image gallery**: Hero carousel with stacked layers, touch swipe, arrow navigation, dot indicators
- **"Browse by Colour" thumbnails**: Clicking a colour thumb **only** jumps to that colour's image — it does **NOT** select the colour for ordering (decoupled)
- **Size selector**: "SELECT SIZE" with button-style options
- **Colour selector**: "SELECT COLOUR" with swatch circles (CSS colour dots from `COLOR_CSS` table) — this is what determines the colour sent to cart
- **"ADD TO BAG" button**: Adds selected size + colour to cart
- **"ENQUIRE ON WHATSAPP" button**: Opens WhatsApp with pre-filled message including product name, price, selected colour, and size
- **"You May Also Like"** section: 4 related products from the same category

> **Key design decision**: Image gallery browsing and colour selection for ordering are deliberately **decoupled**. A customer can browse colour images without accidentally selecting that colour for their order.

### Contact Page (`/contact`)

- **Hero section** with background image and "GET IN TOUCH" heading
- **Feedback form**: Name, email, phone/WhatsApp, message fields (client-side submit with success animation)
- **Store details**: Google Maps embed + address + phone + WhatsApp CTA button

---

## Components

### Header (`src/components/Header.js`)
- **Two-row layout** on mobile:
  - Row 1: Brand logo (left) + cart icon with count badge (right)
  - Row 2: Horizontal nav links (Clothing, Footwear, Accessories, Contact)
- Desktop: single row with logo, inline nav, and cart icon
- Scroll-aware background (transparent → solid `rgba(13,13,13,0.98)` after 20px scroll)
- Active link highlighting based on current pathname

### ProductCard (`src/components/ProductCard.js`)
- Image carousel with **stacked layers** (CSS opacity transitions, not sliding)
- **Touch swipe** support for mobile (40px threshold)
- **← → arrow navigation** on desktop hover
- **Colour image thumbnails** below the card — clicking jumps carousel to that colour's image
  - Controlled by `hideColorThumbs` prop (hidden on homepage, shown on category pages)
- **Dot navigation** shown only when no colour thumbs are available
- Badge display (BESTSELLER, NEW, TRENDING, EXCLUSIVE)
- **Two Quick Add UI modes**:
  - Desktop: slide-up "Quick Add" bar on hover
  - Mobile: persistent small cart icon (bottom-right corner, always visible)
- Graceful fallback: deterministic gradient placeholder for missing/broken images
- Links to `/product/[id]` detail page

### CartDrawer (`src/components/CartDrawer.js`)
- Slide-out panel from right side with backdrop overlay
- **Product images** shown per item (with category-coloured initials fallback)
- Per-item display: name, size, colour, price
- **Discount-aware pricing**: shows original price struck through + discounted price + "X% OFF" badge
- Line total shown when quantity > 1 (with "save ₹X" annotation)
- Quantity adjustment (+/−) per item
- Remove item button
- **Full bill breakdown footer**:
  - Original Total
  - Per-category savings (e.g. "Clothing (10% off): −₹X")
  - "🎉 YOU SAVE" total savings highlight
  - Final Total after all discounts
- **WhatsApp checkout button** — sends the entire cart as a formatted message to the store owner

### VizagIntro (`src/components/VizagIntro.js`)
- Cinematic intro animation on first site visit
- Multi-phase animation: logo → brand name → tagline → fade out
- Uses GSAP timeline for orchestrated animations
- Only plays once per session (sessionStorage check)

### Footer (`src/components/Footer.js`)
- **Brand column**: Logo + tagline
- **"Visit Our Store" column** with 2-column contact grid:
  - Left: Full address (Shivalayam St, Pedda Waltair JN, Vizag)
  - Right: Phone (clickable `tel:` link), WhatsApp link, Instagram (`@brand2brands_official`)
- Bottom bar: copyright + social icons (Instagram, WhatsApp)

### WhatsAppWidget (`src/components/WhatsAppWidget.js`)
- Floating WhatsApp icon (bottom-right corner)
- Links to WhatsApp with pre-filled message
- Bounce animation on load
- **Auto-hides when cart drawer is open** (to avoid obstructing the cart's own WhatsApp CTA)

---

## State Management

### CartContext (`src/context/CartContext.js`)
Manages the shopping cart state across the entire app using React Context. Now integrated with the discount engine.

**State:**
- `items` — Array of cart items (product + size + color + quantity)
- `isOpen` — Whether the cart drawer is visible

**Actions:**
- `addItem(product, size, color)` — Adds product or increments quantity if same variant exists
- `removeItem(cartId)` — Removes item by cartId
- `updateQuantity(cartId, qty)` — Updates quantity, removes if ≤ 0

**Computed (discount-aware):**
- `totalItems` — Sum of all item quantities
- `subtotal` / `originalTotal` — Sum of (price × quantity) before discounts
- `savingsByCategory` — `{ clothing: N, footwear: N, accessories: N }`
- `totalSavings` — Sum of all category savings
- `finalTotal` — Original total minus all savings
- `itemBreakdown` — Items enriched with `{ rate, originalLineTotal, discountedLineTotal, saving }`

### AtmosphereContext (`src/context/AtmosphereContext.js`)
Manages the visual theme system that changes colors based on the current category page.

**Themes:**
| Atmosphere | Background | Accent | Use Case |
|-----------|-----------|--------|----------|
| `default` | `#FAFAFA` | `#C41230` (Red) | Homepage |
| `clothing` | `#FAFAFA` | `#C41230` (Red) | Clothing pages |
| `footwear` | `#F5F5F0` | `#C41230` (Red) | Footwear pages |
| `accessories` | `#0D0D0D` | `#B8860B` (Gold) | Accessories (dark luxury theme) |

Theme changes are applied by setting CSS custom properties on `document.documentElement`:
- `--atmosphere-bg`, `--atmosphere-text`, `--atmosphere-accent`, `--atmosphere-surface`, `--atmosphere-surface-hover`

---

## Discount System & WhatsApp Checkout

### Category-Specific Discounts (`src/lib/discounts.js`)

The storefront applies **automatic category-based discounts** to every item in the cart:

| Category | Discount Rate | Label |
|------------|---------------|----------|
| Clothing | 10% | `10% OFF` |
| Footwear | 20% | `20% OFF` |
| Accessories | 30% | `30% OFF` |

**Key functions:**

| Function | Purpose |
|----------|--------|
| `getDiscountRate(category)` | Returns the decimal rate (0–1) for a category |
| `applyDiscount(price, category)` | Returns discounted price for a single item |
| `computeCartTotals(items)` | Full cart breakdown: originalTotal, savingsByCategory, totalSavings, finalTotal, itemBreakdown |
| `buildWhatsAppMessage(itemBreakdown, totals)` | Generates the formatted WhatsApp order message |

### How Discounts Flow Through the App

```
Customer adds item to cart
          │
          ▼
CartContext.addItem() stores product with `category` field
          │
          ▼
useMemo(() => computeCartTotals(items))
  │
  ├── For each item: rate = DISCOUNT_RATES[item.category]
  ├── discountedLineTotal = price × qty × (1 − rate)
  ├── saving = originalLineTotal − discountedLineTotal
  └── Aggregate: savingsByCategory, totalSavings, finalTotal
          │
          ▼
CartDrawer renders bill breakdown with per-category savings
          │
          ▼
"Send Order on WhatsApp" button calls buildWhatsAppMessage()
  │
  ├── Lists each item: name, size, colour, qty, price, discount
  ├── Per-category savings summary
  ├── Original Total, Total Savings, FINAL TOTAL
  └── Opens: wa.me/918074548419?text=<encoded message>
```

### WhatsApp Message Format

When the customer clicks "Send Order on WhatsApp", a message like this is generated:

```
🛏️ *NEW ORDER — Brand 2 Brand*

1. *Floral Beach Shirt*
   Size: L | Colour: Navy | Qty: 2
   Price: ₹1,299 × 2 = ₹2,598 → After 10% OFF: ₹2,338

2. *Premium Sneakers*
   Size: 9 | Colour: White | Qty: 1
   Price: ₹3,999 × 1 = ₹3,999 → After 20% OFF: ₹3,199

━━━━━━━━━━━━━━━━━━━━
Clothing (10% off) saved: −₹260
Footwear (20% off) saved: −₹800
Original Total : ₹6,597
Total Savings  : −₹1,060
*FINAL TOTAL   : ₹5,537*
━━━━━━━━━━━━━━━━━━━━
Please confirm availability & shipping details. Thank you! 🙏
```

### Animated Discount Banner (Homepage)

The homepage displays a **scrolling ticker banner** (`DiscountBanner` in `HomeClient.js`) below the hero section:
- Horizontally auto-scrolling CSS animation
- Shows all three offers: 🎽 CLOTHING 10% OFF ✦ 👟 FOOTWEAR 20% OFF ✦ 💎 ACCESSORIES 30% OFF
- Fixed "OFFERS" label on the left

---

## Atmosphere System

The "Atmosphere" concept is a unique design feature — when users navigate to different category pages, the entire site's color scheme smoothly transitions:

1. Each category page calls `setCurrentAtmosphere('clothing')` (or `'footwear'`, `'accessories'`)
2. AtmosphereContext updates CSS custom properties on `<html>`
3. All styled elements using `var(--atmosphere-*)` automatically update
4. Creates an immersive, category-specific visual experience

Example: Accessories page uses a dark, gold-accented luxury theme vs. the bright, clean clothing theme.

---

## Middleware

### `src/proxy.js`
Next.js middleware that runs on every request (except static assets).

**Purpose:** Refreshes the Supabase auth session by calling `supabase.auth.getUser()` on each request. This keeps session cookies up to date.

**Matcher:** Excludes `_next/static`, `_next/image`, `favicon.ico`, and common asset file extensions.

> Note: The storefront middleware does NOT enforce authentication. All pages are publicly accessible. Authentication is only required on the admin panel.

---

## SEO & Analytics

### Dynamic Metadata

Every product page generates **unique SEO metadata** at build/request time via `generateMetadata()` in `src/app/product/[id]/page.js`:
- `<title>`: "Product Name by Brand | Brand Two Brand's"
- `<meta description>`: Product description or auto-generated from name, brand, price, category
- `keywords`: Product name, brand, category, "Brand Two Brand", "Vizag fashion"
- `og:image` and `twitter:image`: First product image (with `summary_large_image` card)

The root layout (`layout.js`) sets site-wide metadata:
- Title: "Brand Two Brand's | Premium Men's Fashion Store - Vizag"
- OpenGraph type: `website`

### Sitemap (`src/app/sitemap.js`)

Dynamic sitemap generation at `/sitemap.xml`:
- **Static pages**: `/`, `/clothing`, `/footwear`, `/accessories`, `/contact`, `/footwear/men`, `/footwear/women`
- **Dynamic product pages**: Queries all active products from Supabase and generates `/product/[id]` entries
- Priorities: Homepage (1.0) > Categories (0.9) > Gender pages (0.8) > Contact (0.7) > Products (0.6)
- Graceful fallback: still returns static pages if database is unreachable

### Robots (`src/app/robots.js`)

- Allows all crawlers on `/`
- Disallows `/api/` and `/_next/`
- Points to sitemap at `https://brand2brands.vercel.app/sitemap.xml`

### Vercel Analytics & Speed Insights

Both are included in the root layout:
- `<SpeedInsights />` from `@vercel/speed-insights/next` — monitors Core Web Vitals
- `<Analytics />` from `@vercel/analytics/next` — tracks page views and visitors

---

## Custom 404 Page

`src/app/not-found.js` — a fully branded 404 experience:

- **Giant animated "404"** with gradient text and glow effects
- Decorative divider line
- Headline: "PAGE NOT FOUND"
- Tagline: "The page you're looking for has wandered off the runway"
- Two CTAs: "BACK TO HOME" + "EXPLORE CLOTHING"
- Floating brand watermark in the background
- Noise texture overlay for premium feel

---

## Styling & Design System

The entire design system lives in `src/app/globals.css` (64KB+). Key features:

- **CSS Custom Properties** for theme switching (atmosphere system)
- **No CSS framework** — pure vanilla CSS for maximum control
- **Responsive design** with mobile-first breakpoints
- **GSAP animations** for hero section, product reveals
- **Glassmorphism effects** on header and cards
- **Hero particles** — floating animated dots on homepage
- **Product card hover effects** — image swap, quick-add bar reveal
- **Cart drawer transitions** — smooth slide-in/out
- **Discount banner ticker** — infinite horizontal scroll animation
- **404 page effects** — gradient text, glow pulse, noise overlay
- **Contact page** — form styling, map embed, responsive 2-column store info
- **Colour swatches** — circular dots with CSS background values from `COLOR_CSS` lookup

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

| Variable | Visibility | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (browser) | Supabase anonymous key (read-only access) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role key (full access — never exposed to browser) |

---

## Deployment

### Production URL

**https://brand2brands.vercel.app**

The storefront is deployed on **Vercel** with automatic deployments from the Git repository.

### Next.js Configuration (`next.config.mjs`)

```js
const nextConfig = {
  allowedDevOrigins: ['192.168.0.109'],   // LAN testing on mobile
  images: {
    remotePatterns: [
      new URL('https://xpmudrchipnbmvlawsuw.supabase.co/**'),  // Supabase Storage
    ],
  },
};
```

- `allowedDevOrigins`: Allows dev server access from local network (for testing on phone)
- `images.remotePatterns`: Whitelists the Supabase Storage domain for Next.js `<Image>` optimization

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Brand2Brand

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

The storefront will be available at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

---

## Relationship with Admin Panel

This storefront is **read-only** — it only fetches and displays data. All data management (adding products, editing categories, uploading images) is done through the **separate Admin Panel** at `d:\Brand2Brand-Admin\`.

| Aspect | Storefront | Admin Panel |
|--------|-----------|-------------|
| Location | `d:\Brand2Brand\` | `d:\Brand2Brand-Admin\` |
| Port | 3000 | 3001 |
| Access | Public (anyone) | Password-protected |
| Database | Reads only | Reads + Writes |
| Storage | Reads image URLs | Uploads images |
| Auth | Session refresh only | Full login/logout flow |

**Flow:** Admin adds product → Supabase stores it → Storefront displays it on next page load.

---

## License

Private project — Brand 2 Brand, Visakhapatnam.
