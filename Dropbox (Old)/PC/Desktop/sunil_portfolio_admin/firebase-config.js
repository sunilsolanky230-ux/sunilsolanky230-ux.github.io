// Firebase setup file
// Step 1: Create a Firebase project
// Step 2: Enable Authentication > Email/Password
// Step 3: Enable Firestore Database
// Step 4: Replace the placeholder values below with your Firebase web app config

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

export const ADMIN_EMAIL = "sunilsolanky230@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyBbo-pHSPVBrDPwdeUXrpuWWe2hlk1i-94",
  authDomain: "portfolio-admin-85cc1.firebaseapp.com",
  projectId: "portfolio-admin-85cc1",
  storageBucket: "portfolio-admin-85cc1.firebasestorage.app",
  messagingSenderId: "1016769971358",
  appId: "1:1016769971358:web:1080d199ef80bbdbae678f"
};

export const firebaseConfigured =
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes("PASTE_") &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes("PASTE_");

export const app = firebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
