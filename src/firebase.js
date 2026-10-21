import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyCwmkMz3DlsJDS2ZwjFHahQok0QURdLuWU",
  authDomain: "roomsplit-test.firebaseapp.com",
  projectId: "roomsplit-test",
  storageBucket: "roomsplit-test.firebasestorage.app",
  messagingSenderId: "814016879682",
  appId: "1:814016879682:web:e0c91d7c3b483ebf16a1db"
};

export const hasFirebase = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let db = null;
let auth = null;
let app = null; // 1. Added app variable here

if (hasFirebase) {
  try {
    // 2. Assign the initialized app to our variable
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase init failed:', error);
  }
}

// 3. Added 'app' to the exports list below
export { app, auth, collection, db, deleteDoc, doc, onSnapshot, setDoc, signInAnonymously };