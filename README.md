# Minimind E-commerce Website

A modern e-commerce platform built with Next.js 14, Supabase, and Tailwind CSS for Miniminds - educational toys for children.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **Deployment**: Vercel

## Features

- 🏠 Landing page with hero section and featured products
- 📦 Product listing page
- 🔍 Product detail pages with image gallery and reviews
- 🛒 Shopping cart with persistent storage
- 💳 Checkout flow with order creation
- 📱 Responsive design
- 🌍 French language support
- 💰 XOF currency formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd minimind-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase and Jeko credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

JEKO_API_KEY=your_jeko_api_key
JEKO_API_KEY_ID=your_jeko_api_key_id
JEKO_STORE_ID=your_jeko_store_id
JEKO_WEBHOOK_SECRET=your_jeko_webhook_secret

NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Open the SQL Editor
   - Run the SQL script from `supabase-schema.sql`
   - Run the migration script from `supabase-migration-orders-rls.sql` (if not already in schema)
   - Run the migration script from `supabase-migration-payment-data.sql` (if not already in schema)
   - Run the migration script from `supabase-migration-orders-update-rls.sql` (if not already in schema)
   - Run the migration script from `supabase-migration-promo-price.sql` (if not already in schema)
   - Run the migration script from `supabase-migration-bundle-pricing.sql` (if not already in schema)

5. Configure Jeko Webhooks:
   - Log in to [Jeko Cockpit](https://cockpit.jeko.africa)
   - Navigate to **Paramètres** > **API & Webhooks**
   - Enter your webhook URL: `https://yourdomain.com/api/webhooks/jeko`
     - For local testing, use a service like [ngrok](https://ngrok.com) to expose your local server
   - Copy your **Webhook Secret** and add it to `.env.local` as `JEKO_WEBHOOK_SECRET`
   - The webhook endpoint will automatically verify signatures and update order status when payments are completed

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
minimind-website/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── product/          # Product-related components
│   ├── cart/             # Cart components
│   └── checkout/         # Checkout components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client setup
├── store/                 # Zustand stores
├── types/                 # TypeScript type definitions
└── supabase-schema.sql    # Database schema
```

## Database Schema

The database includes the following tables:
- `products` - Product information
- `product_variants` - Product variants (optional)
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Product reviews

Row Level Security (RLS) is enabled on all tables for data protection.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The app will automatically deploy on every push to the main branch.

## License

MIT

