# Basecrew

A full-stack business registration & management platform built with Next.js, MongoDB, and Tailwind CSS.

## Features

- **Business Registration** — Create and manage multiple businesses
- **Product & Service Catalog** — Add products with pricing, SKUs, and stock tracking
- **Customer Management** — Track customers and their order history
- **Order Processing** — Create orders with line items, status tracking, and revenue calculation
- **Expense Logging** — Log and categorize business expenses
- **Real-Time Analytics** — Charts for revenue, expenses, profit, top products, and top customers
- **Email OTP Verification** — Secure signup with email verification and PIN reset
- **Currency Switching** — PKR, USD, EUR, GBP, SAR, AED support
- **Glassmorphism UI** — Modern glass-effect design with scroll animations
- **Terms & Privacy Policy** — Required checkbox before account creation

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB (Mongoose 9)
- **Auth:** NextAuth v4 (JWT strategy)
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Email:** Nodemailer (Gmail SMTP)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Seed demo data (optional)

```bash
curl -X POST http://localhost:3000/api/seed
```

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth JWT |
| `NEXTAUTH_URL` | Your app URL (e.g. `http://localhost:3000`) |
| `SMTP_EMAIL` | Gmail address for sending OTP emails |
| `SMTP_APP_PASSWORD` | Gmail app password for SMTP |

## Deploy on Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

---

**Project By Musab Dawood** — [musab-007.netlify.app](https://musab-007.netlify.app)
