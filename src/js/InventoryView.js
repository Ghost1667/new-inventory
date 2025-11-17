// PASTE THIS INTO: src/js/InventoryView.js

import Storage from "./API.js";

// Variables moved inside the class
let mainApp;
let addProModal, ProModalAddBtn, ProModalCancelBtn, ModalTitle;
let productNameInput, categoryInput, productQuantityInput, productPriceInput;
let searchBar;

class InventoryUi {
  constructor() {
    this.id = 0; // Setting a default id
  }

  // ✅ This function runs AFTER login
  init() {
    // All querySelectors are now safely here
    mainApp = document.querySelector(".main");
    addProModal = document.querySelector(".addProSection");
    ProModalAddBtn = document.querySelector(".addProModalSubmitBtn");
    ProModalCancelBtn = document.querySelector(".addProModalCancelBtn");
    ModalTitle = document.querySelector(".addProModal__title");
    productNameInput = document.querySelector(".productNameInput");
    categoryInput = document.querySelector("#categoryInput");
    productQuantityInput = document.querySelector(".productQuantityInput");
    productPriceInput = document.querySelector(".productPriceInput");
    searchBar = document.querySelector(".searchBarInput");

    // All event listeners are now safely here
    ProModalAddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.addProductModalLogic();
    });
    ProModalCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeProductModal();
    });
    addProModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("addProSection")) {
        this.closeProductModal(e);
      }
    });
  }

  setApp() {
    if (!mainApp) return; // safety check
    mainApp.innerHTML = `
    <div class="inventory-app">
        <div class="product-section__header">
        <h1>Products</h1>
        <div class="product-section__header__buttons">
            <button class="addProBtn">Add Product</button>
        </div>
        </div>
        <div class="product-section">
        <table class ="product-section-table">
        </table>
        </div>
    </div>`;

    const addProBtn = document.querySelector(".addProBtn");
    addProBtn.addEventListener("click", () => {
      ModalTitle.textContent = "New Product";
      ProModalAddBtn.textContent = "Add Product";
      this.openProductModal();
    });

    this.productSectionHTMl = document.querySelector(".product-section-table");
    this.updateDom(Storage.getProducts());
  }

  updateDom(allProducts) {
    let result = `
    <tr class="table__title">
        <td>Product</td> <td>Quantity</td> <td>Price</td> <td>Category</td> <td></td>
    </tr>`;
    allProducts.forEach((product) => {
      result += this.createProductHTML(product);
    });
    this.productSectionHTMl.innerHTML = result;

    const deleteBtns = document.querySelectorAll(".deleteIcon");
    deleteBtns.forEach((deleteBtn) =>
      deleteBtn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.deleteBtnLogic(id);
      })
    );
    const editBtns = document.querySelectorAll(".editIcon");
    editBtns.forEach((editBtn) =>
      editBtn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.editBtnLogic(id);
      })
    );
  }

  createProductHTML(prodcut) {
    return `
      <tr>
        <td>${prodcut.title}</td>
        <td>${prodcut.quantity}</td>
        <td>$${prodcut.price}</td>
        <td>${this.getCategoryName(prodcut.category)}</td>
        <td class="editTableSection">
            <div class="table__icons">
            <div class="editIcon" data-id=${prodcut.id}>
                <svg class="icon"><use xlink:href="./assets/images/sprite.svg#editIcon"></use></svg>
            </div>
            <div class="deleteIcon" data-id=${prodcut.id}>
                <img src="./assets/images/deleteIcon.svg" alt="deleteIcon" />
            </div>
            </div>
        </td>
    </tr>`;
  }

  getCategoryName(id) {
    const allCategories = Storage.getCategories();
    const existed = allCategories.find((category) => category.id == id);
    return existed ? existed.title : "No-Category";
  }

  openProductModal() {
    addProModal.classList.remove("--hidden");
    this.clearInputsField();
  }

  closeProductModal() {
    addProModal.classList.add("--hidden");
    this.clearInputsField();
    this.id = 0;
  }

  clearInputsField() {
    [
      productPriceInput,
      productQuantityInput,
      categoryInput,
      productNameInput,
    ].forEach((input) => (input.value = ""));
  }

  addProductModalLogic() {
    if (
      !productNameInput.value || !categoryInput.value ||
      !productQuantityInput.value || !productPriceInput.value
    ) {
      alert("Please enter all of the fields!");
      return -1;
    }
    if (
      Number(productPriceInput.value) < 0 ||
      Number(productQuantityInput.value) < 0
    ) {
      alert("Quantity and Price should be at least 0");
      return -1;
    }
    if (this.id != 0) {
      const allProducts = Storage.getProducts();
      const otherProducts = allProducts.filter((p) => p.id != this.id);
      const existed = otherProducts.find(
        (p) => p.title.toLowerCase().trim() == productNameInput.value.toLowerCase().trim()
      );
      if (existed) {
        alert("Product already Exist");
        return -1;
      }
    }
    Storage.saveProduct({
      id: this.id,
      title: productNameInput.value.trim(),
      category: categoryInput.value,
      quantity: Number(productQuantityInput.value),
      price: Number(productPriceInput.value),
    });
    this.id = 0;
    if (searchBar) searchBar.value = "";
    this.updateDom(Storage.getProducts());
    this.closeProductModal();
  }

  deleteBtnLogic(id) {
    Storage.deleteProduct(id);
    if (searchBar) searchBar.value = "";
    this.updateDom(Storage.getProducts());
  }

  editBtnLogic(id) {
    this.id = id;
    const allProducts = Storage.getProducts();
    const selectedProduct = allProducts.find((p) => p.id == id);
    this.openProductModal();
    ModalTitle.textContent = "Edit Product";
    ProModalAddBtn.textContent = "Submit Edit";
    productNameInput.value = selectedProduct.title;
    categoryInput.value = selectedProduct.category;
    productQuantityInput.value = selectedProduct.quantity;
    productPriceInput.value = selectedProduct.price;
  }

  seachLogic(inputValue) {
    const targetValue = inputValue.toLowerCase().trim();
    const allProducts = Storage.getProducts();
    const filteredItem = allProducts.filter((p) =>
      p.title.toLowerCase().trim().includes(targetValue)
    );
    this.updateDom(filteredItem);
  }
}

export default new InventoryUi();