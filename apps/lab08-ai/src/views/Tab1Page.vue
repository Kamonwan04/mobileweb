<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08: Gemini Vision โดย นางสาวกมลวรรณ ดีคง</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />
      
      <ion-button expand="block" @click="fileEl?.click()">
        เลือกไฟล์ภาพ
      </ion-button>
      
      <ion-button expand="block" @click="onTakePhoto">
        ถ่ายภาพ (Camera)
      </ion-button>

      <ion-img v-if="previewUrl" :src="previewUrl" style="margin-top: 20px; border-radius: 8px;" />

      <ion-button expand="block" :disabled="!img || loading" @click="onAnalyze" color="success" class="ion-margin-top">
        <span v-if="!loading">วิเคราะห์ภาพ</span>
        <ion-spinner v-else name="dots"></ion-spinner>
      </ion-button>

      <div v-if="result" class="ion-margin-top">
        <h3>ผลลัพธ์การวิเคราะห์:</h3>
        <pre style="background: #f4f4f4; color: #333333; padding: 10px; border-radius: 8px; overflow: auto;">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error);
  } finally {
    loading.value = false;
  }
}
</script>