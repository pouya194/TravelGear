let cartElement = document.querySelector("#cart-count");
let totalPriceElement = document.querySelector("#total-price");
let cartItemsElement = document.querySelector("#cart-items");

let searchInput = document.querySelector("#product-search");
let priceFilter = document.querySelector("#price-filter");
let sortPrice = document.querySelector("#sort-price");
let categoryFilter = document.querySelector("#category-filter");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let cartDrawer = document.querySelector(".cart-drawer");
let cartToggle = document.querySelector("#cart-toggle");
let cartOverlay = document.querySelector("#cart-overlay");
let closeCart = document.querySelector("#close-cart");

let cartCount = 0;
let totalPrice = 0;

// ترتیب اولیه محصولات برای بازگرداندن مرتب‌سازی پیش‌فرض
let originalProductOrder = Array.from(
  document.querySelectorAll(".product-card"),
);

// محاسبه مبلغ کل سبد خرید
function calculateCartTotal() {
  let totalPrice = 0;

  cart.forEach(function (item) {
    totalPrice += item.price * item.quantity;
  });

  return totalPrice;
}

// محاسبه تعداد محصولات سبد خرید
function calculateCartCount() {
  return cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

// نمایش محصولات داخل سبد خرید
function displayCartItems() {
  cartItemsElement.innerHTML = "";

  if (cart.length === 0) {
    cartItemsElement.innerHTML = `
      <div class="empty-cart">
        <p>سبد خرید شما هنوز خالی است!</p>
        <span>محصول مورد علاقه‌ات رو انتخاب کن.</span>
      </div>
    `;
    return;
  }

  cart.forEach(function (item) {
    cartItemsElement.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="cart-item-info">
          <span>${item.name}</span>

          <span>
            ${(item.price * item.quantity).toLocaleString("fa-IR")} تومان
          </span>

          <div class="quantity-controls">
            <button class="increase-quantity" data-name="${item.name}">
              +
            </button>

            <span>${item.quantity}</span>

            <button class="decrease-quantity" data-name="${item.name}">
              −
            </button>
          </div>
        </div>

        <button class="remove-from-cart" data-name="${item.name}">
          حذف
        </button>
      </div>
    `;
  });

  setupRemoveButtons();
  setupIncreaseButtons();
  setupDecreaseButtons();
}

// به‌روزرسانی اطلاعات سبد خرید
function updateCartUI() {
  cartCount = calculateCartCount();
  totalPrice = calculateCartTotal();

  cartElement.textContent = cartCount.toLocaleString("fa-IR");

  totalPriceElement.textContent = totalPrice.toLocaleString("fa-IR");

  displayCartItems();
}

// افزودن محصول به سبد خرید
let addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    let productName = button.dataset.name;
    let productPrice = Number(button.dataset.price);

    let productImage = button.closest(".product-card").querySelector("img").src;

    let existingProduct = cart.find(function (item) {
      return item.name === productName;
    });

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartUI();
  });
});

// حذف محصول از سبد خرید
function removeFromCart(productName) {
  cart = cart.filter(function (item) {
    return item.name !== productName;
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI();
}

function setupRemoveButtons() {
  let removeButtons = document.querySelectorAll(".remove-from-cart");

  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      removeFromCart(button.dataset.name);
    });
  });
}

// افزایش تعداد محصول
function increaseQuantity(productName) {
  let existingProduct = cart.find(function (item) {
    return item.name === productName;
  });

  if (existingProduct) {
    existingProduct.quantity++;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI();
}

function setupIncreaseButtons() {
  let increaseButtons = document.querySelectorAll(".increase-quantity");

  increaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      increaseQuantity(button.dataset.name);
    });
  });
}

// کاهش تعداد محصول
function decreaseQuantity(productName) {
  let existingProduct = cart.find(function (item) {
    return item.name === productName;
  });

  if (existingProduct) {
    existingProduct.quantity--;

    if (existingProduct.quantity <= 0) {
      cart = cart.filter(function (item) {
        return item.name !== productName;
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI();
}

function setupDecreaseButtons() {
  let decreaseButtons = document.querySelectorAll(".decrease-quantity");

  decreaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      decreaseQuantity(button.dataset.name);
    });
  });
}

// باز کردن سبد خرید
cartToggle.addEventListener("click", function () {
  cartOverlay.classList.add("active");
  cartDrawer.classList.add("active");

  document.body.style.overflow = "hidden";
});

// بستن سبد خرید
function closeCartDrawer() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");

  document.body.style.overflow = "auto";
}

closeCart.addEventListener("click", closeCartDrawer);

cartOverlay.addEventListener("click", function (event) {
  if (event.target === cartOverlay) {
    closeCartDrawer();
  }
});

// دکمه تسویه حساب
let checkoutButton = document.querySelector("#checkout-button");
let checkoutOverlay = document.querySelector("#checkout-overlay");

checkoutButton.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("سبد خرید شما خالی است!");
    return;
  }

  closeCartDrawer();

  displayOrderSummary();

  checkoutOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

// نمایش خلاصه سفارش
function displayOrderSummary() {
  let summaryItems = document.querySelector("#order-summary-items");
  let summaryTotal = document.querySelector("#order-summary-total");

  if (cart.length === 0) {
    summaryItems.innerHTML = "<p>سفارشی در سبد خرید وجود ندارد.</p>";
    summaryTotal.textContent = "۰ تومان";
    return;
  }

  summaryItems.innerHTML = "";

  cart.forEach(function (item) {
    summaryItems.innerHTML += `
      <div class="summary-item">
        <span>${item.name} × ${item.quantity}</span>

        <span>
          ${(item.price * item.quantity).toLocaleString("fa-IR")} تومان
        </span>
      </div>
    `;
  });

  summaryTotal.textContent =
    calculateCartTotal().toLocaleString("fa-IR") + " تومان";
}

// ثبت سفارش
let orderForm = document.querySelector("#order-form");

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let customerName = document.querySelector("#customer-name").value.trim();

  let customerPhone = document.querySelector("#customer-phone").value.trim();

  let customerAddress = document
    .querySelector("#customer-address")
    .value.trim();

  let phonePattern = /^09\d{9}$/;

  if (!customerName || !customerPhone || !customerAddress) {
    alert("لطفاً تمام اطلاعات را وارد کنید.");
    return;
  }

  if (!phonePattern.test(customerPhone)) {
    alert("شماره موبایل باید با 09 شروع شود و 11 رقم باشد.");
    return;
  }

  let newOrder = {
    id: Date.now(),
    customerName: customerName,
    customerPhone: customerPhone,
    customerAddress: customerAddress,
    items: [...cart],
    total: calculateCartTotal(),
    date: new Date().toLocaleString("fa-IR"),
    status: "در انتظار بررسی",
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push(newOrder);

  localStorage.setItem("orders", JSON.stringify(orders));

  // خالی کردن سبد خرید
  cart = [];

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI();

  // نمایش پیام موفقیت
  let successMessage = document.querySelector("#success-message");

  successMessage.classList.add("show");

  setTimeout(function () {
    successMessage.classList.remove("show");
  }, 3000);

  orderForm.reset();

  checkoutOverlay.classList.remove("active");

  document.body.style.overflow = "auto";
});

// فیلتر و جست‌وجوی محصولات
function filterProducts() {
  let searchValue = searchInput.value.trim().toLowerCase();
  let maxPrice = priceFilter.value;
  let selectedCategory = categoryFilter.value;

  let visibleProducts = 0;

  let visibleCards = originalProductOrder.filter(function (card) {
    let productName = card.querySelector("h3").textContent.toLowerCase();

    let productPrice = Number(card.querySelector(".add-to-cart").dataset.price);

    let matchesName = productName.includes(searchValue);

    let matchesPrice = maxPrice === "all" || productPrice < Number(maxPrice);

    let matchesCategory =
      selectedCategory === "all" || card.dataset.category === selectedCategory;

    let isVisible = matchesName && matchesPrice && matchesCategory;

    card.style.display = isVisible ? "" : "none";

    if (isVisible) {
      visibleProducts++;
    }

    return isVisible;
  });

  // مرتب‌سازی قیمت
  if (sortPrice.value === "low-to-high") {
    visibleCards.sort(function (a, b) {
      let priceA = Number(a.querySelector(".add-to-cart").dataset.price);
      let priceB = Number(b.querySelector(".add-to-cart").dataset.price);

      return priceA - priceB;
    });
  } else if (sortPrice.value === "high-to-low") {
    visibleCards.sort(function (a, b) {
      let priceA = Number(a.querySelector(".add-to-cart").dataset.price);
      let priceB = Number(b.querySelector(".add-to-cart").dataset.price);

      return priceB - priceA;
    });
  }

  let productsContainer = document.querySelector(".product-grid");

  visibleCards.forEach(function (card) {
    productsContainer.appendChild(card);
  });

  // نمایش تعداد محصولات
  let productsCount = document.querySelector("#products-count");

  productsCount.textContent =
    visibleProducts.toLocaleString("fa-IR") + " محصول پیدا شد";

  // پیام نبود محصول
  let noProducts = document.querySelector("#no-products");

  noProducts.style.display = visibleProducts === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filterProducts);
priceFilter.addEventListener("change", filterProducts);
sortPrice.addEventListener("change", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// بازنشانی فیلترها
let resetFiltersButton = document.querySelector("#reset-filters");

resetFiltersButton.addEventListener("click", function () {
  searchInput.value = "";
  priceFilter.value = "all";
  categoryFilter.value = "all";
  sortPrice.value = "default";

  filterProducts();
});

// اجرای اولیه
updateCartUI();
filterProducts();
