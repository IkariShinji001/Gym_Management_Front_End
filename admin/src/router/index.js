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
          path: "maintenances",
          name: "maintenances",
          component: () => import("../views/MaintenanceView.vue"),
        },
        {
          path: "branches",
          name: "branches",
          component: () => import("../views/BranchesView.vue"),
        },
        {
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
        },
        {
          path: "chart",
          name: "chart",
          component: () => import("../views/testChartView.vue"),
        },
        {
          path: "package-benefits",
          name: "benefits",
          component: () => import("../views/BenefitView.vue"),
        },
        {
          path: "testChart",
          component: () => import("../views/testChart1.vue"),
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
