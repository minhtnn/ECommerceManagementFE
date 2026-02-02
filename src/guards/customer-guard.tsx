import { RootState } from "@/redux/store";
import { PATH_AUTH } from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type CustomerGuardProps = {
    children: ReactNode;
};

export default function CustomerGuard({ children }: CustomerGuardProps) {
    const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

    if (!isAuthenticated || role !== ERole.EndCustomer) {
        return <Navigate to={PATH_AUTH.login} replace />;
    }

    return <>{children}</>;
}