import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHYBoFRoywjumtTaONkuYRsMhAtAmyWEw",
  authDomain: "spotify-9bfbc.firebaseapp.com",
  projectId: "spotify-9bfbc",
  storageBucket: "spotify-9bfbc.appspot.com",
  messagingSenderId: "968532919345",
  appId: "1:968532919345:web:df603f8cd81b30971e4110",
  measurementId: "G-G8T3NP0P77"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);