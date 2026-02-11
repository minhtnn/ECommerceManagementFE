import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EditShippingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    shippingAddress: string;
    shippingContact: string;
    customerNote?: string;
  };
  onConfirm: (data: {
    shippingAddress: string;
    shippingContact: string;
    customerNote: string;
  }) => void;
  isLoading?: boolean;
}

const EditShippingInfoDialog = ({
  open,
  onOpenChange,
  initialData,
  onConfirm,
  isLoading = false,
}: EditShippingInfoDialogProps) => {
  const [formData, setFormData] = useState({
    shippingAddress: "",
    shippingContact: "",
    customerNote: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        shippingAddress: initialData.shippingAddress,
        shippingContact: initialData.shippingContact,
        customerNote: initialData.customerNote || "",
      });
    }
  }, [open, initialData]);

  const handleConfirm = () => {
    if (!formData.shippingAddress.trim() || !formData.shippingContact.trim()) {
      return;
    }
    onConfirm(formData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const hasChanges =
    formData.shippingAddress !== initialData.shippingAddress ||
    formData.shippingContact !== initialData.shippingContact ||
    formData.customerNote !== (initialData.customerNote || "");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin giao hàng</DialogTitle>
          <DialogDescription>
            Cập nhật địa chỉ và số điện thoại nhận hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="shipping-address">
              Địa chỉ giao hàng <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="shipping-address"
              placeholder="Nhập địa chỉ giao hàng"
              value={formData.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddress: e.target.value })
              }
              rows={3}
              maxLength={500}
              disabled={isLoading}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping-contact">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shipping-contact"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.shippingContact}
              onChange={(e) =>
                setFormData({ ...formData, shippingContact: e.target.value })
              }
              maxLength={20}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-note">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="customer-note"
              placeholder="Thêm ghi chú cho đơn hàng..."
              value={formData.customerNote}
              onChange={(e) =>
                setFormData({ ...formData, customerNote: e.target.value })
              }
              rows={3}
              maxLength={500}
              disabled={isLoading}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !formData.shippingAddress.trim() ||
              !formData.shippingContact.trim() ||
              !hasChanges ||
              isLoading
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditShippingInfoDialog;