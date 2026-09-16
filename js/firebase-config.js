import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAPjM5CznOecdSn0hr6shDk8kxCgOeoOU4",
  authDomain: "mbg---matematika-bergaya-game.firebaseapp.com",
  projectId: "mbg---matematika-bergaya-game",
  storageBucket: "mbg---matematika-bergaya-game.firebasestorage.app",
  messagingSenderId: "769729601354",
  appId: "1:769729601354:web:bf173eb23be6dd588c6bb3",
  measurementId: "G-9JFT74SRL3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app);

export {
  app,
  auth,
  googleProvider,
  db,
  signInWithPopup,
  onAuthStateChanged,
  signOut
};