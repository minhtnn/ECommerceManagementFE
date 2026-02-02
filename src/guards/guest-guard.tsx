import { RootState } from "@/redux/store";
import { PATH_BRAND_DASHBOARD, PATH_GUEST, PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type GuestGuardProps = {
    children: ReactNode;
};

/**
 * GuestGuard - Chỉ dùng cho Login/Register page
 * Nếu đã login → redirect về trang tương ứng với role
 */
export default function GuestGuard({ children }: GuestGuardProps) {
    const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

    if (isAuthenticated) {
        switch (role) {
            case ERole.SystemAdmin:
                return <Navigate to={PATH_SYSTEM_ADMIN_DASHBOARD.root} replace />;
            case ERole.BrandAdmin:
                return <Navigate to={PATH_BRAND_DASHBOARD.root} replace />;
            case ERole.EndCustomer:
                return <Navigate to={PATH_GUEST.home.root} replace />;
            default:
                return <Navigate to={PATH_GUEST.home.root} replace />;
        }
    }

    return <>{children}</>;
}