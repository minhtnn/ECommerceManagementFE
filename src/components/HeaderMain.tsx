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

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Separator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// // import { useSignalRContext } from "@/context/signalr-provider"
// // import { useBrand } from "@/hooks/use-brand"
// // import { useNotification } from "@/hooks/use-notifcation"
// import { useTheme } from "@/providers/theme-provider";
// import type { RootState } from "@/redux/store";
// // import { PATH_ADMIN_DASHBOARD, PATH_AUTH, PATH_BRAND_DASHBOARD, PATH_STORE_DASHBOARD } from "@/routes/path"
// // import type { TRole } from "@/schema/role.schema"
// import { PATH_AUTH } from "@/routes/path";
// import {
//   AlertCircle,
//   ChevronLeft,
//   ImageOff,
//   Info,
//   ListCollapseIcon,
//   LogOut,
//   Moon,
//   Settings,
//   Sun,
// } from "lucide-react";
// import { useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useSidebar } from "./ui/sidebar";
// import { useBrand } from "@/hooks/use-brand";
// import { ERole } from "@/types/enums/role.enum";
// import { handleApiError } from "@/lib/error";

// const HeaderMain = () => {
//   const pathname = useLocation().pathname;
//   const navigate = useNavigate();
//   const { isMobile, toggleSidebar } = useSidebar();
//   const { setTheme } = useTheme();
//   const shouldShowBack = () => {
//     const segments = pathname.split("/").filter(Boolean);
//     return segments.length >= 4;
//   };
//   const { role } = useSelector((state: RootState) => state.user);
//   const { getBrandDetails } = useBrand();

//   const {
//     data: brandData,
//     isError: isFetchBrandError,
//     error: fetchBrandError,
//     isLoading: isFetchBrandLoading,
//   } = getBrandDetails(role == ERole.BrandAdmin);

//   if (isFetchBrandLoading) return <div>Loading ...</div>;

//   if (isFetchBrandError && fetchBrandError) handleApiError(fetchBrandError);

//   //#region Unneeded
//   const [shouldFetchNotifications, setShouldFetchNotifications] =
//     useState(false);

//   // const { unReadNumber, setUnReadNumber } = useSignalRContext();

//   // const {
//   //     notifications,
//   //     totalNotifications,
//   //     fetchNextPage,
//   //     hasNextPage,
//   //     isFetchingNextPage,
//   //     deleteNotificationsMutation,
//   //     markNotificationAsReadMutation,
//   //     isLoading,
//   //     refetch
//   // } = useNotification( {
//   //     enabled: shouldFetchNotifications
//   // } );

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const getNotificationIcon = (type: number) => {
//     return type === 0 ? (
//       <Info className="h-4 w-4 text-blue-500" />
//     ) : (
//       <AlertCircle className="h-4 w-4 text-red-500" />
//     );
//   };

//   const getNotificationStyle = (type: number, isRead: boolean) => {
//     return type === 0
//       ? `border-l-4 border-blue-500 ${
//           isRead ? "bg-blue-0" : "bg-blue-20"
//         }  hover:bg-transparent`
//       : `border-l-4 border-red-500 ${
//           isRead ? "bg-red-0" : "bg-red-20"
//         } hover:bg-transparent`;
//   };

//   // const handleScroll = useCallback( () =>
//   // {
//   //     const container = scrollContainerRef.current;
//   //     if ( !container || !hasNextPage || isFetchingNextPage ) return;

//   //     // Calculate if user has scrolled near the bottom (within 100px)
//   //     const { scrollTop, scrollHeight, clientHeight } = container;
//   //     const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100;

//   //     if ( scrolledToBottom )
//   //     {
//   //         fetchNextPage();
//   //     }
//   // }, [ hasNextPage, isFetchingNextPage, fetchNextPage ] );

//   // useEffect( () =>
//   // {
//   //     const container = scrollContainerRef.current;
//   //     if ( container )
//   //     {
//   //         container.addEventListener( 'scroll', handleScroll );
//   //         return () => container.removeEventListener( 'scroll', handleScroll );
//   //     }
//   // }, [ handleScroll ] );

//   // const handleClearNotifications = () =>
//   // {
//   //     deleteNotificationsMutation.mutate();
//   //     setUnReadNumber( 0 );
//   // };

//   // const handleMarkAllAsRead = () =>
//   // {
//   //     markNotificationAsReadMutation.mutate();
//   //     setUnReadNumber( 0 );
//   // };

//   // const handleNotificationDropdownOpen = ( open: boolean ) =>
//   // {
//   //     if ( open )
//   //     {
//   //         refetch();
//   //         setShouldFetchNotifications( true );
//   //     } else
//   //     {
//   //         setShouldFetchNotifications( false );
//   //     }
//   // };

//   //#endregion

//   return (
//     <nav className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 bg-sidebar/98 z-10">
//       <div className="flex items-center gap-2 px-4 justify-between w-full">
//         <div className="flex items-center gap-2">
//           {shouldShowBack() && (
//             <>
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => {
//                         navigate(
//                           "/" +
//                             pathname
//                               .replace(/^\//, "")
//                               .split("/")
//                               .slice(0, 3)
//                               .join("/")
//                         );
//                       }}
//                       className="gap-1 px-2"
//                     >
//                       <ChevronLeft className="h-6 w-6" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Quay lại trang trước</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </>
//           )}
//         </div>
//         <div className="flex items-center gap-2">
//           {isMobile && (
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="rounded-full bg-white"
//                     onClick={toggleSidebar}
//                   >
//                     <span className="sr-only">Toggle sidebar</span>
//                     <ListCollapseIcon className="size-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Hiển thị thanh bên</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           )}

//           {/* <DropdownMenu onOpenChange={ handleNotificationDropdownOpen }>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="rounded-full bg-white relative">
//                                 <NotificationIcon className="size-5" />
//                                 { ( unReadNumber ) > 0 && (
//                                     <Badge
//                                         variant="destructive"
//                                         className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
//                                     >
//                                         { ( unReadNumber ) > 99 ? '99+' : ( unReadNumber ) }
//                                     </Badge>
//                                 ) }
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-80">
//                             <div className="flex items-center justify-between p-2">
//                                 <DropdownMenuLabel className="text-sm font-semibold">
//                                     Thông báo ({ totalNotifications })
//                                 </DropdownMenuLabel>
//                                 { totalNotifications > 0 && (
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={ handleClearNotifications }
//                                         disabled={ deleteNotificationsMutation.isPending }
//                                         className="h-8 px-2 text-xs"
//                                     >
//                                         <Trash2 className="h-3 w-3 mr-1" />
//                                         Xóa tất cả
//                                     </Button>
//                                 ) }
//                             </div>
//                             <DropdownMenuSeparator />

//                             <div
//                                 ref={ scrollContainerRef }
//                                 className="max-h-96 overflow-y-auto my-1"
//                                 style={ {
//                                     scrollBehavior: 'smooth'
//                                 } }
//                             >
//                                 { !shouldFetchNotifications ? (
//                                     <div className="p-4 text-center text-muted-foreground text-sm">
//                                         Click to load notifications...
//                                     </div>
//                                 ) : isLoading ? (
//                                     <div className="p-4 text-center">
//                                         <Loader2 className="h-4 w-4 animate-spin mx-auto" />
//                                         <p className="text-sm text-muted-foreground mt-2">Đang tải thông báo...</p>
//                                     </div>
//                                 ) : notifications.length === 0 ? (
//                                     <div className="p-4 text-center text-muted-foreground text-sm">
//                                         Không có thông báo nào
//                                     </div>
//                                 ) : (
//                                     <>
//                                         { notifications.map( ( notificationMessage, index ) => (
//                                             <DropdownMenuItem
//                                                 key={ `${ notificationMessage.id }-${ index }` }
//                                                 className={ `flex items-start my-2 gap-3 p-3 ${ getNotificationStyle( notificationMessage.notification.type, notificationMessage.isRead ) }` }
//                                             >
//                                                 <div className="flex-shrink-0 mt-0.5">
//                                                     { getNotificationIcon( notificationMessage.notification.type ) }
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-sm text-gray-900 break-words">
//                                                         { notificationMessage.notification.message }
//                                                     </p>
//                                                     <p className="text-xs text-muted-foreground mt-1">
//                                                         { notificationMessage.notification.type === 0 ? 'Thông tin' : 'Lỗi' }
//                                                         { !notificationMessage.isRead && (
//                                                             <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
//                                                         ) }
//                                                     </p>
//                                                 </div>
//                                             </DropdownMenuItem>
//                                         ) ) }
//                                         { isFetchingNextPage && (
//                                             <div className="p-4 text-center">
//                                                 <Loader2 className="h-4 w-4 animate-spin mx-auto" />
//                                                 <p className="text-xs text-muted-foreground mt-1">Đang tải thêm...</p>
//                                             </div>
//                                         ) }

//                                         { !hasNextPage && notifications.length > 0 && (
//                                             <div className="p-2 text-center">
//                                                 <p className="text-xs text-muted-foreground">Đã hiển thị tất cả thông báo</p>
//                                             </div>
//                                         ) }
//                                     </>
//                                 ) }
//                             </div>

//                             { notifications.length > 0 && (
//                                 <>
//                                     <DropdownMenuSeparator />
//                                     <div className="p-2">
//                                         <Button
//                                             variant="outline"
//                                             size="sm"
//                                             className="w-full text-xs"
//                                             onClick={ handleMarkAllAsRead }
//                                             disabled={ markNotificationAsReadMutation.isPending }
//                                         >
//                                             { markNotificationAsReadMutation.isPending ? (
//                                                 <>
//                                                     <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                                                     Đang xử lý...
//                                                 </>
//                                             ) : (
//                                                 'Đánh dấu tất cả đã đọc'
//                                             ) }
//                                         </Button>
//                                     </div>
//                                 </>
//                             ) }
//                         </DropdownMenuContent>
//                     </DropdownMenu> */}

//           <Separator orientation="vertical" className="h-5" />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="rounded-full bg-white"
//               >
//                 {brandData != null &&
//                 brandData.data != null &&
//                 brandData.data.data != null &&
//                 brandData.data.data.logoUrl != null ? (
//                   <div>
//                     <img
//                       src={brandData.data.data.logoUrl}
//                       alt="Preview"
//                       className="w-full h-auto rounded-lg object-cover"
//                     />
//                   </div>
//                 ) : (
//                   <div>
//                     <ImageOff className="text-black" />
//                   </div>
//                 )}
//                 <span className="sr-only">Toggle theme</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               className="w-(--radix-dropdown-menu-trigger-width) min-w-54 rounded-lg"
//               align="end"
//               side="bottom"
//               sideOffset={4}
//             >
//               <DropdownMenuLabel className="text-sm font-medium">
//                 Chế độ giao diện
//               </DropdownMenuLabel>
//               <DropdownMenuItem
//                 onClick={() => setTheme("light")}
//                 className="gap-2 p-2 hover:cursor-pointer"
//               >
//                 <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
//                   <Sun className="size-4" />
//                 </div>
//                 <div className="text-muted-foreground font-medium">Sáng</div>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setTheme("dark")}>
//                 <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
//                   <Moon className="size-4" />
//                 </div>
//                 <div className="text-muted-foreground font-medium">Tối</div>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setTheme("system")}>
//                 <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
//                   <Settings className="size-4" />
//                 </div>
//                 <div className="text-muted-foreground font-medium">
//                   Hệ thống
//                 </div>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuLabel className="text-sm font-medium">
//                 Cài đặt
//               </DropdownMenuLabel>
//               {/* <Link to={ role === "BrandAdmin" ? PATH_BRAND_DASHBOARD.general.app : role === "StoreAdmin" ? PATH_STORE_DASHBOARD.storeSettings.root : PATH_ADMIN_DASHBOARD.general.app }>
//                                 <DropdownMenuItem className="gap-2 p-2 hover:cursor-pointer">
//                                     <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
//                                         <UserCog2 className="size-4" />
//                                     </div>
//                                     <div className="text-muted-foreground font-medium">Thông tin</div>
//                                 </DropdownMenuItem>
//                             </Link> */}
//               <Link to={PATH_AUTH.logout}>
//                 <DropdownMenuItem className="gap-2 p-2 hover:cursor-pointer">
//                   <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
//                     <LogOut className="size-4" />
//                   </div>
//                   <div className="text-muted-foreground font-medium">
//                     Đăng Xuất
//                   </div>
//                 </DropdownMenuItem>
//               </Link>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default HeaderMain;
