// PASTE THIS INTO Store.js

import Storage from "./API.js";

class Store {
  // ---- Products ----
  getProducts() {
    return Storage.getProducts();
  }

  saveProduct(product) {
    Storage.saveProduct(product);
  }

  deleteProduct(id) {
    Storage.deleteProduct(id);
  }

  saveProducts(products) {
    Storage.saveProducts(products);
  }

  // ---- Categories ----
  getCategories() {
    return Storage.getCategories();
  }

  saveCategory(category) {
    Storage.saveCategory(category);
  }

  deleteCategory(id) {
    Storage.deleteCategory(id);
  }

  // ---- Sales ----
  getSales() {
    return Storage.getSales();
  }

  //
  // ✅ THIS IS THE ONE, TRUE sellProduct FUNCTION
  //
  sellProduct(productId, quantity, remarks) {
    const products = this.getProducts();
    const product = products.find(p => p.id == productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be at least 1");
    }

    if (product.quantity < quantity) {
      throw new Error("Not enough stock available");
    }

    // Reduce stock
    product.quantity -= quantity;
    this.saveProducts(products); // This calls API.js

    // Create sale record
    const sale = {
      productId: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      qty: quantity,
      total: product.price * quantity,
      date: new Date().toLocaleString(),
      remarks: remarks // <-- THE REMARK IS NOW ADDED
    };

    // Save sale to storage
    Storage.saveSale(sale); // This calls API.js

    return sale;
  }

  // ---- Low Stock ----
  getLowStockItems(threshold = 5) {
    const products = this.getProducts();
    return products.filter(p => p.quantity < threshold);
  }
}

export default new Store();