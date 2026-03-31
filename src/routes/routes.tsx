// import LoadingScreen from "@/components/loading-screen";
import { ErrorFallback } from "@/components/ErrorFallback";
import LoadingScreen from "@/components/LoadingScreen";
import CustomerGuard from "@/guards/customer-guard";
import GuestGuard from "@/guards/guest-guard";
import RoleBasedGuard from "@/guards/role-based-guard";
import DashBoardLayout from "@/layouts/DashboardLayout";
import Logout from "@/pages/auth/logout";
import { ERole } from "@/types/enums/role.enum";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense, type ElementType } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import {
  PATH_AUTH,
  PATH_BRAND_DASHBOARD,
  PATH_END_CUSTOMER,
  PATH_GUEST,
  PATH_SYSTEM_ADMIN_DASHBOARD,
} from "./path";
import EndUserLayout from "@/layouts/EndUserLayout";

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

const EndUserRoute = () => (
  <EndUserLayout>
    <Outlet />
  </EndUserLayout>
);

export const AppRoutes = () =>
  useRoutes([
    //#region Auth Routes
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
          element: (
            <CustomerGuard>
              <EndUserAccountPage />
            </CustomerGuard>
          ),
        },
        {
          path: "logout",
          element: <Logout />,
        },
        {
          path: "forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "reset-password",
          element: <ResetPasswordPage />,
        },
      ],
    },
    //#endregion
    //#region Guest Routes
    {
      path: PATH_GUEST.root,
      element: <EndUserRoute />,
      children: [
        // {
        //   index: true,
        //   element: <GuestLandingPage />,
        // },
        {
          index: true,
          element: <Navigate to={`${PATH_GUEST.home.root}`} replace />,
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
          path: "news/:id",
          element: <CustomerNewsDetailPage />,
        },
        {
          path: "contact",
          element: <CustomerContactPage />,
        },
        {
          path: "services",
          children: [
            {
              index: true,
              element: (
                <Navigate to={PATH_GUEST.services.greenCoffee} replace />
              ),
            },
            {
              path: "green-coffee",
              element: <GuestServiceGreenCoffee />,
            },
            {
              path: "roasted-coffee",
              element: <GuestServiceRoastedCoffee />,
            },
          ],
        },
      ],
    },
    //#endregion
    //#region End Customer Routes
    {
      path: PATH_END_CUSTOMER.root,
      element: <EndUserRoute />,
      children: [
        {
          path: "cart",
          element: (
            <CustomerGuard>
              <EndCustomerCartPage />
            </CustomerGuard>
          ),
        },
        {
          path: "checkout",
          element: (
            <CustomerGuard>
              <EndCustomerCheckoutPage />
            </CustomerGuard>
          ),
        },
        {
          path: "orders",
          element: (
            <CustomerGuard>
              <EndCustomerOrdersListPage />
            </CustomerGuard>
          ),
        },
        {
          path: "orders/:id/view",
          element: (
            <CustomerGuard>
              <EndCustomerOrdersDetailPage />
            </CustomerGuard>
          ),
        },
        {
          path: "payment/:id",
          element: (
            <CustomerGuard>
              <EndCustomerOrderPaymentPage />
            </CustomerGuard>
          ),
        },
        {
          path: "addresses",
          element: (
            <CustomerGuard>
              <EndCustomerAddressListPage />
            </CustomerGuard>
          ),
        },
        {
          path: "change-password",
          element: (
            <CustomerGuard>
              <EndUserChangePasswordPage />
            </CustomerGuard>
          ),
        },
      ],
    },
    //#endregion
    //#region System Admin Dashboard Routes
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
          element: <SystemAdminGeneralReportPage />,
        },
        {
          path: "brands",
          element: <BrandListPage />,
        },
        {
          path: "brands/create",
          element: <BrandCreatePage />,
        },
        {
          path: "brands/:id/view",
          element: <div>Brand View Page</div>,
        },
        {
          path: "brands/:id/edit",
          element: <BrandEditPage />,
        },
        {
          path: "payment-methods",
          element: <PaymentMethodsListPage />,
        },
        {
          path: "payment-methods/create",
          element: <PaymentMethodCreatePage />,
        },
        {
          path: "payment-methods/:id/view",
          element: <div>Payment Method View Page</div>,
        },
        {
          path: "payment-methods/:id/edit",
          element: <PaymentMethodEditPage />,
        },
        {
          path: "account",
          element: <DashboardAccountPage />,
        },
        {
          path: "system-configurations",
          element: <SystemConfigPage />,
        },
      ],
    },
    //#endregion
    //#region Brand Admin Dashboard Routes
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
          element: <BrandAdminGeneralReportPage />,
        },
        {
          path: "account",
          element: <DashboardAccountPage />,
        },
        {
          path: "product-categories",
          element: <BrandAdminListProductCategoryPage />,
        },
        {
          path: "product-categories/create",
          element: <BrandAdminCreateProductCategoryPage />,
        },
        {
          path: "product-categories/:id/view",
          element: <div>Product Category View Page</div>,
        },
        {
          path: "product-categories/:id/edit",
          element: <BrandAdminEditProductCategoryPage />,
        },
        {
          path: "products",
          element: <BrandAdminListProductPage />,
        },
        {
          path: "products/create",
          element: <BrandAdminCreateProductPage />,
        },
        {
          path: "products/:id/view",
          element: <div>Product View Page</div>,
        },
        {
          path: "products/:id/edit",
          element: <BrandAdminEditProductPage />,
        },
        {
          path: "payment-methods",
          element: <BrandPaymentMethodListPage />,
        },
        {
          path: "payment-methods/create",
          element: <BrandPaymentMethodCreatePage />,
        },
        {
          path: "payment-methods/:id/view",
          element: <div>Payment Method View Page</div>,
        },
        {
          path: "payment-methods/:id/edit",
          element: <BrandPaymentMethodEditPage />,
        },
        {
          path: "customers",
          element: <BrandAdminListCustomerPage />,
        },
        {
          path: "customers/:id/view",
          element: <div>Customer View Page</div>,
        },
        {
          path: "orders",
          element: <BrandOrderListPage />,
        },
        {
          path: "orders/:id/view",
          element: <BrandOrderDetailPage />,
        },
        {
          path: "promotion-rules",
          element: <BrandPromotionRuleListPage />,
        },
        {
          path: "promotion-rules/create",
          element: <BrandPromotionRuleCreatePage />,
        },
        {
          path: "promotion-rules/:id/view",
          element: <div>Promotion Rule View Page</div>,
        },
        {
          path: "promotion-rules/:id/edit",
          element: <BrandPromotionRuleEditPage />,
        },
        {
          path: "posts",
          element: <BrandPostListPage />,
        },
        {
          path: "posts/create",
          element: <BrandPostCreatePage />,
        },
        {
          path: "posts/:id/edit",
          element: <BrandPostEditPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

//#region Authentication
const LoginPage = Loadable(
  lazy(() => import("@/pages/auth/login-and-register")),
);
const EndUserAccountPage = Loadable(
  lazy(() => import("@/pages/auth/customer-account")),
);
const EndUserChangePasswordPage = Loadable(
  lazy(() => import("@/pages/auth/customer-change-password")),
);
const DashboardAccountPage = Loadable(
  lazy(() => import("@/pages/auth/dashboard-account")),
);
const ForgotPasswordPage = Loadable(
  lazy(() => import("@/pages/auth/forgot-password")),
);
const ResetPasswordPage = Loadable(
  lazy(() => import("@/pages/auth/reset-password")),
);
//#endregion

//#region Customer
const CustomerHomePage = Loadable(lazy(() => import("@/pages/guest/home")));
const CustomerProductListPage = Loadable(
  lazy(() => import("@/pages/guest/products/list")),
);
const CustomerProductDetailPage = Loadable(
  lazy(() => import("@/pages/guest/products/detail")),
);
const CustomerIntroductionPage = Loadable(
  lazy(() => import("@/pages/guest/introduction")),
);
const CustomerNewsListPage = Loadable(
  lazy(() => import("@/pages/guest/news/list")),
);
const CustomerNewsDetailPage = Loadable(
  lazy(() => import("@/pages/guest/news/detail")),
);
const CustomerContactPage = Loadable(
  lazy(() => import("@/pages/guest/contact")),
);
const EndCustomerCartPage = Loadable(
  lazy(() => import("@/pages/end-customer/cart")),
);
const EndCustomerCheckoutPage = Loadable(
  lazy(() => import("@/pages/end-customer/checkout")),
);
const EndCustomerOrdersListPage = Loadable(
  lazy(() => import("@/pages/end-customer/order/list")),
);
const EndCustomerOrdersDetailPage = Loadable(
  lazy(() => import("@/pages/end-customer/order/detail")),
);
const GuestLandingPage = Loadable(
  lazy(() => import("@/pages/guest/landing-page")),
);
const GuestServiceGreenCoffee = Loadable(
  lazy(() => import("@/pages/guest/service/green-coffee")),
);
const GuestServiceRoastedCoffee = Loadable(
  lazy(() => import("@/pages/guest/service/roasted-coffee")),
);

const EndCustomerOrderPaymentPage = Loadable(
  lazy(() => import("@/pages/end-customer/payment")),
);
const EndCustomerAddressListPage = Loadable(
  lazy(() => import("@/pages/end-customer/address/list")),
);
//#endregion

//#region System admin
const SystemAdminGeneralReportPage = Loadable(
  lazy(() => import("@/pages/system-admin/general")),
);
const BrandListPage = Loadable(
  lazy(() => import("@/pages/system-admin/brand/list")),
);
const BrandCreatePage = Loadable(
  lazy(() => import("@/pages/system-admin/brand/create")),
);
const BrandEditPage = Loadable(
  lazy(() => import("@/pages/system-admin/brand/edit")),
);
const PaymentMethodsListPage = Loadable(
  lazy(() => import("@/pages/system-admin/payment-method/list")),
);
const PaymentMethodCreatePage = Loadable(
  lazy(() => import("@/pages/system-admin/payment-method/create")),
);
const PaymentMethodEditPage = Loadable(
  lazy(() => import("@/pages/system-admin/payment-method/edit")),
);
const SystemConfigPage = Loadable(
  lazy(() => import("@/pages/system-admin/system-config")),
);
//#endregion

//#region Brand admin
const BrandAdminGeneralReportPage = Loadable(
  lazy(() => import("@/pages/brand-admin/general")),
);
const BrandAdminCreateProductCategoryPage = Loadable(
  lazy(() => import("@/pages/brand-admin/product-category/create")),
);
const BrandAdminListProductCategoryPage = Loadable(
  lazy(() => import("@/pages/brand-admin/product-category/list")),
);
const BrandAdminEditProductCategoryPage = Loadable(
  lazy(() => import("@/pages/brand-admin/product-category/edit")),
);
const BrandAdminListProductPage = Loadable(
  lazy(() => import("@/pages/brand-admin/product/list")),
);
const BrandAdminCreateProductPage = Loadable(
  lazy(() => import("@/pages/brand-admin/product/create")),
);
const BrandAdminEditProductPage = Loadable(
  lazy(() => import("@/pages/brand-admin/product/edit")),
);
const BrandAdminListCustomerPage = Loadable(
  lazy(() => import("@/pages/brand-admin/end-customer/list")),
);
// const BrandAdminViewCustomerPage = Loadable(lazy(() => import("@/pages/brand-admin/end-customer/view")));
const BrandPaymentMethodListPage = Loadable(
  lazy(() => import("@/pages/brand-admin/payment-method/list")),
);
const BrandPaymentMethodCreatePage = Loadable(
  lazy(() => import("@/pages/brand-admin/payment-method/create")),
);
const BrandPaymentMethodEditPage = Loadable(
  lazy(() => import("@/pages/brand-admin/payment-method/edit")),
);
const BrandOrderListPage = Loadable(
  lazy(() => import("@/pages/brand-admin/order/list")),
);
const BrandOrderDetailPage = Loadable(
  lazy(() => import("@/pages/brand-admin/order/detail")),
);
const BrandPromotionRuleListPage = Loadable(
  lazy(() => import("@/pages/brand-admin/promotion-rule/list")),
);
const BrandPromotionRuleCreatePage = Loadable(
  lazy(() => import("@/pages/brand-admin/promotion-rule/create")),
);
const BrandPromotionRuleEditPage = Loadable(
  lazy(() => import("@/pages/brand-admin/promotion-rule/edit")),
);
const BrandPostListPage = Loadable(
  lazy(() => import("@/pages/brand-admin/post/list")),
);
const BrandPostCreatePage = Loadable(
  lazy(() => import("@/pages/brand-admin/post/create")),
);
const BrandPostEditPage = Loadable(
  lazy(() => import("@/pages/brand-admin/post/edit")),
);

//#endregion

const NotFoundPage = Loadable(lazy(() => import("@/pages/404Page")));
