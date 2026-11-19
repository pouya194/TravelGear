let ordersContainer = document.querySelector("#orders-container");

let orders = JSON.parse(localStorage.getItem("orders")) || [];
let statusFilter = document.querySelector("#status-filter");
document.querySelector("#orders-count").textContent =
  orders.length.toLocaleString("fa-IR");
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

  document.querySelector("#all-orders-count").textContent =
    orders.length.toLocaleString("fa-IR");

  document.querySelector("#pending-orders-count").textContent =
    pendingOrders.toLocaleString("fa-IR");

  document.querySelector("#preparing-orders-count").textContent =
    preparingOrders.toLocaleString("fa-IR");

  document.querySelector("#shipped-orders-count").textContent =
    shippedOrders.toLocaleString("fa-IR");
}

updateOrderStats();
function displayOrders(filteredOrders) {
  ordersContainer.innerHTML = "";

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
}

if (orders.length === 0) {
  ordersContainer.innerHTML = `
    <div class="empty-orders">
      <p>هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
      <a href="index.html">بازگشت به فروشگاه</a>
    </div>
  `;
} else {
  displayOrders(orders);
}
attachOrderEvents();

function deleteOrder(orderId) {
  let confirmDelete = confirm("آیا از حذف این سفارش مطمئن هستید؟");

  if (confirmDelete) {
    orders = orders.filter(function (order) {
      return order.id !== Number(orderId);
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    location.reload();
  }
}
function attachOrderEvents() {
  let deleteButtons = document.querySelectorAll(".delete-order");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let orderId = button.dataset.id;

      deleteOrder(orderId);
    });
  });

  let statusSelects = document.querySelectorAll(".status-select");

  statusSelects.forEach(function (select) {
    select.addEventListener("change", function () {
      let orderId = Number(select.dataset.id);
      let newStatus = select.value;

      orders = orders.map(function (order) {
        if (order.id === orderId) {
          order.status = newStatus;
        }

        return order;
      });

      localStorage.setItem("orders", JSON.stringify(orders));

      location.reload();
    });
  });
}
statusFilter.addEventListener("change", function () {
  let selectedStatus = statusFilter.value;

  let filteredOrders;

  if (selectedStatus === "all") {
    filteredOrders = orders;
  } else {
    filteredOrders = orders.filter(function (order) {
      return (order.status || "در انتظار بررسی") === selectedStatus;
    });
  }

  displayOrders(filteredOrders);
});
