import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { authService } from '../auth/auth-service'; // เรียกใช้ Service ที่เราทำ

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue') // เดี๋ยวเราจะไปสร้างไฟล์นี้กัน
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
        meta: { requiresAuth: true } // <--- แปะป้ายว่า "หน้านี้ต้องล็อกอินนะ"
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- ด่านตรวจคนเข้าเมือง (Guard) ---
router.beforeEach(async (to, from, next) => {
  const user = await authService.getCurrentUser();
  
  // 1. ถ้าจะไปหน้า Login แต่ล็อกอินอยู่แล้ว -> ถีบไป Tab1
  if (to.path === "/login" && user) {
    next("/tabs/tab1");
  } 
  // 2. ถ้าจะไปหน้าลับ (requiresAuth) แต่ยังไม่ล็อกอิน -> ถีบไป Login
  else if (to.meta.requiresAuth && !user) {
    next("/login");
  } 
  // 3. นอกนั้น ผ่านได้
  else {
    next();
  }
});

export default router