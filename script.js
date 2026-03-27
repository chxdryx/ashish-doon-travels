/* ==========================================================
   1. DATA STORE: Destinations & Coordinates
   ========================================================== */
const destinationData = {
    dehradun: { name: "Dehradun", emoji: "🌿", tagline: "Valley of the Doons — Where the Himalayas begin" },
    mussoorie: { name: "Mussoorie", emoji: "🏔", tagline: "The Queen of the Hills" },
    haridwar: { name: "Haridwar", emoji: "🔱", tagline: "Gateway to the Gods" },
    rishikesh: { name: "Rishikesh", emoji: "🌊", tagline: "Yoga Capital of the World" },
    chakrata: { name: "Chakrata", emoji: "⛰", tagline: "Hidden gem of Garhwal hills" }
};

const destCoords = {
    dehradun:  { lat: 30.3165, lon: 78.0322 },
    mussoorie: { lat: 30.4598, lon: 78.0644 },
    haridwar:  { lat: 29.9457, lon: 78.1642 },
    rishikesh: { lat: 30.0869, lon: 78.2676 },
    chakrata:  { lat: 30.6931, lon: 77.8656 }
};

/* ==========================================================
   2. MAPTILER & ROUTE LOGIC
   ========================================================== */
const MAPTILER_KEY = 'YOUR_MAPTILER_KEY_HERE'; // <--- APNI KEY YAHAN DALO

async function getRouteData(startLng, startLat, endLng, endLat) {
    const url = `https://api.maptiler.com/navigation/routing/v2/driving/${startLng},${startLat};${endLng},${endLat}?key=${MAPTILER_KEY}&alternatives=false&geometries=geojson`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.routes && data.routes.length > 0) {
            return {
                geometry: data.routes[0].geometry,
                distance: Math.round(data.routes[0].distance / 1000)
            };
        }
    } catch (e) {
        console.error("Route API Error:", e);
        return null;
    }
}

/* ==========================================================
   3. MASTER FUNCTION: Modal & Distance Fix
   ========================================================== */
async function handleDestinationClick(destId) {
    const data = destinationData[destId];
    const coords = destCoords[destId];
    if (!data || !coords) return;

    // A. Modal UI Update (Title & Tagline)
    const modalTitle = document.querySelector('.modal-title') || document.getElementById('modal-name');
    const modalTag = document.querySelector('.modal-tagline') || document.getElementById('modal-tagline');
    
    if(modalTitle) modalTitle.innerText = data.name;
    if(modalTag) modalTag.innerText = data.tagline;

    const modal = document.getElementById('modal');
    if(modal) modal.classList.add('open');

    // B. Distance Badge Update (Jo screenshot mein 0 km dikha raha tha)
    // Hum multiple possible selectors check kar rahe hain taaki fail na ho
    const distBadge = document.querySelector('.distance-badge-text') || document.querySelector('.badge span:last-child');
    if(distBadge) distBadge.innerHTML = '📍 Finding route...';

    // C. Get Location & Distance
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;

            const routeData = await getRouteData(userLng, userLat, coords.lon, coords.lat);
            
            if (routeData) {
                // 1. Map Drawing (Agar function exist karta hai)
                if (typeof drawRoute === "function") drawRoute(routeData.geometry);

                // 2. UI Update (The "0 km" fix)
                if(distBadge) distBadge.innerHTML = `📍 ${routeData.distance} km (road)`;
                
                // Pricing update (Agar HTML mein IDs hain)
                const kmDisplay = document.getElementById('dist-km');
                if(kmDisplay) kmDisplay.innerText = `${routeData.distance} KM`;
                
                toast('Route Found!', `${routeData.distance} KM road distance.`);
            }
        }, (err) => {
            if(distBadge) distBadge.innerHTML = '📍 Location denied';
            console.error("Geo Error:", err);
        });
    } else {
        if(distBadge) distBadge.innerHTML = '📍 No Geo Support';
    }
}

/* ==========================================================
   4. UTILITIES & BOOKING
   ========================================================== */
function bookNow() {
    const from = document.getElementById('from')?.value.trim();
    const to = document.getElementById('to')?.value.trim();
    const date = document.getElementById('tdate')?.value;
    if (!from || !to) { toast('Error!', 'Please fill pickup & drop.'); return; }
    const msg = `Hello! Cab booking: From ${from} to ${to}. Date: ${date || 'Flexible'}`;
    window.open(`https://wa.me/919719114237?text=${encodeURIComponent(msg)}`, '_blank');
}

function scrollTo(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function closeModalDirect() { 
    document.getElementById('modal').classList.remove('open'); 
}

function closeModal(e) { 
    if (e.target.id === 'modal') closeModalDirect(); 
}

function toast(title, msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-msg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
}

window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (nav) {
        if (window.scrollY > 50) nav.classList.add('stuck'); 
        else nav.classList.remove('stuck');
    }
});

/* ==========================================================
   5. GLOBAL EXPOSE
   ========================================================== */
window.handleDestinationClick = handleDestinationClick;
window.closeModalDirect = closeModalDirect;
window.closeModal = closeModal;
window.bookNow = bookNow;
window.scrollTo = scrollTo;