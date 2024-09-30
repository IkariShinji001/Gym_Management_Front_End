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
          path: "supplement-products/charts",
          name: "chart",
          component: () => import("../views/SoldProductChartView.vue"),
        },
        {
          path: "package-benefits",
          name: "benefits",
          component: () => import("../views/BenefitView.vue"),
        },
        {
          path: "count-maintenances",
          name: "countMaintenance",
          component: () => import("../views/CountMaintenances.vue"),
        },
        {
          path: "daily-bill-statistics",
          name: "weeklyBillStatistics",
          component: () => import("../views/WeeklyBillStatistics.vue"),
        },
        {
          path: "yearly-bill-statistics",
          name: "yearlyBillStatistics",
          component: () => import("../views/YearlyBillStatistics.vue"),
        },
        {
          path: "top-spent-users-statistics-in-month",
          name: "TopSpentUsersStatisticsInMonth",
          component: () => import("../views/TopSpentUsersStatisticsInMonth.vue"),
        },
        {
          path: "top-spent-users-statistics-in-year",
          name: "TopSpentUsersStatisticsInYear",
          component: () => import("../views/TopSpentUsersStatisticsInYear.vue"),
        },
        {
          path: "top-purchased-packages-statistics-in-month",
          name: "TopPurchasedPackagesStatisticsInMonth",
          component: () => import("../views/TopPurchasedPackagesStatisticsInMonth.vue"),
        },
        {
          path: "top-purchased-packages-statistics-in-year",
          name: "TopPurchasedPackagesStatisticsInYear",
          component: () => import("../views/TopPurchasedPackagesStatisticsInYear.vue"),
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
