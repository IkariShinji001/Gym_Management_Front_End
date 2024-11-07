import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admins",
      component: () => import("../views/AdminLayoutView.vue"),
      meta: { requiresAuth: true, roles: ["manager", "employee", "pt"] },
      children: [
        {
          path: "blogs",
          name: "blog",
          component: () => import("../views/BlogView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee", "pt"] },
        },
        {
          path: "blogs/posts/:id",
          name: "postDetails",
          component: () => import("../views/PostDetailView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee", "pt"] },
        },
        {
          path: "supplement-products",
          name: "supplement",
          component: () => import("../views/SupplementProductView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "facilities",
          name: "facilities",
          component: () => import("../views/Facilities.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "maintenances",
          name: "maintenances",
          component: () => import("../views/MaintenanceView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "branches",
          name: "branches",
          component: () => import("../views/BranchesView.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "pts",
          name: "pts",
          component: () => import("../views/Pts.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "employees",
          name: "employees",
          component: () => import("../views/Employees.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "managers",
          name: "managers",
          component: () => import("../views/Managers.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "fitness-packages",
          name: "fitness",
          component: () => import("../views/FitnessPackageView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "pt-packages",
          name: "pt",
          component: () => import("../views/PtPackageView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "supplement-products/charts",
          name: "chart",
          component: () => import("../views/SoldProductChartView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "package-benefits",
          name: "benefits",
          component: () => import("../views/BenefitView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "emails",
          name: "email",
          component: () => import("../views/SendMailView.vue"),
          meta: { requiresAuth: true, roles: ["manager", "employee"] },
        },
        {
          path: "count-maintenances",
          name: "countMaintenance",
          component: () => import("../views/CountMaintenances.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "daily-bill-statistics",
          name: "weeklyBillStatistics",
          component: () => import("../views/WeeklyBillStatistics.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "yearly-bill-statistics",
          name: "yearlyBillStatistics",
          component: () => import("../views/YearlyBillStatistics.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "top-spent-users-statistics-in-month",
          name: "TopSpentUsersStatisticsInMonth",
          component: () =>
            import("../views/TopSpentUsersStatisticsInMonth.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "top-spent-users-statistics-in-year",
          name: "TopSpentUsersStatisticsInYear",
          component: () => import("../views/TopSpentUsersStatisticsInYear.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "top-purchased-packages-statistics-in-month",
          name: "TopPurchasedPackagesStatisticsInMonth",
          component: () =>
            import("../views/TopPurchasedPackagesStatisticsInMonth.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        {
          path: "top-purchased-packages-statistics-in-year",
          name: "TopPurchasedPackagesStatisticsInYear",
          component: () =>
            import("../views/TopPurchasedPackagesStatisticsInYear.vue"),
          meta: { requiresAuth: true, roles: ["manager"] },
        },
        
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/Profile.vue"),
          meta: { requiresAuth: true, roles: ["manager", "pt", "employee"] },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginAdmin.vue"),
    },
    {
      path: "/forbidden",
      name: "forbidden",
      component: () => import("../views/Forbidden.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Kiểm tra xem người dùng có đăng nhập hay không dựa trên localStorage
  const isAuthenticated = !!localStorage.getItem("role");

  const userRoles = localStorage.getItem("role");

  // Kiểm tra xem route có yêu cầu đăng nhập hay không
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Chuyển hướng đến trang đăng nhập nếu không đăng nhập
      return next({ path: "/login" });
    }

    // Nếu route có giới hạn vai trò, kiểm tra quyền
    if (to.meta.roles) {
      const hasPermission = to.meta.roles.some((role) =>
        userRoles.includes(role)
      );
      if (!hasPermission) {
        // Chuyển hướng đến trang không có quyền truy cập nếu người dùng không có vai trò cần thiết
        return next({ path: "/forbidden" });
      }
    }
  }

  // Tiếp tục đến route tiếp theo nếu kiểm tra đăng nhập và quyền truy cập thành công
  next();
});

export default router;
