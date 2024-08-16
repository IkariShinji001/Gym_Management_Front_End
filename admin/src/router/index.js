import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admins",
      name: "admin",
      component: () => import("../views/AdminLayoutView.vue"),
      children: [
        {
          path: "/supplement-products",
          name: "supplement",
          component: () => import("../views/SupplementProductView.vue"),
        },
      ],
    },
  ],
});

export default router;
