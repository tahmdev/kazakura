import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBX88V2NbgK9oNUP4kJPpyIkJUnJBZg3Ls",
  authDomain: "kazakura-77ea0.firebaseapp.com",
  projectId: "kazakura-77ea0",
  storageBucket: "kazakura-77ea0.appspot.com",
  messagingSenderId: "107594122170",
  appId: "1:107594122170:web:9aa736f560cb4b0cde1383",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
