const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/lib/i18n/locales/en.json');
const idPath = path.join(__dirname, 'src/lib/i18n/locales/id.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

const navEn = {
  featured: "Featured",
  featured_desc: "Explore trending collections and top seller picks.",
  view_collection: "View Collection",
  no_results: "No results found for",
  searching: "Searching..."
};
const navId = {
  featured: "Unggulan",
  featured_desc: "Jelajahi koleksi tren dan pilihan penjual teratas.",
  view_collection: "Lihat Koleksi",
  no_results: "Tidak ada hasil ditemukan untuk",
  searching: "Mencari..."
};

en.nav = { ...en.nav, ...navEn };
id.nav = { ...id.nav, ...navId };

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync(idPath, JSON.stringify(id, null, 2) + '\n', 'utf8');

console.log("Translations 2 updated successfully!");
