import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, 
  IonButton, IonList, IonItem, IonButtons, IonBackButton 
} from '@ionic/react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // อ้างอิงไฟล์ firebase.ts ใน src/
import { useHistory } from "react-router-dom";

const AddExpense: React.FC = () => {
  const history = useHistory();

  // สร้าง State สำหรับเก็บข้อมูลฟอร์ม
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  // ฟังก์ชันบันทึกข้อมูล
  const saveExpense = async () => {
    if (!title || !amount) {
      alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note,
        createdAt: new Date()
      });
      
      // เมื่อบันทึกสำเร็จ ให้กลับไปที่หน้า Tab 1 (หรือหน้ารายการหลักของคุณ)
      history.push("/tabs/tab1");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            {/* ปุ่มย้อนกลับไปหน้าก่อนหน้า */}
            <IonBackButton defaultHref="/tabs/tab1" />
          </IonButtons>
          <IonTitle>เพิ่มรายการใหม่</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {/* ชื่อรายการ (title) */}
          <IonItem>
            <IonInput 
              label="ชื่อรายการ" 
              labelPlacement="floating" 
              placeholder="เช่น ซื้อกาแฟ"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value!)}
            />
          </IonItem>

          {/* จำนวนเงิน (amount) */}
          <IonItem>
            <IonInput 
              label="จำนวนเงิน" 
              labelPlacement="floating" 
              type="number" 
              placeholder="0.00"
              value={amount}
              onIonInput={(e) => setAmount(e.detail.value!)}
            />
          </IonItem>

          {/* ประเภท (รายรับ / รายจ่าย) */}
          <IonItem>
            <IonSelect 
              label="ประเภท" 
              value={type} 
              onIonChange={(e) => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* หมวดหมู่ */}
          <IonItem>
            <IonInput 
              label="หมวดหมู่" 
              labelPlacement="floating" 
              placeholder="เช่น อาหาร, เดินทาง"
              value={category}
              onIonInput={(e) => setCategory(e.detail.value!)}
            />
          </IonItem>

          {/* หมายเหตุ */}
          <IonItem>
            <IonTextarea 
              label="หมายเหตุ" 
              labelPlacement="floating" 
              placeholder="ระบุรายละเอียดเพิ่มเติม"
              value={note}
              onIonInput={(e) => setNote(e.detail.value!)}
            />
          </IonItem>
        </IonList>

        <div className="ion-margin-top">
          {/* ปุ่มบันทึกข้อมูล */}
          <IonButton expand="block" onClick={saveExpense}>
            บันทึกข้อมูลลง Firestore
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense;