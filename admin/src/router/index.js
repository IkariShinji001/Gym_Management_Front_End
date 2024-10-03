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
          path: "emails",
          name: "email",
          component: () => import("../views/SendMailView.vue"),
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
