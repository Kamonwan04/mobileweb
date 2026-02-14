import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import type { IAuthService } from "./auth-interface";
import type { AuthUser, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";

// ฟังก์ชันแปลงข้อมูลจาก Firebase ให้เป็นรูปแบบกลางของเรา
function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    phoneNumber: u.phoneNumber ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoUrl ?? null,
  };
}

export class FirebaseAppAuthService implements IAuthService {
  
  async getCurrentUser(): Promise<AuthUser | null> {
    const { user } = await FirebaseAuthentication.getCurrentUser();
    return user ? mapUser(user) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    const { user } = await FirebaseAuthentication.signInWithEmailAndPassword({
      email: creds.email,
      password: creds.password,
    });
    return mapUser(user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const { user } = await FirebaseAuthentication.signInWithGoogle();
    return mapUser(user);
  }

  // Phone Login: แยกเป็น 2 ขั้นตอน (ขอ OTP -> ยืนยัน OTP)
  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    return new Promise(async (resolve, reject) => {
      // ดักจับ error
      const offFailed = await FirebaseAuthentication.addListener("phoneVerificationFailed", (e) => {
        reject(new Error(e.message ?? "Phone verification failed"));
      });

      // ดักจับตอนส่ง OTP สำเร็จ (จะได้ verificationId มา)
      const offSent = await FirebaseAuthentication.addListener("phoneCodeSent", (e) => {
        // ล้าง listener เมื่อได้ของแล้ว
        offFailed.remove();
        offSent.remove();
        resolve({ verificationId: e.verificationId });
      });

      // เริ่มส่งคำขอ OTP
      await FirebaseAuthentication.signInWithPhoneNumber({
        phoneNumber: creds.phoneNumberE164,
      });
    });
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    const { user } = await FirebaseAuthentication.confirmVerificationCode({
      verificationId: payload.verificationId,
      verificationCode: payload.verificationCode,
    });
    return mapUser(user);
  }

  async logout(): Promise<void> {
    await FirebaseAuthentication.signOut();
  }
}