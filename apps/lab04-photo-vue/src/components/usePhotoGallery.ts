import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

// Interface สำหรับรูปภาพ
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const photos = ref<UserPhoto[]>([]);
  const PHOTO_STORAGE = 'photos';

  // ฟังก์ชันโหลดภาพที่บันทึกไว้
  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

    // กรณีรันบนเว็บ ต้องโหลดภาพ base64 จาก Filesystem มาแสดง
    for (const photo of photosInPreferences) {
      const file = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }

    photos.value = photosInPreferences;
  };

  // ฟังก์ชันบันทึกภาพลงเครื่อง
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const base64Data = await readAsBase64(photo);

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  // Helper แปลงไฟล์เป็น Base64
  const readAsBase64 = async (photo: Photo) => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await convertBlobToBase64(blob) as string;
  };

  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  // ฟังก์ชันถ่ายรูป
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + '.jpeg';
    const savedFileImage = await savePicture(photo, fileName);

    photos.value = [savedFileImage, ...photos.value];
  };

  // Watch เพื่อบันทึกข้อมูล array ลง Preferences เมื่อมีการเปลี่ยนแปลง
  watch(photos, (newPhotos) => {
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos),
    });
  });

  onMounted(loadSaved);

  return {
    photos,
    takePhoto,
  };
}