# Getting your Style Profiler online — a step-by-step guide

No coding required. You'll create three free accounts and copy-paste a few things between them. Set aside about 30 minutes. Take it one step at a time; you can't break anything.

**What we're doing, in plain English:**
1. **GitHub** — a place to store the app's files online.
2. **Neon** — a free database that remembers your images and client profiles.
3. **Vercel** — turns the files into a real website with a web address.

You'll do them in that order. Have this guide open in one window and do the steps in another.

---

## Before you start

Make sure you have the project **folder** (`style-profiler-app`) saved somewhere you can find it, like your Desktop. It contains all the files we'll upload.

Also, decide on an **admin password** now and write it down. This is the password *you* will use to log in and manage images. Your clients never see it. Make it something only you know (e.g. `Sunflower-Studio-2026`).

---

## Step 1 — Put the files on GitHub

1. Go to **https://github.com** and click **Sign up**. Create a free account (email, password, username). Verify your email.
2. Once signed in, click the **+** icon in the top-right corner → **New repository**.
3. Under "Repository name" type: `style-profiler`
4. Leave everything else as-is. Make sure **Public** is selected (it's free). Click **Create repository**.
5. On the next page you'll see some setup text. Look for the link that says **"uploading an existing file"** and click it. (If you don't see it, go to `https://github.com/YOUR-USERNAME/style-profiler/upload/main`.)
6. Open your `style-profiler-app` folder on your computer. Select **everything inside it** (all the files and folders — not the outer folder itself), and **drag them onto the GitHub upload page**.
   - Tip: it's fine if it takes a minute. You should see folders like `app`, `lib`, `prisma` and files like `package.json` appear in the list.
7. Scroll to the bottom and click the green **Commit changes** button.

✅ Your code now lives on GitHub. Leave this tab open.

---

## Step 2 — Create your free database (Neon)

1. Go to **https://neon.tech** and click **Sign up**. The easiest option is **"Continue with GitHub"** — click it and approve.
2. It will ask you to create a project. Give it a name like `style-profiler` and click **Create project** (the default region/settings are fine).
3. After it's created, you'll land on a page showing a **connection string**. It's a long line that starts with `postgresql://`. There's usually a **Copy** button next to it — click it.
   - If you see a choice between "Pooled" and "Direct" connection, choose **Direct** (or just the default shown).
4. **Paste that connection string somewhere temporary** (a sticky note or text document). You'll need it in the next step.

✅ You now have a database. Keep that connection string handy.

---

## Step 3 — Put it online (Vercel)

1. Go to **https://vercel.com** and click **Sign up** → **Continue with GitHub** → approve.
2. On your Vercel dashboard, click **Add New…** → **Project**.
3. You'll see a list of your GitHub repositories. Find **style-profiler** and click **Import**.
4. Before deploying, we need to add two settings. Look for a section called **Environment Variables** (you may need to expand it). Add these two, one at a time:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | *paste the connection string from Neon (Step 2)* |
   | `ADMIN_PASSWORD` | *the password you chose at the start* |

   For each: type the **Name** exactly as shown, paste/type the **Value**, then click **Add**.
5. Click the big **Deploy** button.
6. Wait 1–3 minutes while it builds. When it's done you'll see a **Congratulations** screen with a preview image. Click **Continue to Dashboard** (or **Visit**).

✅ Your app is live! Your web address will look like `https://style-profiler-xxxx.vercel.app`.

---

## Step 4 — First login and a quick test

1. Open your new web address and add `/login` to the end, e.g. `https://style-profiler-xxxx.vercel.app/login`.
2. Enter the **admin password** you set. You're in.
3. Go to the **Library** tab. Click **Load 12 sample images** to fill it with examples so you can test.
4. Go to the **Dashboard** tab. Type a test name, click **Create shareable link**, then **Copy**.
5. Open that link in a new tab (or your phone) and try rating the images. When you finish, you'll see a style profile — and it'll also appear back on your Dashboard.

✅ That's the whole flow working.

---

## Day-to-day use

- **Add your own images:** Library tab → paste an image URL or upload a file → pick its style tags → **Add to library**. (Download pins from your Pinterest board and add them here. You can remove the samples once you've added your own.)
- **New client:** Dashboard → enter their name → **Create shareable link** → send it to them.
- **See results:** completed profiles show up on your Dashboard; click **View profile** to see the breakdown and download a report.

---

## If something goes wrong

- **The deploy failed (red screen on Vercel).** Almost always a missing or mistyped environment variable. On Vercel: open your project → **Settings** → **Environment Variables**, confirm `DATABASE_URL` and `ADMIN_PASSWORD` are both there and spelled exactly right. Then go to the **Deployments** tab → click the latest one → **Redeploy**.
- **"Link not found" when opening a client link.** Make sure you copied the whole link, ending in a short code.
- **Images won't load after uploading your own.** If you pasted an image *URL*, make sure it's a direct link to the image file (ends in `.jpg`/`.png`) and is publicly viewable.
- **You forgot your admin password.** Change it on Vercel: **Settings → Environment Variables**, edit `ADMIN_PASSWORD`, save, then **Redeploy**.

---

## A few honest notes

- The free tiers of all three services are plenty for this kind of tool. You won't be charged unless you deliberately upgrade.
- The 12 starter images are placeholders, not real interiors — replace them with your own tagged photos before using this with real clients.
- This uses one shared admin password (just for you). If you later want teammates with their own logins, that's a feature we can add.
