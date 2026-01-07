# Cloudflare Worker Setup Guide

## 🎯 Goal
Set up a Cloudflare Worker that connects your admin panel to GitHub.

**Time needed:** 10-15 minutes

## 📋 Prerequisites

- [x] Cleaned folder uploaded to GitHub
- [ ] GitHub Personal Access Token
- [ ] Cloudflare account (free tier works!)

---

## Step 1: Create GitHub Personal Access Token (3 minutes)

### 1.1 Go to GitHub Settings
```
https://github.com/settings/tokens
```

### 1.2 Generate New Token
- Click: **"Generate new token"** → **"Generate new token (classic)"**

### 1.3 Configure Token
- **Name:** `W&M Autos CMS`
- **Expiration:** No expiration (or 1 year)
- **Select scopes:**
  - ✅ **repo** (check all boxes under repo)
    - ✅ repo:status
    - ✅ repo_deployment
    - ✅ public_repo
    - ✅ repo:invite
    - ✅ security_events

### 1.4 Generate and Copy
- Click: **"Generate token"**
- **IMPORTANT:** Copy the token NOW - you can't see it again!
- It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Save it somewhere safe (you'll need it in Step 3)

---

## Step 2: Create Cloudflare Worker (5 minutes)

### 2.1 Go to Cloudflare Dashboard
```
https://dash.cloudflare.com
```

### 2.2 Navigate to Workers
- Click: **"Workers & Pages"** (in left sidebar)
- Click: **"Create Worker"**

### 2.3 Name Your Worker
- **Name:** `wm-autos-api`
- Click: **"Deploy"**

### 2.4 Edit Worker Code
- After deployment, click: **"Edit Code"**
- You'll see some default code

### 2.5 Replace with Your Code
1. Select ALL the default code (Ctrl+A or Cmd+A)
2. Delete it
3. Open the file: **`functions/api.js`** (from this folder)
4. Copy ALL the code from `api.js`
5. Paste it into the Cloudflare Worker editor
6. Click: **"Save and Deploy"**

---

## Step 3: Add Environment Variables (3 minutes)

### 3.1 Go to Worker Settings
- In your worker page, click: **"Settings"** tab
- Click: **"Variables and Secrets"**

### 3.2 Add Variable 1: GITHUB_TOKEN
- Click: **"Add variable"**
- **Variable name:** `GITHUB_TOKEN`
- **Value:** Paste your GitHub token from Step 1
  - Example: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Click: **"Encrypt"** (important for security!)
- Don't click Deploy yet - add all 3 first

### 3.3 Add Variable 2: GITHUB_REPO
- Click: **"Add variable"** again
- **Variable name:** `GITHUB_REPO`
- **Value:** `shaanaks99/elite-auto-gallery`
  - ⚠️ Make sure this matches YOUR GitHub username/repo exactly!
- Click: **"Encrypt"**

### 3.4 Add Variable 3: ADMIN_PASSWORD
- Click: **"Add variable"** again
- **Variable name:** `ADMIN_PASSWORD`
- **Value:** Choose a strong password
  - Example: `WMAutos2025!SecurePass`
  - This is what you'll use to login to admin panel
  - **SAVE THIS PASSWORD** - you'll need it to login!
- Click: **"Encrypt"**

### 3.5 Deploy All Variables
- Scroll down and click: **"Deploy"**
- Wait for deployment to complete

---

## Step 4: Set Up Worker Route (2 minutes)

You have TWO options. Pick ONE:

### Option A: Route Pattern (Simpler)

**4.1** Go to **"Triggers"** tab

**4.2** Click: **"Add Route"**

**4.3** Enter route details:
- **Route:** `elite-auto-websitetest.pages.dev/api/*`
- **Zone:** Select your Cloudflare zone
- Click: **"Add Route"**

**4.4** Update admin.html (if needed):
- Open `admin.html`
- Find line ~370: `const API_BASE = '/api';`
- Make sure it says: `const API_BASE = '/api';` (should already be correct)

### Option B: Custom Domain (More Professional)

**4.1** Go to **"Triggers"** tab

**4.2** Click: **"Add Custom Domain"**

**4.3** Enter domain:
- **Custom Domain:** `api.elite-auto-websitetest.pages.dev`
- Click: **"Add Custom Domain"**

**4.4** Update admin.html:
- Open `admin.html`
- Find line ~370: `const API_BASE = '/api';`
- Change to: `const API_BASE = 'https://api.elite-auto-websitetest.pages.dev';`

---

## Step 5: Test Your Setup (2 minutes)

### 5.1 Make sure admin.html is in your repo
```bash
git add admin.html
git commit -m "Add admin panel"
git push origin main
```

### 5.2 Wait for Cloudflare Pages to rebuild
- Check: https://dash.cloudflare.com → Pages → Your project
- Wait for deployment to show "Success" (usually 1-2 minutes)

### 5.3 Access Admin Panel
Visit: `https://elite-auto-websitetest.pages.dev/admin.html`

### 5.4 Login
- Enter the password you set in Step 3.4
- Click: **"Login"**

### 5.5 Test Adding a Car
1. Click: **"+ Add New Car"**
2. Fill in minimum required fields:
   - Make: `Test`
   - Model: `Car`
   - Year: `2020`
   - Price: `1000`
3. Click: **"Save Car"**
4. Check your GitHub repository - you should see a new commit!
5. Wait 1-2 minutes for rebuild
6. Check your main site for the test car
7. Delete the test car from admin panel

---

## ✅ Setup Complete!

If everything worked:
- ✅ You logged in successfully
- ✅ Test car was saved to GitHub
- ✅ Site rebuilt automatically
- ✅ Test car appeared on your site

---

## 🛠️ Troubleshooting

### Problem: "Login failed"
**Solutions:**
- Check `ADMIN_PASSWORD` is correct in Cloudflare Worker environment variables
- Make sure you clicked "Encrypt" and "Deploy" for the password
- Clear browser cache and try again

### Problem: "Failed to load cars"
**Solutions:**
- Verify `GITHUB_TOKEN` has `repo` permissions
- Check `GITHUB_REPO` spelling is exactly: `shaanaks99/elite-auto-gallery`
- Look at worker logs: Workers → Your Worker → Logs

### Problem: "API not found" or 404 error
**Solutions:**
- Verify worker route is set up correctly in Step 4
- Check `API_BASE` in admin.html matches your setup
- Make sure worker is deployed (not in draft state)

### Problem: "Unauthorized" when saving
**Solutions:**
- GitHub token might have expired - create a new one
- Check token has `repo` scope
- Verify token is saved correctly in worker environment variables

### Problem: Changes don't appear on site
**Solutions:**
- Wait 1-2 minutes for Cloudflare Pages to rebuild
- Check Cloudflare Pages deployment logs
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Problem: Images won't upload
**Solutions:**
- Check file size (GitHub limit is 100MB per file)
- Verify GitHub token has write permissions
- Try smaller images first
- Check browser console for errors

---

## 📊 What You Just Built

```
Your Admin Panel (admin.html)
         ↓
    Login with password
         ↓
Cloudflare Worker (wm-autos-api)
         ↓
    Authenticates you
         ↓
    GitHub API (commits changes)
         ↓
Your GitHub Repository
         ↓
    Triggers webhook
         ↓
Cloudflare Pages (rebuilds site)
         ↓
Your Live Website (updated!)
```

---

## 🔐 Security Notes

**What's secure:**
- ✅ GitHub token is encrypted
- ✅ Admin password is encrypted
- ✅ All stored in Cloudflare (not in your code)
- ✅ Token never exposed to browser

**What to remember:**
- 🔑 Keep your admin password safe
- 🔑 Don't share your GitHub token
- 🔑 If token is compromised, revoke it and create a new one

---

## 🎉 Next Steps

Now that setup is complete:
1. **Delete test car** if you added one
2. **Start adding real cars** to your inventory
3. **Upload car photos** (drag and drop in admin panel)
4. **Test editing and deleting** to get comfortable
5. **Bookmark your admin URL** for easy access

---

## 📞 Need More Help?

- **Worker Logs:** Cloudflare Dashboard → Workers → wm-autos-api → Logs
- **Pages Logs:** Cloudflare Dashboard → Pages → Your project → View build log
- **GitHub Commits:** https://github.com/shaanaks99/elite-auto-gallery/commits/main

---

**Congratulations!** 🎉 

You now have a fully functional, simple CMS that's way better than TinaCMS!

No more "You have been logged out" errors. No more complexity. Just simple car management that works! 🚗✨
