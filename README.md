# Cult Clothing — Men's Fashion Store

Premium men's clothing e-commerce storefront built with Next.js 16, React 19, Supabase, and Cloudinary.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Database:** Supabase (PostgreSQL)
- **Image CDN:** Cloudinary
- **Deployment:** Vercel

## Setup

### 1. Clone & Install

```bash
cd d:\cult
npm install
```

### 2. Configure Environment

Copy `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Database Setup

Run the migration SQL in Supabase SQL Editor:

```
supabase/migrations/002_cult_clothing_schema.sql
```

This creates all tables, indexes, and seeds categories/subcategories.

### 4. Create Admin User

In Supabase Dashboard → Authentication → Users → Add User (email + password).

### 5. Run Dev Server

```bash
npm run dev          # Storefront on :3000
cd D:\cult-admin && npm run dev   # Admin on :3001
```

## Project Structure

```
src/
├── app/
│   ├── layout.js           # Root layout (providers, header, footer)
│   ├── page.js             # Homepage server component
│   ├── HomeClient.js       # Homepage client (hero, sections)
│   ├── LayoutClient.js     # Header + Search coordination
│   ├── clothing/           # Product listing page
│   ├── product/[id]/       # Product detail page
│   ├── contact/            # Contact page
│   └── globals.css         # Design system
├── components/
│   ├── Header.js           # Single-row header
│   ├── HamburgerDrawer.js  # Slide-out nav
│   ├── SearchOverlay.js    # Full-screen search
│   ├── WishlistDrawer.js   # Wishlist slide-out
│   ├── CartDrawer.js       # Cart slide-out
│   ├── ProductCard.js      # Product card with wishlist
│   └── Footer.js           # Site footer
├── context/
│   ├── CartContext.js       # Cart state
│   └── WishlistContext.js   # Wishlist state (localStorage)
└── lib/
    ├── queries.js           # Supabase data fetching
    ├── discounts.js         # Flat 10% discount engine
    └── supabase/            # Supabase client configs
```

## Contact

- **Phone/WhatsApp:** +91 99515 65569
- **Instagram:** [@cult.vizag](https://instagram.com/cult.vizag)
