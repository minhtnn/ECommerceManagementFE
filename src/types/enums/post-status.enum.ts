export enum EPostStatus {
    PendingReview = 0,
    Published = 1,
    Unpublished = 2,
    Rejected = 3,
}

export const POST_STATUS_LABEL: Record<EPostStatus, string> = {
    [EPostStatus.PendingReview]: "Chờ duyệt",
    [EPostStatus.Published]: "Đã đăng",
    [EPostStatus.Unpublished]: "Chưa đăng",
    [EPostStatus.Rejected]: "Bị từ chối",
};

export const POST_STATUS_COLOR: Record<EPostStatus, string> = {
    [EPostStatus.PendingReview]: "bg-yellow-100 text-yellow-700",
    [EPostStatus.Published]: "bg-green-100 text-green-800",
    [EPostStatus.Unpublished]: "bg-gray-100 text-gray-600",
    [EPostStatus.Rejected]: "bg-red-100 text-red-700",
};