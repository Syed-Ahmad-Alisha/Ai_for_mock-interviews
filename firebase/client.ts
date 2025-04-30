// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAJwToqb1LbvkQi2HpmEu5KOFwuxXO3ZVw",
    authDomain: "prepai-58c2b.firebaseapp.com",
    projectId: "prepai-58c2b",
    storageBucket: "prepai-58c2b.firebasestorage.app",
    messagingSenderId: "305870366227",
    appId: "1:305870366227:web:09cf54b7b496ddbc0181e6",
    measurementId: "G-E4L55N735V"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);