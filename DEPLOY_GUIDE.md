# 🚀 DEPLOY GUIDE — Ememzyvisuals on Vercel
## Zero to Live in Under 30 Minutes

---

## OVERVIEW — What you need (all free)

| Service | What it does | Cost |
|---------|-------------|------|
| **GitHub** | Stores your code | Free |
| **Vercel** | Hosts your site | Free |
| **Neon** | PostgreSQL database | Free |
| **Groq** | Powers the AI chat | Free |
| **Resend** | Sends contact emails | Free |

---

## STEP 1 — Get your Database (Neon)

**Neon gives you free PostgreSQL with pgvector built in.**

1. Go to **neon.tech** → click **Sign Up** → sign up with GitHub
2. Click **New Project**
3. Name it: `emmzyvisuals`
4. Region: choose closest to you (e.g. `eu-west-2` or `us-east-1`)
5. Click **Create Project**

You'll see a connection screen. **Copy these two values:**

```
Connection string:
postgresql://user:password@ep-xxx.eu-west-2.aws.neon.tech/emmzyvisuals?sslmode=require
```

- Paste the SAME string into both `DATABASE_URL` and `DIRECT_URL`

Then **enable pgvector** (needed for AI search):
1. In Neon dashboard → click **SQL Editor**
2. Paste this and click Run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

✅ Database done.

---

## STEP 2 — Get your AI Key (Groq)

**Groq is free. No credit card needed.**

1. Go to **console.groq.com** → click **Sign Up**
2. Sign in with Google or email
3. Click **API Keys** in the left sidebar
4. Click **Create API Key**
5. Name it: `emmzyvisuals`
6. **Copy the key** — it starts with `gsk_`

Paste it as your `GROQ_API_KEY`.

✅ AI done.

---

## STEP 3 — Get your Email Key (Resend)

**Resend gives you 3,000 free emails per month.**

1. Go to **resend.com** → click **Sign Up**
2. Confirm your email
3. Click **API Keys** in sidebar
4. Click **Create API Key**
5. Name: `emmzyvisuals`, Permission: **Sending access**
6. **Copy the key** — it starts with `re_`

Paste it as your `RESEND_API_KEY`.

> ⚠️ On the free plan, Resend can only send FROM `onboarding@resend.dev`
> until you verify your own domain. That's fine for now — emails still 
> arrive, they just come from that address. You can verify your domain later.

Set `CONTACT_EMAIL` to whatever email YOU want to receive messages at.
Example: `contact@ememzyvisuals.com` or your Gmail.

✅ Email done.

---

## STEP 4 — Push your code to GitHub

1. Go to **github.com** → click **New** (green button)
2. Repository name: `emmzyvisuals`
3. Set to **Private** (recommended)
4. Click **Create repository**

Now open your terminal, go into the project folder and run:

```bash
cd emmzyvisuals
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/emmzyvisuals.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

✅ Code on GitHub.

---

## STEP 5 — Deploy on Vercel

1. Go to **vercel.com** → click **Sign Up** → sign up with GitHub
2. Click **Add New Project**
3. Find your `emmzyvisuals` repo → click **Import**
4. Vercel auto-detects Next.js ✅
5. **DO NOT click Deploy yet** — first add environment variables

### Add Environment Variables in Vercel

Click **Environment Variables** section (still on the import screen).

Add each one:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `DIRECT_URL` | Same Neon connection string |
| `GROQ_API_KEY` | Your Groq key (`gsk_...`) |
| `RESEND_API_KEY` | Your Resend key (`re_...`) |
| `CONTACT_EMAIL` | Your email address |
| `NEXT_PUBLIC_ADMIN_KEY` | A secret word only you know (e.g. `mykey2025`) |
| `NEXT_PUBLIC_APP_URL` | Leave blank for now — you'll update this after deploy |

6. Now click **Deploy**
7. Wait 2–3 minutes for the build to finish

You'll get a URL like: `https://emmzyvisuals.vercel.app`

✅ Site is live.

---

## STEP 6 — Update your App URL

1. Copy your Vercel URL (e.g. `https://emmzyvisuals.vercel.app`)
2. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_APP_URL`
4. Click Edit → change the value to your Vercel URL
5. Click **Save**
6. Go to **Deployments** tab → click the three dots on latest deployment → **Redeploy**

This makes your OG images and SEO links point to the right URL.

✅ URL fixed.

---

## STEP 7 — Set Up Your Database

After deploy, you need to create the database tables.

Go to your **Neon SQL Editor** and run this:

```sql
-- Enable pgvector (if not already done)
CREATE EXTENSION IF NOT EXISTS vector;

-- The tables are created automatically by Prisma
-- You just need to run the migration
```

Then in your **local terminal** (not Vercel — on your own computer):

```bash
# Install dependencies first
npm install

# Copy env
cp .env.example .env.local
# Fill in .env.local with your real values

# Push database schema
npx prisma db push

# Seed initial data (your projects + AI knowledge base)
npm run db:seed
```

This creates all the tables and loads your 10 projects + 22 AI knowledge chunks.

✅ Database populated.

---

## STEP 8 — Test Everything

Open your Vercel URL and check:

- [ ] Homepage loads with your name
- [ ] `/work` shows all your projects with screenshots
- [ ] `/services` shows your services page
- [ ] `/contact` — fill the form → you receive an email
- [ ] `/ask-about-me` — ask "What is ClaudGPT?" → AI responds
- [ ] `/admin?key=YOUR_KEY` — admin panel opens

### Test your social previews:
Paste your URL into these testers:

| Platform | Tester URL |
|----------|-----------|
| Twitter/X | https://cards-dev.twitter.com/validator |
| LinkedIn | https://www.linkedin.com/post-inspector |
| Facebook | https://developers.facebook.com/tools/debug |
| General | https://opengraph.xyz |

Each should show your OG image + title + description.

---

## STEP 9 — Add Your OG Image

This is the image that appears when you share your link on WhatsApp,
Twitter, LinkedIn etc.

1. Design a 1200×630px image (use Canva — free)
2. Make it show: **"Emmanuel Ariyo"** big, **"Ememzyvisuals"** as brand, your title
3. Save as `og-image.png`
4. Put it in your project at: `public/og/og-image.png`
5. Commit and push:
```bash
git add public/og/og-image.png
git commit -m "Add OG image"
git push
```
Vercel auto-redeploys in ~1 minute.

---

## STEP 10 — Submit to Google (GET INDEXED)

1. Go to **search.google.com/search-console**
2. Click **Add Property** → enter your Vercel URL
3. Choose **URL prefix** method → click **Continue**
4. Select **HTML tag** verification method
5. Copy the content value from the meta tag they give you
   - Looks like: `google-site-verification=AbCdEfGhIjKlMnOp`
6. Open `app/layout.tsx` → find:
   ```
   // google: "paste-your-google-search-console-code-here",
   ```
7. Replace with:
   ```typescript
   google: "AbCdEfGhIjKlMnOp",
   ```
8. Save → push to GitHub → Vercel redeploys
9. Back in Search Console → click **Verify**
10. Go to **Sitemaps** → enter `sitemap.xml` → click **Submit**
11. Go to **URL Inspection** → enter your homepage URL → click **Request Indexing**

**Done. Google will index you within 24–72 hours.**

---

## STEP 11 — Connect a Custom Domain (Optional but Recommended)

Having `ememzyvisuals.com` instead of `emmzyvisuals.vercel.app` looks more
professional and ranks better on Google.

1. Buy `ememzyvisuals.com` on **Namecheap** (~$10/year)
2. In Vercel Dashboard → Your Project → **Settings** → **Domains**
3. Type your domain → click **Add**
4. Vercel shows you DNS records to add
5. Go to Namecheap → **Advanced DNS** → add the records Vercel shows
6. Wait 5–30 minutes for DNS to propagate
7. Update `NEXT_PUBLIC_APP_URL` in Vercel env to `https://ememzyvisuals.com`
8. Redeploy

---

## QUICK REFERENCE — All Free Accounts You Need

| Service | URL | What to create |
|---------|-----|----------------|
| GitHub | github.com | Account + private repo |
| Vercel | vercel.com | Account + project (import from GitHub) |
| Neon | neon.tech | Account + project named `emmzyvisuals` |
| Groq | console.groq.com | Account + API key |
| Resend | resend.com | Account + API key |

---

## IF SOMETHING BREAKS

**Build fails on Vercel:**
- Check all environment variables are added
- Make sure `DATABASE_URL` doesn't have any spaces

**Database error:**
- Make sure you ran `npx prisma db push` from your local machine first
- Check the Neon connection string is correct (no extra spaces)

**AI chat not working:**
- Check `GROQ_API_KEY` is correct in Vercel env variables
- Make sure it starts with `gsk_`

**Contact form not sending:**
- Check `RESEND_API_KEY` starts with `re_`
- Check `CONTACT_EMAIL` is a valid email address

**Need help:** Email contact@ememzyvisuals.com or check Vercel's build logs
(Dashboard → Deployments → click the failed deployment → View Logs)
