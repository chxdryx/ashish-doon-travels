const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── IN-MEMORY BOOKINGS STORE (replace with DB in production) ───
const bookings = [];

// ─── DESTINATION DATA ───
const destinations = {
  dehradun: {
    name: "Dehradun",
    tagline: "Valley of the Doons — Where the Himalayas Begin",
    emoji: "🌿",
    color: "#2A6B4F",
    rating: 4.8,
    bestTime: "March – June, Sept – Nov",
    distance: "0 km from city center",
    places: [
      { name: "Robber's Cave (Guchhupani)", type: "Nature", time: "2–3 hrs", entry: "₹35", desc: "A stunning river cave where water flows through narrow limestone gorges. Walk inside the cave stream!", must: true },
      { name: "Forest Research Institute", type: "Heritage", time: "3–4 hrs", entry: "₹50", desc: "Colonial-era heritage building with 6 museums. One of India's most beautiful campuses — stunning architecture.", must: true },
      { name: "Sahastradhara", type: "Nature", time: "2–3 hrs", entry: "₹20", desc: "Sulphur springs with therapeutic properties. 'Thousand-fold spring' — great for a relaxing dip.", must: false },
      { name: "Tapkeshwar Temple", type: "Spiritual", time: "1–2 hrs", entry: "Free", desc: "Ancient Shiva temple inside a natural cave with a waterfall dripping over the Shivling. Mystical.", must: true },
      { name: "Mindrolling Monastery", type: "Spiritual", time: "1–2 hrs", entry: "Free", desc: "One of the largest Buddhist centres in India. Stunning Tibetan architecture, towering Buddha statue.", must: false },
      { name: "Paltan Bazaar", type: "Shopping", time: "2–3 hrs", entry: "Free", desc: "Dehradun's main market. Best for basmati rice, litchi products, and local handicrafts.", must: false },
      { name: "Lachhiwala Nature Park", type: "Nature", time: "Half day", entry: "₹30", desc: "Forested picnic spot on the Song river banks. Perfect for families and a quick nature escape.", must: false },
      { name: "Clock Tower", type: "Landmark", time: "30 mins", entry: "Free", desc: "The heart of Dehradun city. 6-faced clock tower built in 1953 — great starting point for exploring.", must: false }
    ],
    packages: [
      { name: "Doon Day Trip", duration: "1D", price: 1499, includes: ["AC Cab", "Guide", "Entry Tickets"] },
      { name: "Doon Weekend", duration: "2D/1N", price: 2999, includes: ["Hotel", "AC Cab", "Breakfast", "Guide"] },
      { name: "Doon Explorer", duration: "3D/2N", price: 4999, includes: ["Hotel", "AC Cab", "All Meals", "Guide", "Insurance"] }
    ]
  },
  mussoorie: {
    name: "Mussoorie",
    tagline: "Queen of the Hills — 2,005m Above Sea Level",
    emoji: "🏔",
    color: "#1a4a6b",
    rating: 4.9,
    bestTime: "April – June, Dec – Jan (snow)",
    distance: "35 km from Dehradun",
    places: [
      { name: "Mall Road", type: "Landmark", time: "2–4 hrs", entry: "Free", desc: "The iconic promenade of Mussoorie. Shops, cafes, street food, and stunning valley views on both sides.", must: true },
      { name: "Kempty Falls", type: "Nature", time: "2–3 hrs", entry: "₹50", desc: "Mussoorie's most famous waterfall — 40 feet high, surrounded by mountains. Swim in the pool below!", must: true },
      { name: "Gun Hill", type: "Viewpoint", time: "1–2 hrs", entry: "₹75 (ropeway)", desc: "Second highest peak in Mussoorie. Take the ropeway for panoramic Himalayan views — Bandarpunch to Kedarnath.", must: true },
      { name: "Lal Tibba", type: "Viewpoint", time: "1–2 hrs", entry: "Free", desc: "Highest point in Mussoorie. On clear days, see Badrinath, Kedarnath, Gangotri peaks through binoculars.", must: false },
      { name: "Cloud's End", type: "Nature", time: "Half day", entry: "₹100", desc: "Literally where the road ends and the forest begins. Dense oak and rhododendron forest, peaceful walks.", must: false },
      { name: "George Everest House", type: "Heritage", time: "2–3 hrs", entry: "₹20", desc: "Ruins of Sir George Everest's home and lab. The man after whom Mt. Everest is named — stunning location.", must: true },
      { name: "Landour Bazaar", type: "Shopping", time: "1–2 hrs", entry: "Free", desc: "The quieter, old-world part of Mussoorie. Ruskin Bond's home area — quaint, charming, less touristy.", must: false },
      { name: "Camel's Back Road", type: "Nature", time: "1–2 hrs", entry: "Free", desc: "3km heritage walk past a rock shaped like a camel. Best at sunset — golden Himalayan views.", must: false }
    ],
    packages: [
      { name: "Mussoorie Day Trip", duration: "1D", price: 1999, includes: ["AC Cab", "Guide"] },
      { name: "Queen's Weekend", duration: "2D/1N", price: 4499, includes: ["Hotel", "AC Cab", "Breakfast", "Guide"] },
      { name: "Hill Royale", duration: "3D/2N", price: 7999, includes: ["Luxury Hotel", "AC Cab", "All Meals", "Guide", "Insurance"] }
    ]
  },
  haridwar: {
    name: "Haridwar",
    tagline: "Gateway to the Gods — Where Ganga Meets the Plains",
    emoji: "🔱",
    color: "#8B4513",
    rating: 4.9,
    bestTime: "Oct – March (pleasant), March–April (Holi, Navratri)",
    distance: "54 km from Dehradun",
    places: [
      { name: "Har Ki Pauri", type: "Spiritual", time: "2–3 hrs", entry: "Free", desc: "The holiest ghat of Haridwar. The famous Ganga Aarti at sunset is one of India's most magical experiences.", must: true },
      { name: "Ganga Aarti (Evening)", type: "Spiritual", time: "1 hr", entry: "Free", desc: "Every evening at 6–7pm. Thousands of diyas float on the Ganga — bells, chants, fire, divinity. Life-changing.", must: true },
      { name: "Mansa Devi Temple", type: "Spiritual", time: "2–3 hrs", entry: "₹108 (ropeway)", desc: "Hilltop temple reached by ropeway. Mansa Devi grants wishes — tie a sacred thread, fulfill a wish.", must: true },
      { name: "Chandi Devi Temple", type: "Spiritual", time: "2–3 hrs", entry: "₹108 (ropeway)", desc: "Another hilltop goddess temple. Built in 1929 by the King of Kashmir. Panoramic views of the valley.", must: false },
      { name: "Maya Devi Temple", type: "Spiritual", time: "1 hr", entry: "Free", desc: "One of the Shakti Peethas — ancient and deeply sacred. The heart of Haridwar's spiritual identity.", must: false },
      { name: "Rajaji National Park", type: "Nature", time: "Half day", entry: "₹800", desc: "Elephant safaris through dense jungle. Spot elephants, leopards, deer, and 315 bird species.", must: false },
      { name: "Bada Bazaar", type: "Shopping", time: "1–2 hrs", entry: "Free", desc: "Buy brass idols, religious items, Ganga jal, rudraksha, and handmade souvenirs at great prices.", must: false },
      { name: "Patanjali Yogpeeth", type: "Wellness", time: "2 hrs", entry: "Free", desc: "Baba Ramdev's yoga institute. Watch live yoga sessions, buy Ayurvedic products directly from source.", must: false }
    ],
    packages: [
      { name: "Haridwar Day Trip", duration: "1D", price: 1499, includes: ["AC Cab", "Ganga Aarti"] },
      { name: "Sacred Weekend", duration: "2D/1N", price: 3499, includes: ["Hotel", "AC Cab", "All Meals", "Aarti"] },
      { name: "Pilgrimage Special", duration: "4D/3N", price: 7999, includes: ["Hotel", "AC Cab", "All Meals", "Guide", "Puja"] }
    ]
  },
  rishikesh: {
    name: "Rishikesh",
    tagline: "Yoga Capital of the World — Adventure Meets Spirituality",
    emoji: "🌊",
    color: "#1a6b4a",
    rating: 4.9,
    bestTime: "Feb – May, Sept – Nov",
    distance: "43 km from Dehradun",
    places: [
      { name: "Laxman Jhula", type: "Landmark", time: "1–2 hrs", entry: "Free", desc: "The iconic iron suspension bridge over Ganga. Legend: Laxman crossed the Ganga here on jute ropes. Iconic photo spot.", must: true },
      { name: "Ram Jhula", type: "Landmark", time: "1 hr", entry: "Free", desc: "Bigger suspension bridge nearby. Both bridges offer stunning river and mountain views.", must: false },
      { name: "River Rafting", type: "Adventure", time: "3–4 hrs", entry: "₹600–2,500", desc: "16km to 36km rafting routes through Grade 1–4 rapids. Best adrenaline rush in Uttarakhand. March–May best.", must: true },
      { name: "Bungee Jumping", type: "Adventure", time: "Half day", entry: "₹3,550", desc: "India's highest fixed platform bungee at 83m — Jumpin Heights. Also giant swing and flying fox available.", must: true },
      { name: "Beatles Ashram", type: "Heritage", time: "2–3 hrs", entry: "₹150 (foreigners ₹600)", desc: "Abandoned ashram where The Beatles stayed in 1968. Stunning graffiti, eerie beauty, incredible history.", must: true },
      { name: "Triveni Ghat", type: "Spiritual", time: "1–2 hrs", entry: "Free", desc: "Main bathing ghat in Rishikesh. Beautiful morning aarti. Three rivers meet here — holy and peaceful.", must: false },
      { name: "Parmarth Niketan Ashram", type: "Spiritual", time: "Evening", entry: "Free", desc: "Largest ashram in Rishikesh. Famous for Ganga Aarti at sunset — more intimate than Haridwar.", must: true },
      { name: "Neelkanth Mahadev Temple", type: "Spiritual", time: "Half day", entry: "Free", desc: "32km drive through forest. Where Shiva drank the poison (Neela = blue, Kanth = throat). Sacred and scenic.", must: false }
    ],
    packages: [
      { name: "Rishikesh Adventure", duration: "1D", price: 2499, includes: ["AC Cab", "Rafting", "Bungee"] },
      { name: "Yoga & Adventure", duration: "3D/2N", price: 5999, includes: ["Camp Stay", "AC Cab", "Rafting", "Yoga", "All Meals"] },
      { name: "Complete Rishikesh", duration: "4D/3N", price: 8999, includes: ["Hotel", "AC Cab", "All Activities", "All Meals", "Guide"] }
    ]
  },
  chakrata: {
    name: "Chakrata",
    tagline: "The Hidden Gem — Garhwal's Best Kept Secret",
    emoji: "⛰",
    color: "#2a2a5a",
    rating: 4.7,
    bestTime: "March – June, Dec – Feb (snow)",
    distance: "88 km from Dehradun",
    places: [
      { name: "Tiger Falls", type: "Nature", time: "Half day", entry: "Free", desc: "India's highest direct waterfall at 312 feet. 5km jungle trek to reach it — absolutely worth every step.", must: true },
      { name: "Deoban Forest", type: "Nature", time: "Half day", entry: "Free", desc: "Dense deodar forest at 2,200m. Himalayan views, bird watching, complete silence. Far from all tourists.", must: true },
      { name: "Chilmiri Neck", type: "Viewpoint", time: "1–2 hrs", entry: "Free", desc: "360-degree Himalayan panorama. On clear days see peaks from Kedarnath to Bandarpunch range.", must: true },
      { name: "Mundan Falls", type: "Nature", time: "2–3 hrs", entry: "Free", desc: "Lesser-known waterfall near Chakrata. Short trek, beautiful pool, far fewer crowds than Tiger Falls.", must: false },
      { name: "Kanda Village", type: "Cultural", time: "2–3 hrs", entry: "Free", desc: "Ancient Jaunsari tribal village. Unique architecture, traditional costumes, century-old temples.", must: false },
      { name: "Budher Caves", type: "Adventure", time: "Half day", entry: "Free", desc: "Mysterious caves dating back thousands of years. Some caves stretch 150m inside the mountain.", must: false }
    ],
    packages: [
      { name: "Chakrata Day Trip", duration: "1D", price: 2999, includes: ["AC Cab", "Guide", "Entry"] },
      { name: "Chakrata Escape", duration: "2D/1N", price: 4999, includes: ["Camp/Hotel", "AC Cab", "All Meals", "Trek"] },
      { name: "Doon + Chakrata", duration: "4D/3N", price: 8999, includes: ["Hotels", "AC Cab", "All Meals", "Guide", "Insurance"] }
    ]
  }
};

// ─── API ROUTES ───

// GET all destinations (summary)
app.get('/api/destinations', (req, res) => {
  const summary = Object.entries(destinations).map(([id, d]) => ({
    id,
    name: d.name,
    tagline: d.tagline,
    emoji: d.emoji,
    rating: d.rating,
    bestTime: d.bestTime,
    distance: d.distance,
    startingPrice: Math.min(...d.packages.map(p => p.price))
  }));
  res.json({ success: true, data: summary });
});

// GET single destination with all places
app.get('/api/destinations/:id', (req, res) => {
  const dest = destinations[req.params.id.toLowerCase()];
  if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
  res.json({ success: true, data: { id: req.params.id, ...dest } });
});

// POST new booking
app.post('/api/bookings', (req, res) => {
  const { name, phone, destination, date, guests, package: pkg, message } = req.body;
  if (!name || !phone || !destination) {
    return res.status(400).json({ success: false, message: 'Name, phone, and destination are required' });
  }
  const booking = {
    id: 'ADT' + Date.now(),
    name, phone, destination, date, guests,
    package: pkg || 'Custom',
    message: message || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  console.log('New booking:', booking);
  res.json({
    success: true,
    message: `Booking confirmed! ID: ${booking.id}. We'll call ${phone} within 30 minutes.`,
    bookingId: booking.id
  });
});

// GET all bookings (admin)
app.get('/api/admin/bookings', (req, res) => {
  res.json({ success: true, total: bookings.length, data: bookings });
});

// PATCH update booking status (admin)
app.patch('/api/admin/bookings/:id', (req, res) => {
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  bookings[idx].status = req.body.status || bookings[idx].status;
  res.json({ success: true, data: bookings[idx] });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅  Ashish Doon Travels server running on http://localhost:${PORT}`);
});
