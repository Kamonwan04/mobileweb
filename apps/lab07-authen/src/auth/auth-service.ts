import { Capacitor } from "@capacitor/core";
import type { IAuthService } from "./auth-interface";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";

// ถ้าเป็น Native (Android/iOS) ให้ใช้ FirebaseAppAuthService
// ถ้าเป็น Web ให้ใช้ FirebaseWebAuthService
export const authService: IAuthService = Capacitor.isNativePlatform()
  ? new FirebaseAppAuthService()
  : new FirebaseWebAuthService();