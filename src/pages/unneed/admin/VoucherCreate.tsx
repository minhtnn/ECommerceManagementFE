import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, Plus, X, Edit } from "lucide-react";
import { toast } from "sonner";

interface Condition {
  id: string;
  type: string;
  operator: string;
  value: string;
}

interface Action {
  id: string;
  type: string;
  maxDiscount: string;
}

const conditionTypes = [
  { value: "min_cart_value", label: "Giá trị tối thiểu của giỏ hàng" },
  { value: "cart_contains_product", label: "Giỏ hàng chứa sản phẩm" },
  { value: "product_quantity", label: "Số lượng của sản phẩm trong giỏ hàng" },
];

const operators = [
  { value: "gte", label: "Lớn hơn hoặc bằng (≥)" },
  { value: "lte", label: "Nhỏ hơn hoặc bằng (≤)" },
  { value: "eq", label: "Bằng (=)" },
];

const actionTypes = [
  { value: "percent_cart", label: "Khuyến mãi theo phần trăm toàn giỏ hàng" },
  { value: "fixed_cart", label: "Khuyến mãi cố định toàn giỏ hàng" },
  { value: "percent_per_product", label: "Khuyến mãi theo phần trăm cho từng sản phẩm" },
  { value: "percent_one_product", label: "Khuyến mãi theo phần trăm cho một sản phẩm" },
  { value: "fixed_per_product", label: "Khuyến mãi cố định cho từng sản phẩm" },
  { value: "fixed_one_product", label: "Khuyến mãi cố định cho một sản phẩm" },
];

const VoucherCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    priority: 0,
    shortDescription: "",
    description: "",
  });

  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  // Condition dialog state
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({
    type: "min_cart_value",
    operator: "gte",
    value: "",
  });

  // Action dialog state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [newAction, setNewAction] = useState({
    type: "percent_cart",
    maxDiscount: "",
  });

  const addCondition = () => {
    if (!newCondition.value) {
      toast.error("Vui lòng nhập giá trị");
      return;
    }
    const condition: Condition = {
      id: Date.now().toString(),
      ...newCondition,
    };
    setConditions([...conditions, condition]);
    setNewCondition({ type: "min_cart_value", operator: "gte", value: "" });
    setConditionDialogOpen(false);
    toast.success("Thêm điều kiện thành công");
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const addAction = () => {
    const action: Action = {
      id: Date.now().toString(),
      ...newAction,
    };
    setActions([...actions, action]);
    setNewAction({ type: "percent_cart", maxDiscount: "" });
    setActionDialogOpen(false);
    toast.success("Thêm hành động thành công");
  };

  const removeAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Vui lòng nhập tên khuyến mãi");
      return;
    }

    // Mock save
    toast.success("Tạo khuyến mãi thành công!");
    navigate("/admin/vouchers");
  };

  const getConditionLabel = (type: string) => {
    return conditionTypes.find((c) => c.value === type)?.label || type;
  };

  const getOperatorLabel = (op: string) => {
    return operators.find((o) => o.value === op)?.label || op;
  };

  const getActionLabel = (type: string) => {
    return actionTypes.find((a) => a.value === type)?.label || type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/vouchers")}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Title */}
        <h1 className="text-2xl font-bold">Tạo Khuyến Mãi Mới</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Basic info (2 cols) */}
          <div className="lg:col-span-2 bg-background rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-semibold">Thông Tin Cơ Bản</h2>

            {/* Name and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên Khuyến Mãi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập tên sản phẩm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">
                  Độ ưu tiên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            {/* Short description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription">
                Mô tả ngắn khuyến mãi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shortDescription"
                placeholder="Nhập tóm tắt khuyến mãi"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
              />
            </div>

            {/* Full description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả khuyến mãi</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả khuyến mãi"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>

          {/* Right side - Conditions and Actions (1 col) */}
          <div className="space-y-6">
            {/* Conditions */}
            <div className="bg-background rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Điều kiện khuyến mãi</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConditionDialogOpen(true)}
                >
                  Thêm
                  <Edit className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {conditions.length > 0 ? (
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div
                      key={condition.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm"
                    >
                      <div>
                        <p className="font-medium">{getConditionLabel(condition.type)}</p>
                        <p className="text-muted-foreground">
                          {getOperatorLabel(condition.operator)}: {condition.value}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có điều kiện nào được thêm.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-background rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Hành động khuyến mãi</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActionDialogOpen(true)}
                >
                  Thêm
                  <Edit className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {actions.length > 0 ? (
                <div className="space-y-2">
                  {actions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm"
                    >
                      <div>
                        <p className="font-medium">{getActionLabel(action.type)}</p>
                        {action.maxDiscount && (
                          <p className="text-muted-foreground">
                            Giảm tối đa: {action.maxDiscount}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeAction(action.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có hành động nào được thêm.
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
                Tạo
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Add Condition Dialog */}
      <Dialog open={conditionDialogOpen} onOpenChange={setConditionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm điều kiện khuyến mãi</DialogTitle>
            <DialogDescription>
              Điền thông tin cho điều kiện mới. Điều kiện này sẽ được thêm vào danh sách.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Loại điều kiện <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newCondition.type}
                  onValueChange={(value) =>
                    setNewCondition({ ...newCondition, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Toán tử <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newCondition.operator}
                  onValueChange={(value) =>
                    setNewCondition({ ...newCondition, operator: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Giá trị <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Vd: 500000"
                value={newCondition.value}
                onChange={(e) =>
                  setNewCondition({ ...newCondition, value: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConditionDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={addCondition}
            >
              Thêm điều kiện
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm hành động khuyến mãi</DialogTitle>
            <DialogDescription>
              Điền thông tin cho hành động mới.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Loại hành động <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newAction.type}
                  onValueChange={(value) =>
                    setNewAction({ ...newAction, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Giảm giá tối đa</Label>
                <Input
                  placeholder="Nhập số tiền tối đa cho giảm giá phần trăm"
                  value={newAction.maxDiscount}
                  onChange={(e) =>
                    setNewAction({ ...newAction, maxDiscount: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={addAction}
            >
              Thêm điều kiện
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default VoucherCreate;
