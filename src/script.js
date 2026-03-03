// Data Produk
const products = [
    {
        id: "1",
        name: "Sambal Roa",
        description: "Sambal ikan roa khas Manado dengan cita rasa pedas gurih yang autentik. Dibuat dari ikan roa asap pilihan dan bumbu tradisional.",
        price: 48000,
        image: "images/sambalroa.jpeg",
        category: "Sambal Premium",
        spicyLevel: 4,
        weight: "180g",
        stock: 35
    },
    {
        id: "2",
        name: "Sambal Cakalang Fu Fu",
        description: "Sambal ikan cakalang asap khas Manado dengan cita rasa yang kaya dan gurih. Perpaduan sempurna antara pedas dan gurih.",
        price: 45000,
        image: "images/sambalcakalang.jpeg",
        category: "Sambal Premium",
        spicyLevel: 4,
        weight: "180g",
        stock: 30
    },
    {
        id: "3",
        name: "Abon Tuna",
        description: "Abon tuna premium dengan tekstur lembut dan rasa yang gurih. Cocok untuk teman makan nasi atau roti.",
        price: 38000,
        image: "images/abontuna.jpeg",
        category: "Abon",
        spicyLevel: 2,
        weight: "100g",
        stock: 40
    },
    {
        id: "4",
        name: "Kacang Batik",
        description: "Kacang tanah batik dengan bumbu khas yang renyah dan gurih. Camilan sempurna untuk berbagai momen.",
        price: 22000,
        image: "images/kacangbatik.jpeg",
        category: "Snack",
        spicyLevel: 2,
        weight: "125g",
        stock: 50
    }
];

const categories = ["Semua", "Sambal Premium", "Abon", "Snack"];

// State Management
let currentUser = null;
let cart = [];
let selectedCategory = "Semua";
let currentProductId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDataFromStorage();
    renderFeaturedProducts();
    renderProducts();
    renderCategoryFilter();
    updateCartBadge();
    updateAuthUI();
    setupScrollEffects();
    addStaggeredAnimations();
    addRippleEffect();
    addParallaxEffect();
    addKeyboardNavigation();
});

function initializeApp() {
    // Seed demo user
    const users = JSON.parse(localStorage.getItem('larisdy_users') || '[]');
    if (!users.find(u => u.email === 'demo@larisdy.com')) {
        users.push({
            id: 'demo-1',
            email: 'demo@larisdy.com',
            password: 'demo123',
            name: 'Demo User',
            phone: '0812-3456-7890',
            address: 'Jl. Sudirman No. 123, Jakarta Pusat',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('larisdy_users', JSON.stringify(users));
    }
}

function setupEventListeners() {
    // Auth
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('authBtn')?.addEventListener('click', () => showPage('login'));
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('accountBtn')?.addEventListener('click', () => showPage('account'));
    document.getElementById('cartBtn')?.addEventListener('click', () => showPage('cart'));

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page);
            updateActiveNav(this);
        });
    });
}

function loadDataFromStorage() {
    currentUser = JSON.parse(localStorage.getItem('larisdy_user'));
    cart = JSON.parse(localStorage.getItem('larisdy_cart') || '[]');
}

// Page Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const pageMap = {
        'home': 'homePage',
        'products': 'productsPage',
        'product': 'productDetailPage',
        'cart': 'cartPage',
        'login': 'loginPage',
        'register': 'registerPage',
        'checkout': 'checkoutPage',
        'account': 'accountPage'
    };

    const pageId = pageMap[pageName];
    if (pageId) {
        document.getElementById(pageId).classList.add('active');
    }

    // Render page content
    if (pageName === 'cart') renderCart();
    if (pageName === 'checkout') renderCheckout();
    if (pageName === 'account') renderAccount();
    if (pageName === 'products') renderProducts();

    smoothScrollToTop();
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Product Rendering
function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return;

    const featured = products.slice(0, 3);
    grid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = selectedCategory === 'Semua' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    grid.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const spicyLevel = product.spicyLevel;
    const spicyDots = '●'.repeat(spicyLevel) + '○'.repeat(5 - spicyLevel);
    
    return `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div>
                        <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                        <p class="product-category" style="margin-top: 0.25rem;">${product.weight}</p>
                    </div>
                    <div class="spicy-level" style="font-size: 0.875rem; color: var(--accent-copper);" title="Tingkat Pedas: ${spicyLevel}/5">
                        ${spicyDots}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    if (!filter) return;

    filter.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === selectedCategory ? 'active' : ''}" 
                onclick="filterByCategory('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function filterByCategory(category) {
    selectedCategory = category;
    renderCategoryFilter();
    renderProducts();
}

// Product Detail
function showProductDetail(productId) {
    currentProductId = productId;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const detailContainer = document.getElementById('productDetail');
    const spicyIcons = '🔥'.repeat(product.spicyLevel);
    const emptySpicy = '⚪'.repeat(5 - product.spicyLevel);

    detailContainer.innerHTML = `
        <div class="product-detail">
            <div>
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
            </div>
            <div class="product-detail-info">
                <span class="product-badge">${product.category}</span>
                <h1>${product.name}</h1>
                <div style="margin-bottom: 1.5rem;">
                    <strong>Tingkat Pedas:</strong> ${spicyIcons}${emptySpicy} (${product.spicyLevel}/5)
                </div>
                <p style="margin-bottom: 1.5rem; color: #6b7280;">${product.description}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding: 1.5rem 0; border-top: 2px solid #e5e7eb; border-bottom: 2px solid #e5e7eb;">
                    <div>
                        <p style="color: #6b7280; margin-bottom: 0.5rem;">Berat</p>
                        <p style="font-weight: 600;">${product.weight}</p>
                    </div>
                    <div>
                        <p style="color: #6b7280; margin-bottom: 0.5rem;">Stok Tersedia</p>
                        <p style="font-weight: 600;">${product.stock} unit</p>
                    </div>
                </div>
                <p class="product-price" style="font-size: 2.5rem; margin-bottom: 1.5rem;">
                    Rp ${product.price.toLocaleString('id-ID')}
                </p>
                <div class="quantity-selector">
                    <p style="font-weight: 600;">Jumlah</p>
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <span class="quantity-value" id="quantityValue">1</span>
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                </div>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="addToCartFromDetail()">
                        🛒 Tambah ke Keranjang
                    </button>
                    <button class="btn-primary" onclick="buyNow()">
                        Beli Sekarang
                    </button>
                </div>
            </div>
        </div>
    `;

    showPage('product');
}

let productQuantity = 1;

function changeQuantity(delta) {
    const product = products.find(p => p.id === currentProductId);
    productQuantity = Math.max(1, Math.min(product.stock, productQuantity + delta));
    document.getElementById('quantityValue').textContent = productQuantity;
}

function addToCartFromDetail() {
    const product = products.find(p => p.id === currentProductId);
    for (let i = 0; i < productQuantity; i++) {
        addToCart(product);
    }
    showToast(`${product.name} ditambahkan ke keranjang!`);
    productQuantity = 1;
}

function buyNow() {
    const product = products.find(p => p.id === currentProductId);
    for (let i = 0; i < productQuantity; i++) {
        addToCart(product);
    }
    productQuantity = 1;
    showPage('cart');
}

// Cart Management
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartBadge();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('Produk dihapus dari keranjang');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, Math.min(item.stock, quantity));
        saveCart();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('larisdy_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}

function renderCart() {
    const container = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h2>Keranjang Kosong</h2>
                <p style="color: #6b7280; margin: 1rem 0;">Belum ada produk dalam keranjang Anda</p>
                <button class="btn-primary" onclick="showPage('products')">Mulai Belanja</button>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15000;
    const total = subtotal + shipping;

    container.innerHTML = `
        <div class="cart-layout">
            <div>
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-header">
                                <div>
                                    <h3 class="cart-item-name">${item.name}</h3>
                                    <p class="product-category">${item.category}</p>
                                </div>
                                <button class="delete-btn" onclick="removeFromCart('${item.id}')">🗑️</button>
                            </div>
                            <p class="product-price">Rp ${item.price.toLocaleString('id-ID')}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                                <div class="quantity-selector">
                                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                                <div>
                                    <p style="color: #6b7280; font-size: 0.875rem;">Subtotal</p>
                                    <p style="font-weight: 700; font-size: 1.125rem;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h2 style="margin-bottom: 1.5rem;">Ringkasan Pesanan</h2>
                <div class="summary-row">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="font-weight: 600;">Rp ${subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div class="summary-row">
                    <span style="color: #6b7280;">Ongkos Kirim</span>
                    <span style="font-weight: 600;">Rp ${shipping.toLocaleString('id-ID')}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span class="price">Rp ${total.toLocaleString('id-ID')}</span>
                </div>
                <button class="btn-primary btn-block" onclick="proceedToCheckout()">Checkout</button>
                <button class="btn-secondary btn-block" style="margin-top: 0.5rem;" onclick="showPage('products')">Lanjut Belanja</button>
            </div>
        </div>
    `;
}

function proceedToCheckout() {
    if (!currentUser) {
        showToast('Silakan login terlebih dahulu', 'error');
        setTimeout(() => showPage('login'), 1000);
        return;
    }
    showPage('checkout');
}

// Checkout
function renderCheckout() {
    const container = document.getElementById('checkoutContent');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15000;
    const total = subtotal + shipping;

    container.innerHTML = `
        <form id="checkoutForm" onsubmit="handleCheckout(event)">
            <div class="checkout-layout">
                <div>
                    <div class="checkout-section">
                        <div class="section-header">
                            <div class="section-icon">🚚</div>
                            <h2>Informasi Pengiriman</h2>
                        </div>
                        <div class="form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" id="checkoutName" value="${currentUser?.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="checkoutEmail" value="${currentUser?.email || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Nomor Telepon</label>
                            <input type="tel" id="checkoutPhone" value="${currentUser?.phone || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Alamat Lengkap</label>
                            <textarea id="checkoutAddress" required>${currentUser?.address || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Catatan (Opsional)</label>
                            <textarea id="checkoutNotes" placeholder="Catatan untuk penjual..."></textarea>
                        </div>
                    </div>

                    <div class="checkout-section">
                        <div class="section-header">
                            <div class="section-icon">💳</div>
                            <h2>Metode Pembayaran</h2>
                        </div>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="transfer" checked>
                            <div>
                                <strong>Transfer Bank</strong>
                                <p style="color: #6b7280; font-size: 0.875rem;">BCA, Mandiri, BNI, BRI</p>
                            </div>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="cod">
                            <div>
                                <strong>COD (Bayar di Tempat)</strong>
                                <p style="color: #6b7280; font-size: 0.875rem;">Bayar saat barang diterima</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="cart-summary">
                    <div class="section-header">
                        <div class="section-icon">📦</div>
                        <h2>Ringkasan Pesanan</h2>
                    </div>
                    ${cart.map(item => `
                        <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.5rem;">
                            <div>
                                <p style="font-weight: 600; font-size: 0.875rem;">${item.name}</p>
                                <p style="color: #6b7280; font-size: 0.875rem;">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    `).join('')}
                    <div style="border-top: 2px solid #e5e7eb; margin: 1rem 0; padding-top: 1rem;">
                        <div class="summary-row">
                            <span style="color: #6b7280;">Subtotal</span>
                            <span style="font-weight: 600;">Rp ${subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div class="summary-row">
                            <span style="color: #6b7280;">Ongkos Kirim</span>
                            <span style="font-weight: 600;">Rp ${shipping.toLocaleString('id-ID')}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total</span>
                            <span class="price">Rp ${total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary btn-block">Buat Pesanan</button>
                </div>
            </div>
        </form>
    `;
}

function handleCheckout(e) {
    e.preventDefault();
    
    const order = {
        id: `ORD-${Date.now()}`,
        items: [...cart],
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingCost: 15000,
        grandTotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15000,
        customerName: document.getElementById('checkoutName').value,
        customerEmail: document.getElementById('checkoutEmail').value,
        customerPhone: document.getElementById('checkoutPhone').value,
        shippingAddress: document.getElementById('checkoutAddress').value,
        notes: document.getElementById('checkoutNotes').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        orderDate: new Date().toISOString(),
        status: 'Pending'
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem('larisdy_orders') || '[]');
    orders.push(order);
    localStorage.setItem('larisdy_orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();
    updateCartBadge();

    // Show success
    showOrderSuccess(order);
}

function showOrderSuccess(order) {
    const container = document.getElementById('checkoutContent');
    container.innerHTML = `
        <div class="order-success">
            <div class="success-icon">✅</div>
            <h1 style="font-size: 2rem; margin-bottom: 1rem;">Pesanan Berhasil!</h1>
            <p style="color: #6b7280; margin-bottom: 0.5rem;">Terima kasih telah berbelanja di Larisdy</p>
            <div class="order-id">ID Pesanan: ${order.id}</div>
            
            <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0; text-align: left;">
                <h3 style="margin-bottom: 1rem;">Detail Pengiriman</h3>
                <p style="color: #6b7280; margin-bottom: 0.5rem;"><strong>Nama:</strong> ${order.customerName}</p>
                <p style="color: #6b7280; margin-bottom: 0.5rem;"><strong>Email:</strong> ${order.customerEmail}</p>
                <p style="color: #6b7280; margin-bottom: 0.5rem;"><strong>Telepon:</strong> ${order.customerPhone}</p>
                <p style="color: #6b7280;"><strong>Alamat:</strong> ${order.shippingAddress}</p>
            </div>

            <div class="info-box">
                <p style="font-weight: 600; margin-bottom: 0.5rem; color: #1e40af;">Informasi Pembayaran</p>
                <p style="color: #1e3a8a; font-size: 0.875rem; margin-bottom: 0.75rem;">
                    Silakan lakukan pembayaran sebesar <strong>Rp ${order.grandTotal.toLocaleString('id-ID')}</strong> ke rekening berikut:
                </p>
                <p style="color: #1e3a8a; font-weight: 600;">Bank BCA: 1234567890</p>
                <p style="color: #1e3a8a; font-size: 0.875rem;">a.n. Larisdy Indonesia</p>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button class="btn-secondary" onclick="showPage('home')">Kembali ke Beranda</button>
                <button class="btn-primary" onclick="showPage('account')">Lihat Pesanan Saya</button>
            </div>
        </div>
    `;
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('larisdy_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        localStorage.setItem('larisdy_user', JSON.stringify(currentUser));
        updateAuthUI();
        showToast('Login berhasil!');
        showPage('home');
    } else {
        showToast('Email atau password salah', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Password tidak cocok', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password minimal 6 karakter', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('larisdy_users') || '[]');
    const email = document.getElementById('regEmail').value;

    if (users.find(u => u.email === email)) {
        showToast('Email sudah terdaftar', 'error');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        email: email,
        password: password,
        name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value,
        address: document.getElementById('regAddress').value,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('larisdy_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;
    localStorage.setItem('larisdy_user', JSON.stringify(currentUser));
    
    updateAuthUI();
    showToast('Akun berhasil dibuat!');
    showPage('home');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('larisdy_user');
    updateAuthUI();
    showToast('Berhasil logout');
    showPage('home');
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (currentUser) {
        authBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        authBtn.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

function useDemoCredentials() {
    document.getElementById('loginEmail').value = 'demo@larisdy.com';
    document.getElementById('loginPassword').value = 'demo123';
}

// Account Page
function renderAccount() {
    if (!currentUser) {
        showPage('login');
        return;
    }

    const container = document.getElementById('accountContent');
    const orders = JSON.parse(localStorage.getItem('larisdy_orders') || '[]')
        .filter(order => order.customerEmail === currentUser.email)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    container.innerHTML = `
        <div class="account-layout">
            <div class="account-sidebar">
                <div class="account-user-info">
                    <div class="account-avatar">👤</div>
                    <div>
                        <p style="font-weight: 600;">${currentUser.name}</p>
                        <p style="font-size: 0.875rem; color: #6b7280;">${currentUser.email}</p>
                    </div>
                </div>
                <div class="account-menu">
                    <button class="account-menu-btn active" onclick="showAccountTab('profile')">⚙️ Profil</button>
                    <button class="account-menu-btn" onclick="showAccountTab('orders')">📦 Pesanan Saya ${orders.length > 0 ? `(${orders.length})` : ''}</button>
                    <button class="account-menu-btn" style="color: #dc2626;" onclick="handleLogout()">🚪 Logout</button>
                </div>
            </div>
            <div class="account-content" id="accountTabContent">
                ${renderProfileTab()}
            </div>
        </div>
    `;
}

function renderProfileTab() {
    return `
        <h2 style="margin-bottom: 1.5rem;">Informasi Profil</h2>
        <div class="form-group">
            <label>Nama Lengkap</label>
            <input type="text" id="profileName" value="${currentUser.name}">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" value="${currentUser.email}" disabled>
            <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">Email tidak dapat diubah</p>
        </div>
        <div class="form-group">
            <label>Nomor Telepon</label>
            <input type="tel" id="profilePhone" value="${currentUser.phone}">
        </div>
        <div class="form-group">
            <label>Alamat</label>
            <textarea id="profileAddress">${currentUser.address}</textarea>
        </div>
        <button class="btn-primary" onclick="updateProfile()">Simpan Perubahan</button>
        <p style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 0.875rem;">
            Akun dibuat pada ${new Date(currentUser.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
    `;
}

function renderOrdersTab() {
    const orders = JSON.parse(localStorage.getItem('larisdy_orders') || '[]')
        .filter(order => order.customerEmail === currentUser.email)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    if (orders.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h2>Belum Ada Pesanan</h2>
                <p style="color: #6b7280; margin: 1rem 0;">Anda belum memiliki riwayat pesanan</p>
                <button class="btn-primary" onclick="showPage('products')">Mulai Belanja</button>
            </div>
        `;
    }

    return `
        <h2 style="margin-bottom: 1.5rem;">Riwayat Pesanan</h2>
        ${orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <p style="font-weight: 600; font-size: 1.125rem;">${order.id}</p>
                        <p style="color: #6b7280; font-size: 0.875rem;">
                            ${new Date(order.orderDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <span class="order-status">${order.status}</span>
                </div>
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                        <div style="flex: 1;">
                            <p style="font-weight: 600;">${item.name}</p>
                            <p style="color: #6b7280; font-size: 0.875rem;">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <p style="font-weight: 600;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                `).join('')}
                <div style="border-top: 2px solid #e5e7eb; padding-top: 1rem; margin-top: 1rem; display: flex; justify-content: space-between;">
                    <span style="font-weight: 600;">Total Pembayaran</span>
                    <span style="font-size: 1.25rem; font-weight: 700; color: #dc2626;">Rp ${order.grandTotal.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `).join('')}
    `;
}

function showAccountTab(tab) {
    const content = document.getElementById('accountTabContent');
    const buttons = document.querySelectorAll('.account-menu-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'profile') {
        content.innerHTML = renderProfileTab();
    } else if (tab === 'orders') {
        content.innerHTML = renderOrdersTab();
    }
}

function updateProfile() {
    currentUser.name = document.getElementById('profileName').value;
    currentUser.phone = document.getElementById('profilePhone').value;
    currentUser.address = document.getElementById('profileAddress').value;

    localStorage.setItem('larisdy_user', JSON.stringify(currentUser));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('larisdy_users') || '[]');
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, ...currentUser } : u);
    localStorage.setItem('larisdy_users', JSON.stringify(updatedUsers));

    updateAuthUI();
    showToast('Profil berhasil diperbarui');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Scroll Effects
function setupScrollEffects() {
    // Header shadow on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.product-card, .feature-card, .cart-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function addStaggeredAnimations() {
    // Add staggered delay to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary, .btn-secondary, .btn-hero')) {
            const button = e.target;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    });
}

// Animate cart badge on update
function animateCartBadge() {
    const badge = document.getElementById('cartBadge');
    badge.classList.add('updated');
    setTimeout(() => badge.classList.remove('updated'), 300);
}

// Enhanced updateCartBadge with animation
const originalUpdateCartBadge = updateCartBadge;
updateCartBadge = function() {
    originalUpdateCartBadge();
    animateCartBadge();
}

// Add loading effect to forms
function addButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Memproses...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// Smooth scroll to top when changing pages
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add parallax effect to hero
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Add keyboard navigation
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any modals or go back
            const activePage = document.querySelector('.page.active');
            if (activePage && activePage.id !== 'homePage') {
                showPage('home');
            }
        }
    });
}