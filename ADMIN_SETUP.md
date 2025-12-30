# Admin Panel Setup - OAuth Authentication

## Important: Netlify Identity is Deprecated

Netlify Identity was deprecated on February 28, 2025. This admin panel now uses **GitHub OAuth** for authentication, which is more secure and actively maintained.

---

## Setup Steps (15 minutes)

### Step 1: Update the Config File

1. Open `admin/config.yml`
2. Find this line:
   ```yaml
   repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
   ```
3. Replace with your actual GitHub details:
   ```yaml
   repo: yourusername/elite-auto-gallery
   ```

---

### Step 2: Deploy Your Site

1. Commit all files to GitHub
2. Push to your repository
3. Netlify will auto-deploy
4. Wait 2-3 minutes for deployment
5. Note your site URL: `https://your-site.netlify.app`

---

### Step 3: Enable Netlify OAuth

1. Go to **Netlify Dashboard** (app.netlify.com)
2. Click on your site
3. Go to **Site Configuration** → **Access & security** → **OAuth**
4. Click **"Install provider"**
5. Select **"GitHub"**
6. Click **"Install"**
7. Authorize Netlify to access your GitHub account
8. ✅ Done!

---

### Step 4: Set Up GitHub OAuth App (Alternative Method)

If the above doesn't work, you can manually create a GitHub OAuth app:

1. Go to GitHub: **Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Elite Auto Gallery CMS`
   - **Homepage URL:** `https://your-site.netlify.app`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"**
7. Copy the **Client Secret**

Then in Netlify:
1. Go to **Site settings** → **Access control** → **OAuth**
2. Under **Authentication providers**, click **Install provider**
3. Select **GitHub**
4. Paste your **Client ID** and **Client Secret**
5. Click **Install**

---

### Step 5: Grant Repository Access

1. The customer needs **write access** to your GitHub repository
2. Go to your repo: **Settings** → **Collaborators**
3. Click **"Add people"**
4. Enter customer's GitHub username
5. Set permission to **"Write"** or **"Admin"**
6. Customer accepts invitation via email

---

### Step 6: Customer Accesses Admin Panel

1. Go to: `https://your-site.netlify.app/admin/`
2. Click **"Login with GitHub"**
3. Authorize the app (first time only)
4. **They're in!** 🎉

---

## How It Works

### For You (Developer):
- You control the GitHub repository
- You invite customer as collaborator
- Netlify OAuth handles authentication

### For Customer:
- Logs in with their GitHub account
- Can add/edit/delete cars
- Changes saved directly to GitHub
- Site auto-rebuilds on publish

---

## Security Features

- ✅ **GitHub OAuth** - Industry standard authentication
- ✅ **Repository permissions** - Only invited users can edit
- ✅ **HTTPS** - All traffic encrypted
- ✅ **No passwords stored** - GitHub handles authentication
- ✅ **Audit trail** - All changes tracked in Git history

---

## Customer Requirements

Your customer needs:
1. A **GitHub account** (free)
2. **Collaborator access** to your repository
3. Internet browser (works on desktop/mobile)

If they don't have GitHub:
1. Go to github.com
2. Click "Sign up"
3. Create free account (5 minutes)
4. Done!

---

## Using The Admin Panel

Once logged in:

1. Click **"Cars"** in sidebar
2. Click **"New Car"**
3. Fill in all fields
4. Upload car image
5. Click **"Save"** (draft) or **"Publish"** (live)
6. Wait 2-3 minutes for site to rebuild
7. Car appears on website!

### Editing Cars:
1. Click **"Cars"** in sidebar
2. Click on any car
3. Make changes
4. Click **"Publish"**

### Deleting Cars:
1. Click on car to edit
2. Click **"Delete entry"** button
3. Confirm deletion
4. Click **"Publish"**

---

## Troubleshooting

### "Config not found" error:
- Check that `admin/config.yml` has correct repo name
- Verify files are deployed to Netlify

### "Not authorized" error:
- Make sure customer is added as collaborator on GitHub
- Customer needs to accept invitation email

### Changes don't appear:
- Wait 2-3 minutes for Netlify to rebuild
- Check **Deploys** tab in Netlify dashboard
- Refresh browser with Ctrl+F5

### Can't log in:
- Verify Netlify OAuth is installed
- Customer needs GitHub account
- Check repository permissions

---

## Advantages Over Old System

| Feature | Old (Identity) | New (OAuth) |
|---------|---------------|-------------|
| **Status** | Deprecated ❌ | Active ✅ |
| **Setup Time** | 10 min | 15 min |
| **Security** | Good | Better |
| **Maintenance** | Manual | Automatic |
| **Cost** | Free | Free |
| **User Limit** | 1,000 | Unlimited |

---

## Quick Reference

**Admin URL:** `https://your-site.netlify.app/admin/`
**Login Method:** GitHub OAuth
**Customer Needs:** GitHub account + Repo access
**Deploy Time:** 2-3 minutes per change
**Support:** Decap CMS documentation at decapcms.org

---

## Need Help?

1. Check Netlify docs: docs.netlify.com
2. Decap CMS docs: decapcms.org/docs
3. GitHub OAuth docs: docs.github.com/en/developers/apps

---

**Setup complete!** Your admin panel is now ready to use! 🚀
