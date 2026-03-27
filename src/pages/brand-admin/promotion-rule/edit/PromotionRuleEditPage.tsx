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
import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ACTION_TYPE_OPTIONS,
  CONDITION_OPERATOR_OPTIONS,
  CONDITION_TYPE_OPTIONS,
  PROMOTION_TYPE_LABEL,
  STATUS_CONFIG,
  TARGET_ROLE_OPTIONS,
  TARGET_TYPE_OPTIONS,
} from "./components/PromotionRuleShared";
import { ConditionValueInput } from "./components/ConditionValueInput";
import { TargetIdInput } from "./components/TargetIdInput";

// ─── Lifecycle helpers ────────────────────────────────────────────────────────

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

  const { data: promotionData, isLoading } = getPromotionRuleById(
    id!,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const updateMutation = updatePromotionRule();
  const deactivateMutation = deactivatePromotionRule();

  const promotion = promotionData?.data?.data;

  const lifecycleState: LifecycleState = promotion
    ? getLifecycleState(
        promotion.status,
        promotion.startDate,
        promotion.endDate,
      )
    : "NotStarted";

  const isReadOnly = lifecycleState === "Expired";
  const isRunning =
    lifecycleState === "Running" || lifecycleState === "Inactive";
  const isPending = updateMutation.isPending || deactivateMutation.isPending;

  const form = useForm<TUpdatePromotionRule>({
    resolver: zodResolver(UpdatePromotionRuleSchema),
    defaultValues: { id: id! },
  });

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
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: promotion.status,
      ruleConditions: promotion.ruleConditions.map((c) => ({
        conditionType: c.conditionType,
        operator: c.operator,
        value: c.value ?? "",
      })),
      ruleActions: promotion.ruleActions.map((a) => ({
        actionType: a.actionType,
        value: a.value ?? "",
        maxDiscountAmountForPercentage: [
          ERuleActionType.CartPercentageDiscount,
          ERuleActionType.ItemPercentageDiscount,
        ].includes(a.actionType)
          ? (a.maxDiscountAmountForPercentage ?? undefined)
          : undefined,
        ruleActionTargets: a.ruleActionTargets.map((t) => ({
          targetType: t.targetType,
          targetId: t.targetId,
          quantity: t.quantity,
          role: t.role,
        })),
      })),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      : payload;

    try {
      const result = await updateMutation.mutateAsync({ id: id!, data: body });
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success("Cập nhật khuyến mãi thành công");
        navigate(PATH_BRAND_DASHBOARD.promotionRule.root);
      }else{
        toast.error(result.data.message || "Cập nhật thất bại!");
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
      {/* ── Header ────────────────────────────────────────────── */}
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
            {deactivateMutation.isPending && (
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
            )}
            Tắt khẩn cấp
          </Button>
        )}
      </div>

      {/* ── Banners ───────────────────────────────────────────── */}
      {isReadOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Khuyến mãi này đã{" "}
          {lifecycleState === "Expired" ? "hết hạn" : "bị tắt"} và không thể
          chỉnh sửa. Sử dụng chức năng Duplicate để tạo bản sao mới.
        </div>
      )}
      {isRunning && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Khuyến mãi đang chạy. Chỉ có thể chỉnh sửa: Tên, Mô tả, Ngày kết thúc
          (chỉ kéo dài), Cap giảm tối đa và Trạng thái (tắt). Conditions và
          Actions không thể thay đổi.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ── THÔNG TIN CƠ BẢN ────────────────────────────────── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

            {/* Code + Type: luôn read-only */}
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
                    <Textarea
                      rows={3}
                      {...field}
                      disabled={isPending || isReadOnly}
                    />
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
                    <FormLabel>
                      Ngày kết thúc
                      {isRunning && (
                        <span className="ml-1 text-xs text-muted-foreground font-normal">
                          (chỉ được kéo dài)
                        </span>
                      )}
                    </FormLabel>
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
                    <FormLabel>
                      Cap tối đa
                      {isRunning && (
                        <span className="ml-1 text-xs text-muted-foreground font-normal">
                          (chỉ được tăng)
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0 = xóa cap"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        disabled={
                          isPending ||
                          isReadOnly ||
                          promotion.promotionType ===
                            EPromotionType.FreeShipping
                        }
                      />
                    </FormControl>
                    {promotion.promotionType ===
                      EPromotionType.FreeShipping && (
                      <p className="text-xs text-muted-foreground">
                        FreeShipping không dùng GlobalDiscountCap
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status toggle — chỉ khi đang chạy */}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* ── CONDITIONS ───────────────────────────────────────── */}
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

            {/* Ghi chú BuyXGetY */}
            {promotion.promotionType === EPromotionType.BuyXGetY && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  <strong>
                    BuyXGetY yêu cầu điều kiện "Số lượng sản phẩm tối thiểu"
                  </strong>{" "}
                  — xác định sản phẩm cần mua và số lượng tối thiểu (format:
                  chọn sản phẩm + nhập số lượng).
                </span>
              </div>
            )}

            {conditionFields.map((field, index) => (
              <EditConditionRow
                key={field.id}
                form={form}
                index={index}
                onRemove={() => removeCondition(index)}
                isPending={isPending}
                canRemove={
                  !isReadOnly && !isRunning && conditionFields.length > 1
                }
                isReadOnly={isReadOnly || isRunning}
              />
            ))}
          </div>

          {/* ── ACTIONS ──────────────────────────────────────────── */}
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
                promotionType={promotion.promotionType}
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
                onClick={() =>
                  navigate(PATH_BRAND_DASHBOARD.promotionRule.root)
                }
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

// ─── EditConditionRow ─────────────────────────────────────────────────────────

const EditConditionRow = ({
  form,
  index,
  onRemove,
  isPending,
  canRemove,
  isReadOnly,
}: {
  form: any;
  index: number;
  onRemove: () => void;
  isPending: boolean;
  canRemove: boolean;
  isReadOnly: boolean;
}) => {
  const conditionType: ERuleConditionType = useWatch({
    control: form.control,
    name: `ruleConditions.${index}.conditionType`,
  });

  // FirstOrder không có operator — map về default khi đổi sang loại khác
  const defaultOperatorByType: Record<
    ERuleConditionType,
    ERuleConditionOperator
  > = {
    [ERuleConditionType.CartSubtotal]:
      ERuleConditionOperator.GreaterThanOrEqual,
    [ERuleConditionType.TotalCartQuantity]:
      ERuleConditionOperator.GreaterThanOrEqual,
    [ERuleConditionType.MinQuantityOfProduct]:
      ERuleConditionOperator.GreaterThanOrEqual,
    [ERuleConditionType.MinQuantityInCategory]:
      ERuleConditionOperator.GreaterThanOrEqual,
    [ERuleConditionType.CartContainsProduct]:
      ERuleConditionOperator.ContainsAny,
    [ERuleConditionType.CartContainsCategory]:
      ERuleConditionOperator.ContainsAny,
    [ERuleConditionType.FirstOrder]: ERuleConditionOperator.Equals, // không dùng nhưng cần có giá trị
  };

  const handleDoiConditionType = (v: string) => {
    const newType = Number(v) as ERuleConditionType;
    form.setValue(`ruleConditions.${index}.conditionType`, newType);
    form.setValue(
      `ruleConditions.${index}.operator`,
      defaultOperatorByType[newType] ??
        ERuleConditionOperator.GreaterThanOrEqual,
    );
    form.setValue(`ruleConditions.${index}.value`, "");
  };

  const isFirstOrder = conditionType === ERuleConditionType.FirstOrder;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-lg bg-muted/30">
      {/* Loại điều kiện */}
      <FormField
        control={form.control}
        name={`ruleConditions.${index}.conditionType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Loại điều kiện</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={handleDoiConditionType}
              disabled={isPending || isReadOnly}
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
              <FormMessage />
            </Select>
          </FormItem>
        )}
      />

      {/* Toán tử — ẩn khi FirstOrder */}
      {!isFirstOrder ? (
        <FormField
          control={form.control}
          name={`ruleConditions.${index}.operator`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Toán tử</FormLabel>
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
                  {CONDITION_OPERATOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
      ) : (
        // Placeholder giữ layout khi FirstOrder
        <div />
      )}

      {/* Giá trị — dùng ConditionValueInput (smart) */}
      <FormField
        control={form.control}
        name={`ruleConditions.${index}.value`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">
              {isFirstOrder ? "Điều kiện" : "Giá trị"}
              {conditionType === ERuleConditionType.MinQuantityOfProduct && (
                <span className="ml-1 text-muted-foreground font-normal">
                  (sản phẩm + số lượng)
                </span>
              )}
            </FormLabel>
            <FormControl>
              <ConditionValueInput
                conditionType={conditionType}
                value={field.value ?? ""}
                onChange={field.onChange}
                disabled={isPending || isReadOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Xóa */}
      <div className="flex items-end">
        {canRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
            disabled={isPending}
            className="mb-0.5"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── EditActionBlock ──────────────────────────────────────────────────────────

const EditActionBlock = ({
  form,
  actionIndex,
  promotionType,
  onRemove,
  isPending,
  canRemove,
  isReadOnly,
}: {
  form: any;
  actionIndex: number;
  promotionType: EPromotionType;
  onRemove: () => void;
  isPending: boolean;
  canRemove: boolean;
  isReadOnly: boolean;
}) => {
  const {
    fields: targetFields,
    append: appendTarget,
    remove: removeTarget,
  } = useFieldArray({
    control: form.control,
    name: `ruleActions.${actionIndex}.ruleActionTargets`,
  });

  const actionType: ERuleActionType = useWatch({
    control: form.control,
    name: `ruleActions.${actionIndex}.actionType`,
  });

  const hienThiValue = ![
    ERuleActionType.BuyXGetYFreeProducts,
    ERuleActionType.FreeGiftProduct,
    ERuleActionType.FreeShipping,
  ].includes(actionType);

  const hienThiCap = [
    ERuleActionType.CartPercentageDiscount,
    ERuleActionType.ItemPercentageDiscount,
  ].includes(actionType);

  const hienThiTarget = ![
    ERuleActionType.CartPercentageDiscount,
    ERuleActionType.CartFixedDiscount,
    ERuleActionType.FreeShipping,
  ].includes(actionType);

  // Default role khi thêm target mới — tự động theo actionType
  const defaultRoleForAction = (): EActionTargetRole => {
    if (actionType === ERuleActionType.BuyXGetYFreeProducts)
      return EActionTargetRole.GetProduct;
    if (actionType === ERuleActionType.FreeGiftProduct)
      return EActionTargetRole.GiftProduct;
    return EActionTargetRole.DiscountTarget;
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Loại action */}
        <FormField
          control={form.control}
          name={`ruleActions.${actionIndex}.actionType`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-xs">Loại action</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={(v) => {
                  field.onChange(Number(v));
                  const newType = Number(v) as ERuleActionType;
                  if (
                    ![
                      ERuleActionType.CartPercentageDiscount,
                      ERuleActionType.ItemPercentageDiscount,
                    ].includes(newType)
                  ) {
                    form.setValue(
                      `ruleActions.${actionIndex}.maxDiscountAmountForPercentage`,
                      undefined,
                    );
                  }
                }}
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
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />

        {/* Giá trị */}
        {hienThiValue && (
          <FormField
            control={form.control}
            name={`ruleActions.${actionIndex}.value`}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-xs">
                  {actionType === ERuleActionType.CartPercentageDiscount ||
                  actionType === ERuleActionType.ItemPercentageDiscount
                    ? "Phần trăm giảm (%)"
                    : "Số tiền giảm (đ)"}
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending || isReadOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Cap của action */}
        {/* <FormField
          control={form.control}
          name={`ruleActions.${actionIndex}.maxDiscountAmountForPercentage`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-xs">Cap của action (đ)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Để trống = không giới hạn"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                  disabled={isPending || isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {hienThiCap && (
          <FormField
            control={form.control}
            name={`ruleActions.${actionIndex}.maxDiscountAmountForPercentage`}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-xs">Giảm tối đa (đ)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Để trống = không giới hạn"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    disabled={isPending || isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Targets */}
      {hienThiTarget && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Targets ({targetFields.length})
              {actionType === ERuleActionType.BuyXGetYFreeProducts && (
                <span className="ml-2 text-xs text-amber-600 font-normal">
                  — chỉ khai báo sản phẩm được tặng (GetProduct). Sản phẩm cần
                  mua đã khai báo ở điều kiện MinQuantityOfProduct.
                </span>
              )}
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
                    role: defaultRoleForAction(),
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
            <EditTargetRow
              key={targetField.id}
              form={form}
              actionIndex={actionIndex}
              targetIndex={targetIndex}
              actionType={actionType}
              onRemove={() => removeTarget(targetIndex)}
              isPending={isPending}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}

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

// ─── EditTargetRow ────────────────────────────────────────────────────────────

const EditTargetRow = ({
  form,
  actionIndex,
  targetIndex,
  actionType,
  onRemove,
  isPending,
  isReadOnly,
}: {
  form: any;
  actionIndex: number;
  targetIndex: number;
  actionType: ERuleActionType;
  onRemove: () => void;
  isPending: boolean;
  isReadOnly: boolean;
}) => {
  const targetType: EActionTargetType = useWatch({
    control: form.control,
    name: `ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.targetType`,
  });

  // Lọc vai trò theo actionType — không có BuyProduct
  const availableRoles = (() => {
    if (actionType === ERuleActionType.BuyXGetYFreeProducts)
      return TARGET_ROLE_OPTIONS.filter(
        (r) => r.value === EActionTargetRole.GetProduct,
      );
    if (actionType === ERuleActionType.FreeGiftProduct)
      return TARGET_ROLE_OPTIONS.filter(
        (r) => r.value === EActionTargetRole.GiftProduct,
      );
    return TARGET_ROLE_OPTIONS.filter(
      (r) => r.value === EActionTargetRole.DiscountTarget,
    );
  })();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-background border rounded-md">
      {/* Loại đối tượng */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.targetType`}
        render={({ field }: any) => (
          <FormItem>
            <FormLabel className="text-xs">Loại</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={(v) => {
                field.onChange(Number(v));
                // Reset targetId khi đổi loại
                form.setValue(
                  `ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.targetId`,
                  "",
                );
              }}
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
              <FormMessage />
            </Select>
          </FormItem>
        )}
      />

      {/* targetId — combobox theo targetType */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.targetId`}
        render={({ field }: any) => (
          <FormItem>
            <FormLabel className="text-xs">
              {targetType === EActionTargetType.Product
                ? "Sản phẩm"
                : "Danh mục"}
            </FormLabel>
            <FormControl>
              <TargetIdInput
                targetType={targetType}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending || isReadOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Vai trò — tự động filter theo actionType */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${targetIndex}.role`}
        render={({ field }: any) => (
          <FormItem>
            <FormLabel className="text-xs">Vai trò</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={(v) => field.onChange(Number(v))}
              disabled={isPending || isReadOnly || availableRoles.length <= 1}
            >
              <FormControl>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableRoles.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
              <FormMessage />
            </Select>
          </FormItem>
        )}
      />

      {/* Số lượng */}
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Xóa */}
      <div className="flex items-end">
        {!isReadOnly && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={onRemove}
            disabled={isPending}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PromotionRuleEditPage;
