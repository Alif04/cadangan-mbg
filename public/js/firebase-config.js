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
  apiKey: 'AIzaSyCLRj1-2ghoQgBHGKSSBcq3jag2m7sjamM',
  authDomain: 'mbg-matematika.firebaseapp.com',
  projectId: 'mbg-matematika',
  storageBucket: 'mbg-matematika.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890'
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