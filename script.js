const nav = document.querySelector('.primary-nav');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const search = document.querySelector('#song-search');
const songs = [...document.querySelectorAll('.song-card')];
let activeFilter = 'all';
function filterSongs() {
  const query = search.value.trim().toLowerCase();
  songs.forEach((song) => {
    const matchesCategory = activeFilter === 'all' || song.dataset.category === activeFilter;
    const matchesQuery = song.dataset.search.includes(query);
    song.hidden = !(matchesCategory && matchesQuery);
  });
}
search.addEventListener('input', filterSongs);
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active');
  button.classList.add('active');
  activeFilter = button.dataset.filter;
  filterSongs();
}));

document.querySelector('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const lines = [
    'Hello MSU-MCEST Innovation Band,', '',
    'I would like to ask about booking the band. Here are my event details:', '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Event date: ${data.get('date')}`,
    `Event type: ${data.get('eventType')}`,
    `Venue: ${data.get('venue')}`,
    `Estimated audience: ${data.get('audience')}`,
    `Performance length: ${data.get('duration')}`,
    `Additional notes: ${data.get('notes') || 'None provided'}`, '',
    'Please let me know about availability and next steps.', '',
    'Thank you!'
  ];
  const subject = `Band booking request — ${data.get('date')}`;
  window.location.href = `mailto:markericgenosa2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
