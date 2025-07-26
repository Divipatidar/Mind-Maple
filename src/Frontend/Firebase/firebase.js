import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyCfi12Tx77dLveM8SfkRqhVDHndzpO7Ak8",
  authDomain: "mindmaple-96dca.firebaseapp.com",
  projectId: "mindmaple-96dca",
  storageBucket: "mindmaple-96dca.appspot.com",
  messagingSenderId: "736746766553",
  appId: "1:736746766553:web:7c85ac2ee28ef7a1777ec8",
  measurementId: "G-N1RL0JYN6Q",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

async function LoginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Get Firebase ID token
    const firebaseToken = await user.getIdToken();

    const response = await axios.post(
      "https://backend-server-chi-nine.vercel.app/signupWithGoogle",
      { firebaseToken }  // ✅ Send Firebase token to backend
    );

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.token}`;
    }

    return { 
      credential: user, 
      token: response.data.token,
      auth: response.data.auth || response.data.data
    };
  } catch (error) {
    console.error("Google login error:", error.message);
    throw error;
  }
}

async function LoginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  // ✅ Get Firebase ID token
  const firebaseToken = await user.getIdToken();

  const response = await axios.post(
    "https://backend-server-chi-nine.vercel.app/login",
    { firebaseToken }  // ✅ Send Firebase token
  );

  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
  }

  return { 
    credential: user, 
    token: response.data.token,
    auth: response.data.auth || response.data.data
  };
}

async function SignupWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  const response = await axios.post(
    "https://backend-server-chi-nine.vercel.app/signup",
    { email, password }  // ✅ Send email and password for regular signup
  );

  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
  }

  return { 
    credential: user, 
    token: response.data.token,
    auth: response.data.auth || response.data.data
  };
}

export { LoginWithGoogle, LoginWithEmail, SignupWithEmail };