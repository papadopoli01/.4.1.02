import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbXvdIeNea7ib2pxDydFS9XQad8hEIrEY",
  authDomain: "nexora-firebase-7fe1b.firebaseapp.com",
  projectId: "nexora-firebase-7fe1b",
  storageBucket: "nexora-firebase-7fe1b.firebasestorage.app",
  messagingSenderId: "327054581269",
  appId: "1:327054581269:web:caf3feb4882a4e7bce781c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function create() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, "admin@nexora.com", "senha123");
    const uid = userCredential.user.uid;
    console.log("Logged in! UID:", uid);

    await setDoc(doc(db, "users", uid), {
      email: "admin@nexora.com",
      role: "SuperAdmin",
      name: "Admin",
      companyId: "nexora"
    });
    
    console.log("User doc created in Firestore");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

create();
