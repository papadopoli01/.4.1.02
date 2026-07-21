import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbXvdIeNea7ib2pxDydFS9XQad8hEIrEY",
  authDomain: "nexora-firebase-7fe1b.firebaseapp.com",
  projectId: "nexora-firebase-7fe1b",
  storageBucket: "nexora-firebase-7fe1b.firebasestorage.app",
  messagingSenderId: "327054581269",
  appId: "1:327054581269:web:caf3feb4882a4e7bce781c",
};

// Initialize Firebase only if we have a real or dummy config
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

db = getFirestore(app);
auth = getAuth(app);
storage = getStorage(app);

export { app, db, auth, storage };
