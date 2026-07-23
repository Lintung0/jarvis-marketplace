const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/lib/i18n/locales/en.json');
const idPath = path.join(__dirname, 'src/lib/i18n/locales/id.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.checkout_steps.xendit_desc = "Bank Transfer, E-Wallet, Card";
id.checkout_steps.xendit_desc = "Transfer Bank, E-Wallet, Kartu Kredit";

en.checkout.invalid_coupon = "Invalid coupon";
id.checkout.invalid_coupon = "Kupon tidak valid";

en.checkout.validate_failed = "Failed to validate coupon";
id.checkout.validate_failed = "Gagal memvalidasi kupon";

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync(idPath, JSON.stringify(id, null, 2) + '\n', 'utf8');

console.log("Translations 3 updated successfully!");
