// PASTE THIS INTO: src/js/Dashboard.js

import Storage from "./API.js";

// This will hold the dashboard's own container
let dashboardContainer; 

class DashboardUi {
  constructor() {
    // Constructor is safe and empty
  }

  // ✅ This function runs AFTER login
  init() {
    // ✅ THE FIX: It now finds ITS OWN container, not ".main"
    dashboardContainer = document.querySelector(".dashboardUi");
  }

  setApp() {
    // Safety check
    if (!dashboardContainer) {
      console.error("DashboardUI container not found!");
      return;
    }
    
    // ✅ THE FIX:
    // It now sets the innerHTML of ".dashboardUi",
    // NOT ".main". This stops it from deleting your other pages.
    dashboardContainer.innerHTML = `
    <div class="dashboardUi__header">
        <h1>Overview</h1>
    </div>
    <div class="dashboardUi__main">
        <div class="dashboardUi__main__items">
            <img src="./assets/images/Cancel.svg" alt="Cancel Item" />
            <p class="dashboardUi__notAvailable">${this.calculateProducts()}</p>
            <p>Number of Producs</p>
        </div>
        <div class="dashboardUi__main__items">
            <img src="./assets/images/Quantity.svg" alt="quantity" />
            <p class="dashboardUi__quantity">${this.calculateQuantity()}</p>
            <p>Total Quantity</p>
        </div>
        <div class="dashboardUi__main__items">
            <img src="./assets/images/Sales.svg" alt="salesItem" />
            <p class="dashboardUi__sales">$${this.calculatePrice()}</p>
            <p>Total Value in Hand</p>
        </div>
        <div class="dashboardUi__main__items">
            <img src="./assets/images/Categoriescolor.svg" alt="category" />
            <p class="dashboardUi__notAvailable">${this.totalCategories()}</p>
            <p>Total Categories</p>
        </div>
    </div>`;
  }

  calculateQuantity() {
    const allProducts = Storage.getProducts();
    return allProducts
      .reduce((acc, product) => acc + product.quantity, 0)
      .toLocaleString();
  }

  calculatePrice() {
    const allProducts = Storage.getProducts();
    const totalPrice = allProducts.reduce(
      (acc, product) => acc + product.price, 0
    );
    return totalPrice.toLocaleString();
  }

  totalCategories() {
    const allCategories = Storage.getCategories();
    return allCategories.length.toLocaleString();
  }

  calculateProducts() {
    const allProducts = Storage.getProducts();
    return allProducts.length.toLocaleString();
  }
}

export default new DashboardUi();