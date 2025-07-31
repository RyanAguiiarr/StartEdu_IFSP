import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpEzjpB8K9BcpWhfMZRJly9b7ykJfqKbE",
  authDomain: "startedu-f8929.firebaseapp.com",
  projectId: "startedu-f8929",
  storageBucket: "startedu-f8929.firebasestorage.app",
  messagingSenderId: "320452832637",
  appId: "1:320452832637:web:75b66d1896c2bad51eb014",
  measurementId: "G-FEBMEW46PC",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
