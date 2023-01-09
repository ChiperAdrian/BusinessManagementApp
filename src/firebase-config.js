import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAiFfCIFGfijMq6df0VwcRq4ha2jgqz7cs",
    authDomain: "sorinapp.firebaseapp.com",
    projectId: "sorinapp",
    storageBucket: "sorinapp.appspot.com",
    messagingSenderId: "813867234838",
    appId: "1:813867234838:web:0daca657f999e43ccc2737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)