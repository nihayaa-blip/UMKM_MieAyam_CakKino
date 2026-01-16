// script.js - Sistem Kasir Mie Ayam & Bakso Cak Kino

// 1. Inisialisasi State Keranjang
let cart = [];

// 2. Jalankan script setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
    // Menangkap semua tombol "Pesan" di menu
    const orderButtons = document.querySelectorAll(".btn-order");

    orderButtons.forEach((btn) => {
        btn.addEventListener("click", function() {
            const card = this.closest(".menu-card");
            const itemName = card.querySelector("h3").innerText;
            // Mengambil angka saja dari teks harga (Contoh: "Rp 15.000" -> 15000)
            const itemPrice = card.querySelector(".price").innerText
                .replace(/[^0-9]/g, "")
                .trim();

            // Tambahkan item ke array keranjang
            addToCart(itemName, parseInt(itemPrice));
        });
    });
});

// 3. Fungsi Tambah ke Keranjang
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    renderCart();
}

// 4. Render Keranjang dan Kalkulator Pembayaran
function renderCart() {
    let cartContainer = document.getElementById("cart-container");

    // Jika container belum ada di HTML, buat secara dinamis
    if (!cartContainer) {
        cartContainer = document.createElement("div");
        cartContainer.id = "cart-container";
        // Masukkan container ke dalam .container milik .menu-section sesuai struktur index.html
        const sectionContainer = document.querySelector(".menu-section .container");
        if (sectionContainer) {
            sectionContainer.appendChild(cartContainer);
        }
    }

    // Template HTML untuk Keranjang dan Fitur Kembalian
    cartContainer.innerHTML = `
        <h2>Keranjang Pesanan</h2>
        <ul id="cart-list"></ul>
        <div class="cart-summary">
            <p><strong>Total Harga:</strong> Rp <span id="cart-total">0</span></p>
            
            <div class="payment-section" style="margin: 20px 0; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid var(--primary-color);">
                <label for="cash-amount" style="display: block; margin-bottom: 5px; font-weight: bold;">Uang Tunai Pelanggan (Rp):</label>
                <input type="number" id="cash-amount" placeholder="Masukkan jumlah uang..." 
                    style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
                
                <p style="margin-top: 15px; font-size: 1.1rem; font-weight: bold;">
                    Kembalian: <span id="change-text" style="color: var(--primary-color);">Rp 0</span>
                </p>
            </div>
        </div>
        <button onclick="orderWhatsApp()" class="btn-primary" style="width: 100%; border: none; cursor: pointer;">
            Kirim Pesanan ke WhatsApp
        </button>
    `;

    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    const cashInput = document.getElementById("cash-amount");

    cartList.innerHTML = "";
    let total = 0;

    // Tampilkan daftar item
    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - Rp ${item.price.toLocaleString('id-ID')} 
            <button onclick="removeItem(${index})" style="background: var(--secondary-color); color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer;">Hapus</button>
        `;
        cartList.appendChild(li);
    });

    cartTotal.innerText = total.toLocaleString('id-ID');

    // Event listener untuk menghitung kembalian setiap kali input diisi
    cashInput.addEventListener("input", () => {
        calculateChange(total);
    });
}

// 5. Fungsi Hitung Kembalian
function calculateChange(total) {
    const cashInput = document.getElementById("cash-amount");
    const changeText = document.getElementById("change-text");
    const cashValue = parseInt(cashInput.value) || 0;

    const change = cashValue - total;

    if (cashInput.value === "") {
        changeText.innerText = "Rp 0";
        changeText.style.color = "var(--primary-color)";
    } else if (change < 0) {
        changeText.innerText = "Uang Kurang!";
        changeText.style.color = "red";
    } else {
        changeText.innerText = "Rp " + change.toLocaleString('id-ID');
        changeText.style.color = "green";
    }
}

// 6. Hapus item dari keranjang
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// 7. Order via WhatsApp
function orderWhatsApp() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cashValue = document.getElementById("cash-amount").value || 0;
    const change = cashValue - total;

    let message = "*PESANAN BARU - CAK KINO*\n";
    message += "----------------------------\n";

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} - Rp ${item.price.toLocaleString('id-ID')}\n`;
    });

    message += "----------------------------\n";
    message += `*Total Harga:* Rp ${total.toLocaleString('id-ID')}\n`;
    message += `*Bayar Tunai:* Rp ${parseInt(cashValue).toLocaleString('id-ID')}\n`;

    if (change >= 0) {
        message += `*Kembalian:* Rp ${change.toLocaleString('id-ID')}\n`;
    }

    message += "\nMohon segera diproses ya, terima kasih!";

    let phone = "6289604887405";
    let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}