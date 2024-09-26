import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/QRCodeScannerPage.vue"),
    },
    {
      path: "/face-reg",
      component: () => import("../views/FaceReg.vue"),
    },
  ],
});

export default router;
