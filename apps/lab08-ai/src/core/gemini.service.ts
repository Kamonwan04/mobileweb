import type { Base64Image, ImageAnalysisResult } from "./ai.interface";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai"; // *หมายเหตุ: หากใช้ SDK ใหม่ อาจต้องใช้ firebase/vertexai แทน firebase/ai ตามเวอร์ชันปัจจุบัน แต่ใน Lab ระบุ firebase/ai ให้ลองใช้ตาม Lab ก่อน ถ้า error ให้เปลี่ยนเป็น vertexai*
// เพื่อความชัวร์ตาม Lab ใช้ import นี้:
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

import { app } from "./firebase";
import { imageAnalysisSchema } from "./ai.interface";

// Setup AI
export const ai = getAI(app, { backend: new GoogleAIBackend() });

export const visionModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash", // ใช้รุ่น Flash ตามโจทย์
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: imageAnalysisSchema,
  },
});

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt = `วิเคราะห์ภาพนี้และตอบกลับตาม JSON schema เท่านั้น
    - caption: คำบรรยายสั้น 1 ประโยคภาษาไทย
    - tags: คีย์เวิร์ด 3-8 คำ
    - objects: ถ้าเห็นวัตถุเด่น ให้ระบุชื่อ
    - safety: ถ้าเป็นภาพอ่อนไหวให้ทำเครื่องหมาย`;

    const imagePart = {
      inlineData: { data: image.base64, mimeType: image.mimeType },
    };

    const resp = await visionModel.generateContent([prompt, imagePart]);
    const text = resp.response.text() ?? "{}";
    return JSON.parse(text) as ImageAnalysisResult;
  }
}