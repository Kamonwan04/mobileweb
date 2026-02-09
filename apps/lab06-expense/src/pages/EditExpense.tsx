import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, 
  IonButton, IonList, IonItem, IonButtons, IonBackButton, useIonAlert
} from '@ionic/react';
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useHistory, useParams } from "react-router-dom";

const EditExpense: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>(); // รับ ID จาก URL
  const [presentAlert] = useIonAlert();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  // 1. ดึงข้อมูลเดิมมาแสดงในฟอร์มเมื่อหน้าจอโหลด
  useEffect(() => {
    const getExpenseData = async () => {
      const docRef = doc(db, "expenses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setAmount(data.amount.toString());
        setType(data.type);
        setCategory(data.category);
        setNote(data.note);
      }
    };
    getExpenseData();
  }, [id]);

  // 2. ฟังก์ชันอัปเดตข้อมูล
  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note
      });
      
      history.push("/tab1"); // กลับหน้ารายการหลัก
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("ไม่สามารถอัปเดตข้อมูลได้");
    }
  };

  // 3. ฟังก์ชันสำหรับลบข้อมูล
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await deleteDoc(docRef);
      history.push("/tab1"); // กลับหน้ารายการหลักเมื่อลบเสร็จ
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };

  // 4. ฟังก์ชันแสดงกล่องยืนยันก่อนลบ
  const confirmDelete = () => {
    presentAlert({
      header: 'ยืนยันการลบ',
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? เมื่อลบแล้วไม่สามารถย้อนกลับได้',
      buttons: [
        { text: 'ยกเลิก', role: 'cancel' },
        { 
          text: 'ลบรายการ', 
          role: 'destructive', 
          handler: handleDelete // ถ้ากดยืนยัน ให้ไปทำฟังก์ชันลบ
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning"> 
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>แก้ไขรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput label="ชื่อรายการ" labelPlacement="floating" 
              value={title} onIonInput={(e) => setTitle(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonInput label="จำนวนเงิน" labelPlacement="floating" type="number" 
              value={amount} onIonInput={(e) => setAmount(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonSelect label="ประเภท" value={type} onIonChange={(e) => setType(e.detail.value)}>
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput label="หมวดหมู่" labelPlacement="floating" 
              value={category} onIonInput={(e) => setCategory(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonTextarea label="หมายเหตุ" labelPlacement="floating" 
              value={note} onIonInput={(e) => setNote(e.detail.value!)} />
          </IonItem>
        </IonList>

        <div className="ion-margin-top">
          <IonButton expand="block" color="warning" onClick={handleUpdate}>
            อัปเดตข้อมูล
          </IonButton>
          <IonButton expand="block" color="danger" fill="clear" className="ion-margin-top" onClick={confirmDelete}>
            ลบรายการ
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;