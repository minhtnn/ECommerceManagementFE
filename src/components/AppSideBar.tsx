import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import {
  PATH_BRAND_DASHBOARD,
  PATH_SYSTEM_ADMIN_DASHBOARD,
} from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import {
  ArrowLeftFromLineIcon,
  HomeIcon,
  ImageOff,
  PackageIcon,
  PackageSearchIcon,
  SlackIcon,
  SquareStackIcon,
  WalletIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavMain } from "./NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { useBrand } from "@/hooks/use-brand";
import { handleApiError } from "@/lib/error";
import { PageLoader } from "./LoadingScreen";

const systemAdminRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Báo cáo tổng quan",
        url: PATH_SYSTEM_ADMIN_DASHBOARD.general.app,
        icon: HomeIcon,
      },
    ],
  },
  brand: {
    mainTitle: "Quản lý thương hiệu",
    items: [
      {
        title: "Danh sách thương hiệu",
        url: PATH_SYSTEM_ADMIN_DASHBOARD.brand.root,
        icon: SlackIcon,
      },
    ],
  },
  paymentMethod: {
    mainTitle: "Quản lý phương thức thanh toán",
    items: [
      {
        title: "Danh sách phương thức",
        url: PATH_SYSTEM_ADMIN_DASHBOARD.paymentMethod.root,
        icon: PackageSearchIcon,
      },
    ],
  },
};

const brandAdminRoute = {
  dashboard: {
    mainTitle: "Tổng quan",
    items: [
      {
        title: "Báo cáo tổng quan",
        url: PATH_BRAND_DASHBOARD.general.app,
        icon: HomeIcon,
      },
    ],
  },
  catalog: {
    mainTitle: "Quản lý sản phẩm",
    items: [
      {
        title: "Danh mục",
        url: PATH_BRAND_DASHBOARD.productCategory.root,
        icon: SquareStackIcon,
      },
      {
        title: "Sản phẩm",
        url: PATH_BRAND_DASHBOARD.product.root,
        icon: PackageIcon,
      },
    ],
  },
  customer: {
    mainTitle: "Quản lý khách hàng",
    items: [
      {
        title: "Danh sách khách hàng",
        url: PATH_BRAND_DASHBOARD.customer.root,
        icon: PackageSearchIcon,
      },
    ],
  },
  order: {
    mainTitle: "Quản lý bán hàng",
    items: [
      {
        title: "Đơn hàng",
        url: PATH_BRAND_DASHBOARD.order.root,
        icon: PackageSearchIcon,
      },
      {
        title: "Phương thức thanh toán",
        url: PATH_BRAND_DASHBOARD.paymentMethod.root,
        icon: WalletIcon,
      },
    ],
  },
  promotionRule: {
    mainTitle: "Quản lý khuyến mãi",
    items: [
      {
        title: "Danh sách khuyến mãi",
        url: PATH_BRAND_DASHBOARD.promotionRule.root,
        icon: PackageSearchIcon,
      },
    ],
  },
  posts: {
    mainTitle: "Quản lý bài viết",
    items: [
      {
        title: "Danh sách bài viết",
        url: PATH_BRAND_DASHBOARD.posts.root,
        icon: PackageSearchIcon,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useSelector((state: RootState) => state.user);
  const { getBrandDetails } = useBrand();

  const {
    data: brandData,
    isError: isFetchBrandError,
    error: fetchBrandError,
    isLoading: isFetchBrandLoading,
  } = getBrandDetails(role === ERole.BrandAdmin);

  if (isFetchBrandLoading) {
    return <PageLoader />;
  }

  if (isFetchBrandError && fetchBrandError) {
    handleApiError(fetchBrandError);
  }

  const brandLogo = brandData?.data?.data?.logoUrl;

  const { toggleSidebar, open } = useSidebar();
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between my-0">
          <div
            className="cursor-pointer"
            onClick={open ? undefined : toggleSidebar}
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt="Brand logo"
                className={cn(
                  open ? "size-14" : "size-8",
                  "duration-300",
                  "rounded-full object-cover",
                )}
              />
            ) : (
              <ImageOff
                className={cn(
                  open ? "size-14" : "size-8",
                  "duration-300",
                  "rounded-full object-cover",
                )}
              />
            )}
          </div>
          {open && (
            <div className="cursor-pointer" onClick={toggleSidebar}>
              <ArrowLeftFromLineIcon className="size-5 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" />
            </div>
          )}
        </div>
      </SidebarHeader>
      {(() => {
        switch (role) {
          case ERole.SystemAdmin:
            return (
              <SidebarContent>
                <NavMain content={systemAdminRoutes.dashboard} />
                <NavMain content={systemAdminRoutes.brand} />
                <NavMain content={systemAdminRoutes.paymentMethod} />
              </SidebarContent>
            );
          case ERole.BrandAdmin:
            return (
              <SidebarContent>
                <NavMain content={brandAdminRoute.dashboard} />
                <NavMain content={brandAdminRoute.catalog} />
                <NavMain content={brandAdminRoute.customer} />
                <NavMain content={brandAdminRoute.order} />
                <NavMain content={brandAdminRoute.promotionRule} />
                <NavMain content={brandAdminRoute.posts} />
              </SidebarContent>
            );
          default:
            return null;
        }
      })()}
      <SidebarRail />
    </Sidebar>
  );
}
