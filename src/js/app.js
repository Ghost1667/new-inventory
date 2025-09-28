import DashboardUi from "./Dashboard.js";
import InventoryUi from "./InventoryView.js";
import CategoryUi from "./categoryView.js";
import Store from "./store.js";
import SalesUi from "./sales.js";


// -------------------------- Sidebar Btns -----------------------------
const dashboardBtns = [...document.querySelectorAll(".sideBar__dashboard")];
const inventoryBtns = [...document.querySelectorAll(".sideBar__inventory")];
const categoryBtns = [...document.querySelectorAll(".sideBar__setting")];
const salesBtns = [...document.querySelectorAll(".sideBar__sales")]; // handles mobile + main if present

// --------------------------  Sidebar-Menu  ---------------------------------
const menuToggle = document.querySelector(".menu-toggle");
const sideBarOnToggle = document.querySelector(".sideBar-ontoggle");
const sideBarBackdrop = document.querySelector(".sideBar-ontoggle-backdrop");

// -------------------------- Search Bar -------------------------------------
const searchBar = document.querySelector(".searchBarInput");

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.addEventListeners();

  CategoryUi.updateCategoryOptions();
  DashboardUi.setApp(); // show dashboard by default

  SalesUi.setApp(); // prepare sales page (hidden by default)
 Store.setApp(); // prepare sales page (hidden by default)

});

class App {
  addEventListeners() {
    // Dashboard buttons (desktop + mobile)
    dashboardBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.dashboardBtnLogic(e);
        this.hideMenu();
      });
    });

    // Inventory buttons
    inventoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.inventoryBtnLogic(e);
        this.hideMenu();
      });
    });

    // Category buttons
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.categoryBtnLogic(e);
        this.hideMenu();
      });
    });

    // Sales buttons (desktop + mobile)
    salesBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.salesBtnLogic(e);
        this.hideMenu();
        SalesUi.setApp();



        
      });
    });

    // Menu toggle (mobile)
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        this.menuToggleLogic();
      });
    }

    if (sideBarBackdrop) {
      sideBarBackdrop.addEventListener("click", () => {
        this.hideMenu();
      });
    }

    if (searchBar) {
      searchBar.addEventListener("input", () => {
        this.searchInputLogic();
        this.hideMenu();
        inventoryBtns.forEach((btn) => btn.classList.add("--selectedBtnUi"));
      });
    }
  }

  // Search behaviour -> show inventory and filter
  searchInputLogic() {
    InventoryUi.setApp();
    InventoryUi.seachLogic(searchBar.value);
    this.removeCurrentSelectedBtn();
  }

  dashboardBtnLogic(event) {
    DashboardUi.setApp();
    searchBar.value = "";
    this.removeCurrentSelectedBtn();
    // use event.currentTarget so the wrapper div is selected even if svg/p was clicked
    if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
  }

  inventoryBtnLogic(event) {
    InventoryUi.setApp();
    searchBar.value = "";
    this.removeCurrentSelectedBtn();
    if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
  }

  categoryBtnLogic(event) {
    CategoryUi.setApp();
    searchBar.value = "";
    this.removeCurrentSelectedBtn();
    if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
  }

  // New: show the sales page only
  salesBtnLogic(event) {
    // hide other UI modules (some modules like DashboardUi.setApp may also manipulate DOM)
    this.removeCurrentSelectedBtn();
    if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");

    // Hide built-in UIs (these selectors should match your HTML structure)
    const dashboardUi = document.querySelector(".dashboardUi");
    const inventoryApp = document.querySelector(".inventory-app");
    const categoriesUi = document.querySelector(".categoryUi");
    const salesApp = document.querySelector(".sales-app");

    if (dashboardUi) dashboardUi.classList.add("--hidden");
    if (inventoryApp) inventoryApp.classList.add("--hidden");
    if (categoriesUi) categoriesUi.classList.add("--hidden");
    if (salesApp) salesApp.classList.remove("--hidden");
  }

  menuToggleLogic() {
    sideBarOnToggle.classList.remove("--hidden");
    sideBarBackdrop.classList.remove("--hidden");
  }

  hideMenu() {
    if (sideBarOnToggle) sideBarOnToggle.classList.add("--hidden");
    if (sideBarBackdrop) sideBarBackdrop.classList.add("--hidden");
  }

  removeCurrentSelectedBtn() {
    // Remove selected class from all known sidebar buttons
    [dashboardBtns, inventoryBtns, categoryBtns, salesBtns].forEach((btns) => {
      btns.forEach((btn) => {
        btn.classList.remove("--selectedBtnUi");
      });
    });
  }
}



// Select all the sections
const sections = document.querySelectorAll(
  ".dashboardUi, .inventory-app, .categoryUi, .sales-app"
);

// Sidebar buttons
const dashboardBtn = document.querySelectorAll(".sideBar__dashboard");
const inventoryBtn = document.querySelectorAll(".sideBar__inventory");
const categoryBtn = document.querySelectorAll(".sideBar__setting");
const salesBtn = document.querySelectorAll(".sideBar__sales");

// Helper function to switch pages
function showSection(sectionClass) {
  sections.forEach(sec => sec.classList.add("--hidden")); // hide all
  const target = document.querySelector(sectionClass);
  if (target) target.classList.remove("--hidden"); // show only one
}

// Hook up buttons (works for both sidebars)
dashboardBtn.forEach(btn =>
  btn.addEventListener("click", () => showSection(".dashboardUi"))
);
inventoryBtn.forEach(btn =>
  btn.addEventListener("click", () => showSection(".inventory-app"))
);
categoryBtn.forEach(btn =>
  btn.addEventListener("click", () => showSection(".categoryUi"))
);
salesBtn.forEach(btn =>
  btn.addEventListener("click", () => showSection(".sales-app"))
);
