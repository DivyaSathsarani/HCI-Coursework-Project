# Furnish API Server

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Database (choose one)

**Option A: MongoDB Atlas (recommended, no local install)**
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster and get your connection string
3. In `.env`, set:
   ```
   MONGODB_URI=mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/roomdesigner?retryWrites=true&w=majority
   ```
   Replace `USER`, `PASS`, and the cluster URL with your values.

**Option B: Local MongoDB**
1. Install MongoDB: `brew install mongodb-community` (macOS)
2. Start MongoDB: `brew services start mongodb-community`
3. The default `mongodb://127.0.0.1:27017/roomdesigner` will be used

### 3. Start the server

**Option A: Full stack (recommended — no CORS issues)**  
Builds the frontend and serves everything from http://localhost:5000:
```bash
npm run start:full
```

**Option B: API only**  
For development with `npm run dev` in the frontend folder (uses Vite proxy):
```bash
npm start
```

The server runs on http://localhost:5000. With `start:full`, open http://localhost:5000 in your browser.

### Test credentials (seeded on first run)
- Email: `admin@example.com`
- Password: `123456`

### Health check
`GET http://localhost:5000/api/health` — returns database connection status.
