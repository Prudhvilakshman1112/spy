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
- [Atmosphere System](#atmosphere-system)
- [Middleware](#middleware)
- [Styling & Design System](#styling--design-system)
- [Environment Variables](#environment-variables)
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

---

## Project Structure

```
d:\Brand2Brand\
├── .env.local                 # Supabase connection keys
├── next.config.mjs            # Next.js configuration
├── jsconfig.json              # Path aliases (@/ → src/)
├── package.json               # Dependencies & scripts
│
├── public/                    # Static assets
│   ├── images/                # Atmosphere backgrounds, hero images
│   └── products/              # Local product images (legacy)
│
├── src/
│   ├── proxy.js               # Next.js middleware — session refresh
│   │
│   ├── lib/
│   │   ├── queries.js         # ALL database query functions (server-side)
│   │   └── supabase/
│   │       ├── client.js      # Browser-side Supabase client
│   │       └── server.js      # Server-side Supabase client (with cookies)
│   │
│   ├── context/
│   │   ├── CartContext.js     # Shopping cart state management
│   │   └── AtmosphereContext.js # Theme switching (colors per category)
│   │
│   ├── components/
│   │   ├── Header.js          # Navigation bar with cart button
│   │   ├── Footer.js          # Footer with links & store info
│   │   ├── ProductCard.js     # Product display card with image gallery
│   │   ├── CartDrawer.js      # Slide-out shopping cart panel
│   │   ├── VizagIntro.js      # Cinematic intro animation on first load
│   │   └── WhatsAppWidget.js  # Floating WhatsApp contact button
│   │
│   ├── data/
│   │   └── products.js        # Legacy static product data (fallback)
│   │
│   └── app/                   # Next.js App Router pages
│       ├── layout.js          # Root layout — providers, header, footer
│       ├── page.js            # Homepage — server component
│       ├── HomeClient.js      # Homepage — client component (animations)
│       ├── globals.css        # ENTIRE design system (40KB+)
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
│       │       └── page.js    # Product detail page (dynamic route)
│       │
│       └── contact/
│           └── page.js        # Store location, map, contact info
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

---

## Components

### Header (`src/components/Header.js`)
- Fixed navigation bar at top
- Links: Clothing, Footwear, Accessories, Contact
- Cart icon with item count badge
- Scroll-aware background transparency
- Mobile hamburger menu with slide-in overlay
- Closes mobile menu on route change

### ProductCard (`src/components/ProductCard.js`)
- Displays product image with hover-to-switch gallery
- Thumbnail strip for multi-image products
- Badge display (BESTSELLER, NEW, etc.)
- Quick Add button (adds first size/color to cart)
- Graceful fallback: gradient placeholder for missing images
- Links to `/product/[id]` detail page

### CartDrawer (`src/components/CartDrawer.js`)
- Slide-out panel from right side
- Shows cart items with name, size, color, price
- Quantity adjustment (+/−) per item
- Remove item button
- Subtotal calculation
- Checkout button (placeholder)
- Backdrop overlay when open

### VizagIntro (`src/components/VizagIntro.js`)
- Cinematic intro animation on first site visit
- Multi-phase animation: logo → brand name → tagline → fade out
- Uses GSAP timeline for orchestrated animations
- Only plays once per session (sessionStorage check)

### Footer (`src/components/Footer.js`)
- Store information, address, phone
- Navigation links
- Social media links
- Copyright notice

### WhatsAppWidget (`src/components/WhatsAppWidget.js`)
- Floating WhatsApp icon (bottom-right corner)
- Links to WhatsApp with pre-filled message
- Bounce animation on load

---

## State Management

### CartContext (`src/context/CartContext.js`)
Manages the shopping cart state across the entire app using React Context.

**State:**
- `items` — Array of cart items (product + size + color + quantity)
- `isOpen` — Whether the cart drawer is visible

**Actions:**
- `addItem(product, size, color)` — Adds product or increments quantity if same variant exists
- `removeItem(cartId)` — Removes item by cartId
- `updateQuantity(cartId, qty)` — Updates quantity, removes if ≤ 0

**Computed:**
- `totalItems` — Sum of all item quantities
- `subtotal` — Sum of (price × quantity) for all items

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

## Styling & Design System

The entire design system lives in `src/app/globals.css` (40KB+). Key features:

- **CSS Custom Properties** for theme switching (atmosphere system)
- **No CSS framework** — pure vanilla CSS for maximum control
- **Responsive design** with mobile breakpoints
- **GSAP animations** for hero section, product reveals
- **Glassmorphism effects** on header and cards
- **Hero particles** — floating animated dots on homepage
- **Product card hover effects** — image swap, quick-add reveal
- **Cart drawer transitions** — smooth slide-in/out

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
