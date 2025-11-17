// PASTE THIS INTO: src/js/sales.js

import Store from "./store.js";

// This variable will hold the sales container
let salesAppContainer;

class SalesUI {
  constructor() {
    // Constructor is safe and empty
  }

  // This runs after login
  init() {
    // ✅ THE FIX: It now finds ITS OWN container
    salesAppContainer = document.querySelector(".sales-app");
  }

  setApp() {
    // Safety check
    if (!salesAppContainer) {
      console.error("SalesUI container not found! Was it deleted by another module?");
      return;
    }
    
    // ✅ THE FIX:
    // It now sets the innerHTML of ".sales-app",
    // NOT ".main". This stops it from deleting your other pages.
    salesAppContainer.innerHTML = `
      <h2>Sales</h2>
      <form id="salesForm">
        <label>Product</label>
        <select id="salesProduct"></select>
        <label>Quantity</label>
        <input type="number" id="salesQty" min="1" value="1"/>
        <label>Remarks</label>
        <textarea id="salesRemarks" rows="3" placeholder="Add any notes..."></textarea>
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
    const select = salesAppContainer.querySelector("#salesProduct");
    if (!select) return;
    select.innerHTML = "";
    products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.title} (Stock: ${p.quantity})`;
      select.appendChild(opt);
    });
  }

  addFormListener() {
    const form = salesAppContainer.querySelector("#salesForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const productId = salesAppContainer.querySelector("#salesProduct").value;
      const qty = parseInt(salesAppContainer.querySelector("#salesQty").value, 10);
      const remarks = salesAppContainer.querySelector("#salesRemarks").value;
      const msg = salesAppContainer.querySelector("#salesMessage");
      try {
        const sale = Store.sellProduct(productId, qty, remarks); 
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
    const history = salesAppContainer.querySelector("#salesHistory");
    if (!history) return;
    if (!sales.length) {
      history.innerHTML = "<p>No sales yet.</p>";
      return;
    }
    history.innerHTML = `
      <h3>Sales History</h3>
      <ul>
        ${sales.map((s) => {
            const readableDate = new Date(s.date).toLocaleString();
            return `
              <li>
                ${readableDate}: Sold ${s.qty} of ${s.title}
                ${s.remarks ? `<p class="history-remark">Note: ${s.remarks}</p>` : ""}
              </li>`;
          }).join("")}
      </ul>
    `;
  }
}

export default new SalesUI();