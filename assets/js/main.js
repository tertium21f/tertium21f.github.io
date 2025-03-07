//=================================
// Products
//=================================

const products = [
    { id: 1, name: "iPhone", price: 20000, qty: 1, img: "./assets/image/thm_product1.png", badge: "new" },
    { id: 2, name: "AirPod Pro", price: 7000, qty: 1, img: "./assets/image/thm_product2.png", badge: "promotion" },
    { id: 3, name: "Home pod", price: 10000, qty: 1, img: "./assets/image/thm_product3.png", badge: "" },
    { id: 4, name: "Aurora Wireless", price: 2500, qty: 1, img: "./assets/image/thm_product4.png", badge: "" },
    { id: 5, name: "Apple Watch", price: 7500, qty: 1, img: "./assets/image/thm_product5.png", badge: "" },
    { id: 6, name: "iPad air", price: 18000, qty: 1, img: "./assets/image/thm_product6.png", badge: "" },
    { id: 7, name: "Air Tag", price: 18000, qty: 1, img: "./assets/image/thm_product7.png", badge: "" },
    { id: 8, name: "Airpod MAX", price: 18000, qty: 1, img: "./assets/image/thm_product8.png", badge: "" },
    { id: 9, name: "Airpod 3", price: 18000, qty: 1, img: "./assets/image/thm_product9.png", badge: "" },
    { id: 10, name: "iPad mini", price: 18000, qty: 1, img: "./assets/image/thm_product10.png", badge: "" },
];



//=================================
// Local Storage Management
//=================================

//ดึงข้อมูลcartจาก localStorage
function getCart() {
    let cart = localStorage.getItem('cart');
    if (cart) {
        return JSON.parse(cart);
    } else {
        return [];
    }
}

//เก็บข้อมูลcartลง localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

//อัพเดทจำนวนสินค้าในตะกร้า (บน navbar)
function updateCartCount() {
    let cart = getCart();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
//เพิ่มสินค้าไปยังตะกร้า
function addToCart(productId) {

    const productToAdd = products.find(prod => prod.id === productId);

    if (!productToAdd) {
        alert("Product not found!");
        return;
    }
    let cart = getCart();
    let existingProduct = cart.find(item => item.id === productToAdd.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            ...productToAdd,
            quantity: 1
        });
    }
    saveCart(cart);
    updateCartCount();
    showPopupNotification("Product added to cart!");
}

//ลบสินค้าออกจากตะกร้า
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCartItems();
}

// แก้ไขจำนวนสินค้าภายในตะกร้า
function updateCartItemQuantity(productId, newQty) {
    let cart = getCart(); // ดึงข้อมูลจาก localStorage
    let product = cart.find(item => item.id === productId); // ค้นหาสินค้าที่ตรงกับ productId

    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
    if (product) {
        // ตรวจสอบว่า newQty เป็นจำนวนที่ถูกต้อง (ไม่น้อยกว่า 1)
        if (newQty > 0) {
            product.quantity = newQty;
        } else {
            // ถ้าจำนวนใหม่เป็น 0 หรือไม่ถูกต้อง ให้ลบสินค้าออกจากตะกร้า
            cart = cart.filter(item => item.id !== productId);
        }
    }

    // บันทึกการเปลี่ยนแปลงกลับไปใน localStorage
    saveCart(cart);
    updateCartCount();
    renderCartItems(); // อัปเดตการแสดงผลตะกร้า
}



//=================================
// Rendering Functions
//=================================

//สร้าง navbar 
function renderNavbar(){
    const navBar = document.getElementById("nav-bar");
    if (!navBar) return;

    navBar.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-navbar">
        <div class="container">
            <a class="navbar-brand" href="index.html">MAN-GO!</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="products.html">Products</a></li>
                    <li class="nav-item"><a class="nav-link position-relative" href="cart.html">Cart <span
                                class="badge bg-primary" id="cart-count">0</span></a></li>
                </ul>
            </div>
        </div>
    </nav>
    `;
    
}



//สร้าง product card slide ที่หน้า index
function renderProductSlide() {
    const productSlide = document.getElementById("product-slide");
    productSlide.innerHTML = "";

    products.forEach(product => {
        // ตรวจสอบว่ามี badge หรือไม่
        const badgeHTML = product.badge
            ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">${product.badge}</span>`
            : '';

        const cardHTML = `
            <div class="col-md-3 mb-4">
            <!-- สร้าง card สำหรับแต่ละสินค้า -->
                <div class="card product-card border-0 rounded-4 shadow-sm position-relative">
                <!-- ส่วนเนื้อหาของ card -->
                    <div class="card-body text-center p-4">
                        ${badgeHTML} <!-- แทรก badge ถ้ามี -->
                        <!-- ส่วนรูปภาพของ card -->
                        <img src="${product.img}" alt="${product.name}" class="card-img-top rounded-4 mb-3">
                        <!-- ชื่อสินค้า-->
                        <h5 class="card-title mb-2">${product.name}</h5>
                        <!-- ราคาสินค้า -->
                        <p class="card-text text-muted mb-4">${product.price.toLocaleString('th-TH')} THB</p>
                        <button class="btn btn-primary rounded-pill w-75 py-2" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productSlide.innerHTML += cardHTML;
    });
}
//สร้าง product ที่หน้า products
function renderProductList() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card product-card border-0 rounded-4 shadow-sm d-flex flex-column">
                    <div class="position-relative">
                        <div class="overflow-hidden">
                            <img src="${product.img}" class="card-img-top" alt="${product.name}">
                        </div>
                    </div>
                    <div class="card-body p-4">
                        <h5 class="card-title mb-3 fw-bold">${product.name}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price">Price: ${product.price.toLocaleString('th-TH')} THB</span>
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

//สร้างสินค้าในหน้า cart
function renderCartItems() {
    const cart = getCart(); // ดึงข้อมูลตะกร้าจาก localStorage
    const cartItemsContainer = document.getElementById('cart-items');
    const cartGrandTotal = document.getElementById('cart-total'); // Total Display

    cartItemsContainer.innerHTML = '';
    let total = 0; // ราคารวมทั้งหมด

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal; // คำนวณราคารวม

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                    <div>
                        <p class="mb-0">${item.name}</p>
                    </div>
                </div>
            </td>
            <td>${item.price.toLocaleString('th-TH')} THB</td>
            <td>
               <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="form-control mx-2 text-center" style="width: 60px;" id="cart-qty" min="1" value="${item.quantity}" onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>${itemTotal.toLocaleString('th-TH')} THB</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">X</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    // แสดงยอดรวม Grand Total
    cartGrandTotal.textContent = total.toLocaleString('th-TH') + ' THB';
}

//สร้างรายการสรุปหน้า check out
function renderCheckoutItems() {
    let cart = getCart(); // ดึงข้อมูลตะกร้าจาก localStorage
    const checkoutItems = document.getElementById('checkout-items'); // หาจุดที่จะแสดงรายการสินค้า
    if (!checkoutItems) return; // ถ้าไม่มี element นี้ใน DOM ให้หยุดทำงาน
    checkoutItems.innerHTML = ''; // ล้างรายการเดิม

    let total = 0; // เก็บยอดรวมทั้งหมด

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        // สร้าง <li> สำหรับแต่ละสินค้า
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${item.name} (x${item.quantity}) <span>${itemTotal.toLocaleString('th-TH')} THB</span>`;
        checkoutItems.appendChild(li);
    });

    // ถ้าไม่มีสินค้าในตะกร้า
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<li class="text-center">Your cart is empty.</li>';
    }
    // แสดงยอดรวม
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutTotal) {
        checkoutTotal.textContent = 'Total: ' + total.toLocaleString('th-TH') + ' THB';
    }
}



//=================================
// Logical Function
//=================================

function addToCartWithCustomQuantity(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity!");
        return;
    }

    // หาจาก products
    const productToAdd = products.find(prod => prod.id === productId);
    if (!productToAdd) {
        alert("Product not found!");
        return;
    }

    let cart = getCart();
    let existingProduct = cart.find(item => item.id === productToAdd.id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            ...productToAdd,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCount();
}


function filterProducts() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const productCards = document.querySelectorAll("#product-list .card");

    productCards.forEach((card) => {
        const productName = card.querySelector(".card-title").textContent.toLowerCase();
        if (productName.includes(searchValue)) {
            card.parentElement.style.display = "block"; // Show product
        } else {
            card.parentElement.style.display = "none"; // Hide product
        }
    });
}

function showPopupNotification(message) {
    const popup = document.getElementById("popup-notification");
    popup.textContent = message; // กำหนดข้อความที่ต้องการแสดง
    popup.classList.remove("hidden");
    popup.classList.add("visible");

    // ซ่อน Popup หลังจาก 2 วินาที
    setTimeout(() => {
        popup.classList.remove("visible");
        popup.classList.add("hidden");
    }, 2000);
}


// ฟังก์ชันสำหรับยืนยันการสั่งซื้อ
function handleConfirmOrder(event) {
    event.preventDefault(); // ป้องกันการ reload หน้า

    // แสดง Popup
    const popup = document.createElement('div');
    popup.textContent = "Order Received";
    popup.className = 'order-popup';
    document.body.appendChild(popup);

    // แสดง Popup พร้อม Animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    // ซ่อน Popup หลัง 3 วินาที
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove(); // ลบ Popup ออกจาก DOM
            localStorage.clear(); // ล้าง localStorage
            window.location.href = "index.html";
        }, 500);
    }, 800);
}


//=================================
// Event Listeners
//=================================


document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
});

document.addEventListener('DOMContentLoaded', () => {
    renderProductSlide();
});

document.addEventListener('DOMContentLoaded', () => {
    renderProductList()
});

document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutItems();
});
