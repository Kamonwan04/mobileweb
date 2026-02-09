import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonNote, IonButton, IonIcon, 
  IonButtons, IonCard, IonCardContent, IonGrid, IonRow, IonCol 
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    // 1. สร้าง Query เพื่อดึงข้อมูลและเรียงจากใหม่ไปเก่า (createdAt desc)
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    // 2. ใช้ onSnapshot เพื่อดึงข้อมูลแบบ Real-time
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataArr: any[] = [];
      let incomeSum = 0;
      let expenseSum = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
        dataArr.push(item);

        // 3. คำนวณผลรวมรายรับ - รายจ่าย
        if (data.type === 'income') {
          incomeSum += Number(data.amount);
        } else {
          expenseSum += Number(data.amount);
        }
      });

      setExpenses(dataArr);
      setTotalIncome(incomeSum);
      setTotalExpense(expenseSum);
    });

    // ล้างการเชื่อมต่อเมื่อ Component ถูกปิด
    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>สรุปรายรับ-รายจ่าย</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/add-expense">
              <IonIcon icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* ส่วนแสดงสรุปผลรวม */}
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div style={{ color: 'green' }}>
                    <strong>รายรับรวม</strong>
                    <h2>{totalIncome.toLocaleString()} ฿</h2>
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ color: 'red' }}>
                    <strong>รายจ่ายรวม</strong>
                    <h2>{totalExpense.toLocaleString()} ฿</h2>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                  <hr />
                  <strong>คงเหลือ: {(totalIncome - totalExpense).toLocaleString()} ฿</strong>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ส่วนแสดงรายการรายรับรายจ่าย */}
        <IonList>
          {expenses.map((item) => (
            <IonItem key={item.id} button routerLink={`/edit-expense/${item.id}`}>
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.category}</p>
                <small>{item.note}</small>
              </IonLabel>
              <IonNote slot="end" color={item.type === 'income' ? 'success' : 'danger'} style={{ fontSize: '1.1em' }}>
                {item.type === 'income' ? '+' : '-'}{Number(item.amount).toLocaleString()} ฿
              </IonNote>
            </IonItem>
          ))}
        </IonList>

        {/* ปุ่มลัดด้านล่างรายการ */}
        <div className="ion-padding">
          <IonButton expand="block" fill="outline" routerLink="/add-expense">
            เพิ่มรายการใหม่
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
