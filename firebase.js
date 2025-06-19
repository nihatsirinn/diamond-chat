// Firebase App (the core Firebase SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// Firebase Auth SDK
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config - sizin paylaştığınız kodla
const firebaseConfig = {
  apiKey: "AIzaSyAvH-wCEt68B6LnSEo7zGE1AvztrNdE2lY",
  authDomain: "diamond-chat.firebaseapp.com",
  projectId: "diamond-chat",
  storageBucket: "diamond-chat.appspot.com",
  messagingSenderId: "1015801038466",
  appId: "1:1015801038466:web:bfa00912c77b987bc86bc1"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔐 Giriş fonksiyonları
export {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
