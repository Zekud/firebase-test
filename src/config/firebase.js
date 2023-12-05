import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBcq1CUNqopoDW4-tie5Dyb5BpDvEDk2Ho",
  authDomain: "fir-test-f2da6.firebaseapp.com",
  projectId: "fir-test-f2da6",
  storageBucket: "fir-test-f2da6.appspot.com",
  messagingSenderId: "877114379843",
  appId: "1:877114379843:web:7dae4a1ac1fd82ab3a4ef6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const gooleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
