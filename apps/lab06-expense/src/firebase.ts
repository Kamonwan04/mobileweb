import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ข้อมูล Config จาก Firebase ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyAxxASkj4aX7Gq3TJPHmgxY8sv6Q85vEJE",
  authDomain: "lab06-expense-bcaef.firebaseapp.com",
  projectId: "lab06-expense-bcaef",
  storageBucket: "lab06-expense-bcaef.firebasestorage.app",
  messagingSenderId: "1022502813873",
  appId: "1:1022502813873:web:ddade0a0d22573bb352290",
  measurementId: "G-Q749K6WYVP"
};

// เริ่มต้นโปรเจกต์ Firebase
const app = initializeApp(firebaseConfig);

// ส่งออก Database Instance เพื่อไปใช้จัดการข้อมูล (Firestore)
export const db = getFirestore(app);