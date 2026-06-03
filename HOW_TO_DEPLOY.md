# 🚀 HOW TO DEPLOY — Simple Version
## Just 3 websites. No terminal. No commands. Fill boxes and click Deploy.

---

## What you need accounts for (all FREE)

1. **GitHub** — stores your code
2. **Neon** — your database (free)
3. **Groq** — powers the AI chat (free)
4. **Resend** — sends you emails when someone contacts you (free)
5. **Vercel** — hosts your website (free)

---

## PART 1 — Get your 3 secret keys (10 minutes)

---

### 🔑 Key 1 — Your Database (Neon)

1. Go to **neon.tech**
2. Click **Sign Up** → use Google or GitHub
3. Click **New Project**
4. Name it anything e.g. `emmzyvisuals`
5. Click **Create Project**
6. A box appears with your connection string — it looks like:
   ```
   postgresql://alex:AbC123xYz@ep-cool-name-123.us-east-2.aws.neon.tech/emmzyvisuals?sslmode=require
   ```
7. Click the **Copy** button next to it
8. **Paste it somewhere safe** (Notes app, anywhere) — you'll need it twice

> That's it for Neon. ✅

---

### 🔑 Key 2 — AI Chat (Groq)

1. Go to **console.groq.com**
2. Click **Sign Up** → use Google
3. On the left sidebar click **API Keys**
4. Click **Create API Key**
5. Name it `emmzyvisuals` → click **Submit**
6. A key appears — it starts with `gsk_`
7. **Copy it and paste it somewhere safe**

> That's it for Groq. ✅

---

### 🔑 Key 3 — Contact Emails (Resend)

1. Go to **resend.com**
2. Click **Sign Up** → use Google
3. On the left sidebar click **API Keys**
4. Click **Create API Key**
5. Name it `emmzyvisuals`, Permission: **Full Access**
6. Click **Add** → a key appears starting with `re_`
7. **Copy it and paste it somewhere safe**

> That's it for Resend. ✅

---

## PART 2 — Put your code on GitHub (5 minutes)

1. Go to **github.com** → Sign Up or Log In
2. Click the **+** button (top right) → **New repository**
3. Name: `emmzyvisuals`
4. Set to **Private**
5. Click **Create repository**

Now upload your files:
1. On the repository page, click **uploading an existing file**
2. Unzip the project folder on your computer
3. **Drag ALL the files and folders** into the GitHub upload box
4. Wait for them to upload
5. Scroll down → click **Commit changes**

> Your code is now on GitHub. ✅

---

## PART 3 — Deploy on Vercel (10 minutes)

1. Go to **vercel.com**
2. Click **Sign Up** → **Continue with GitHub**
3. Click **Add New Project**
4. Find `emmzyvisuals` in the list → click **Import**

### ⚠️ STOP — Before clicking Deploy, add your keys

Scroll down to **Environment Variables** section.

Add these one by one — click **Add** after each:

---

**Variable 1:**
- Name: `DATABASE_URL`
- Value: *(paste your Neon connection string)*

---

**Variable 2:**
- Name: `DIRECT_URL`
- Value: *(paste the SAME Neon connection string again)*

---

**Variable 3:**
- Name: `GROQ_API_KEY`
- Value: *(paste your Groq key — starts with `gsk_`)*

---

**Variable 4:**
- Name: `RESEND_API_KEY`
- Value: *(paste your Resend key — starts with `re_`)*

---

**Variable 5:**
- Name: `CONTACT_EMAIL`
- Value: *(your own email address — where you want to receive messages)*
- Example: `emmanuelariyo@gmail.com`

---

**Variable 6:**
- Name: `NEXT_PUBLIC_ADMIN_KEY`
- Value: *(make up a secret word/password only you know)*
- Example: `mykey2025` or anything you want

---

**Variable 7:**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://emmzyvisuals.vercel.app`
- *(We'll update this after deploy if Vercel gives a different URL)*

---

### Now click **Deploy** 🚀

Vercel will:
- Install everything automatically
- Set up your database automatically
- Build your site automatically

This takes about **2-3 minutes**.

When it says **"Congratulations!"** — your site is live. ✅

---

## PART 4 — After Deploy (2 minutes)

### Check your URL
Vercel gives you a URL like `https://emmzyvisuals.vercel.app`
or it might be slightly different.

If the URL is different from what you typed in Variable 7:
1. Go to Vercel Dashboard → your project
2. Click **Settings** → **Environment Variables**
3. Click the pencil icon on `NEXT_PUBLIC_APP_URL`
4. Update it to your real URL
5. Go to **Deployments** → click **Redeploy** on the latest one

---

## PART 5 — Enable pgvector on Neon (1 minute)

This powers the AI search. Just one thing to do:

1. Go back to **neon.tech** → your project
2. Click **SQL Editor** in the left sidebar
3. In the box, type exactly:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. Click **Run**
5. It says **"CREATE EXTENSION"** — done ✅

That's the only "technical" thing. Copy, paste, click Run.

---

## PART 6 — Your Admin Panel

Go to: `https://your-vercel-url.vercel.app/admin?key=YOUR_KEY`

Replace `YOUR_KEY` with whatever you typed in Variable 6.

From here you can:
- ✍️ Write and publish blog posts
- 🖼️ Upload gallery images with captions
- ✅ Approve or reject reviews people submit

---

## DONE! ✅

Your site is live at your Vercel URL with:
- All 10 projects showing
- AI chat working
- Contact form working
- Admin panel working
- SEO fully set up

---

## Something went wrong?

**Site shows error:**
→ Go to Vercel Dashboard → Deployments → click the failed deploy → **View Logs**
→ Look for the red error line and check if an env variable is missing

**AI chat not responding:**
→ Check GROQ_API_KEY is correct in Vercel env variables

**Contact form not sending:**
→ Check RESEND_API_KEY is correct

**Database error:**
→ Make sure DATABASE_URL and DIRECT_URL have the exact same Neon connection string
→ Make sure you ran the `CREATE EXTENSION IF NOT EXISTS vector;` in Neon SQL Editor

---

## HOW TO GET CONTACT MESSAGES IN YOUR EMAIL INBOX

Yes, messages go straight to your email inbox. Here is exactly how it works:

### Step 1
In Vercel, set `CONTACT_EMAIL` to YOUR email address.
Example: `emmanuelariyo@gmail.com`

### Step 2
When someone fills the contact form on your site, Resend sends the message TO that email.

### The "from" address issue
On the free Resend plan without a verified domain, the email arrives in your inbox
from `onboarding@resend.dev` — but the CONTENT is from the person who contacted you.
You can just hit Reply and it goes back to them (the replyTo is set to their email).

### To get it from your own email (contact@ememzyvisuals.com):
1. Buy the domain `ememzyvisuals.com` on Namecheap (~$10/year)
2. In Resend dashboard → Domains → Add Domain → follow the DNS steps
3. Once verified, update the contact route:
   Change: `from: "Ememzyvisuals Portfolio <onboarding@resend.dev>"`
   To: `from: "Ememzyvisuals Portfolio <contact@ememzyvisuals.com>"`
4. Push to GitHub → Vercel redeploys automatically

---

## GOOGLE VERIFICATION — THE EASY WAY (No code editing)

You no longer need to edit any code file.

1. Get your verification code from search.google.com/search-console
   (Choose HTML tag method → copy ONLY the content value e.g. `AbCdEf123`)

2. Go to Vercel → Your Project → Settings → Environment Variables

3. Add a new variable:
   - Name: `GOOGLE_SITE_VERIFICATION`
   - Value: `AbCdEf123` (your actual code)

4. Click Save → Go to Deployments → Redeploy

5. Go back to Google Search Console → click Verify

That is it. No code editing needed at all.
