import { initializeApp } from "/node_modules/firebase/app";
import { getFirestore } from "/node_modules/firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr0EK5ejK2JjsjQbIiuLwZlfk__MCXbaA",
  authDomain: "web-extensions-base.firebaseapp.com",
  projectId: "web-extensions-base",
  storageBucket: "web-extensions-base.appspot.com",
  messagingSenderId: "63727534028",
  appId: "1:63727534028:web:3a5eb852fc3692f9286769"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const firebaseSDK = initializeApp(firebaseConfig)
const db = getFirestore(firebaseSDK)


export { firebaseSDK, db}