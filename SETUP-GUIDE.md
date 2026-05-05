# Setup Guide for SocialApp

## Database Setup

The backend requires PostgreSQL. The error you're seeing is because the `DATABASE_URL` environment variable is not set.

### Option 1: Docker PostgreSQL (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name socialapp-postgres -e POSTGRES_DB=socialapp -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Create .env file
cp .env.example .env
# Edit .env with your database credentials
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database named `socialapp`
3. Create a `.env` file with your database credentials:
```
DATABASE_URL=postgres://your_username:your_password@localhost:5432/socialapp
JWT_SECRET=your-secret-key-here
```

## Frontend Setup

The new frontend is in the `frontend-new` directory:

```bash
cd frontend-new
bun install
bun run dev
```

The frontend will run on `http://localhost:5173` and proxy API calls to `http://localhost:3000`.

## Backend Setup

```bash
# Install dependencies (already done)
bun install

# Start the backend server
bun run dev
```

The backend will run on `http://localhost:3000`.

## Running Both Services

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
bun run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend-new
bun install
bun run dev
```

## What's Fixed

1. ✅ Created new modern frontend with React 18 + TypeScript
2. ✅ Removed old frontend completely
3. ✅ Added environment configuration example
4. ✅ Set up proper API integration
5. ✅ Modern UI with Tailwind CSS

## Next Steps

1. Set up PostgreSQL (Docker recommended)
2. Create `.env` file from `.env.example`
3. Start both frontend and backend servers
4. Test the application at `http://localhost:5173`
