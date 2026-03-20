import type { BaseResponse } from "@/types/response.type";
import { toast } from "sonner";

const toSafeString = (value: any): string => {
  // Null/undefined
  if (value === null || value === undefined) {
    return "";
  }

  // String - return trực tiếp
  if (typeof value === "string") {
    return value;
  }

  // Error object
  if (value instanceof Error) {
    return value.message || "Đã xảy ra lỗi";
  }

  // Array - lấy phần tử đầu tiên
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    return toSafeString(value[0]);
  }

  // Object - tìm thuộc tính message/errorMessage
  if (typeof value === "object") {
    if (value.message) return String(value.message);
    if (value.errorMessage) return String(value.errorMessage);
    if (value.error) return toSafeString(value.error);

    // Fallback: stringify
    try {
      const str = JSON.stringify(value);
      // Nếu stringify ra object rỗng, return fallback
      if (str === "{}" || str === "[]") return "Đã xảy ra lỗi";
      return str;
    } catch {
      return "Đã xảy ra lỗi";
    }
  }

  // Number, Boolean, etc - convert to string
  return String(value);
};

export const handleApiError = (error: any): BaseResponse<any> | null => {
  console.log("Error caught:", error); // Debug log
  console.log("Error response:", error?.response); // Debug log

  let handledError: BaseResponse<any> | null = null;

  if (error.response) {
    const { status, data } = error.response;
    console.log("Response status:", status); // Debug
    console.log("Response data:", data); // Debug

    if (status === 401) {
      handledError = {
        status: status,
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        data: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    } else if (status === 403) {
      handledError = {
        status: status,
        message: "Bạn không có quyền truy cập vào tài nguyên này.",
        data: "Bạn không có quyền truy cập vào tài nguyên này.",
      };
    } else if (status === 400) {
      let errorMessage = "Dữ liệu không hợp lệ.";

      if (data?.message) {
        errorMessage = toSafeString(data.message);
      } else if (data?.data) {
        errorMessage = toSafeString(data.data);
      } else if (data?.errors) {
        // ASP.NET validation errors
        const firstError = Object.values(data.errors)[0];
        errorMessage = toSafeString(firstError);
      } else if (data?.title) {
        // ASP.NET problem details
        errorMessage = toSafeString(data.title);
      }

      handledError = {
        status: status,
        message: errorMessage,
        data: errorMessage,
      };
    } else if (data && typeof data === "object") {
      // Generic object response
      const message = toSafeString(
        data.message || data.title || "Đã xảy ra lỗi",
      );
      const dataStr = toSafeString(
        data.data || data.message || data.title || "Vui lòng thử lại",
      );

      handledError = {
        status: data.status || status,
        message: message,
        data: dataStr,
      };
    } else {
      handledError = {
        status: status,
        message: toSafeString(data) || "Một lỗi không xác định đã xảy ra.",
        data: toSafeString(data) || "Một lỗi không xác định đã xảy ra.",
      };
    }
  } else if (error.request) {
    handledError = {
      status: 0,
      message: "Không nhận được phản hồi từ máy chủ.",
      data: "Không nhận được phản hồi từ máy chủ.",
    };
  } else {
    // Generic error (including Firebase errors)
    handledError = {
      status: 0,
      message: toSafeString(error.message || error),
      data: toSafeString(error.message || error),
    };
  }

  const safeMessage =
    toSafeString(handledError.message) || "Đã xảy ra lỗi không xác định.";
  const safeData = toSafeString(handledError.data) || "Vui lòng thử lại sau.";

  console.log("Final error message:", safeMessage); // Debug
  console.log("Final error data:", safeData); // Debug

  // Show toast notification
  toast.error(safeMessage, {
    duration: 5000,
    description: (
      <span className="text-xs font-medium text-red-500">{safeData}</span>
    ),
    position: "top-right",
  });

  return {
    ...handledError,
    message: safeMessage,
    data: safeData,
  };
};
