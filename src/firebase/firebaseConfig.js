// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYCPyZ2M5J29kHlffBj2EfnHi1sFVFcl0",
  authDomain: "fund-management-77c89.firebaseapp.com",
  projectId: "fund-management-77c89",
  storageBucket: "fund-management-77c89.appspot.com",  
  messagingSenderId: "964467705506",
  appId: "1:964467705506:web:cb91e300fac236b1d179fb",
  measurementId: "G-W6CDK5ZHHH"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✨ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
