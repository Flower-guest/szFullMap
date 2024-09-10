import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("@/pages/index/index.vue"),
    meta: {
      title: "首页",
    },
    children: [],
  },
  {
    path: "/webView/:jumpUrl",
    component: () => import("@/pages/webView.vue"),
    meta: {
      title: "首页",
    },
    children: [],
  },
  {
    path: "/detail/:id",
    component: () => import("@/pages/detail.vue"),
    meta: {
      title: "详情",
    },
    children: [],
  }, {
    path: "/ruralInfo",
    component: () => import("@/pages/ruralInfo.vue"),
    meta: {
      title: "乡村简介",
    },
    children: [],
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
