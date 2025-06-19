document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signup");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const googleBtn = document.getElementById("google");
  const sendBtn = document.getElementById("send");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageInput = document.getElementById("message-input");
  const messagesDiv = document.getElementById("messages");
  const chatSection = document.getElementById("chat-section");

  signupBtn.onclick = () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => console.log("Signed up:", user))
      .catch(error => alert(error.message));
  };

  loginBtn.onclick = () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => console.log("Logged in:", user))
      .catch(error => alert(error.message));
  };

  logoutBtn.onclick = () => {
    firebase.auth().signOut();
  };

  googleBtn.onclick = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  sendBtn.onclick = () => {
    const message = messageInput.value;
    const user = firebase.auth().currentUser;
    if (user && message.trim() !== "") {
      firebase.firestore().collection("messages").add({
        text: message,
        uid: user.uid,
        email: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      messageInput.value = "";
    }
  };

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      chatSection.style.display = "block";
      logoutBtn.style.display = "inline-block";
      firebase.firestore().collection("messages").orderBy("timestamp")
        .onSnapshot(snapshot => {
          messagesDiv.innerHTML = "";
          snapshot.forEach(doc => {
            const msg = doc.data();
            const div = document.createElement("div");
            div.textContent = `${msg.email}: ${msg.text}`;
            messagesDiv.appendChild(div);
          });
        });
    } else {
      chatSection.style.display = "none";
      logoutBtn.style.display = "none";
    }
  });
});
