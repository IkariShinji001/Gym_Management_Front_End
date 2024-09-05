import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admins",
      component: () => import("../views/AdminLayoutView.vue"),
      children: [
        {
          path: "supplement-products",
          name: "supplement",
          component: () => import("../views/SupplementProductView.vue"),
        },
        {
          path: "facilities",
          name: "facilities",
          component: () => import("../views/Facilities.vue"),
        },
        {
<<<<<<< HEAD
          path: "maintenances",
          name: "maintenances",
          component: () => import("../views/MaintenanceView.vue"),
=======
          path: "pts",
          name: "pts",
          component: () => import("../views/Pts.vue"),
        },
        {
          path: "employees",
          name: "employees",
          component: () => import("../views/Employees.vue"),
        },
        {
          path: "managers",
          name: "managers",
          component: () => import("../views/Managers.vue"),
        },
        {
          path: "services",
          name: "services",
          component: () => import("../views/ServicePackageView.vue"),
>>>>>>> bb4c00b266ed8734ce65f6db7acea80005e26892
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginAdmin.vue"),
    },
  ],
});

export default router;
