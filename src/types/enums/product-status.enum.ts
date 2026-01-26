export enum EProductStatus
{
    Active=0,
    Inactive=1,
    Discontinued=2
}

export const ProductStatusLabels: Record<EProductStatus, string> = {
    [EProductStatus.Active]: "Đang hoạt động",
    [EProductStatus.Inactive]: "Không hoạt động",
    [EProductStatus.Discontinued]: "Ngừng kinh doanh",
};

export const ProductStatusColors: Record<EProductStatus, string> = {
    [EProductStatus.Active]: "bg-green-100 text-green-800",
    [EProductStatus.Inactive]: "bg-gray-100 text-gray-800",
    [EProductStatus.Discontinued]: "bg-red-100 text-red-800",
};