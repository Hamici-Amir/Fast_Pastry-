# Supabase Setup Guide

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project

## Step 2: Get Connection String
1. In Supabase dashboard, go to **Settings → Database**
2. Look for "Connection string"
3. Select "URI" tab
4. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public`)
5. **Replace [PASSWORD] with your database password** (you set this during project creation)

## Step 3: Update .env
Replace the DATABASE_URL in `backend/.env` with your Supabase connection string

Example:
```
DATABASE_URL="postgresql://postgres:your_password@db.yourproject.supabase.co:5432/postgres?schema=public"
```

## Step 4: Run Seed
```powershell
cd backend
npm run prisma:seed
```

## ✅ Done!
You can now login with:
- client@fastpastry.com
- driver@fastpastry.com  
- admin@fastpastry.com

Password: Password123
