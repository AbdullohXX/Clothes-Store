## Clothes E-commerce Platform

Production-ready, responsive clothes e-commerce platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, Stripe, and AWS S3.

### Quick start

1. Copy `.env.example` to `.env` and fill in secrets.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup database and generate client:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

### Tech stack
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Prisma ORM, PostgreSQL
- Auth via NextAuth (credentials + Google)
- Stripe Checkout for payments
- S3 presigned uploads for images
- Jest + Playwright tests, GitHub Actions CI
- Docker + Compose for local fullstack

### Scripts
- `npm run dev` - start dev server
- `npm run build` - build production
- `npm run start` - start production server
- `npm run db:seed` - seed sample data

### Database
The Prisma schema lives in `prisma/schema.prisma`. Models include `User`, `Seller`, `Product`, `Variant`, `Order`, `OrderItem`, `ProductImage`, `Category`, `Review`, `Address` plus NextAuth models.

### API
- `GET /api/products` - list/search products with filters
- `POST /api/register` - create user
- `POST /api/checkout` - create Stripe Checkout session
- `POST /api/webhooks/stripe` - handle Stripe webhooks
- `POST /api/upload/presign` - get S3 presigned upload URL

See `openapi.yaml` for details.

### Deployment
- Vercel recommended; set env vars in project settings
- Dockerfile provided for container deployment

### Notes
- Some features (cart persistence, seller/admin UIs, payouts) are scaffolded for follow-up. The core data models, auth, products, and checkout endpoints are ready.
