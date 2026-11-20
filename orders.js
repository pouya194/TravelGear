let ordersContainer = document.querySelector("#orders-container");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let statusFilter = document.querySelector("#status-filter");
let orderSearch = document.querySelector("#order-search");

function updateOrderStats() {
  let pendingOrders = orders.filter(function (order) {
    return (order.status || "در انتظار بررسی") === "در انتظار بررسی";
  }).length;

  let preparingOrders = orders.filter(function (order) {
    return order.status === "در حال آماده‌سازی";
  }).length;

  let shippedOrders = orders.filter(function (order) {
    return order.status === "ارسال‌شده";
  }).length;

  document.querySelector("#orders-count").textContent =
    orders.length.toLocaleString("fa-IR");

  document.querySelector("#all-orders-count").textContent =
    orders.length.toLocaleString("fa-IR");

  document.querySelector("#pending-orders-count").textContent =
    pendingOrders.toLocaleString("fa-IR");

  document.querySelector("#preparing-orders-count").textContent =
    preparingOrders.toLocaleString("fa-IR");

  document.querySelector("#shipped-orders-count").textContent =
    shippedOrders.toLocaleString("fa-IR");
}

function displayOrders(filteredOrders) {
  ordersContainer.innerHTML = "";

  if (filteredOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-orders">
        <p>سفارشی با این مشخصات پیدا نشد.</p>
      </div>
    `;
    return;
  }

  filteredOrders.forEach(function (order) {
    ordersContainer.innerHTML += `
      <div class="order-card">
        <h2>سفارش شماره ${order.id}</h2>

        <p class="order-status">
          وضعیت سفارش: ${order.status || "در انتظار بررسی"}
        </p>

        <select class="status-select" data-id="${order.id}">
          <option value="در انتظار بررسی" ${
            (order.status || "در انتظار بررسی") === "در انتظار بررسی"
              ? "selected"
              : ""
          }>در انتظار بررسی</option>

          <option value="در حال آماده‌سازی" ${
            order.status === "در حال آماده‌سازی" ? "selected" : ""
          }>در حال آماده‌سازی</option>

          <option value="ارسال‌شده" ${
            order.status === "ارسال‌شده" ? "selected" : ""
          }>ارسال‌شده</option>
        </select>

        <a href="order-details.html?id=${order.id}" class="view-order">
          مشاهده جزئیات
        </a>

        <button class="delete-order" data-id="${order.id}">
          حذف سفارش
        </button>

        <p>نام مشتری: ${order.customerName}</p>
        <p>شماره تماس: ${order.customerPhone}</p>
        <p>آدرس: ${order.customerAddress}</p>
        <p>تاریخ ثبت: ${order.date}</p>

        <h3>محصولات سفارش:</h3>

        <div class="order-items">
          ${order.items
            .map(function (item) {
              return `
              <p>
                ${item.name} × ${item.quantity}
                — ${(item.price * item.quantity).toLocaleString("fa-IR")} تومان
              </p>
            `;
            })
            .join("")}
        </div>

        <h3>
          مبلغ کل:
          ${order.total.toLocaleString("fa-IR")} تومان
        </h3>
      </div>
    `;
  });

  attachOrderEvents();
}

function deleteOrder(orderId) {
  let confirmDelete = confirm("آیا از حذف این سفارش مطمئن هستید؟");

  if (!confirmDelete) {
    return;
  }

  orders = orders.filter(function (order) {
    return Number(order.id) !== Number(orderId);
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  updateOrderStats();
  filterOrders();
}

function attachOrderEvents() {
  let deleteButtons = document.querySelectorAll(".delete-order");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      deleteOrder(button.dataset.id);
    });
  });

  let statusSelects = document.querySelectorAll(".status-select");

  statusSelects.forEach(function (select) {
    select.addEventListener("change", function () {
      let orderId = Number(select.dataset.id);
      let newStatus = select.value;

      orders = orders.map(function (order) {
        if (Number(order.id) === orderId) {
          order.status = newStatus;
        }

        return order;
      });

      localStorage.setItem("orders", JSON.stringify(orders));

      updateOrderStats();
      filterOrders();
    });
  });
}

function filterOrders() {
  let selectedStatus = statusFilter.value;
  let searchValue = orderSearch.value.trim().toLowerCase();

  let filteredOrders = orders.filter(function (order) {
    let matchesStatus =
      selectedStatus === "all" ||
      (order.status || "در انتظار بررسی") === selectedStatus;

    let matchesSearch =
      String(order.customerName || "")
        .toLowerCase()
        .includes(searchValue) || String(order.id).includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  displayOrders(filteredOrders);
}

updateOrderStats();
filterOrders();

statusFilter.addEventListener("change", filterOrders);
orderSearch.addEventListener("input", filterOrders);
