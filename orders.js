let ordersContainer = document.querySelector("#orders-container");

let orders = JSON.parse(localStorage.getItem("orders")) || [];
document.querySelector("#orders-count").textContent =
  orders.length.toLocaleString("fa-IR");
if (orders.length === 0) {
  ordersContainer.innerHTML = `
        <div class="empty-orders">
            <p>هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
            <a href="index.html">بازگشت به فروشگاه</a>
        </div>
    `;
} else {
  orders.forEach(function (order) {
    ordersContainer.innerHTML += `
            <div class="order-card">
                <h2>سفارش شماره ${order.id}</h2>
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
let deleteButtons = document.querySelectorAll(".delete-order");

deleteButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    let orderId = button.dataset.id;

    deleteOrder(orderId);
  });
});
