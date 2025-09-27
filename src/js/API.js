class Storage {
  getProducts() {
    // Getting all of the products
    const allData = JSON.parse(localStorage.getItem("InventoryProducts")) || [];
    this.sortArray(allData); // Sorting the Products (newest first by default)
    return allData;
  }

  getCategories() {
    // Getting all of the categories
    const allData =
      JSON.parse(localStorage.getItem("Inventorycategories")) || [];

    this.sortArray(allData); // Sorting the Categories (newest first by default)
    return allData;
  }

  saveCategorie(data) {
    // Getting all of the categories
    const allCategories = this.getCategories();
    if (data.id != 0) {
      // Finding the category that already exists
      const existed = allCategories.find((category) => category.id == data.id);

      existed.title = data.title;
      existed.description = data.description;
      existed.updated = new Date().toISOString();
    } else {
      // Finding if the data already exist
      const existed = allCategories.find(
        (category) =>
          category.title.toLowerCase().trim() == data.title.toLowerCase().trim()
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
    // Getting all of the Data
    const allProducts = this.getProducts();
    if (data.id != 0) {
      const existed = allProducts.find((product) => product.id == data.id); // Finding the data that already exist

      existed.title = data.title;
      existed.category = data.category;
      existed.quantity = data.quantity;
      existed.price = data.price;
      existed.updated = new Date().toISOString();
    } else {
      // Finding if the data already exist
      const existed = allProducts.find(
        (product) =>
          product.title.toLowerCase().trim() == data.title.toLowerCase().trim()
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
    // Sorting array by newest
    array.sort((a, b) => (new Date(a.updated) < new Date(b.updated) ? 1 : -1));
  }

  deleteProduct(id) {
    // Getting all the Products
    const allProducts = this.getProducts();
    // Filtering the Products
    const filteredProducts = allProducts.filter((product) => product.id != id);
    // Update the Storage
    localStorage.setItem("InventoryProducts", JSON.stringify(filteredProducts));
  }

  deleteCategory(id) {
    // Getting all the Products
    const allCategories = this.getCategories();
    // Filtering the Products
    const filteredProducts = allCategories.filter(
      (category) => category.id != id
    );
    // Update the Storage
    localStorage.setItem(
      "Inventorycategories",
      JSON.stringify(filteredProducts)
    );
  }
}

export default new Storage();
