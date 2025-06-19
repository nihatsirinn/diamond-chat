import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const signupButton = document.getElementById("signup");
const logoutButton = document.getElementById("logout");

let currentUserEmail = "Misafir";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
  } else {
    currentUserEmail = "Misafir";
  }
});

sendButton.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    user: currentUserEmail,
    text,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
});

const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

onSnapshot(q, (querySnapshot) => {
  chatBox.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const msg = doc.data();
    const div = document.createElement("div");
    const time = msg.createdAt?.toDate().toLocaleTimeString() || "";
    div.textContent = `[${time}] ${msg.user}: ${msg.text}`;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

signupButton.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Email ve şifre gerekli");
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Kayıt başarılı"))
    .catch(e => alert(e.message));
});

loginButton.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Email ve şifre gerekli");
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Giriş başarılı"))
    .catch(e => alert(e.message));
});

logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => alert("Çıkış yapıldı"));
});
