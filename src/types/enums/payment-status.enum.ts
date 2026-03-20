export enum EPaymentStatus {
    Pending,
    Processing,
    Completed,
    Failed,
    Expired,
}

export const getPaymentStatusConfig = (status: EPaymentStatus) => {
    const configs = {
        [EPaymentStatus.Pending]: {
            label: "Chờ thanh toán",
            className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        },
        [EPaymentStatus.Processing]: {
            label: "Đang xử lý",
            className: "bg-blue-100 text-blue-800 border-blue-300",
        },
        [EPaymentStatus.Completed]: {
            label: "Thành công",
            className: "bg-green-100 text-green-800 border-green-300",
        },
        [EPaymentStatus.Failed]: {
            label: "Thất bại",
            className: "bg-red-100 text-red-800 border-red-300",
        },
        [EPaymentStatus.Expired]: {
            label: "Hết hạn",
            className: "bg-gray-100 text-gray-800 border-gray-300",
        },
    };
    return (
        configs[status] || {
            label: "Không xác định",
            className: "bg-gray-100 text-gray-800",
        }
    );
};