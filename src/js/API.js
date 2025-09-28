// API.js
class Storage {
  // --- Products ---
  getProducts() {
    const allData = JSON.parse(localStorage.getItem("InventoryProducts")) || [];
    this.sortArray(allData);
    return allData;
  }

  saveProducts(productsArray) {
    localStorage.setItem("InventoryProducts", JSON.stringify(productsArray));
  }

  getCategories() {
    const allData = JSON.parse(localStorage.getItem("Inventorycategories")) || [];
    this.sortArray(allData);
    return allData;
  }

  saveCategorie(data) {
    const allCategories = this.getCategories();
    if (data.id != 0) {
      const existed = allCategories.find((category) => category.id == data.id);
      existed.title = data.title;
      existed.description = data.description;
      existed.updated = new Date().toISOString();
    } else {
      const existed = allCategories.find(
        (category) => category.title.toLowerCase().trim() == data.title.toLowerCase().trim()
      );
      if (existed) {
        existed.title = data.title;
        existed.description = data.description;
        existed.updated = new Date().toISOString();
      } else {
        data.id = new Date().getTime();
        data.updated = new Date().toISOString();
        allCategories.push(data);
      }
    }
    localStorage.setItem("Inventorycategories", JSON.stringify(allCategories));
  }

  saveProduct(data) {
    const allProducts = this.getProducts();
    if (data.id != 0) {
      const existed = allProducts.find((product) => product.id == data.id);
      existed.title = data.title;
      existed.category = data.category;
      existed.quantity = data.quantity;
      existed.price = data.price;
      existed.updated = new Date().toISOString();
    } else {
      const existed = allProducts.find(
        (product) => product.title.toLowerCase().trim() == data.title.toLowerCase().trim()
      );
      if (existed) {
        existed.title = data.title;
        existed.category = data.category;
        existed.quantity = data.quantity;
        existed.price = data.price;
        existed.updated = new Date().toISOString();
      } else {
        data.id = new Date().getTime();
        data.updated = new Date().toISOString();
        allProducts.push(data);
      }
    }
    localStorage.setItem("InventoryProducts", JSON.stringify(allProducts));
  }

  sortArray(array) {
    array.sort((a, b) => (new Date(a.updated) < new Date(b.updated) ? 1 : -1));
  }

  deleteProduct(id) {
    const allProducts = this.getProducts();
    const filteredProducts = allProducts.filter((product) => product.id != id);
    localStorage.setItem("InventoryProducts", JSON.stringify(filteredProducts));
  }

  deleteCategory(id) {
    const allCategories = this.getCategories();
    const filteredProducts = allCategories.filter((category) => category.id != id);
    localStorage.setItem("Inventorycategories", JSON.stringify(filteredProducts));
  }

  // --- Sales: new methods ---
  getSales() {
    const allSales = JSON.parse(localStorage.getItem("InventorySales")) || [];
    this.sortArray(allSales);
    return allSales;
  }

  saveSale(sale) {
    const allSales = this.getSales();
    sale.id = sale.id || new Date().getTime();
    sale.updated = new Date().toISOString();
    allSales.push(sale);
    localStorage.setItem("InventorySales", JSON.stringify(allSales));
  }

  // ✅ NEW: Sell product (reduces stock + saves sale)
  sellProduct(productId, quantitySold) {
    const allProducts = this.getProducts();
    const product = allProducts.find((p) => p.id == productId);

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product.quantity < quantitySold) {
      return { success: false, message: "Not enough stock available" };
    }

    // Deduct stock
    product.quantity -= quantitySold;
    product.updated = new Date().toISOString();

    // Save updated products
    this.saveProducts(allProducts);

    // Save sale record
    const sale = {
      productId: product.id,
      title: product.title,
      quantity: quantitySold,
      price: product.price,
      total: product.price * quantitySold,
      date: new Date().toISOString(),
    };
    this.saveSale(sale);

    return { success: true, message: "Sale recorded successfully", sale };
  }
}

export default new Storage();
