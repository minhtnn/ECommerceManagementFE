import { RootState } from "@/redux/store";
import { PATH_BRAND_DASHBOARD, PATH_GUEST, PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type GuestGuardProps = {
    children: ReactNode;
};

export default function GuestGuard ( { children }: GuestGuardProps )
{
    const { isAuthenticated, role } = useSelector( ( state: RootState ) => state.user );

    if ( isAuthenticated )
    {
        switch ( role )
        {
            case ERole.SystemAdmin:
                return <Navigate to={ PATH_SYSTEM_ADMIN_DASHBOARD.root } />;
            case ERole.BrandAdmin:
                return <Navigate to={ PATH_BRAND_DASHBOARD.root } />;
            default:
                return <Navigate to={PATH_GUEST.root} />;
        }
    }

    return <>{ children }</>;
}