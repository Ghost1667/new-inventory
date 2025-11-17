// PASTE THIS INTO: src/js/categoryView.js

import Storage from "./API.js";

let mainApp;
let categoryModal, categoryBack, cancelBtnEdit, categoryModTitle;
let editTitleInput, editDesInput;
let submitBtnEdit;
let categoryInput;

class CategoryUi {
  constructor() {
    this.id = 0;
  }

  // ✅ This function runs AFTER login
  init() {
    mainApp = document.querySelector(".main");
    categoryModal = document.querySelector(".EditCategorySection");
    categoryBack = document.querySelector(".EditCategorySection");
    cancelBtnEdit = document.querySelector(".cancelBtnEdit");
    categoryModTitle = document.querySelector(".EditCatMod__title");
    editTitleInput = document.querySelector("#editTitle");
    editDesInput = document.querySelector("#editDescription");
    submitBtnEdit = document.querySelector(".submitBtnEdit");
    categoryInput = document.querySelector("#categoryInput");

    cancelBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeCategoryModal();
    });
    categoryBack.addEventListener("click", (e) => {
      if (e.target.classList.contains("EditCategorySection"))
        this.closeCategoryModal();
    });
    submitBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.submitBtnLogic();
    });
  }

  setApp() {
    if (!mainApp) return; // safety check
    mainApp.innerHTML = `
    <div class="categoryUi">
        <div class="category__header">
            <h1>Categories</h1>
            <button class="addCategoryBtn">Add Category</button>
        </div>
        <div class="category__items"></div>
    </div>`;

    this.HTMLContainer = document.querySelector(".category__items");
    this.updateDOM();
    const addCategoryBtn = document.querySelector(".addCategoryBtn");
    addCategoryBtn.addEventListener("click", () => {
      categoryModTitle.textContent = "Add Category";
      this.openCategoryModal();
    });
  }

  openCategoryModal() {
    categoryModal.classList.remove("--hidden");
    this.clearInputs();
  }

  closeCategoryModal() {
    categoryModal.classList.add("--hidden");
    this.clearInputs();
    this.id = 0;
  }

  createHTML(category) {
    return `
     <div class="category__item">
        <div class="category__item__text">
            <h2 class="title">${category.title}</h2>
            <p class="description">${category.description}</p>
        </div>
        <div class="category__item__icons">
            <svg class="icon editCategoryIcon" data-id=${category.id}>
                <use xlink:href="./assets/images/sprite.svg#editIcon"></use>
            </svg>
            <img src="./assets/images/deleteIcon.svg" alt="delete Icon" class="deleteBtnCategory" data-id=${category.id} />
        </div>
    </div>`;
  }

  submitBtnLogic() {
    if (editDesInput.value == "" || editTitleInput.value == "") {
      alert("Please Enter all of the fields!");
      return -1;
    }
    if (this.id != 0) {
      const allCategories = Storage.getCategories();
      const otherCategories = allCategories.filter((c) => c.id != this.id);
      const existed = otherCategories.find(
        (c) => c.title.toLowerCase().trim() == editTitleInput.value.toLowerCase().trim()
      );
      if (existed) {
        alert("Category already Exist");
        return -1;
      }
    }
    Storage.saveCategorie({
      id: this.id,
      title: editTitleInput.value,
      description: editDesInput.value,
    });
    this.id = 0;
    this.updateDOM();
    this.closeCategoryModal();
  }

  updateDOM() {
    let result = "";
    const allCategories = Storage.getCategories();
    allCategories.forEach((category) => {
      result += this.createHTML(category);
    });
    if (this.HTMLContainer) {
      this.HTMLContainer.innerHTML = result;
    }
    this.updateCategoryOptions();
    const deleteBtns = document.querySelectorAll(".deleteBtnCategory");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.deleteCategory(id);
      });
    });
    const editBtns = document.querySelectorAll(".editCategoryIcon");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.editCategory(id);
      });
    });
  }

  clearInputs() {
    [editDesInput, editTitleInput].forEach((input) => {
      input.value = "";
    });
  }

  deleteCategory(id) {
    Storage.deleteCategory(id);
    this.updateDOM();
  }

  editCategory(id) {
    const allCategories = Storage.getCategories();
    const selectedCategory = allCategories.find((c) => c.id == id);
    this.id = id;
    categoryModTitle.textContent = "Edit Category";
    this.openCategoryModal();
    editTitleInput.value = selectedCategory.title;
    editDesInput.value = selectedGategory.description;
  }

  updateCategoryOptions() {
    let result = `<option value="">Select product category</option>
    <option value="no-cat">No Category</option>`;
    const allCategories = Storage.getCategories();
    allCategories.forEach((category) => {
      result += `<option value=${category.id}>${category.title}</option>`;
    });
    if (categoryInput) {
      categoryInput.innerHTML = result;
    }
  }
}

export default new CategoryUi();