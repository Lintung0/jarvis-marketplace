const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/lib/i18n/locales/en.json');
const idPath = path.join(__dirname, 'src/lib/i18n/locales/id.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

const newKeysEn = {
  wallet: {
    balance_title: "Your Wallet Balance",
    balance_subtitle: "Use your wallet for fast payments on Modesy",
    top_up: "Top Up Balance",
    enter_amount: "Enter amount...",
    pay_now: "Pay Now",
    history: "Transaction History",
    all_status: "All Status",
    success: "Success",
    pending: "Pending",
    failed: "Failed",
    detail_amount: "Amount",
    detail_status: "Status",
    detail_date: "Date",
    detail_payment_id: "Payment ID",
    detail_notes: "Notes"
  },
  checkout_steps: {
    fill_address_first: "Please fill in your shipping address first!",
    wallet_balance_insufficient: "Insufficient wallet balance. Balance: {balance}, Need: {need}",
    empty_cart: "Your Cart is Empty",
    add_products_first: "Add products before checkout",
    shop_now: "Shop Now",
    cart: "Cart",
    shipping: "Shipping",
    payment: "Payment",
    title: "Checkout",
    subtitle: "Complete your details to finish the purchase",
    shipping_address: "Shipping Address",
    shipping_address_desc: "Fill in the address for physical product delivery",
    selected_address: "Selected Address",
    change: "Change",
    digital_product: "Digital Product",
    digital_product_desc: "All your products are digital. No shipping address required. Access will be granted immediately after payment.",
    choose_payment: "Choose Payment Method",
    choose_payment_desc: "Select your preferred payment method"
  },
  checkout: {
    continue_to_payment: "Continue to Payment",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    shipping_fee: "Shipping Fee",
    free_shipping: "FREE!",
    coupon_discount: "Coupon Discount",
    buy: "Buy",
    more_for_free_shipping: "more for free shipping!",
    enter_coupon: "Enter coupon code",
    total_payment: "Total Payment",
    pay_now: "Pay Now",
    secure_payment: "Secure payment via Xendit",
    payment_methods: "Payment Methods:"
  },
  saved_addresses: {
    title: "Saved Addresses",
    add_new: "Add New",
    empty: "No saved addresses yet. Add a new address for faster checkout.",
    edit: "Edit",
    set_default: "Set as default",
    delete: "Delete",
    edit_address: "Edit Address",
    new_address: "New Address",
    label: "Label",
    custom_label_placeholder: "Label name (e.g., Store)",
    full_name: "Full Name *",
    phone: "Phone Number *",
    address: "Address",
    address_placeholder: "Search address...",
    city: "City",
    city_placeholder: "Search city...",
    state: "Province/State",
    state_placeholder: "Search province/state...",
    postal_code: "Postal Code",
    country: "Country",
    fill_required: "Please fill in all required fields",
    invalid_session: "Invalid session, please login again",
    update_failed: "Failed to update address",
    update_success: "Address updated",
    add_failed: "Failed to add address",
    add_success: "Address added",
    delete_confirm: "Delete this address?"
  },
  common: {
    loading: "Loading...",
    close: "Close",
    error: "An error occurred, please try again.",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    update: "Update",
    apply: "Apply",
    processing: "Processing..."
  }
};

const newKeysId = {
  wallet: {
    balance_title: "Saldo Wallet Anda",
    balance_subtitle: "Gunakan wallet untuk pembayaran cepat di Modesy",
    top_up: "Top Up Saldo",
    enter_amount: "Masukkan nominal...",
    pay_now: "Bayar Sekarang",
    history: "Riwayat Transaksi",
    all_status: "Semua Status",
    success: "Berhasil",
    pending: "Tertunda",
    failed: "Gagal",
    detail_amount: "Nominal",
    detail_status: "Status",
    detail_date: "Waktu",
    detail_payment_id: "Payment ID",
    detail_notes: "Catatan"
  },
  checkout_steps: {
    fill_address_first: "Isi alamat pengiriman dulu ya!",
    wallet_balance_insufficient: "Saldo wallet tidak cukup. Saldo: {balance}, Perlu: {need}",
    empty_cart: "Keranjang Kosong",
    add_products_first: "Tambahkan produk dulu sebelum checkout",
    shop_now: "Belanja Sekarang",
    cart: "Keranjang",
    shipping: "Pengiriman",
    payment: "Pembayaran",
    title: "Checkout",
    subtitle: "Lengkapi data untuk menyelesaikan pembelian",
    shipping_address: "Alamat Pengiriman",
    shipping_address_desc: "Isi alamat untuk pengiriman produk fisik",
    selected_address: "Alamat terpilih",
    change: "Ganti",
    digital_product: "Produk Digital",
    digital_product_desc: "Semua produk kamu adalah digital. Tidak perlu alamat pengiriman. Akses produk akan langsung tersedia setelah pembayaran berhasil.",
    choose_payment: "Pilih Metode Pembayaran",
    choose_payment_desc: "Pilih cara bayar yang kamu inginkan"
  },
  checkout: {
    continue_to_payment: "Lanjut ke Pembayaran",
    order_summary: "Ringkasan Pesanan",
    subtotal: "Subtotal",
    shipping_fee: "Biaya Pengiriman",
    free_shipping: "GRATIS!",
    coupon_discount: "Diskon Kupon",
    buy: "Belanja",
    more_for_free_shipping: "lagi untuk gratis ongkir!",
    enter_coupon: "Masukkan kode kupon",
    total_payment: "Total Pembayaran",
    pay_now: "Bayar Sekarang",
    secure_payment: "Pembayaran aman via Xendit",
    payment_methods: "Metode Pembayaran:"
  },
  saved_addresses: {
    title: "Alamat Tersimpan",
    add_new: "Tambah Baru",
    empty: "Belum ada alamat tersimpan. Tambah alamat baru untuk checkout lebih cepat.",
    edit: "Edit",
    set_default: "Jadikan utama",
    delete: "Hapus",
    edit_address: "Edit Alamat",
    new_address: "Alamat Baru",
    label: "Label",
    custom_label_placeholder: "Nama label (contoh: Toko)",
    full_name: "Nama Lengkap *",
    phone: "No. HP *",
    address: "Alamat",
    address_placeholder: "Cari alamat...",
    city: "Kota",
    city_placeholder: "Cari kota...",
    state: "Provinsi",
    state_placeholder: "Cari provinsi...",
    postal_code: "Kode Pos",
    country: "Negara",
    fill_required: "Lengkapi semua field yang wajib",
    invalid_session: "Sesi tidak valid, silakan login ulang",
    update_failed: "Gagal update alamat",
    update_success: "Alamat diupdate",
    add_failed: "Gagal menambah alamat",
    add_success: "Alamat ditambahkan",
    delete_confirm: "Hapus alamat ini?"
  },
  common: {
    loading: "Memuat...",
    close: "Tutup",
    error: "Terjadi kesalahan, coba lagi.",
    cancel: "Batal",
    save: "Simpan",
    saving: "Menyimpan...",
    update: "Update",
    apply: "Apply",
    processing: "Memproses..."
  }
};

const mergeObj = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeObj(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
};

// Also update nav object for TopBar
const navEn = {
  my_profile: "My Profile",
  wallet: "Wallet",
  orders: "Orders",
  profile_settings: "Profile Settings",
  logging_out: "Logging out...",
  logout: "Logout",
  messages: "Messages"
};
const navId = {
  my_profile: "Profil Saya",
  wallet: "Dompet",
  orders: "Pesanan",
  profile_settings: "Pengaturan Profil",
  logging_out: "Keluar...",
  logout: "Keluar",
  messages: "Pesan"
};

en.nav = { ...en.nav, ...navEn };
id.nav = { ...id.nav, ...navId };

mergeObj(en, newKeysEn);
mergeObj(id, newKeysId);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync(idPath, JSON.stringify(id, null, 2) + '\n', 'utf8');

console.log("Translations updated successfully!");
