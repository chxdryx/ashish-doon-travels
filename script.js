// 1. DATA STORE: Destinations ki details
const destinationData = {
    dehradun: {
        name: "Dehradun",
        emoji: "🌿",
        tagline: "Valley of the Doons — Where the Himalayas begin",
        places: [
            { name: "Robber's Cave (Guchhu Pani)", desc: "Natural cave river formation.", mustVisit: true },
            { name: "FRI", desc: "Greco-Roman architecture campus.", mustVisit: true }
        ]
    },
    mussoorie: {
        name: "Mussoorie",
        emoji: "🏔",
        tagline: "The Queen of the Hills",
        places: [
            { name: "Kempty Falls", desc: "The most famous giant waterfall.", mustVisit: true },
            { name: "Gun Hill", desc: "Second highest peak in Mussoorie.", mustVisit: true }
        ]
    },
    haridwar: {
        name: "Haridwar",
        emoji: "🔱",
        tagline: "Gateway to the Gods",
        places: [
            { name: "Har Ki Pauri", desc: "Famous ghat for Ganga Aarti.", mustVisit: true }
        ]
    },
    rishikesh: {
        name: "Rishikesh",
        emoji: "🌊",
        tagline: "Yoga Capital of the World",
        places: [
            { name: "Laxman Jhula", desc: "Iconic suspension bridge.", mustVisit: true }
        ]
    },
    chakrata: {
        name: "Chakrata",
        emoji: "⛰",
        tagline: "Hidden gem of Garhwal hills",
        places: [
            { name: "Tiger Falls", desc: "Highest direct water fall.", mustVisit: true }
        ]
    }
};

// 2. MODAL LOGIC (Jisse Places aur Distance dono dikhenge)
function openDestModal(id) {
    const data = destinationData[id];
    if (!data) return;

    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    document.getElementById('modal-name').innerText = data.name;
    document.getElementById('modal-emoji').innerText = data.emoji;
    document.getElementById('modal-tagline').innerText = data.tagline;
    
    // Places list update (Keeping distance section safe)
    let placesDiv = document.getElementById('places-list');
    if(!placesDiv) {
        placesDiv = document.createElement('div');
        placesDiv.id = 'places-list';
        content.prepend(placesDiv);
    }

    let html = `<h3 class="modal-section-title">Must Visit <em>Places</em></h3><div class="places-grid">`;
    data.places.forEach(p => {
        html += `<div class="place-card ${p.mustVisit ? 'must-visit' : ''}">
                    <span class="place-name">${p.name}</span>
                    <p class="place-desc">${p.desc}</p>
                 </div>`;
    });
    html += `</div>`;
    
    placesDiv.innerHTML = html;
    modal.classList.add('open');

    // Aapka distance function call
    showDistanceInModal(id);
}

// 3. TERA ORIGINAL DISTANCE CALCULATOR
const destCoords = {
  dehradun:  { lat: 30.3165, lon: 78.0322 },
  mussoorie: { lat: 30.4598, lon: 78.0644 },
  haridwar:  { lat: 29.9457, lon: 78.1642 },
  rishikesh: { lat: 30.0869, lon: 78.2676 },
  chakrata:  { lat: 30.6931, lon: 77.8656 }
};

const trainInfo = {
  dehradun:  { avail: true,  cost: 150,  time: '—' },
  mussoorie: { avail: false, cost: 0,    time: 'No direct train' },
  haridwar:  { avail: true,  cost: 120,  time: '1.5 hr' },
  rishikesh: { avail: true,  cost: 140,  time: '2 hr' },
  chakrata:  { avail: false, cost: 0,    time: 'No direct train' }
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) *
            Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function showDistanceInModal(destId) {
  const section = document.getElementById('dist-section');
  const status  = document.getElementById('dist-status');
  if (!navigator.geolocation) {
    status.innerHTML = '📍 Location support nahi hai browser mein';
    return;
  }
  status.innerHTML = '📍 Aapki location dhundh raha hoon...';
  section.style.display = 'block';

  navigator.geolocation.getCurrentPosition(pos => {
      const km = haversine(pos.coords.latitude, pos.coords.longitude, destCoords[destId].lat, destCoords[destId].lon);
      const car = Math.round(km * 12);
      const bike = Math.round(km / 40 * 100);
      const t = trainInfo[destId];
      status.innerHTML = '';
      document.getElementById('dist-km').textContent = km + ' km aapki location se';
      document.getElementById('dist-car').textContent = '🚗 Cab: ₹' + car + ' approx (' + Math.round(km/50) + ' hr)';
      document.getElementById('dist-bike').textContent = '🏍 Bike: ₹' + bike + ' petrol (' + Math.round(km/45) + ' hr)';
      document.getElementById('dist-train').textContent = t.avail ? '🚂 Train: ₹' + t.cost + ' · ' + t.time : '🚂 Train: ' + t.time;
    },
    err => { status.innerHTML = '⚠️ Location allow karo browser mein'; }
  );
}

// 4. BOOKING & WHATSAPP FUNCTIONS (Tera Code)
function bookNow() {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const date = document.getElementById('tdate').value;
  const type = document.getElementById('trip-type').value;
  if (!from || !to) { alert('Please enter pickup and destination.'); return; }
  const msg = `Hello! Cab booking: From ${from} to ${to}. Date: ${date || 'Flexible'}. Type: ${type}`;
  window.open(`https://wa.me/919719114237?text=${encodeURIComponent(msg)}`, '_blank');
}

function prefillBooking(packageName) {
    const destSelect = document.getElementById('b-dest');
    if(destSelect) destSelect.value = packageName;
    scrollTo('booking');
    toast('Package Selected!', packageName);
}

function submitBooking() {
    const name = document.getElementById('b-name').value;
    const phone = document.getElementById('b-phone').value;
    if (!name || !phone) { toast('Error!', 'Details bhar do bhai.'); return; }
    toast('Confirmed! ✅', `Dhanyawad ${name}! Call aayega 30 min mein.`);
}

// 5. UTILITIES (Scroll, Navbar, Toast)
function scrollTo(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function closeModalDirect() { document.getElementById('modal').classList.remove('open'); }
function closeModal(e) { if (e.target.id === 'modal') closeModalDirect(); }

const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 50) nav.classList.add('stuck'); else nav.classList.remove('stuck');
  
  let current = '';
  document.querySelectorAll('section[id], div[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#F5D97A' : '#ccc';
  });
});

function toast(title, msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-msg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
}