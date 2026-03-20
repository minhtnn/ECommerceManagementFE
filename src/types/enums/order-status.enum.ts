export enum EOrderStatus {
    WaitingPayment,
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
}

export const getOrderStatusConfig = (status: EOrderStatus) => {
  const configs = {
    [EOrderStatus.WaitingPayment]: {
      label: "Chờ thanh toán",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    [EOrderStatus.Pending]: {
      label: "Chờ xác nhận",
      className: "bg-orange-100 text-orange-800 border-orange-300",
    },
    [EOrderStatus.Processing]: {
      label: "Đang xử lý",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
    [EOrderStatus.Shipped]: {
      label: "Đang giao hàng",
      className: "bg-purple-100 text-purple-800 border-purple-300",
    },
    [EOrderStatus.Delivered]: {
      label: "Đã giao hàng",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    [EOrderStatus.Cancelled]: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };
  return (
    configs[status] || {
      label: "Không xác định",
      className: "bg-gray-100 text-gray-800",
    }
  );
};