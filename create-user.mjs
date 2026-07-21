import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

async function create() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@nexora.com", "senha123");
    console.log("User created successfully!");
    console.log("Email: admin@nexora.com");
    console.log("Password: senha123");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("User already exists!");
      process.exit(0);
    }
    console.error("Error creating user:", error);
    process.exit(1);
  }
}

create();
