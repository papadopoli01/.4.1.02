import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD5RfIf2MVkJiQc8z2kaA_kSjj64Wb07jQ",
  authDomain: "agencia-ia-db.firebaseapp.com",
  projectId: "agencia-ia-db",
  storageBucket: "agencia-ia-db.firebasestorage.app",
  messagingSenderId: "219764639000",
  appId: "1:219764639000:web:3ce8c31f9e6c90b3a74a6d",
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
