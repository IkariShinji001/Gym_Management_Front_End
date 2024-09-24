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
        {
          path: "fitness-package-type-service",
          component: () => import("../views/FitnessPackageTypeServicePage.vue"),
        },
        {
          path: "service-package/:typeId",
          name: "service-package",
          component: () => import("../views/ServicePackagePage.vue"),
        },
        {
          path: "service-package/types/:typeId/fitness-package/:fitnessPackageId",
          component: () => import("../views/FitnessPackageDetail.vue"),
        },
        {
          path: "service-package/types/:typeId/fitness-package/:fitnessPackageId/prices/:priceId",
          component: () => import("../views/PTPackagePage.vue"),
        },
        {
          path: "service-package/types/:typeId/fitness-package/:fitnessPackageId/prices/:priceId/pt-packages/:ptPackageId",
          component: () => import("../views/PTDetail.vue"),
        },
        {
          path:"chatbot",
          name: "chatbot",
          component: () => import("../components/chatbotcom.vue"),
        }
      ],
      component: () => import("../views/Layout.vue"),
    },
  ],
});

export default router;
