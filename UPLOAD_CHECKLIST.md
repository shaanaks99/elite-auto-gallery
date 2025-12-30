# ✅ QUICK UPLOAD CHECKLIST

## 📦 7 FILES TO UPLOAD

Use this checklist as you upload each file:

---

### File 1: config.yml
- [ ] Go to `/admin/config.yml` in GitHub
- [ ] Click "Edit"
- [ ] Select all and delete
- [ ] Copy from package and paste
- [ ] Commit: "Update admin config"

**Location:** `/admin/config.yml` (REPLACE existing)

---

### File 2: carLoader.js
- [ ] Go to repo root
- [ ] Click "Add file" → "Create new file"
- [ ] Name: `carLoader.js`
- [ ] Copy from package and paste
- [ ] Commit: "Add car loader"

**Location:** `/carLoader.js` (ADD NEW in root)

---

### File 3: inventory.html
- [ ] Go to `/inventory.html` in GitHub
- [ ] Click "Edit"
- [ ] Select all and delete
- [ ] Copy from package and paste
- [ ] Commit: "Update inventory"

**Location:** `/inventory.html` (REPLACE existing)

---

### File 4: inventory.js
- [ ] Go to repo root
- [ ] Click "Add file" → "Create new file"
- [ ] Name: `inventory.js`
- [ ] Copy from package and paste
- [ ] Commit: "Add inventory JS"

**Location:** `/inventory.js` (ADD NEW in root)

---

### File 5: inventory-styles.css
- [ ] Go to repo root
- [ ] Click "Add file" → "Create new file"
- [ ] Name: `inventory-styles.css`
- [ ] Copy from package and paste
- [ ] Commit: "Add inventory styles"

**Location:** `/inventory-styles.css` (ADD NEW in root)

---

### File 6: car-detail.html
- [ ] Go to repo root
- [ ] Click "Add file" → "Create new file"
- [ ] Name: `car-detail.html`
- [ ] Copy from package and paste
- [ ] Commit: "Add car detail page"

**Location:** `/car-detail.html` (ADD NEW in root)

---

### File 7: car-detail.js
- [ ] Go to repo root
- [ ] Click "Add file" → "Create new file"
- [ ] Name: `car-detail.js`
- [ ] Copy from package and paste
- [ ] Commit: "Add car detail JS"

**Location:** `/car-detail.js` (ADD NEW in root)

---

## ⏱️ AFTER ALL FILES UPLOADED

- [ ] Wait 2-3 minutes for Netlify rebuild
- [ ] Check Netlify dashboard (green checkmark = success)
- [ ] Go to admin: `yoursite.netlify.app/admin`
- [ ] Re-save test cars with Status: "published"
- [ ] Visit: `yoursite.netlify.app/inventory.html`
- [ ] See if cars load! 🎉

---

## 🧪 TEST EVERYTHING

- [ ] Cars load on inventory page
- [ ] Filter buttons work
- [ ] Click "View Details" opens car page
- [ ] Prices show as £65,000 format
- [ ] Status badges show (Sold/Reserved)
- [ ] Google Reviews button works (already fixed ✅)
- [ ] Admin panel shows "Petrol" not "Gasoline"

---

## 🎯 REPO STRUCTURE AFTER UPLOAD

```
elite-auto-gallery/
├── admin/
│   └── config.yml          ← REPLACED
├── _cars/                  (already exists)
│   ├── 2022-bmw-m4.md
│   ├── 2023-ferrari-488.md
│   └── ...
├── images/                 (already exists)
├── index.html             (already has Google fix ✅)
├── carLoader.js           ← NEW
├── inventory.html         ← REPLACED
├── inventory.js           ← NEW
├── inventory-styles.css   ← NEW
├── car-detail.html        ← NEW
├── car-detail.js          ← NEW
└── ... (other existing files)
```

---

## 💡 QUICK TIPS

1. **Copy entire file contents** - don't miss any code
2. **Keep file names exact** - case sensitive!
3. **Wait for Netlify** - rebuilds take 2-3 min
4. **Clear cache** - Ctrl+Shift+R after deploy
5. **Check console** - F12 for any errors

---

## 🎉 DONE!

Once all 7 files are uploaded and Netlify rebuilds:

✅ Everything works together
✅ Cars load from admin
✅ Filtering works
✅ Car details work
✅ Currency is £
✅ Google Reviews linked

**TIME TO TEST!** 🚗💨
