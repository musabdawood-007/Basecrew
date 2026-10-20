# Basecrew

> **Built by [Musab Projects](https://musab-007.netlify.app)** — a project group by Musab Dawood

Basecrew is a full-stack business management platform built with Next.js, MongoDB, and Tailwind CSS. It helps businesses register their operations, manage products and services, track customers, process orders, record expenses, and monitor performance through a real-time dashboard.

## Features

- Business registration and management
- Product and service catalog with pricing, SKUs, and stock tracking
- Customer management and order history
- Order processing with line items, status tracking, and revenue calculations
- Expense logging and categorization
- Analytics for revenue, expenses, profit, top products, and top customers
- Email OTP verification during signup
- PIN-based authentication and reset flows
- Currency switching for PKR, USD, EUR, GBP, SAR, and AED
- Glassmorphism dashboard with responsive layouts and scroll animations
- Terms and privacy consent before account creation

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.2.12 |
| Language | TypeScript 5 |
| UI | React 19.2.4 |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose 9.8.1 |
| Authentication | NextAuth.js 4 with JWT strategy, bcryptjs, and PIN flows |
| Charts | Recharts 3.10.1 |
| Email | Nodemailer |
| Deployment | Vercel-compatible Next.js deployment |

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB or MongoDB Atlas
- SMTP credentials for OTP email delivery

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy the project's example environment file to `.env.local` when available, then configure the MongoDB, NextAuth, and SMTP values required by the application. Never commit credentials to Git.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Deployment

Import the repository into Vercel, add the required environment variables, and deploy the Next.js application.

## License

Built by [Musab Projects](https://musab-007.netlify.app) — a project group by Musab Dawood.
