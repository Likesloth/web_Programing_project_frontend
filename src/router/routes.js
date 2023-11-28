
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LoginPage.vue") },
      { path: "/register", component: () => import("pages/RegisterPage.vue") },
      { path: "/user", component: () => import("pages/HomePage.vue") },
      { path: "/admin", component: () => import("pages/AdminHomepage.vue") },
      { path: "/admin/login", component: () => import("pages/AdminLoginpage.vue") },
      {
        path: "/DashBoard",
        component: () => import("pages/DashBoard.vue"),
      },
      {
        path: "/bookroom/:val:date",
        name: "bookroom",
        component: () => import("pages/RoomDetailPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes
