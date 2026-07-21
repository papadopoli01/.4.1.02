import { db } from './lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function test() {
  try {
    const docRef = await addDoc(collection(db, "portfolio"), {
      title: "Projeto Teste",
      description: "Teste de conexão com Firebase",
      category: "Landing Page",
      featured: true,
      createdAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

test();
