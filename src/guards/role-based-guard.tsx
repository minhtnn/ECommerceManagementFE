import LoginPage from "@/pages/auth/login";
import type { RootState } from "@/redux/store";
import {
    PATH_AUTH,
    PATH_BRAND_DASHBOARD,
    PATH_GUEST,
    PATH_SYSTEM_ADMIN_DASHBOARD,
} from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import { useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

type RoleBasedGuardProps = {
  role: ERole;
  children: ReactNode;
};

const RoleBasedGuard = ({ children, role }: RoleBasedGuardProps) => {
  const { isAuthenticated, role: userRole } = useSelector(
    (state: RootState) => state.user
  );
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );
  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    if (pathname === "/") {
      return <Navigate to={PATH_AUTH.login} />;
    }
    return <Navigate to={PATH_AUTH.login} />;
  }
  if (userRole !== role) {
    switch (userRole) {
      case ERole.SystemAdmin:
        return <Navigate to={PATH_SYSTEM_ADMIN_DASHBOARD.root} replace />;
      case ERole.BrandAdmin:
        return <Navigate to={PATH_BRAND_DASHBOARD.root} replace />;
      default:
        return <Navigate to={PATH_GUEST.root} replace />;
    }
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default RoleBasedGuard;
