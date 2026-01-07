# Quick Setup Checklist ✅

## Pre-Setup
- [ ] GitHub account ready
- [ ] Cloudflare account ready
- [ ] Repository: `shaanaks99/elite-auto-gallery`
- [ ] Site URL: `elite-auto-websitetest.pages.dev`

## Step-by-Step Setup

### 1. GitHub Token
- [ ] Go to GitHub → Settings → Developer settings → Personal access tokens
- [ ] Create new token (classic)
- [ ] Name: "W&M Autos CMS"
- [ ] Scope: ✅ `repo` (all)
- [ ] Generate and save token: `ghp_________________`

### 2. Cloudflare Worker
- [ ] Go to Cloudflare Dashboard → Workers & Pages
- [ ] Create Worker named: `wm-autos-api`
- [ ] Copy code from `functions/api.js`
- [ ] Paste into worker editor
- [ ] Save and Deploy

### 3. Environment Variables
- [ ] In worker, go to Settings → Variables
- [ ] Add `GITHUB_TOKEN` = your token from step 1
- [ ] Add `GITHUB_REPO` = `shaanaks99/elite-auto-gallery`
- [ ] Add `ADMIN_PASSWORD` = choose a strong password
- [ ] Click "Encrypt" for each
- [ ] Deploy

### 4. Worker Route
Choose ONE option:

**Option A: Custom Domain (Recommended)**
- [ ] Worker → Triggers → Add Custom Domain
- [ ] Domain: `api.elite-auto-websitetest.pages.dev`
- [ ] Update `admin.html` line 370: `const API_BASE = 'https://api.elite-auto-websitetest.pages.dev';`

**Option B: Route Pattern**
- [ ] Worker → Triggers → Add Route
- [ ] Pattern: `elite-auto-websitetest.pages.dev/api/*`
- [ ] Keep `admin.html` as: `const API_BASE = '/api';`

### 5. Upload to GitHub
- [ ] Copy `admin.html` to your repo
- [ ] Copy `functions/api.js` to your repo (for reference)
- [ ] Commit: `git add admin.html && git commit -m "Add admin panel"`
- [ ] Push: `git push origin main`
- [ ] Wait for Cloudflare Pages to rebuild (~1-2 min)

### 6. Test
- [ ] Visit: `https://elite-auto-websitetest.pages.dev/admin.html`
- [ ] Login with your admin password
- [ ] Click "+ Add New Car"
- [ ] Fill in test car details
- [ ] Upload an image
- [ ] Click "Save Car"
- [ ] Check GitHub for new commit
- [ ] Wait for rebuild
- [ ] Check main site for new car

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Can't login | Check `ADMIN_PASSWORD` in worker env vars |
| Can't load cars | Check `GITHUB_TOKEN` has `repo` scope |
| 404 on API calls | Verify worker route/domain setup |
| Images won't upload | Check token permissions, file size < 100MB |
| Changes not showing | Wait 1-2 min for rebuild, check CF Pages logs |

## Environment Variables Summary

```
GITHUB_TOKEN = ghp_your_token_here
GITHUB_REPO = shaanaks99/elite-auto-gallery
ADMIN_PASSWORD = your_secure_password
```

## Important URLs

- Admin Panel: `https://elite-auto-websitetest.pages.dev/admin.html`
- API Endpoint: `https://api.elite-auto-websitetest.pages.dev` (if using custom domain)
- GitHub Repo: `https://github.com/shaanaks99/elite-auto-gallery`
- Cloudflare Dashboard: `https://dash.cloudflare.com/`

## After Setup

✅ Test adding a car
✅ Test editing a car
✅ Test deleting a car
✅ Test image uploads
✅ Verify site updates after changes
✅ Save your admin password safely!

---

**Setup Time:** ~15-20 minutes
**Difficulty:** Medium
**Result:** Full-featured CMS without complexity! 🎉
