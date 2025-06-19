import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

sendButton.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (msg === "") return;

  push(ref(db, "messages"), {
    user: currentUserEmail,
    text: msg,
    timestamp: Date.now()
  });

  messageInput.value = "";
});

onChildAdded(ref(db, "messages"), (data) => {
  const msg = data.val();
  const div = document.createElement("div");
  div.textContent = `${msg.user}: ${msg.text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

signupButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Kayıt başarılı"))
    .catch((error) => alert(error.message));
});

loginButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Giriş başarılı"))
    .catch((error) => alert(error.message));
});

logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => alert("Çıkış yapıldı"));
});
