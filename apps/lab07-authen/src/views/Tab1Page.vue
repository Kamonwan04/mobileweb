<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      
      <div v-if="user" style="text-align: center; margin-top: 50px;">
        <img :src="user.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" 
             style="width: 100px; height: 100px; border-radius: 50%;" />
        
        <h2>{{ user.displayName || 'No Name' }}</h2>
        <p>{{ user.email }}</p>
        <p style="color: grey; font-size: 0.8em;">UID: {{ user.uid }}</p>

        <ion-button color="medium" expand="block" @click="logout">
          Logout / ออกจากระบบ
        </ion-button>
      </div>

      <div v-else>
        <p>Loading user data...</p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { authService } from '@/auth/auth-service';
import { AuthUser } from '@/auth/auth-interface';
import { useRouter } from 'vue-router';

const user = ref<AuthUser | null>(null);
const router = useRouter();

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const logout = async () => {
  await authService.logout();
  router.replace('/login'); // ออกแล้วเด้งไปหน้า Login
};
</script>