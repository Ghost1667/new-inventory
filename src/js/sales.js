// sales.js
import Store from "./store.js";


class SalesUI {
  constructor() {
    this.salesApp = document.querySelector(".sales-app"); // container in HTML
  }

  setApp() {
    if (!this.salesApp) return;

    this.salesApp.innerHTML = `
      <h2>Sales</h2>
      <form id="salesForm">
        <label>Product</label>
        <select id="salesProduct"></select>

        <label>Quantity</label>
        <input type="number" id="salesQty" min="1" value="1"/>

        <button type="submit">Sell</button>
      </form>

      <div id="salesMessage"></div>
      <div id="salesHistory"></div>
    `;

    this.populateProducts();
    this.addFormListener();
    this.renderSalesHistory();
  }

  populateProducts() {
    const products = Store.getProducts();
    const select = this.salesApp.querySelector("#salesProduct");
    select.innerHTML = "";
    products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.title} (Stock: ${p.quantity})`;
      select.appendChild(opt);
    });
  }

  addFormListener() {
    const form = this.salesApp.querySelector("#salesForm");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const productId = this.salesApp.querySelector("#salesProduct").value;
      const qty = parseInt(this.salesApp.querySelector("#salesQty").value, 10);
      const msg = this.salesApp.querySelector("#salesMessage");

      try {
        const sale = Store.sellProduct(productId, qty);
        msg.textContent = `✅ Sold ${qty} of ${sale.title}`;
        msg.style.color = "green";
        this.populateProducts();
        this.renderSalesHistory();
      } catch (error) {
        msg.textContent = error.message;
        msg.style.color = "red";
      }
    });
  }

  renderSalesHistory() {
    const sales = Store.getSales();
    const history = this.salesApp.querySelector("#salesHistory");

    if (!sales.length) {
      history.innerHTML = "<p>No sales yet.</p>";
      return;
    }

    history.innerHTML = `
      <h3>Sales History</h3>
      <ul>
        ${sales
          .map(
            s =>
              `<li>${s.date}: Sold ${s.qty} of ${s.title} </li>`
          )
          .join("")}
      </ul>
    `;
  }
}

export default new SalesUI();
