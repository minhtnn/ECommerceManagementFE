import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/providers/theme-provider";
import type { RootState } from "@/redux/store";
import {
  PATH_AUTH,
  PATH_BRAND_DASHBOARD,
  PATH_END_CUSTOMER,
  PATH_GUEST,
  PATH_SYSTEM_ADMIN_DASHBOARD,
} from "@/routes/path";
import {
  ChevronLeft,
  CircleUserIcon,
  ImageOff,
  ListCollapseIcon,
  LogOut,
  Moon,
  Settings,
  Smartphone,
  Sun,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "./ui/sidebar";
import { useBrand } from "@/hooks/use-brand";
import { ERole } from "@/types/enums/role.enum";
import { handleApiError } from "@/lib/error";
import { PageLoader } from "./LoadingScreen";
import { useAuth } from "@/hooks/use-auth";

const HeaderMain = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { isMobile, toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const { role } = useSelector((state: RootState) => state.user);
  const { getBrandDetails } = useBrand();
  const { logout, logoutAllDevices } = useAuth();

  const {
    data: brandData,
    isError: isFetchBrandError,
    error: fetchBrandError,
    isLoading: isFetchBrandLoading,
  } = getBrandDetails(role === ERole.BrandAdmin);

  const shouldShowBack = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length >= 4;
  };

  const handleBackNavigation = () => {
    const pathSegments = pathname.replace(/^\//, "").split("/").slice(0, 3);
    navigate(`/${pathSegments.join("/")}`);
  };

  if (isFetchBrandLoading) {
    return <PageLoader />;
  }

  if (isFetchBrandError && fetchBrandError) {
    handleApiError(fetchBrandError);
  }

  const brandLogo = brandData?.data?.data?.logoUrl;

  return (
    <nav className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 bg-sidebar/98 z-10">
      <div className="flex items-center gap-2 px-4 justify-between w-full">
        {/* Left Section - Back Button */}
        <div className="flex items-center gap-2">
          {shouldShowBack() && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackNavigation}
                    className="gap-1 px-2"
                    aria-label="Quay lại trang trước"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quay lại trang trước</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Sidebar Toggle */}
          {isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                  >
                    <ListCollapseIcon className="size-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hiển thị thanh bên</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Separator orientation="vertical" className="h-5" />

          {/* Theme & Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white border"
                aria-label="Mở menu cài đặt"
              >
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt="Brand logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <ImageOff className="text-black size-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              align="end"
              side="bottom"
              sideOffset={4}
            >
              {/* Theme Section */}
              <DropdownMenuLabel className="text-sm font-medium">
                Chế độ giao diện
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Sun className="size-4" />
                </div>
                <span className="text-muted-foreground font-medium">Sáng</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Moon className="size-4" />
                </div>
                <span className="text-muted-foreground font-medium">Tối</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Settings className="size-4" />
                </div>
                <span className="text-muted-foreground font-medium">
                  Hệ thống
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Settings Section */}
              <DropdownMenuLabel className="text-sm font-medium">
                Tài khoản
              </DropdownMenuLabel>
              <Link
                to={
                  role === ERole.SystemAdmin
                    ? PATH_SYSTEM_ADMIN_DASHBOARD.general.account
                    : role === ERole.BrandAdmin
                      ? PATH_BRAND_DASHBOARD.general.account
                      : PATH_AUTH.account
                }
              >
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <CircleUserIcon className="size-4" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    Tài khoản
                  </span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              {/* Settings Section */}
              <DropdownMenuLabel className="text-sm font-medium">
                Cài đặt
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={logout}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <LogOut className="size-4" />
                </div>
                <span className="text-muted-foreground font-medium">
                  Đăng Xuất
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logoutAllDevices}
                className="gap-2 p-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Đăng xuất tất cả thiết bị
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default HeaderMain;