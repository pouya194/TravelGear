let urlParams = new URLSearchParams(window.location.search);

console.log("URL:", window.location.href);
console.log("ID from URL:", urlParams.get("id"));

let orderId = Number(urlParams.get("id"));

console.log("URL:", window.location.href);
console.log("ID from URL:", urlParams.get("id"));

let orders = JSON.parse(localStorage.getItem("orders")) || [];
console.log("orderId:", orderId);
console.log("orders:", orders);
console.log(
  "stored IDs:",
  orders.map((order) => order.id),
);
let selectedOrder = orders.find(function (order) {
  return Number(order.id) === orderId;
});

console.log(selectedOrder);
let detailsContainer = document.querySelector("#order-details-container");

if (!selectedOrder) {
  detailsContainer.innerHTML = `
    <div class="empty-orders">
      <p>سفارش موردنظر پیدا نشد.</p>
      <a href="orders.html">بازگشت به سفارش‌ها</a>
    </div>
  `;
}
detailsContainer.innerHTML = `
<div class="order-details-header">
<button class="print-order" onclick="window.print()">
  چاپ سفارش
</button>
  <h2>سفارش شماره ${selectedOrder.id}</h2>
  <span>${selectedOrder.status || "در انتظار بررسی"}</span>
</div>
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
