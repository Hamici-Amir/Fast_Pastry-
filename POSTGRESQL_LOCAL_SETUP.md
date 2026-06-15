# PostgreSQL Local Setup for Fast Pastry

## Step 1: Download & Install PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Download the latest version (15.x or higher recommended)
3. Run the installer

### During Installation:
- **Installation Directory**: Leave as default (`C:\Program Files\PostgreSQL\15`)
- **Port**: `5432` (default)
- **Superuser Password**: `postgres` (or your choice - remember this!)
- **Service Account**: Leave default
- **Check "Install as Windows Service"**: ✅ YES
- **Locale**: Your region

## Step 2: Verify Installation

Open PowerShell and run:
```powershell
psql -U postgres -h localhost
```

If prompted for password, enter: `postgres`

If successful, you'll see:
```
psql (15.x)
Type "help" for help.

postgres=#
```

Exit with: `\q`

## Step 3: Create Database

Run this command in PowerShell:
```powershell
psql -U postgres -h localhost -c "CREATE DATABASE fast_pastry;"
```

When prompted for password, enter: `postgres`

## Step 4: Update .env (Already Done ✅)

The `.env` file already has:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fast_pastry?schema=public"
```

**If you used a different password**, update it:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fast_pastry?schema=public"
```

## Step 5: Run Seed

```powershell
cd backend
npm run prisma:seed
```

You should see:
```
🌱 Seeding database...

📋 Creating test accounts:

✅ CLIENT Account:
   Email: client@fastpastry.com
   Password: Password123

✅ DRIVER Account:
   Email: driver@fastpastry.com
   Password: Password123

✅ ADMIN Account:
   Email: admin@fastpastry.com
   Password: Password123

✨ Database seeding completed successfully!
```

## ✅ Done!

You can now login in the app with any of these accounts using password: `Password123`

---

## Troubleshooting

### "psql: command not found"
- PostgreSQL not installed or path not set
- Restart your terminal after installing PostgreSQL

### "FATAL: role 'postgres' does not exist"
- Create the role: `createuser -U postgres postgres`

### "database 'fast_pastry' does not exist"
- Create it manually in pgAdmin or use the command above

