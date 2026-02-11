import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { EOrderStatus } from "@/types/enums/order-status.enum";

interface UpdateOrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: EOrderStatus;
  onConfirm: (newStatus: EOrderStatus) => void;
  isLoading?: boolean;
}

const UpdateOrderStatusDialog = ({
  open,
  onOpenChange,
  currentStatus,
  onConfirm,
  isLoading = false,
}: UpdateOrderStatusDialogProps) => {
  const [newStatus, setNewStatus] = useState<EOrderStatus | null>(null);

  // Get allowed next statuses based on current status
  const getAllowedStatuses = () => {
    const statusFlow: Record<EOrderStatus, EOrderStatus[]> = {
      [EOrderStatus.WaitingPayment]: [EOrderStatus.Pending],
      [EOrderStatus.Pending]: [EOrderStatus.Processing],
      [EOrderStatus.Processing]: [EOrderStatus.Shipped],
      [EOrderStatus.Shipped]: [EOrderStatus.Delivered],
      [EOrderStatus.Delivered]: [],
      [EOrderStatus.Cancelled]: [],
    };

    return statusFlow[currentStatus] || [];
  };

  const getStatusLabel = (status: EOrderStatus) => {
    const labels: Record<EOrderStatus, string> = {
      [EOrderStatus.WaitingPayment]: "Chờ thanh toán",
      [EOrderStatus.Pending]: "Chờ xử lý",
      [EOrderStatus.Processing]: "Đang xử lý",
      [EOrderStatus.Shipped]: "Đang giao hàng",
      [EOrderStatus.Delivered]: "Đã giao hàng",
      [EOrderStatus.Cancelled]: "Đã hủy",
    };
    return labels[status];
  };

  const handleConfirm = () => {
    if (newStatus !== null) {
      onConfirm(newStatus);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNewStatus(null);
      onOpenChange(false);
    }
  };

  const allowedStatuses = getAllowedStatuses();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            Trạng thái hiện tại:{" "}
            <strong>{getStatusLabel(currentStatus)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-status">
              Trạng thái mới <span className="text-red-500">*</span>
            </Label>
            <Select
              value={newStatus !== null ? String(newStatus) : ""}
              onValueChange={(value) => setNewStatus(Number(value) as EOrderStatus)}
              disabled={isLoading || allowedStatuses.length === 0}
            >
              <SelectTrigger id="new-status">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {allowedStatuses.map((status) => (
                  <SelectItem key={status} value={String(status)}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {allowedStatuses.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Không thể chuyển sang trạng thái khác từ trạng thái hiện tại
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={newStatus === null || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrderStatusDialog;