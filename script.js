const nav = document.querySelector('.primary-nav');
const menuToggle = document.querySelector('.menu-toggle');
const bookingDialog = document.querySelector('#booking-dialog');
const themeToggle = document.querySelector('#theme-toggle');
const themeLabel = themeToggle.querySelector('.theme-label');
const themeIcon = themeToggle.querySelector('[aria-hidden="true"]');
const root = document.documentElement;
function setTheme(theme, save = false) {
  const dark = theme !== 'light';
  root.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#080d1d' : '#fbfaf8';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
  themeIcon.textContent = dark ? '☼' : '☾';
  if (save) {
    try { localStorage.setItem('innoband-theme', dark ? 'dark' : 'light'); } catch {}
  }
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('innoband-theme') || 'dark'; } catch {}
setTheme(savedTheme);
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const songRequestField = document.querySelector('[name="songRequests"]');
function openBooking() {
  if (selectedSongs.size) {
    songRequestField.value = [...selectedSongs].sort((a, b) => a - b)
      .map((number) => `${String(number).padStart(2, '0')} — ${songTitles[number - 1]}`)
      .join('\n');
  }
  bookingDialog.showModal();
}
document.querySelectorAll('.open-booking').forEach((button) => button.addEventListener('click', openBooking));
document.querySelector('#use-setlist').addEventListener('click', openBooking);
document.querySelector('.dialog-close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});

const songTitles = [
  'A Million Dreams', 'A Smile In Your Heart', 'After All', 'All Out Of Love',
  'Always Remember Us This Way', 'Anak', 'Ang Buhay Ko', 'Atik Ra', 'Babe',
  'Bakit Pa Ba', 'Balanghoy Gabi', 'Breathless', 'Buwan',
  'Can’t Help Falling In Love With You', 'Country Roads', 'Di Na Babalik',
  'Fraulein', 'From This Moment', 'Have You Ever Seen The Rain',
  'Heaven Knows (Orange and Lemons)', 'Himala', 'Hinahanap Hanap Kita',
  'Huling El Bimbo', 'I Don’t Wanna Talk About It', 'Idana',
  'Ikaw ang Iibigin Ko', 'I’ll Never Go', 'Iniibig Kita', 'Isang Linggong Pag-ibig',
  'Jar of Hearts', 'Kahit Maputi Na Ang Buhok Ko', 'Kanlungan',
  'Killing Me Softly', 'Love Me for What I Am', 'Love Will Keep Us Alive',
  'Maging Sino Ka Man', 'Maybe This Time', 'Minamahal Kita', 'Multo', 'Mundo',
  'My Heart Will Go On', 'O Kinabuhi', 'Obladi Oblada', 'Open Arms', 'Pagsubok',
  'Pasabta Ko', 'Power Of Love', 'Pusong Ligaw', 'Still Loving You', 'Tatsulok',
  'Thank You for Loving Me', 'Through the Years', 'Top of the World', 'Torete',
  'Two Less Lonely People', 'Upuan', 'Warrior is a Child', 'What’s Up',
  'Wherever You Will Go', 'Wind of Change', 'Wonderful Tonight',
  'Yesterday Once More', 'You Are the Reason (Calum Scott)', 'Your Love'
];
const songList = document.querySelector('#song-list');
const songCount = document.querySelector('#song-count');
const search = document.querySelector('#song-search');
const setlistCount = document.querySelector('#setlist-count');
const clearSetlist = document.querySelector('#clear-setlist');
const useSetlist = document.querySelector('#use-setlist');
let selectedSongs = new Set();
try {
  const storedSongs = JSON.parse(localStorage.getItem('innoband-setlist') || '[]');
  if (Array.isArray(storedSongs)) selectedSongs = new Set(storedSongs.filter((number) => Number.isInteger(number) && number >= 1 && number <= songTitles.length));
} catch {}
function saveSetlist() {
  try { localStorage.setItem('innoband-setlist', JSON.stringify([...selectedSongs])); } catch {}
}
function updateSetlistSummary() {
  const count = selectedSongs.size;
  setlistCount.textContent = `${count} ${count === 1 ? 'song' : 'songs'} picked`;
  clearSetlist.disabled = count === 0;
  useSetlist.disabled = count === 0;
}
function renderSongs() {
  const query = search.value.trim().toLocaleLowerCase();
  const visibleSongs = songTitles.map((title, index) => ({ title, number: index + 1 }))
    .filter((song) => song.title.toLocaleLowerCase().includes(query));
  songList.replaceChildren(...visibleSongs.map(({ title, number }) => {
    const row = document.createElement('div');
    row.className = 'song-row';
    const id = document.createElement('span');
    id.className = 'song-row-number';
    id.textContent = String(number).padStart(2, '0');
    const name = document.createElement('span');
    name.className = 'song-row-title';
    name.textContent = title;
    const pick = document.createElement('button');
    const isSelected = selectedSongs.has(number);
    row.classList.toggle('is-selected', isSelected);
    pick.className = 'song-pick';
    pick.type = 'button';
    pick.setAttribute('aria-pressed', String(isSelected));
    pick.setAttribute('aria-label', `${isSelected ? 'Remove' : 'Add'} ${title} ${isSelected ? 'from' : 'to'} your request list`);
    pick.textContent = isSelected ? 'Added ✓' : '+ Add';
    pick.addEventListener('click', () => {
      if (selectedSongs.has(number)) selectedSongs.delete(number);
      else selectedSongs.add(number);
      const added = selectedSongs.has(number);
      row.classList.toggle('is-selected', added);
      pick.setAttribute('aria-pressed', String(added));
      pick.setAttribute('aria-label', `${added ? 'Remove' : 'Add'} ${title} ${added ? 'from' : 'to'} your request list`);
      pick.textContent = added ? 'Added ✓' : '+ Add';
      saveSetlist();
      updateSetlistSummary();
    });
    row.append(id, name, pick);
    return row;
  }));
  songCount.textContent = `${visibleSongs.length} of ${songTitles.length} songs`;
  if (!visibleSongs.length) {
    const empty = document.createElement('p');
    empty.className = 'song-empty';
    empty.textContent = 'No song matches that search. Try another title.';
    songList.append(empty);
  }
}
search.addEventListener('input', renderSongs);
clearSetlist.addEventListener('click', () => {
  selectedSongs.clear();
  saveSetlist();
  updateSetlistSummary();
  renderSongs();
});
updateSetlistSummary();
renderSongs();

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
    `Song numbers or titles: ${data.get('songRequests') || 'None specified'}`,
    'Performance format: typically 3–5 sets, around 8 songs per set',
    `Electricity source available at venue: ${data.get('power')}`,
    `Additional notes: ${data.get('notes') || 'None provided'}`, '',
    'Please let me know about availability and next steps.', '',
    'Thank you!'
  ];
  const subject = `Innovation Band booking request — ${data.get('date')}`;
  window.location.href = `mailto:markericgenosa2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
