import {initializeApp} from "firebase/app";
import {browserLocalPersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { initializeAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyD9CG8PwE7tTL1K2quoSJbURw-tIe0c8rI",

  authDomain: "hci-project-80294.firebaseapp.com",

  databaseURL: "https://hci-project-80294-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "hci-project-80294",

  storageBucket: "hci-project-80294.firebasestorage.app",

  messagingSenderId: "1057357218075",

  appId: "1:1057357218075:web:ce23c7b6a01c93152653be",

  measurementId: "G-EJR407L0EZ"

};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence,
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);