# 🏋️ My Routine Tracker – PWA Setup Guide

## What You Have
A complete Progressive Web App (PWA) that works like a native app on your phone — with an icon on your home screen, offline support, and no app store needed.

---

## 🚀 OPTION A: Deploy with Vercel (Easiest – 5 minutes)

### Step 1: Create a GitHub Account (if you don't have one)
- Go to **https://github.com** and sign up (free)

### Step 2: Upload the Code to GitHub
1. Click **"New Repository"** (the green button)
2. Name it: `my-routine-tracker`
3. Keep it **Public**, click **Create Repository**
4. Click **"Upload files"** → drag the entire project folder contents
5. Click **"Commit changes"**

### Step 3: Deploy on Vercel (Free)
1. Go to **https://vercel.com** and click **"Sign Up"** → Sign in with GitHub
2. Click **"Add New Project"**
3. Select your `my-routine-tracker` repo
4. Framework Preset: **Create React App**
5. Click **"Deploy"** → Wait 1-2 minutes
6. You'll get a live URL like: `https://my-routine-tracker.vercel.app`

### Step 4: Install on Your Phone
1. Open the URL in **Chrome** on your phone
2. You'll see a banner saying **"Add to Home Screen"**
   - If not, tap the **⋮ (three dots)** menu → **"Add to Home Screen"**
3. Tap **"Add"**
4. The app icon now appears on your home screen! 🎉

---

## 🚀 OPTION B: Deploy with Netlify (Also Easy)

1. Go to **https://app.netlify.com** → Sign up with GitHub
2. Click **"Add New Site"** → **"Import from Git"**
3. Select your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `build`
6. Click **Deploy**
7. Open the URL on your phone → Add to Home Screen

---

## 🚀 OPTION C: Quick Test Locally

If you have Node.js installed on your computer:

```bash
cd my-routine-tracker
npm install
npm start
```

This opens the app at `http://localhost:3000`. 
To test on your phone, connect to the same WiFi and open `http://YOUR_PC_IP:3000`.

---

## 📱 Installing as App on Your Phone

### Android (Chrome)
1. Open the URL in Chrome
2. Tap **⋮** (three dots, top right)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Done! Opens like a real app

### iPhone (Safari)
1. Open the URL in **Safari** (not Chrome)
2. Tap the **Share button** (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Done!

---

## ✅ Features
- ✅ Works offline after first load
- ✅ App icon on home screen
- ✅ No browser bars (fullscreen)
- ✅ Data saved permanently on your device
- ✅ Works on Android + iPhone
- ✅ Navigate any week — past or future
- ✅ Skin care (morning) + Beard care (night)
- ✅ 7-day workout cycle repeats forever
- ✅ Streak tracking
- ✅ Completely FREE

---

## 🔧 Want to Change Something?
- **Edit routines**: Open `src/App.js` → find `PERSONAL_ROUTINE` array → add/remove items
- **Edit workouts**: Find `WORKOUT_PLAN_CYCLE` array → modify exercises
- **Edit diet**: Search for `meal1`, `meal2` etc in the diet section
- After changes, push to GitHub and Vercel auto-deploys!
