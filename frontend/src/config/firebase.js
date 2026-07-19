import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1TdOElUXkJK_uId6kpDM_DbkAtN0JQRU",
  authDomain: "krishiverse-auth.firebaseapp.com",
  projectId: "krishiverse-auth",
  storageBucket: "krishiverse-auth.firebasestorage.app",
  messagingSenderId: "677940131483",
  appId: "1:677940131483:web:e171bde64d52f27ffdf83e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();