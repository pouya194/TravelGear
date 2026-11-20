let urlParams = new URLSearchParams(window.location.search);

let orderId = Number(urlParams.get("id")) || null;

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let selectedOrder = orders.find(function (order) {
  return Number(order.id) === orderId;
});

let detailsContainer = document.querySelector("#order-details-container");

if (!selectedOrder) {
  detailsContainer.innerHTML = `
    <div class="empty-orders">
      <p>سفارش موردنظر پیدا نشد.</p>
      <a href="orders.html">بازگشت به سفارش‌ها</a>
    </div>
  `;
} else {
  detailsContainer.innerHTML = `
    <div class="order-details-header">
      <h2>سفارش شماره ${selectedOrder.id}</h2>
      <span>${selectedOrder.status || "در انتظار بررسی"}</span>
    </div>

    <button class="print-order" onclick="window.print()">
      چاپ سفارش
    </button>

    <div class="order-details-grid">

      <div class="order-card">
        <h2>اطلاعات مشتری</h2>
        <p>نام مشتری: ${selectedOrder.customerName}</p>
        <p>شماره تماس: ${selectedOrder.customerPhone}</p>
        <p>آدرس: ${selectedOrder.customerAddress}</p>
        <p>تاریخ ثبت: ${selectedOrder.date}</p>
        <p>وضعیت سفارش: ${selectedOrder.status || "در انتظار بررسی"}</p>
      </div>

      <div class="order-card">
        <h2>محصولات سفارش</h2>

        <div class="order-items">
          ${selectedOrder.items
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
          ${selectedOrder.total.toLocaleString("fa-IR")} تومان
        </h3>
      </div>

    </div>
  `;
}
