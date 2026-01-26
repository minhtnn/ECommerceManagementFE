// import LoadingScreen from "@/components/loading-screen";
import { ErrorFallback } from "@/components/ErrorFallback";
import LoadingScreen from "@/components/LoadingScreen";
import GuestGuard from "@/guards/guest-guard";
import RoleBasedGuard from "@/guards/role-based-guard";
import Logout from "@/pages/auth/logout";
import Collections from "@/pages/unneed/Collections";
import { ERole } from "@/types/enums/role.enum";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense, type ElementType } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, useRoutes } from "react-router-dom";
import {
  PATH_AUTH,
  PATH_BRAND_DASHBOARD,
  PATH_GUEST,
  PATH_SYSTEM_ADMIN_DASHBOARD,
} from "./path";
import Admins from "@/pages/unneed/admin/Admins";
import Dashboard from "@/pages/unneed/admin/Dashboard";
import DashBoardLayout from "@/layouts/DashboardLayout";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export const AppRoutes = () =>
  useRoutes([
    {
      path: PATH_AUTH.root,
      children: [
        {
          element: <Navigate to={PATH_AUTH.login} replace />,
          index: true,
        },
        {
          path: "login",
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: "account",
          element: <EndUserAccountPage />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    // Guest Routes
    {
      path: PATH_GUEST.root,
      children: [
        {
          element: <Navigate to={PATH_GUEST.home.root} replace />,
          index: true,
        },
        {
          path: "home",
          element: <CustomerHomePage />,
        },
        {
          path: "products",
          element: <CustomerProductListPage />,
        },
        {
          path: "products/:productId",
          element: <CustomerProductDetailPage />,
        },
        {
          path: "introduce",
          element: <CustomerIntroductionPage />,
        },
        {
          path: "news",
          element: <CustomerNewsListPage />,
        },
        {
          path: "news/:slug",
          element: <CustomerNewsDetailPage />,
        },
        {
          path: "contact",
          element: <CustomerContactPage />,
        },
      ],
    },
    // System Admin Dashboard Routes
    {
      path: PATH_SYSTEM_ADMIN_DASHBOARD.root,
      element: (
        <RoleBasedGuard role={ERole.SystemAdmin}>
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: (
            <Navigate to={PATH_SYSTEM_ADMIN_DASHBOARD.general.app} replace />
          ),
          index: true,
        },
        {
          path: "general",
          element: <SystemAdminGeneralReportPage/>,
        },
        {
          path: "brands",
          element: <BrandListPage/>,
        },
        {
          path: "brands/create",
          element: <BrandCreatePage/>,
        },
        {
          path: "brands/:id/view",
          element: <div>Brand View Page</div>,
        },
        {
          path: "brands/:id/edit",
          element: <BrandEditPage/>,
        },
        {
          path: "account",
          element: <DashboardAccountPage/>
        }
      ],
    },
    // Brand Admin Dashboard Routes
    {
      path: PATH_BRAND_DASHBOARD.root,
      element: (
        <RoleBasedGuard role={ERole.BrandAdmin}>
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_BRAND_DASHBOARD.general.app} replace />,
          index: true,
        },
        {
          path: "general",
          element: <BrandAdminGeneralReportPage/>,
        },
        {
          path: "account",
          element: <DashboardAccountPage/>,
        },
        {
          path: "product-categories",
          element: <BrandAdminListProductCategoryPage/>,
        },
        {
          path: "product-categories/create",
          element: <BrandAdminCreateProductCategoryPage/>,
        },
        {
          path: "product-categories/:id/view",
          element: <div>Product Category View Page</div>,
        },
        {
          path: "product-categories/:id/edit",
          element: <BrandAdminEditProductCategoryPage/>,
        },
        {
          path: "products",
          element: <BrandAdminListProductPage/>,
        },
        {
          path: "products/create",
          element: <BrandAdminCreateProductPage/>,
        },
        {
          path: "products/:id/view",
          element: <div>Product View Page</div>,
        },
        {
          path: "products/:id/edit",
          element: <BrandAdminEditProductPage/>,
        },
        {
          path: "orders",
          element: <div>Order List Page</div>,
        },
        {
          path: "orders/:id/view",
          element: <div>Order View Page</div>,
        },
      ],
    },
    // Default Routes
    {
      path: "/",
      element: (
        <GuestGuard>
          <CustomerHomePage />
        </GuestGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_GUEST.home.root} replace />,
          index: true,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

//#region Authentication
const LoginPage = Loadable(lazy(() => import("@/pages/auth/login")));
const EndUserAccountPage = Loadable(lazy(() => import("@/pages/auth/customer-account")));
const DashboardAccountPage = Loadable(lazy(() => import("@/pages/auth/dashboard-account")));
//#endregion

//#region Customer
const CustomerHomePage = Loadable(lazy(() => import("@/pages/guest/home")));
const CustomerProductListPage = Loadable(
  lazy(() => import("@/pages/guest/products/list"))
);
const CustomerProductDetailPage = Loadable(
  lazy(() => import("@/pages/guest/products/detail"))
);
const CustomerIntroductionPage = Loadable(
  lazy(() => import("@/pages/guest/introduction"))
);
const CustomerNewsListPage = Loadable(lazy(() => import("@/pages/guest/news/list")));
const CustomerNewsDetailPage = Loadable(
  lazy(() => import("@/pages/guest/news/detail"))
);
const CustomerContactPage = Loadable(lazy(() => import("@/pages/guest/contact")));

//#endregion

//#region System admin
const SystemAdminGeneralReportPage = Loadable(lazy(() => import("@/pages/system-admin/general")));
const BrandListPage = Loadable(lazy(() => import("@/pages/system-admin/brand/list")));
const BrandCreatePage = Loadable(lazy(() => import("@/pages/system-admin/brand/create")));
const BrandEditPage = Loadable(lazy(() => import("@/pages/system-admin/brand/edit")));
//#endregion

//#region Brand admin
const BrandAdminGeneralReportPage = Loadable(lazy(() => import("@/pages/brand-admin/general")));
const BrandAdminCreateProductCategoryPage = Loadable(lazy(() => import("@/pages/brand-admin/product-category/create")));
const BrandAdminListProductCategoryPage = Loadable(lazy(() => import("@/pages/brand-admin/product-category/list")));
const BrandAdminEditProductCategoryPage = Loadable(lazy(() => import("@/pages/brand-admin/product-category/edit")));
const BrandAdminListProductPage = Loadable(lazy(() => import("@/pages/brand-admin/product/list")));
const BrandAdminCreateProductPage = Loadable(lazy(() => import("@/pages/brand-admin/product/create")));
const BrandAdminEditProductPage = Loadable(lazy(() => import("@/pages/brand-admin/product/edit")));
//#endregion



const NotFoundPage = Loadable(lazy(() => import("@/pages/404Page")));
