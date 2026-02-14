import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  User
} from "firebase/auth";
import type { IAuthService, AuthUser, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";

// เอาค่า Config ที่ก๊อปปี้จากหน้าเว็บ Firebase มาแปะทับตรงนี้ครับ
const firebaseConfig = {
  apiKey: "AIzaSyAxxASkj4aX7Gq3TJPHmgxY8sv6Q85vEJE",
  authDomain: "lab06-expense-bcaef.firebaseapp.com",
  projectId: "lab06-expense-bcaef",
  storageBucket: "lab06-expense-bcaef.firebasestorage.app",
  messagingSenderId: "1022502813873",
  appId: "1:1022502813873:web:6d56d7ddc9284f2b352290",
  measurementId: "G-HVCPLYBKKZ"
};

// --------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ตัวแปรสำหรับเก็บ confirmationResult ของ Phone Auth
let confirmationResult: any = null;

function mapUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    phoneNumber: u.phoneNumber,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

export class FirebaseWebAuthService implements IAuthService {
  
  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user ? mapUser(user) : null);
      });
    });
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    const uc = await signInWithEmailAndPassword(auth, creds.email, creds.password);
    return mapUser(uc.user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return mapUser(result.user);
  }

  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    // บนเว็บต้องมีตัวตรวจจับ Robot (Recaptcha)
    // ต้องมี <div id="recaptcha-container"></div> ในหน้า Login ด้วย
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });

    confirmationResult = await signInWithPhoneNumber(auth, creds.phoneNumberE164, recaptchaVerifier);
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) throw new Error("No confirmation result found");
    const result = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(result.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}