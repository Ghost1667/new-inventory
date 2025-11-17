// PASTE THIS INTO: src/js/auth.js
// AND ADD YOUR FIREBASE KEYS

import { initializeApp } from "./app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC2yjCzfLrZV25GsXxSmmEklvxRYCuXBSk",
  authDomain: "ukens-inventory.firebaseapp.com",
  projectId: "ukens-inventory",
  storageBucket: "ukens-inventory.firebasestorage.app",
  messagingSenderId: "219617769752",
  appId: "1:219617769752:web:67b758869e9cb423f7066d",
  measurementId: "G-2ZGFH9G28D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const loginScreen = document.getElementById("login-screen");
const appContainer = document.querySelector(".app.container");
const loginButton = document.getElementById("google-login-btn");
const logoutButtonMobile = document.getElementById("logout-btn-mobile");
const logoutButtonDesktop = document.getElementById("logout-btn-desktop");

let appHasInitialized = false;

loginButton.addEventListener("click", () => {
  auth.signInWithPopup(provider)
    .then((result) => { /* Success is handled by onAuthStateChanged */ })
    .catch((error) => {
      console.error("Google Sign-in Error:", error.message);
      if (error.code === 'auth/operation-not-allowed') {
        alert("Error: Google Sign-in is not enabled in the Firebase console. Please go to Authentication > Sign-in method > Google and enable it.");
      } else if (error.code === 'auth/popup-blocked-by-browser') {
         alert("Pop-up blocked! Please allow pop-ups for this site to sign in.");
      } else {
        alert("Sign-in failed: " + error.message);
      }
    });
});

function logout() {
  auth.signOut();
}
logoutButtonMobile.addEventListener("click", logout);
logoutButtonDesktop.addEventListener("click", logout);

auth.onAuthStateChanged((user) => {
  if (user) {
    loginScreen.classList.add("--hidden");
    appContainer.classList.remove("--hidden");
    if (!appHasInitialized) {
      initializeApp();
      appHasInitialized = true;
    }
  } else {
    loginScreen.classList.remove("--hidden");
    appContainer.classList.add("--hidden");
    appHasInitialized = false;
  }
});