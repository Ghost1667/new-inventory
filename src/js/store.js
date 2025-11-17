// This is your complete, correct Store.js file
// The ONLY CHANGE is the Date/Time fix inside sellProduct
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
  // ✅ DATE/TIME FIX IS HERE
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
    this.saveProducts(products); 

    // Create sale record
    const sale = {
      productId: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      qty: quantity,
      total: product.price * quantity,
      date: new Date().toISOString(), // <-- ✅ CHANGED to toISOString()
      remarks: remarks 
    };

    Storage.saveSale(sale);
    return sale;
  }

  // ---- Low Stock ----
  getLowStockItems(threshold = 5) {
    const products = this.getProducts();
    return products.filter(p => p.quantity < threshold);
  }
}

export default new Store();