export enum EPostStatus {
    Published,
    Hidden,
    PendingReview,
    NeedsRevision 
}

export const POST_STATUS_LABEL: Record<EPostStatus, string> = {
    [EPostStatus.PendingReview]: "Chờ duyệt",
    [EPostStatus.Published]: "Đã đăng",
    [EPostStatus.Hidden]: "Đã ẩn",
    [EPostStatus.NeedsRevision]: "Cần sửa đổi",
};

export const POST_STATUS_COLOR: Record<EPostStatus, string> = {
    [EPostStatus.PendingReview]: "bg-yellow-100 text-yellow-700",
    [EPostStatus.Published]: "bg-green-100 text-green-800",
    [EPostStatus.Hidden]: "bg-gray-100 text-gray-600",
    [EPostStatus.NeedsRevision]: "bg-blue-100 text-blue-700",
};

export const ALLOWED_TRANSITIONS: Record<EPostStatus, EPostStatus[]> = {
    [EPostStatus.PendingReview]: [EPostStatus.Hidden, EPostStatus.Published, EPostStatus.NeedsRevision],
    [EPostStatus.NeedsRevision]: [EPostStatus.PendingReview, EPostStatus.Hidden],
    [EPostStatus.Published]:     [EPostStatus.Hidden],
    [EPostStatus.Hidden]:        [EPostStatus.Published],
};

