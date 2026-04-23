import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/DefaultLayout.vue"),
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/pages/HomePage.vue"),
          meta: { title: "Home" },
        },
        {
          path: "paths",
          name: "Paths",
          component: () => import("@/pages/PathsOverview.vue"),
          meta: { title: "Learning Paths" },
        },
        {
          path: "paths/:role",
          name: "PathDetail",
          component: () => import("@/pages/PathDetail.vue"),
          meta: { title: "Learning Path" },
        },
        {
          path: "languages",
          name: "Languages",
          component: () => import("@/pages/LanguagesOverview.vue"),
          meta: { title: "Programming Languages" },
        },
        {
          path: "languages/:lang",
          name: "LanguageLanding",
          component: () => import("@/pages/LanguageLanding.vue"),
          meta: { title: "Language" },
        },
        {
          path: "languages/:lang/:topic",
          name: "LanguageTopic",
          component: () => import("@/pages/LanguageTopicPage.vue"),
          meta: { title: "Topic" },
        },
        {
          path: "dsa",
          name: "DSA",
          component: () => import("@/pages/DSAOverview.vue"),
          meta: { title: "Data Structures & Algorithms" },
        },
        {
          path: "dsa/:category",
          name: "DSACategory",
          component: () => import("@/pages/DSACategoryPage.vue"),
          meta: { title: "DSA Category" },
        },
        {
          path: "dsa/:category/:topic",
          name: "DSATopic",
          component: () => import("@/pages/DSATopicPage.vue"),
          meta: { title: "DSA Topic" },
        },
        {
          path: "problems",
          name: "Problems",
          component: () => import("@/pages/ProblemsListPage.vue"),
          meta: { title: "Coding Problems" },
        },
        {
          path: "problems/:slug",
          name: "ProblemDetail",
          component: () => import("@/pages/ProblemDetailPage.vue"),
          meta: { title: "Problem" },
        },
        {
          path: "interviews",
          name: "Interviews",
          component: () => import("@/pages/InterviewsOverview.vue"),
          meta: { title: "Interview Preparation" },
        },
        {
          path: "interviews/:company",
          name: "CompanyQuestions",
          component: () => import("@/pages/CompanyQuestionsPage.vue"),
          meta: { title: "Interview Questions" },
        },
        {
          path: "interviews/:company/:role",
          name: "RoleInterview",
          component: () => import("@/pages/RoleInterviewPage.vue"),
          meta: { title: "Role Interview" },
        },
        {
          path: "methodology",
          name: "Methodology",
          component: () => import("@/pages/MethodologyOverview.vue"),
          meta: { title: "Methodologies" },
        },
        {
          path: "methodology/:topic",
          name: "MethodologyDetail",
          component: () => import("@/pages/MethodologyDetail.vue"),
          meta: { title: "Methodology" },
        },
        {
          path: "system-design",
          name: "SystemDesign",
          component: () => import("@/pages/SystemDesignOverview.vue"),
          meta: { title: "System Design" },
        },
        {
          path: "system-design/:slug",
          name: "SystemDesignDetail",
          component: () => import("@/pages/SystemDesignDetailPage.vue"),
          meta: { title: "System Design" },
        },
        {
          path: "databases",
          name: "Databases",
          component: () => import("@/pages/DatabasesOverview.vue"),
          meta: { title: "Databases" },
        },
        {
          path: "databases/:slug",
          name: "DatabaseDetail",
          component: () => import("@/pages/DatabaseDetailPage.vue"),
          meta: { title: "Database" },
        },
        {
          path: "playground",
          name: "Playground",
          component: () => import("@/pages/PlaygroundPage.vue"),
          meta: { title: "Code Playground" },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/pages/NotFoundPage.vue"),
      meta: { title: "404 — Not Found" },
    },
  ],
});

// Update document title on navigation
router.beforeEach((to) => {
  const title = to.meta.title as string | undefined;
  if (title) {
    document.title = `${title} | codespace`;
  }
});

export default router;
