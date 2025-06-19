import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCu4KtTBI-pEH2a9AzhKN1pKfd9u6YtkNs",
  authDomain: "diamond-chat-7c95d.firebaseapp.com",
  projectId: "diamond-chat-7c95d",
  storageBucket: "diamond-chat-7c95d.firebasestorage.app",
  messagingSenderId: "920115621429",
  appId: "1:920115621429:web:6aac8db7cb7a8b6d46cb7c",
  measurementId: "G-MJ1VY7741G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
