import { PageLoader } from "@/components/LoadingScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePromotionRule } from "@/hooks/use-promotion-rule";
import { handleApiError } from "@/lib/error";
import { cn, formatDateTimeInShort } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import {
  TUpdatePromotionRule,
  UpdatePromotionRuleSchema,
} from "@/schemas/promotion-rule.schema";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";
import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// ─── Re-use label maps từ CreatePage ─────────────────────────────────────────

const PROMOTION_TYPE_LABEL: Record<number, string> = {
  [EPromotionType.OrderDiscount]: "Giảm đơn hàng",
  [EPromotionType.LineItemDiscount]: "Giảm sản phẩm",
  [EPromotionType.BuyXGetY]: "Mua X tặng Y",
  // [EPromotionType.QuantityTier]: "Theo số lượng",
  [EPromotionType.FreeGift]: "Tặng quà",
  [EPromotionType.FreeShipping]: "Miễn phí ship",
};

const STATUS_CONFIG: Record<EPromotionStatus, { label: string; className: string }> = {
  [EPromotionStatus.Draft]: { label: "Nháp", className: "bg-gray-100 text-gray-600" },
  [EPromotionStatus.Active]: { label: "Đang chạy", className: "bg-green-100 text-green-700" },
  [EPromotionStatus.Inactive]: { label: "Đã tắt", className: "bg-red-100 text-red-600" },
  [EPromotionStatus.Expired]: { label: "Hết hạn", className: "bg-slate-100 text-slate-500" },
};

const CONDITION_TYPE_OPTIONS = [
  { value: ERuleConditionType.CartSubtotal, label: "Tổng giá trị giỏ hàng" },
  { value: ERuleConditionType.CartContainsProduct, label: "Giỏ hàng có sản phẩm" },
  { value: ERuleConditionType.CartContainsCategory, label: "Giỏ hàng có danh mục" },
  { value: ERuleConditionType.MinQuantityOfProduct, label: "Số lượng sản phẩm tối thiểu" },
  { value: ERuleConditionType.MinQuantityInCategory, label: "Số lượng trong danh mục" },
  { value: ERuleConditionType.TotalCartQuantity, label: "Tổng số lượng giỏ hàng" },
];

const CONDITION_OPERATOR_OPTIONS = [
  { value: ERuleConditionOperator.GreaterThanOrEqual, label: ">=" },
  { value: ERuleConditionOperator.GreaterThan, label: ">" },
  { value: ERuleConditionOperator.Equals, label: "=" },
  { value: ERuleConditionOperator.ContainsAny, label: "Chứa ít nhất 1" },
  { value: ERuleConditionOperator.ContainsAll, label: "Chứa tất cả" },
];

const ACTION_TYPE_OPTIONS = [
  { value: ERuleActionType.CartPercentageDiscount, label: "Giảm % toàn đơn" },
  { value: ERuleActionType.CartFixedDiscount, label: "Giảm tiền cố định toàn đơn" },
  { value: ERuleActionType.ItemPercentageDiscount, label: "Giảm % sản phẩm" },
  { value: ERuleActionType.ItemFixedDiscount, label: "Giảm tiền cố định / sản phẩm" },
  { value: ERuleActionType.BuyXGetYFreeProducts, label: "Mua X tặng Y sản phẩm" },
  { value: ERuleActionType.FreeGiftProduct, label: "Tặng quà cố định" },
  { value: ERuleActionType.FreeShipping, label: "Miễn phí vận chuyển" },
];

const TARGET_TYPE_OPTIONS = [
  { value: EActionTargetType.Product, label: "Sản phẩm" },
  { value: EActionTargetType.Category, label: "Danh mục" },
];

const TARGET_ROLE_OPTIONS = [
  { value: EActionTargetRole.DiscountTarget, label: "Áp giảm giá" },
  { value: EActionTargetRole.BuyProduct, label: "Sản phẩm cần mua (Buy)" },
  { value: EActionTargetRole.GetProduct, label: "Sản phẩm được tặng (Get)" },
  { value: EActionTargetRole.GiftProduct, label: "Quà tặng cố định" },
];

const toDatetimeLocal = (dateStr?: string | null) => {
  if (!dateStr) return "";
  // "2025-06-01T00:00:00" → "2025-06-01T00:00"
  return dateStr.slice(0, 16);
};

// ─── Determine edit permission theo lifecycle ─────────────────────────────────

type LifecycleState = "NotStarted" | "Running" | "Expired" | "Inactive";

const getLifecycleState = (
  status: EPromotionStatus,
  startDate?: string | null,
  endDate?: string | null,
): LifecycleState => {
  if (status === EPromotionStatus.Inactive) return "Inactive";
  if (status === EPromotionStatus.Draft) return "NotStarted";
  const now = new Date();
  if (endDate && now > new Date(endDate)) return "Expired";
  if (startDate && now < new Date(startDate)) return "NotStarted";
  return "Running";
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PromotionRuleEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { getPromotionRuleById, updatePromotionRule, deactivatePromotionRule } =
    usePromotionRule();

  const { data: promotionData, isLoading } = getPromotionRuleById(id!);
  const updateMutation = updatePromotionRule();
  const deactivateMutation = deactivatePromotionRule();

  const promotion = promotionData?.data?.data;

  const lifecycleState: LifecycleState = promotion
    ? getLifecycleState(promotion.status, promotion.startDate, promotion.endDate)
    : "NotStarted";

  const isReadOnly = lifecycleState === "Expired" || lifecycleState === "Inactive";
  const isRunning = lifecycleState === "Running";
  const isPending = updateMutation.isPending || deactivateMutation.isPending;

  const form = useForm<TUpdatePromotionRule>({
    resolver: zodResolver(UpdatePromotionRuleSchema),
    defaultValues: { id: id! },
  });

  // Populate form khi data load xong
  useEffect(() => {
    if (!promotion) return;
    form.reset({
      id: promotion.id,
      name: promotion.name,
      shortDescription: promotion.shortDescription ?? "",
      description: promotion.description ?? "",
      promotionType: promotion.promotionType,
      globalDiscountCap: promotion.globalDiscountCap ?? undefined,
      priority: promotion.priority,
      startDate: toDatetimeLocal(promotion.startDate),
      endDate: toDatetimeLocal(promotion.endDate),
      status: promotion.status,
      ruleConditions: promotion.ruleConditions.map((c) => ({
        conditionType: c.conditionType,
        operator: c.operator,
        value: c.value ?? "",
      })),
      ruleActions: promotion.ruleActions.map((a) => ({
        actionType: a.actionType,
        value: a.value ?? "",
        maxDiscountAmountForPercentage: a.maxDiscountAmountForPercentage ?? undefined,
        ruleActionTargets: a.ruleActionTargets.map((t) => ({
          targetType: t.targetType,
          targetId: t.targetId,
          quantity: t.quantity,
          role: t.role,
        })),
      })),
    });
  }, [promotion]);

  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({ control: form.control, name: "ruleConditions" });

  const {
    fields: actionFields,
    append: appendAction,
    remove: removeAction,
  } = useFieldArray({ control: form.control, name: "ruleActions" });

  const onSubmit = async (data: TUpdatePromotionRule) => {
    if (isPending) return;
    const { id: _id, ...payload } = data;

    const body = isRunning
      ? {
          id: id!,
          name: payload.name,
          shortDescription: payload.shortDescription,
          description: payload.description,
          endDate: payload.endDate,
          globalDiscountCap: payload.globalDiscountCap,
          status: payload.status,
        }
      : payload;

    try {
      const result = await updateMutation.mutateAsync({ id: id!, data: body });
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success("Cập nhật khuyến mãi thành công");
        navigate(PATH_BRAND_DASHBOARD.promotionRule.root);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Bạn có chắc muốn tắt khuyến mãi này ngay lập tức?")) return;
    try {
      await deactivateMutation.mutateAsync(id!);
      toast.success("Đã tắt khuyến mãi thành công");
      navigate(PATH_BRAND_DASHBOARD.promotionRule.root);
    } catch (err) {
      handleApiError(err);
    }
  };

  if (isLoading || !promotion) return <PageLoader />;

  const statusConfig = STATUS_CONFIG[promotion.status];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Chi tiết khuyến mãi</h1>
          <Badge className={cn("text-sm", statusConfig.className)}>
            {statusConfig.label}
          </Badge>
        </div>
        {isRunning && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeactivate}
            disabled={isPending}
          >
            {deactivateMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Tắt khẩn cấp
          </Button>
        )}
      </div>

      {/* Read-only warning */}
      {isReadOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Khuyến mãi này đã{" "}
          {lifecycleState === "Expired" ? "hết hạn" : "bị tắt"} và không thể
          chỉnh sửa. Sử dụng chức năng Duplicate để tạo bản sao mới.
        </div>
      )}

      {/* Running warning */}
      {isRunning && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Khuyến mãi đang chạy. Chỉ có thể chỉnh sửa: Tên, Mô tả, Ngày kết
          thúc (chỉ kéo dài), Cap giảm tối đa và Trạng thái (tắt).
          Conditions và Actions không thể thay đổi.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* ── THÔNG TIN CƠ BẢN ─────────────────────────────────── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

            {/* Code + Type: chỉ đọc */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Mã khuyến mãi</p>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted font-mono text-sm">
                  {promotion.code}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Loại khuyến mãi</p>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm">
                  {PROMOTION_TYPE_LABEL[promotion.promotionType]}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khuyến mãi</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending || isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending || isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} disabled={isPending || isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        // Khi đang chạy: không cho sửa startDate
                        disabled={isPending || isReadOnly || isRunning}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={isPending || isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="globalDiscountCap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cap tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0 = xóa cap"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value),
                          )
                        }
                        disabled={isPending || isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status toggle — chỉ hiện khi đang chạy để tắt khẩn cấp */}
            {isRunning && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === EPromotionStatus.Active}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked
                              ? EPromotionStatus.Active
                              : EPromotionStatus.Inactive,
                          )
                        }
                        disabled={isPending}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      {field.value === EPromotionStatus.Active
                        ? "Đang hoạt động"
                        : "Sẽ tắt sau khi lưu"}
                    </span>
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* ── CONDITIONS (chỉ đọc khi đang chạy / hết hạn / inactive) ── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Điều kiện kích hoạt</h2>
              {!isReadOnly && !isRunning && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendCondition({
                      conditionType: ERuleConditionType.CartSubtotal,
                      operator: ERuleConditionOperator.GreaterThanOrEqual,
                      value: "",
                    })
                  }
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm điều kiện
                </Button>
              )}
            </div>

            {conditionFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-lg bg-muted/30"
              >
                <FormField
                  control={form.control}
                  name={`ruleConditions.${index}.conditionType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Loại điều kiện</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                        disabled={isPending || isReadOnly || isRunning}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONDITION_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`ruleConditions.${index}.operator`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Toán tử</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                        disabled={isPending || isReadOnly || isRunning}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONDITION_OPERATOR_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`ruleConditions.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Giá trị</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending || isReadOnly || isRunning}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  {!isReadOnly && !isRunning && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeCondition(index)}
                      disabled={isPending || conditionFields.length <= 1}
                      className="mb-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── ACTIONS (chỉ đọc khi đang chạy / hết hạn / inactive) ─── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hành động áp dụng</h2>
              {!isReadOnly && !isRunning && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendAction({
                      actionType: ERuleActionType.CartPercentageDiscount,
                      value: "",
                      maxDiscountAmountForPercentage: undefined,
                      ruleActionTargets: [],
                    })
                  }
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm action
                </Button>
              )}
            </div>

            {actionFields.map((actionField, actionIndex) => (
              <EditActionBlock
                key={actionField.id}
                form={form}
                actionIndex={actionIndex}
                onRemove={() => removeAction(actionIndex)}
                isPending={isPending}
                canRemove={!isReadOnly && !isRunning && actionFields.length > 1}
                isReadOnly={isReadOnly || isRunning}
              />
            ))}
          </div>

          {/* ── FOOTER ───────────────────────────────────────────── */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Cập nhật lần cuối:{" "}
              {promotion.lastModifiedDate
                ? formatDateTimeInShort(new Date(promotion.lastModifiedDate))
                : formatDateTimeInShort(new Date(promotion.createdDate))}
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PATH_BRAND_DASHBOARD.promotionRule.root)}
                disabled={isPending}
              >
                {isReadOnly ? "Quay lại" : "Hủy"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

// ─── EditActionBlock ──────────────────────────────────────────────────────────

const EditActionBlock = ({
  form,
  actionIndex,
  onRemove,
  isPending,
  canRemove,
  isReadOnly,
}: {
  form: any;
  actionIndex: number;
  onRemove: () => void;
  isPending: boolean;
  canRemove: boolean;
  isReadOnly: boolean;
}) => {
  const { fields: targetFields, append: appendTarget, remove: removeTarget } =
    useFieldArray({
      control: form.control,
      name: `ruleActions.${actionIndex}.ruleActionTargets`,
    });

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name={`ruleActions.${actionIndex}.actionType`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-xs">Loại action</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
                disabled={isPending || isReadOnly}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACTION_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ruleActions.${actionIndex}.value`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-xs">Giá trị</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending || isReadOnly} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ruleActions.${actionIndex}.maxDiscountAmountForPercentage`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-xs">Cap của action</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                  disabled={isPending || isReadOnly}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Targets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Targets ({targetFields.length})
          </p>
          {!isReadOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                appendTarget({
                  targetType: EActionTargetType.Product,
                  targetId: "",
                  quantity: 1,
                  role: EActionTargetRole.DiscountTarget,
                })
              }
              disabled={isPending}
            >
              <Plus className="h-3 w-3 mr-1" />
              Thêm target
            </Button>
          )}
        </div>

        {targetFields.map((targetField, targetIndex) => (
          <div
            key={targetField.id}
            className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-background border rounded-md"
          >
            <FormField
              control={form.control}
              name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.targetType`}
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-xs">Loại</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={isPending || isReadOnly}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TARGET_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.targetId`}
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-xs">Target ID</FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs font-mono"
                      {...field}
                      disabled={isPending || isReadOnly}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.role`}
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-xs">Role</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={isPending || isReadOnly}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TARGET_ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.quantity`}
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-xs">Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="h-8 text-xs"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isPending || isReadOnly}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-end">
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeTarget(targetIndex)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {canRemove && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa action này
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromotionRuleEditPage;