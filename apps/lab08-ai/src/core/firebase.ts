// ไฟล์: src/core/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // โจทย์กำหนดให้เพิ่มบรรทัดนี้

// Config ที่คุณได้มา
const firebaseConfig = {
  apiKey: "AIzaSyAxxASkj4aX7Gq3TJPHmgxY8sv6Q85vEJE",
  authDomain: "lab06-expense-bcaef.firebaseapp.com",
  projectId: "lab06-expense-bcaef",
  storageBucket: "lab06-expense-bcaef.firebasestorage.app",
  messagingSenderId: "1022502813873",
  appId: "1:1022502813873:web:88db3250ff384f62352290",
  measurementId: "G-6X265BRWW0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ส่งออก db ตามที่โจทย์ข้อ 130 ต้องการ