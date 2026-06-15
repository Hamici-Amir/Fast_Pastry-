# Database Setup Instructions for Fast Pastry

## Option 1: Use PostgreSQL Locally (Recommended for Development)

### Windows Setup:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install with default settings (usually port 5432)
3. During installation, set password for `postgres` user to: `postgres`
4. After installation, PostgreSQL service should start automatically

### Verify Installation:
```powershell
# In terminal, run:
psql -U postgres -h localhost

# If prompted for password, enter: postgres
# If connected, you'll see: postgres=#
```

### Create Database:
```sql
CREATE DATABASE fast_pastry;
```

Then run:
```powershell
cd backend
npm run prisma:seed
```

---

## Option 2: Use Cloud PostgreSQL (Easiest - No Local Setup)

### Using Supabase (Free Tier Available):
1. Go to https://supabase.com
2. Sign up and create a new project
3. Copy the connection string from Settings → Database → Connection string
4. Update `.env` with your Supabase connection string:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
   ```

Then run:
```powershell
cd backend
npm run prisma:seed
```

---

## Option 3: Use SQLite for Testing (Fastest - No Setup)

If you just want to test locally without PostgreSQL:

1. Update `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   ```

2. Update `prisma/schema.prisma` datasource:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. Run:
   ```powershell
   cd backend
   npm run prisma:seed
   ```

---

## After Setup, You Can:
✅ Login with: client@fastpastry.com (Password123)
✅ Login with: driver@fastpastry.com (Password123)
✅ Login with: admin@fastpastry.com (Password123)

