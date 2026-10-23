import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  signInAnonymously,
} from 'firebase/auth';
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
let app = null;

if (hasFirebase) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    try {
      auth = initializeAuth(app, { persistence: browserLocalPersistence });
    } catch (error) {
      if (error.code !== 'auth/already-initialized') throw error;
      auth = getAuth(app);
    }
  } catch (error) {
    console.error('Firebase init failed:', error);
  }
}

export { app, auth, collection, db, deleteDoc, doc, onSnapshot, setDoc, signInAnonymously };