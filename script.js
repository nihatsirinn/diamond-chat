import {
  auth,
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "./firebase.js";

const provider = new GoogleAuthProvider();

const userInfoDiv = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const authSection = document.getElementById("auth-section");
const emailForm = document.getElementById("email-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

const googleSignInBtn = document.getElementById("google-signin-btn");

const phoneForm = document.getElementById("phone-form");
const phoneNumberInput = document.getElementById("phone-number");
const phoneSendCodeBtn = document.getElementById("phone-send-code-btn");
const phoneCodeForm = document.getElementById("phone-code-form");
const phoneCodeInput = document.getElementById("phone-code");
const phoneVerifyCodeBtn = document.getElementById("phone-verify-code-btn");

let currentUser = null;
let confirmationResult = null;

function renderMessage(doc) {
  const data = doc.data();
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  const userSpan = document.createElement("span");
  userSpan.classList.add("username");
  userSpan.textContent = data.userEmail || "Unknown";

  const textSpan = document.createElement("span");
  textSpan.textContent = ": " + data.text;

  msgDiv.appendChild(userSpan);
  msgDiv.appendChild(textSpan);

  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearMessages() {
  messagesDiv.innerHTML = "";
}

function setupAuthListener() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      userInfoDiv.textContent = "Logged in as: " + (user.email || user.phoneNumber);
      logoutBtn.style.display = "inline-block";
      authSection.style.display = "none";
      loadMessages();
    } else {
      currentUser = null;
      userInfoDiv.textContent = "";
      logoutBtn.style.display = "none";
      authSection.style.display = "block";
      clearMessages();
    }
  });
}

async function loadMessages() {
  clearMessages();
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        renderMessage(change.doc);
      }
    });
  });
}

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !currentUser) return;
  await addDoc(collection(db, "messages"), {
    text,
    userId: currentUser.uid,
    userEmail: currentUser.email || currentUser.phoneNumber,
    createdAt: serverTimestamp()
  });
  messageInput.value = "";
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    alert("Email and password required");
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert("Login error: " + err.message);
  }
});

registerBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    alert("Email and password required");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert("Register error: " + err.message);
  }
});

googleSignInBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    alert("Google sign-in error: " + err.message);
  }
});

window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible',
  'callback': (response) => {}
}, auth);

phoneSendCodeBtn.addEventListener("click", async () => {
  const phoneNumber = phoneNumberInput.value.trim();
  if (!phoneNumber) {
    alert("Phone number required");
    return;
  }
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    alert("Code sent!");
    phoneCodeForm.style.display = "block";
    phoneForm.style.display = "none";
  } catch (err) {
    alert("Send code error: " + err.message);
  }
});

phoneVerifyCodeBtn.addEventListener("click", async () => {
  const code = phoneCodeInput.value.trim();
  if (!code) {
    alert("Verification code required");
    return;
  }
  try {
    await confirmationResult.confirm(code);
  } catch (err) {
    alert("Code verification error: " + err.message);
  }
});

setupAuthListener();
