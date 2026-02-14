<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เข้าสู่ระบบ (Lab 07)</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <h1>Welcome Back!</h1>
        
        <ion-button expand="block" color="danger" @click="loginGoogle">
          <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
          Login with Google
        </ion-button>

        <ion-button expand="block" color="success" @click="loginPhone">
          <ion-icon slot="start" :icon="call"></ion-icon>
          Login with Phone
        </ion-button>

        <ion-button expand="block" fill="outline" @click="loginEmail">
          Login with Email (Test)
        </ion-button>

        <div id="recaptcha-container"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { logoGoogle, call } from 'ionicons/icons';
import { authService } from '@/auth/auth-service';
import { useRouter } from 'vue-router';

const router = useRouter();

// 1. Google Login
const loginGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.replace('/tabs/tab1'); // สำเร็จแล้วไปหน้าแรก
  } catch (error) {
    alert("Google Login Error: " + error);
  }
};

// 2. Phone Login (แบบย่อ: เบอร์ต้องลงทะเบียนใน Firebase Authentication > Phone > Testing numbers ไว้ก่อนจะง่ายครับ)
const loginPhone = async () => {
  try {
    const phone = prompt("เบอร์โทรศัพท์ (เช่น +66812345678):", "+66");
    if (!phone) return;

    const { verificationId } = await authService.startPhoneLogin({ phoneNumberE164: phone });
    
    const code = prompt("กรอกรหัส OTP ที่ได้รับ:");
    if (!code) return;

    await authService.confirmPhoneCode({ verificationId, verificationCode: code });
    router.replace('/tabs/tab1');
  } catch (error) {
    alert("Phone Login Error: " + error);
    console.error(error);
  }
};

// 3. Email Login (แบบ Hardcode เพื่อเทส)
const loginEmail = async () => {
  try {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (email && password) {
      await authService.loginWithEmailPassword({ email, password });
      router.replace('/tabs/tab1');
    }
  } catch (error) {
    alert("Email Login Error: " + error);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 15px;
}
</style>