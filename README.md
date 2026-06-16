# 💍 Matrimony Mediator Management

A full-stack web app for marriage mediators to manage bride/groom profiles, track mediator chains, and share matches via WhatsApp.

## Quick Setup

### Step 1: Configure Backend

1. Open `backend/.env` and fill in your details:

```
MONGO_URI=mongodb+srv://ajaypavushetti123_db_user:YOUR_ACTUAL_PASSWORD@cluster0.zjk35mk.mongodb.net/matrimony?appName=Cluster0
```

Replace `YOUR_ACTUAL_PASSWORD` with your MongoDB Atlas password.

2. For photo uploads, create a free [Cloudinary](https://cloudinary.com) account and fill in:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** The app works without Cloudinary — you just won't be able to upload photos until you set it up.

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

### Step 3: Start Frontend

Open a **new terminal**:
```bash
cd frontend
npm run dev
```

Open the URL shown (usually http://localhost:5173) in your browser.

### Step 4: Register & Login

1. Click "Register" to create your account
2. Login with your email and password
3. Start adding bride/groom profiles!

## Features

- 🔐 Secure login with JWT (stays logged in for 30 days)
- 👰 Add detailed bride/groom profiles
- 📸 Upload up to 4 photos per profile (via Cloudinary)
- 🔗 Track complete mediator chains
- 💰 Payment tracking with pending amounts
- 🔍 Search by name, village, occupation, education
- 📱 WhatsApp sharing with formatted messages
- 📊 Filter by Bride/Groom and Marriage Type
- 📋 NA option for all optional fields

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Auth:** JWT
- **Photos:** Cloudinary
- **Styling:** Vanilla CSS (mobile-first)
