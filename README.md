# Ashish Doon Travels — Full Stack Website

## Project Structure
```
ashish-doon-travels/
├── server.js          ← Backend (Node.js + Express)
├── package.json       ← Dependencies
├── public/
│   └── index.html     ← Frontend (HTML + CSS + JS)
└── README.md
```

---

## Run Locally (Step by Step)

### Step 1 — Install Node.js
Download from: https://nodejs.org (get LTS version)
Check it's installed:
```bash
node --version   # should show v18+
npm --version
```

### Step 2 — Install dependencies
```bash
cd ashish-doon-travels
npm install
```

### Step 3 — Start the server
```bash
npm start
# OR for auto-restart on changes:
npm run dev
```

### Step 4 — Open in browser
```
http://localhost:3000
```

---

## API Endpoints (Backend)

| Method | URL | What it does |
|--------|-----|-------------|
| GET | /api/destinations | List all destinations |
| GET | /api/destinations/:id | Get one destination (dehradun/mussoorie/etc) |
| POST | /api/bookings | Submit a new booking |
| GET | /api/admin/bookings | View all bookings (admin) |
| PATCH | /api/admin/bookings/:id | Update booking status |

---

## Make it a Real Website — 3 Options

### Option A: Render.com (FREE, easiest)
1. Create account at https://render.com
2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "first commit"
   # create repo on github.com, then:
   git remote add origin https://github.com/YOURNAME/ashish-doon-travels.git
   git push -u origin main
   ```
3. On Render: New → Web Service → connect GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Click Deploy → you get a free URL like `ashish-doon-travels.onrender.com`

### Option B: Railway.app (FREE, very fast)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo → it auto-detects Node.js
4. Add custom domain or use the free railway.app URL

### Option C: VPS + Custom Domain (Professional)
1. Buy domain on GoDaddy/Namecheap: `ashishdoontravels.com` (~₹800/year)
2. Buy VPS on DigitalOcean/Hostinger (~₹400/month)
3. SSH into server:
   ```bash
   apt install nodejs npm nginx
   git clone your-repo
   npm install
   # use PM2 to keep it running:
   npm install -g pm2
   pm2 start server.js
   pm2 save
   ```
4. Point domain DNS to your VPS IP
5. Setup SSL (free HTTPS):
   ```bash
   apt install certbot
   certbot --nginx -d ashishdoontravels.com
   ```

---

## Add Real Database (MongoDB - Free)

Replace in-memory bookings with MongoDB:

```bash
npm install mongoose
```

In server.js, add:
```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user:pass@cluster.mongodb.net/ashishdoon');

const BookingSchema = new mongoose.Schema({
  name: String, phone: String, destination: String,
  date: String, guests: String, message: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', BookingSchema);

// In POST /api/bookings:
const booking = await new Booking(req.body).save();
```

Get free MongoDB at: https://mongodb.com/atlas

---

## Add WhatsApp Notifications (when someone books)

```bash
npm install twilio
```

```javascript
const twilio = require('twilio');
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

// After booking saved:
client.messages.create({
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+91YOUR_NUMBER',
  body: `New booking! ${name} (${phone}) wants to go to ${destination}`
});
```

---

## Checklist Before Going Live
- [ ] Replace placeholder phone number with real one
- [ ] Replace placeholder email with real one  
- [ ] Add Google Analytics for visitor tracking
- [ ] Test booking form end-to-end
- [ ] Add real photos (replace emoji backgrounds)
- [ ] Setup WhatsApp/SMS notifications for new bookings
- [ ] Add SSL certificate (HTTPS)
