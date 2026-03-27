import { authApi } from "@/apis/auth.api";
import { logout, setUser } from "@/redux/user/user-slice";
import { PATH_AUTH } from "@/routes/path";
import {
  TForgotPasswordRequest,
  TResetPasswordRequest,
  TValidateResetTokenRequest,
} from "@/schemas/auth.schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UseAccountDetailParams {}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const login = () =>
    useMutation({
      mutationFn: authApi.login,
    });
  const endCustomerGoogleLoginAndRegister = () =>
    useMutation({
      mutationFn: authApi.endCustomerGoogleLoginAndRegister,
    });
  const updateAccount = () =>
    useMutation({
      mutationFn: (data: FormData) => authApi.updateAccount(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["account-detail"] });
      },
    });
  const customerNormalRegister = () =>
    useMutation({
      mutationFn: authApi.endCustomerNormalRegister,
    });

  // const customerGoogleRegister = () =>
  //   useMutation({
  //     mutationFn: authApi.endCustomerGoogleRegister,
  //   });
  const verifyEmail = () =>
    useMutation({
      mutationFn: authApi.verifyEmail,
    });
  const resendOtpVerifyEmail = () =>
    useMutation({
      mutationFn: authApi.resendOTPVerifyEmail,
    });
  const getAccountDetail = (params: UseAccountDetailParams = {}) => {
    return useSuspenseQuery({
      queryKey: ["account-detail"],
      queryFn: async () => authApi.getAccountDetail(params),
      retry: 0,
      refetchOnWindowFocus: false,
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
  const changePassword = () =>
    useMutation({
      mutationFn: authApi.changePassword,
      onSuccess: (response) => {
        toast.success(
          response.data.message ||
            "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        );
        // Auto logout after successful password change
        setTimeout(() => {
          dispatch(logout());
          navigate(PATH_AUTH.login);
        }, 2000);
      },
    });
  const forgotPassword = () =>
    useMutation({
      mutationFn: async (data: TForgotPasswordRequest) =>
        authApi.forgotPassword(data),
    });
  const validateResetToken = () =>
    useMutation({
      mutationFn: async (data: TValidateResetTokenRequest) =>
        authApi.validateResetToken(data),
    });
  const resetPassword = () =>
    useMutation({
      mutationFn: async (data: TResetPasswordRequest) =>
        authApi.resetPassword(data),
    });
  return {
    login,
    endCustomerGoogleLoginAndRegister,
    customerNormalRegister,
    // customerGoogleRegister,
    getAccountDetail,
    verifyEmail,
    resendOtpVerifyEmail,
    logout: handleLogout,
    logoutAllDevices: handleLogoutAllDevices,
    changePassword,
    updateAccount,
    forgotPassword,
    validateResetToken,
    resetPassword,
  };
};
