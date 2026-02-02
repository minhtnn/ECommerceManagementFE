import { authApi } from "@/apis/auth.api";
import { logout, setUser } from "@/redux/user/user-slice";
import { PATH_AUTH } from "@/routes/path";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UseAccountDetailParams {}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const userData = response.data.data;
      dispatch(setUser(userData));
    },
    onError: (error: any) => {
      toast.error("Đăng nhập thất bại:", error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.endCustomerRegister,
    onError: (error: any) => {
      toast.error("Đăng ký thất bại:", error);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onError: (error: any) => {
      toast.error("Xác thực email thất bại:", error);
    },
  });
  const resendOtpVerifyEmailMutation = useMutation({
    mutationFn: authApi.resendOTPVerifyEmail,
    onError: (error: any) => {
      toast.error("Gửi lại mã OTP thất bại:", error);
    },
  });

  const getAccountDetail = (params: UseAccountDetailParams = {}) => {
    return useSuspenseQuery({
      queryKey: ["account-detail"],
      queryFn: async () => authApi.getAccountDetail(params),
    });
  };

  const handleLogout = async () => {
    try {
      var result = await authApi.logout();

      if (result.status === 200) {
        dispatch(logout());
        navigate(PATH_AUTH.login);
        toast.success("Đăng xuất thành công");
      }
    } catch (error: any) {
      dispatch(logout());
      navigate(PATH_AUTH.login);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      const response = await authApi.logoutAllDevices();

      dispatch(logout());
      navigate(PATH_AUTH.login);

      toast.success(
        response.data.message || "Đã đăng xuất khỏi tất cả thiết bị",
      );
    } catch (error: any) {
      console.error("Logout all devices error:", error);

      if (error.response?.status === 401) {
        dispatch(logout());
        navigate(PATH_AUTH.login);
        toast.info("Phiên đăng nhập đã hết hạn");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Không thể đăng xuất tất cả thiết bị",
        );
      }
    }
  };

  return {
    loginMutation,
    registerMutation,
    getAccountDetail,
    verifyEmailMutation,
    resendOtpVerifyEmailMutation,
    logout: handleLogout,
    logoutAllDevices: handleLogoutAllDevices,
  };
};
