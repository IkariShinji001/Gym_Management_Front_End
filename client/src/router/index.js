import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: () => import("../views/LoginPage.vue") },
    {
      path: "/",
      children: [
        {
          path: "/",
          component: () => import("../views/HomePage.vue"),
        },
        {
          path: "qr-code",
          component: () => import("../views/QRCodePage.vue"),
        },
        {
          path: "users",
          component: () => import("../views/User.vue"),
        },
        {
          path: "entry-times",
          component: () => import("../views/UserHistoryEntry.vue"),
        },
        {
          path: "create-face-login",
          component: () => import("../views/CreateFaceReg.vue"),
        },
      ],
      component: () => import("../views/Layout.vue"),
    },
  ],
});

export default router;
