import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
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
  measurementId: "G-N1RL0JYN6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
////const analytics = getAnalytics(app);

//console.log(analytics)
const provider = new GoogleAuthProvider();
const auth = getAuth();

async function LoginWithGoogle() {
  auth.languageCode = "it";

  try {
    const data = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(data);
  
    console.log(credential);
    const user = data.user;
    console.log(user);
    //  //from here we will send data to backend to store the email
    // const info = getAdditionalUserInfo(data).isNewUser; //If this is true we will send the mail along with uid of firebase and uuid of chat
    //  // If this is false we will just user the access token...
      const headers = {
        token: "Bearer " + user.accessToken,
      };
      console.log(headers);

      const signup = await axios.post(
        'https://mind-maple-xkvp.vercel.app'+'/signupWithGoogle',
        {},
        { headers, withCredentials: true }
      );
      console.log(signup.data)
  
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function LoginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const credential = result.user;
    console.log(credential);
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error so it can be caught in the calling function
  }
}

async function SignupWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const headers = {
      token: "Bearer " + user.accessToken,
    };
    console.log(headers);

    // One vulnerability here
    // If signup fails, you might want to handle it appropriately (e.g., show an error message to the user)
    await axios.post(
      'https://mind-maple-xkvp.vercel.app' + '/signup',
      {},
      {
        headers,
        withCredentials: true,
      }
    );
  } catch (error) {
    // Handle signup error (e.g., display an error message to the user)
    console.error(error);
    throw error; // Re-throw the error so it can be caught in the calling function
  }
}

  export { LoginWithGoogle, LoginWithEmail, SignupWithEmail };
  