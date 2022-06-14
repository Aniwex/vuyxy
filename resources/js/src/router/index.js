import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("@/views/Home.vue"),
            meta: {
                pageTitle: "Home",
                breadcrumb: [
                    {
                        text: "Home",
                        active: true,
                    },
                ],
            },
        },
        {
            path: "/Integration",
            name: "Integration",
            component: () => import("@/views/Integration.vue"),
            meta: {
                pageTitle: "Интеграции",
                breadcrumb: [
                    {
                        text: "Интеграции",
                        active: true,
                    },
                ],
            },
        },
        {
            path: "/Users",
            name: "Users",
            component: () => import("@/views/Users.vue"),
            meta: {
                pageTitle: "Пользователи",
                breadcrumb: [
                    {
                        text: "Пользователи",
                        active: true,
                    },
                ],
            },
        },
        {
            path: "/Projects",
            name: "Projects",
            component: () => import("@/views/Projects.vue"),
            meta: {
                pageTitle: "Проекты",
                breadcrumb: [
                    {
                        text: "Проекты",
                        active: true,
                    },
                ],
            },
        },
        {
            path: "/Sources",
            name: "Sources",
            component: () => import("@/views/Sources.vue"),
            meta: {
                pageTitle: "Источники обращений",
                breadcrumb: [
                    {
                        text: "Источники обращений",
                        active: true,
                    },
                ],
            },
        },
        {
            path: "/Tags",
            name: "Tags",
            component: () => import("@/views/Tags.vue"),
            meta: {
                pageTitle: "Тэги обращений",
                breadcrumb: [
                    {
                        text: "Тэги обращений",
                        active: true,
                    },
                ],
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/Login.vue"),
            meta: {
                layout: "full",
            },
        },
        {
            path: "/error-404",
            name: "error-404",
            component: () => import("@/views/error/Error404.vue"),
            meta: {
                layout: "full",
            },
        },
        {
            path: "*",
            redirect: "error-404",
        },
    ],
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById("loading-bg");
    if (appLoading) {
        appLoading.style.display = "none";
    }
});

export default router;
