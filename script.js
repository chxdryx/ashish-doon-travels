// Book Now - WhatsApp pe message bhejta hai
function bookNow() {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const date = document.getElementById('tdate').value;
  const type = document.getElementById('trip-type').value;

  if (!from || !to) {
    alert('Please enter pickup and destination location.');
    return;
  }

  const msg = `Hello Ashish Doon Travels!%0A%0AI want to book a cab:%0AFrom: ${from}%0ATo: ${to}%0ADate: ${date || 'Flexible'}%0ATrip Type: ${type}%0A%0APlease confirm availability and price.`;
  window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
}

// Contact form - WhatsApp pe
function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const phone = document.getElementById('cf-phone').value.trim();
  const msg = document.getElementById('cf-msg').value.trim();

  const waMsg = `Hello! I'm ${name} (${phone}).%0A%0A${msg}`;
  window.open(`https://wa.me/919999999999?text=${waMsg}`, '_blank');
}

// Navbar active link highlight on scroll
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#F5D97A' : '#ccc';
  });
});
