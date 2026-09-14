import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBBjzJwuJMj5gBBcUX-ivn5eVxGjvDkLKs",
    authDomain: "ecoangelim.firebaseapp.com",
    projectId: "ecoangelim",
    storageBucket: "ecoangelim.firebasestorage.app",
    messagingSenderId: "733703935358",
    appId: "1:733703935358:web:a8482ec69b38c94ad34f2f",
    measurementId: "G-8116LKPCMJ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);