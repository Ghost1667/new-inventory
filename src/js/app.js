// PASTE THIS INTO: src/js/app.js

import DashboardUi from "./Dashboard.js";
import InventoryUi from "./InventoryView.js";
import CategoryUi from "./categoryView.js";
import Store from "./store.js";
import SalesUi from "./sales.js";

export function initializeApp() {
  console.log("App is initializing...");

  //
  //  ✅✅✅ THIS IS THE FIX ✅✅✅
  //  The entire 'class App' definition is now at the TOP,
  //  before it is used. This fixes the 'Cannot access App' error.
  //
  class App {
    addEventListeners() {
      dashboardBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.dashboardBtnLogic(e);
          this.hideMenu();
        });
      });
      inventoryBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.inventoryBtnLogic(e);
          this.hideMenu();
        });
      });
      categoryBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.categoryBtnLogic(e);
          this.hideMenu();
        });
      });
      salesBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.salesBtnLogic(e);
          this.hideMenu();
        });
      });

      if (menuToggle) {
        menuToggle.addEventListener("click", () => this.menuToggleLogic());
      }
      if (sideBarBackdrop) {
        sideBarBackdrop.addEventListener("click", () => this.hideMenu());
      }
      if (searchBar) {
        searchBar.addEventListener("input", () => {
          this.searchInputLogic();
          this.hideMenu();
        });
      }
    }

    // NEW, SIMPLER page switching function
    showSection(sectionName) {
      // Hide all sections
      Object.values(sections).forEach(section => {
        if (section) section.classList.add("--hidden");
      });
      
      // Show the one we want
      if (sections[sectionName]) {
        sections[sectionName].classList.remove("--hidden");
      }
    }

    searchInputLogic() {
      this.showSection("inventory");
      InventoryUi.setApp(); 
      InventoryUi.seachLogic(searchBar.value);
      this.removeCurrentSelectedBtn();
      const invBtns = document.querySelectorAll(".sideBar__inventory");
      invBtns.forEach((btn) => btn.classList.add("--selectedBtnUi"));
    }

    dashboardBtnLogic(event) {
      this.removeCurrentSelectedBtn();
      if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
      this.showSection("dashboard");
      DashboardUi.setApp();
      if(searchBar) searchBar.value = "";
    }

    inventoryBtnLogic(event) {
      this.removeCurrentSelectedBtn();
      if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
      this.showSection("inventory");
      InventoryUi.setApp();
      if(searchBar) searchBar.value = "";
    }

    categoryBtnLogic(event) {
      this.removeCurrentSelectedBtn();
      if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
      this.showSection("category");
      CategoryUi.setApp();
      if(searchBar) searchBar.value = "";
    }

    salesBtnLogic(event) {
      this.removeCurrentSelectedBtn();
      if (event.currentTarget) event.currentTarget.classList.add("--selectedBtnUi");
      this.showSection("sales");
      SalesUi.setApp();
    }

    menuToggleLogic() {
      if (sideBarOnToggle) sideBarOnToggle.classList.remove("--hidden");
      if (sideBarBackdrop) sideBarBackdrop.classList.remove("--hidden");
    }

    hideMenu() {
      if (sideBarOnToggle) sideBarOnToggle.classList.add("--hidden");
      if (sideBarBackdrop) sideBarBackdrop.classList.add("--hidden");
    }

    removeCurrentSelectedBtn() {
      const allBtns = document.querySelectorAll(".sideBar__dashboard, .sideBar__inventory, .sideBar__setting, .sideBar__sales");
      allBtns.forEach((btn) => {
        btn.classList.remove("--selectedBtnUi");
      });
    }
  }
  // --- END OF CLASS DEFINITION ---


  // --- Now we can safely initialize everything ---

  InventoryUi.init(); 
  DashboardUi.init();
  CategoryUi.init();
  SalesUi.init();
  
  // Get all elements
  const dashboardBtns = [...document.querySelectorAll(".sideBar__dashboard")];
  const inventoryBtns = [...document.querySelectorAll(".sideBar__inventory")];
  const categoryBtns = [...document.querySelectorAll(".sideBar__setting")];
  const salesBtns = [...document.querySelectorAll(".sideBar__sales")];

  const menuToggle = document.querySelector(".menu-toggle");
  const sideBarOnToggle = document.querySelector(".sideBar-ontoggle");
  const sideBarBackdrop = document.querySelector(".sideBar-ontoggle-backdrop");

  const searchBar = document.querySelector(".searchBarInput");
  
  const sections = {
    dashboard: document.querySelector(".dashboardUi"),
    inventory: document.querySelector(".inventory-app"),
    category: document.querySelector(".categoryUi"),
    sales: document.querySelector(".sales-app")
  };

  // ✅ NOW this line is safe
  const app = new App();
  app.addEventListeners();

  CategoryUi.updateCategoryOptions();
  
  // Show the dashboard by default when the app loads
  app.showSection("dashboard");
  DashboardUi.setApp(); 
}