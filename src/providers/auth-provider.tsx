import { authApi } from "@/apis/auth.api";
import { handleSetIsAuthLoading } from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import { logout, setInitialized, setUser } from "@/redux/user/user-slice";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector((state: RootState) => state.modal);
  const { isInitialized } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(handleSetIsAuthLoading(true));

      try {
        // BƯỚC 1: ĐỌC LOCALSTORAGE TRƯỚC
        const userInfoStr = localStorage.getItem("userInfo");

        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);

            if (userInfo.accessToken && !isTokenExpired(userInfo.accessToken)) {
              dispatch(setUser(userInfo));
              return;
            }
          } catch (parseError) {
            toast.warning(
              "Failed to parse userInfo from localStorage:",
              parseError,
            );
            localStorage.removeItem("userInfo");
          }
        }

        // BƯỚC 3: KIỂM TRA CÓ REFRESH TOKEN COOKIE
        const hasRefreshToken = document.cookie.includes("refreshToken");

        if (!hasRefreshToken) {
          throw new Error("No refresh token");
        }

        const response = await authApi.refresh({
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        if (response.data.status !== 200) {
          throw new Error(response.data.message || "Refresh failed");
        }

        const userData = response.data.data;

        localStorage.setItem("userInfo", JSON.stringify(userData));

        dispatch(setUser(userData));
      } catch (error: any) {
        toast.warning(
          "⚠️ Session restore failed:",
          error?.response?.data?.message || error.message,
        );

        localStorage.removeItem("userInfo");
        dispatch(logout());
      } finally {
        dispatch(setInitialized(true));
        dispatch(handleSetIsAuthLoading(false));
      }
    };

    if (!isInitialized) {
      initAuth();
    } else {
      dispatch(handleSetIsAuthLoading(false));
    }
  }, [dispatch, isInitialized]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;

    // Thêm buffer 30 giây để tránh edge case
    const bufferTime = 30 * 1000;
    return Date.now() >= exp - bufferTime;
  } catch {
    return true;
  }
}
