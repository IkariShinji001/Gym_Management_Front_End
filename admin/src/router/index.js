import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admins",
      component: () => import("../views/AdminLayoutView.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "blogs",
          name:"blog",
          component: ()=> import("../views/BlogView.vue")
        },
        {
          path: "blogs/posts/:id",
          name:"postDetails",
          component: () => import("../views/PostDetailView.vue")
        },

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
          path: "fitness-packages",
          name: "fitness",
          component: () => import("../views/FitnessPackageView.vue"),
        },
        {
          path: "pt-packages",
          name: "pt",
          component: () => import("../views/PtPackageView.vue"),
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
          path: "emails",
          name: "email",
          component: () => import("../views/SendMailView.vue"),
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
        
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/Profile.vue"),
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

//  hukhan
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("role");

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
