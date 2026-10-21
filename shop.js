// ─── Shop Page: fetch watches, render grid, filter, search, modal ───
// DEMO MODE (Komil's decision, 2026-10-21): only the frontend is deployed.
// The backend stays in this repo (backend/) for code showcase / local runs —
// it is NOT hosted. So the shop runs on the built-in catalogue below and
// makes no API calls. To use the live backend later: host backend/, then
// set USE_BACKEND = true.
const USE_BACKEND = false;
const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '';
const resolveImg = p => (!p ? '' : (p.startsWith('http') || p.startsWith('/img') ? p : `${API_BASE}${p}`));
// Demo fallback data — used when the backend is not running (e.g. a static Vercel deploy),
// so the shop never shows an empty grid.
const FALLBACK_WATCHES = [
  { id: 'x1-violet', name: 'NOVA X1 — Nebula Violet', ref: 'X1 · Violet', desc: 'Deep violet glass that shifts with the light. 3 nm N1 chip, 120 Hz AMOLED, 5,200 mAh.', price: 289999, oldPrice: 309999, tag: 'Best Seller', photos: ['/img/nova/nova-studio.webp'], category: 'Flagship' },
  { id: 'x1-graphite', name: 'NOVA X1 — Graphite Black', ref: 'X1 · Graphite', desc: 'Matte graphite over a titanium frame. Boardroom outside, race car inside.', price: 279999, oldPrice: null, tag: 'New', photos: ['/img/nova/nova-graphite.webp'], category: 'Flagship' },
  { id: 'x1-pearl', name: 'NOVA X1 — Pearl Silver', ref: 'X1 · Pearl', desc: 'Pearl silver glass with a soft satin sheen. The quiet colourway, same flagship speed.', price: 279999, oldPrice: null, tag: 'New', photos: ['/img/nova/nova-hand.webp'], category: 'Flagship' },
  { id: 'x1-concept', name: 'NOVA X1 Concept — Exploded Edition', ref: 'X1 · Concept', desc: 'The display piece: the four-layer stack, framed as built. For collectors of the process.', price: 319999, oldPrice: null, tag: 'Concept', photos: ['/img/nova/nova-layers.webp'], category: 'Concept' }
];
let ALL_WATCHES = [];
let CURRENT_CAT = 'all';

const grid = document.getElementById('shopGrid');
const catFiltersEl = document.getElementById('categoryFilters');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('watchModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

async function loadWatches() {
  if (!USE_BACKEND) {
    ALL_WATCHES = FALLBACK_WATCHES;
    buildCategoryFilters();
    renderGrid();
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/watches`);
    if (!res.ok) throw new Error('Failed to fetch');
    ALL_WATCHES = await res.json();
    if (!Array.isArray(ALL_WATCHES) || !ALL_WATCHES.length) throw new Error('Empty catalogue');
    buildCategoryFilters();
    renderGrid();
  } catch (err) {
    console.warn('Backend unavailable — showing the built-in demo catalogue.', err);
    ALL_WATCHES = FALLBACK_WATCHES;
    buildCategoryFilters();
    renderGrid();
  }
}

function buildCategoryFilters() {
  const cats = [...new Set(ALL_WATCHES.map(w => w.category).filter(Boolean))];
  catFiltersEl.innerHTML = `<button class="filter-chip active" data-cat="all">All</button>` +
    cats.map(c => `<button class="filter-chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('');

  catFiltersEl.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      catFiltersEl.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CURRENT_CAT = btn.dataset.cat;
      renderGrid();
    });
  });
}

function getFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  return ALL_WATCHES.filter(w => {
    const matchCat = CURRENT_CAT === 'all' || w.category === CURRENT_CAT;
    const matchSearch = !q || w.name.toLowerCase().includes(q) || (w.description || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

function renderGrid() {
  const list = getFiltered();
  if (!list.length) {
    grid.innerHTML = '<p class="shop-empty">No watches match your search.</p>';
    return;
  }
  grid.innerHTML = list.map(cardHtml).join('');
  grid.querySelectorAll('.shop-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
}

function cardHtml(w) {
  const image = w.photos?.[0] ? resolveImg(w.photos[0]) : '';
  const price = `PKR ${Number(w.price).toLocaleString()}`;
  const inStock = w.stock > 0;
  const desc = (w.description || '').split('\r\n')[0].slice(0, 100);

  return `
    <article class="shop-card" data-id="${w.id}">
      <div class="shop-card-img">
        <img src="${image}" alt="${esc(w.name)}" loading="lazy">
        <span class="shop-card-stock-badge ${inStock ? '' : 'out'}">${inStock ? 'In Stock' : 'Sold Out'}</span>
      </div>
      <div class="shop-card-body">
        <p class="caps shop-card-cat">${esc(w.category || '')}</p>
        <h3 class="shop-card-name">${esc(w.name)}</h3>
        <p class="shop-card-desc">${esc(desc)}</p>
        <div class="shop-card-footer">
          <p class="shop-card-price">${price}</p>
          <span class="shop-card-view">View Details →</span>
        </div>
      </div>
    </article>
  `;
}

function openModal(id) {
  const w = ALL_WATCHES.find(x => String(x.id) === String(id));
  if (!w) return;
  const photos = (w.photos || []).map(p => resolveImg(p));
  const mainImg = photos[0] || '';
  const price = `PKR ${Number(w.price).toLocaleString()}`;
  const waText = encodeURIComponent(`Hello AKCLNT NOVA, I'm interested in "${w.name}" (PKR ${w.price}). Could you share more details?`);

  modalBody.innerHTML = `
    <div class="modal-gallery">
      <img src="${mainImg}" alt="${esc(w.name)}" id="modalMainImg">
      <div class="modal-thumbs">
        ${photos.map((p, i) => `<img src="${p}" class="${i === 0 ? 'active' : ''}" data-src="${p}">`).join('')}
      </div>
    </div>
    <div class="modal-info">
      <p class="caps">${esc(w.category || '')} · Stock: ${w.stock}</p>
      <h2>${esc(w.name)}</h2>
      <p class="modal-price">${price}</p>
      <p class="modal-desc">${esc((w.description || '').replace(/\\r\\n/g, '\n'))}</p>
      <a class="modal-cta" href="https://wa.me/923238559822?text=${waText}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
    </div>
  `;

  modalBody.querySelectorAll('.modal-thumbs img').forEach(t => {
    t.addEventListener('click', () => {
      document.getElementById('modalMainImg').src = t.dataset.src;
      modalBody.querySelectorAll('.modal-thumbs img').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

searchInput.addEventListener('input', renderGrid);

function esc(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadWatches();