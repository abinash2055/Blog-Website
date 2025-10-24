import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "mern-blog-30d3f.firebaseapp.com",
  projectId: "mern-blog-30d3f",
  storageBucket: "mern-blog-30d3f.firebasestorage.app",
  messagingSenderId: "89268303301",
  appId: "1:89268303301:web:8d5743445a4e0038c287ac",
  measurementId: "G-0430TVB831",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
