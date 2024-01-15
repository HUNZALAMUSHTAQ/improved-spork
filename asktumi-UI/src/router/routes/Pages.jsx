import { lazy } from "react";

const PagesRoutes = [
  //Workspace

  {
    path: "/pages/workspace",
    component: lazy(() => import("../../view/main/dashboard/workspace")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/upload",
    component: lazy(() => import("../../view/main/dashboard/upload")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  // {
  //   path: "/pages/workspace-history",
  //   component: lazy(() => import("../../view/pages/workspaceHistory/WorkspaceHistory")),
  //   layout: "VerticalLayout",
  //   isProtected: true,
  // },

  // PAGES
  {
    path: "/pages/authentication/login",
    component: lazy(() => import("../../view/pages/authentication/login")),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/recover-password",
    component: lazy(() =>
      import("../../view/pages/authentication/recover-password")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/verify-email",
    component: lazy(() =>
      import("../../view/pages/authentication/verify-email")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/register",
    component: lazy(() => import("../../view/pages/authentication/register")),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/reset-password",
    component: lazy(() =>
      import("../../view/pages/authentication/reset-password")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/set-password",
    component: lazy(() =>
      import("../../view/pages/authentication/set-password")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/projects",
    component: lazy(() => import("../../view/pages/projects")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/pricing",
    component: lazy(() => import("../../view/pages/pricing")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/chatBot",
    component: lazy(() => import("../../view/pages/chatBot")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/profile/personel-information",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/profile/password-change",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/profile/add-users",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/profile/delete-account",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/payment/success",
    component: lazy(() => import("../../view/pages/payment-success")),
    layout: "FullLayout",
    isProtected: true,
  },
  {
    path: "/pages/payment/fail",
    component: lazy(() => import("../../view/pages/payment-fail")),
    layout: "FullLayout",
    isProtected: true,
  },
  {
    path: "/pages/embed",
    component: lazy(() => import("../../view/pages/embed")),
    layout: "VerticalLayout",
    isProtected: true,
  },
];

export default PagesRoutes;
