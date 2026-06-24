# ShaishaArts Infrastructure

## Stack Overview

```
Customer Browser
      ↓
Vercel (Next.js App)
      ↓
Prisma ORM
      ↓
Neon PostgreSQL (Database)

+ Cloudinary (Image Storage)
```

---

## Components

### 1. Vercel — App Hosting
- **What it does:** Hosts and runs the Next.js application (frontend + API routes)
- **Plan:** Hobby (Free)
- **Free tier limits:**
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Serverless functions: 100 GB-hours/month
  - Build time: 6000 minutes/month
- **Dashboard:** https://vercel.com/dashboard
- **When to upgrade:** Only if you get thousands of daily visitors

---

### 2. Neon — PostgreSQL Database
- **What it does:** Stores all structured data — products, orders, categories, reviews, customers, admin users
- **Plan:** Free
- **Free tier limits:**
  - 0.5 GB storage
  - 1 project, 1 database
  - Auto-suspends after 5 min inactivity (1-2 sec cold start on first request)
  - Unlimited read/write operations
- **Dashboard:** https://console.neon.tech
- **Note:** Both local dev and Vercel production connect to the same Neon database
- **When to upgrade:** Storage is virtually never an issue for a text-based store. Upgrade only if cold starts become a problem (paid plan keeps DB always-on)

---

### 3. Cloudinary — Image Storage
- **What it does:** Stores and serves all product images and payment screenshots uploaded via admin panel or order confirmation
- **Plan:** Free
- **Free tier limits:**
  - 25 GB storage
  - 25 GB bandwidth/month
  - 25 credits/month (1 credit = 1000 transformations)
- **Dashboard:** https://cloudinary.com/console
- **Folder structure:**
  - `shaishaarts/` — product images
  - `shaisha_payment_proofs/` — customer payment screenshots
- **When to upgrade:** At ~500+ products with multiple images each, or high traffic months

---

### 4. GitHub — Code Repository
- **What it does:** Stores the source code, triggers Vercel deployments on every push to `main`
- **Plan:** Free
- **Repo:** https://github.com/GenerativeZee/shaishaArts
- **Free tier limits:** Unlimited public/private repos, unlimited storage for code

---

## Environment Variables

| Variable | Used By | Description |
|---|---|---|
| `DATABASE_URL` | Prisma | Neon PostgreSQL connection string |
| `JWT_SECRET` | Admin auth | Secret key for admin login tokens |
| `CLOUDINARY_CLOUD_NAME` | Image upload | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Image upload | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Image upload | Cloudinary API secret |
| `NEXT_PUBLIC_UPI_ID` | Checkout | UPI ID shown to customers for payment |
| `NEXT_PUBLIC_UPI_NAME` | Checkout | UPI name shown to customers |
| `NEXT_PUBLIC_WHATSAPP_LINK` | WhatsApp | WhatsApp business link |
| `NEXT_PUBLIC_CONTACT_PHONE` | Contact | Phone number shown on site |
| `NEXT_PUBLIC_INSTAGRAM` | Header | Instagram profile link |
| `ADMIN_SEED_EMAIL` | Seed script | Admin login email |
| `ADMIN_SEED_PASSWORD` | Seed script | Admin login password |

> These must be set in both the local `.env` file and Vercel → Settings → Environment Variables.

---

## Admin Credentials
- **URL:** https://shaisha-arts.vercel.app/admin/login
- **Email:** owner@shaishaarts.com
- **Password:** ShaishaArts@2024

---

## Deployment Flow

```
You push code to GitHub (main branch)
            ↓
Vercel auto-detects the push
            ↓
Vercel runs: prisma db push && next build
            ↓
New version goes live at shaisha-arts.vercel.app
```

No manual deployment needed — every `git push origin main` auto-deploys.
