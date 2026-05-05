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
import { Textarea } from "@/components/ui/textarea";
import { usePromotionRule } from "@/hooks/use-promotion-rule";
import { handleApiError } from "@/lib/error";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import {
  CreatePromotionRuleSchema,
  TCreatePromotionRule,
} from "@/schemas/promotion-rule.schema";
import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConditionValueInput } from "./components/ConditionValueInput";
import {
  CONDITION_TYPE_OPERATORS,
  LOAI_DOI_TUONG,
  PROMOTION_TYPE_LABEL,
  TAT_CA_LOAI_DIEU_KIEN,
  TAT_CA_LOAI_HANH_DONG,
  TAT_CA_TOAN_TU,
  TAT_CA_VAI_TRO,
} from "./components/PromotionRuleShared";
import { TargetIdInput } from "./components/TargetIdInput";

type PromotionConfig = {
  moTa: string;
  dieuKienChoPhep: ERuleConditionType[];
  hanhDongChoPhep: ERuleActionType[];
  // Vai trò được phép xuất hiện trong targets của action
  // BuyProduct đã bị loại bỏ hoàn toàn
  vaiTroChoPhep: EActionTargetRole[];
  defaultDieuKien: {
    conditionType: ERuleConditionType;
    operator: ERuleConditionOperator;
    value: string;
  };
  defaultHanhDong: {
    actionType: ERuleActionType;
    value: string;
    maxDiscountAmountForPercentage?: number;
    ruleActionTargets: {
      targetType: EActionTargetType;
      targetId: string;
      quantity: number;
      role: EActionTargetRole;
    }[];
  };
};

const PROMOTION_CONFIG: Record<EPromotionType, PromotionConfig> = {
  [EPromotionType.OrderDiscount]: {
    moTa: "Giảm giá trực tiếp trên tổng đơn hàng",
    dieuKienChoPhep: [
      ERuleConditionType.CartSubtotal,
      ERuleConditionType.TotalCartQuantity,
      ERuleConditionType.CartContainsProduct,
      ERuleConditionType.CartContainsCategory,
      ERuleConditionType.FirstOrder,
    ],
    hanhDongChoPhep: [
      ERuleActionType.CartPercentageDiscount,
      ERuleActionType.CartFixedDiscount,
    ],
    vaiTroChoPhep: [],
    defaultDieuKien: {
      conditionType: ERuleConditionType.CartSubtotal,
      operator: ERuleConditionOperator.GreaterThanOrEqual,
      value: "",
    },
    defaultHanhDong: {
      actionType: ERuleActionType.CartPercentageDiscount,
      value: "",
      ruleActionTargets: [],
    },
  },

  [EPromotionType.LineItemDiscount]: {
    moTa: "Giảm giá trên sản phẩm hoặc danh mục cụ thể",
    dieuKienChoPhep: [
      ERuleConditionType.CartContainsProduct,
      ERuleConditionType.CartContainsCategory,
      ERuleConditionType.CartSubtotal,
      ERuleConditionType.MinQuantityOfProduct,
      ERuleConditionType.FirstOrder,
    ],
    hanhDongChoPhep: [
      ERuleActionType.ItemPercentageDiscount,
      ERuleActionType.ItemFixedDiscount,
    ],
    vaiTroChoPhep: [EActionTargetRole.DiscountTarget],
    defaultDieuKien: {
      conditionType: ERuleConditionType.CartContainsProduct,
      operator: ERuleConditionOperator.ContainsAny,
      value: "",
    },
    defaultHanhDong: {
      actionType: ERuleActionType.ItemPercentageDiscount,
      value: "",
      ruleActionTargets: [
        {
          targetType: EActionTargetType.Product,
          targetId: "",
          quantity: 1,
          role: EActionTargetRole.DiscountTarget,
        },
      ],
    },
  },

  [EPromotionType.BuyXGetY]: {
    // Thiết kế mới: thông tin "mua bao nhiêu sản phẩm nào" nằm hoàn toàn
    // ở condition MinQuantityOfProduct (bắt buộc, format: "productId:minQty").
    // Action chỉ cần khai báo GetProduct targets (sản phẩm được tặng).
    // BuyProduct target đã bị bỏ.
    moTa: 'Mua đủ X sản phẩm → tặng Y. Điều kiện "MinQuantityOfProduct" xác định sản phẩm cần mua và số lượng tối thiểu. Action chỉ cần khai báo sản phẩm được tặng (GetProduct).',
    dieuKienChoPhep: [
      // MinQuantityOfProduct là bắt buộc cho BuyXGetY
      ERuleConditionType.MinQuantityOfProduct,
      // CartSubtotal là tùy chọn thêm
      ERuleConditionType.CartSubtotal,
    ],
    hanhDongChoPhep: [ERuleActionType.BuyXGetYFreeProducts],
    // Chỉ GetProduct — không có BuyProduct
    vaiTroChoPhep: [EActionTargetRole.GetProduct],
    defaultDieuKien: {
      // Default là MinQuantityOfProduct (bắt buộc, không thể đổi sang loại khác)
      conditionType: ERuleConditionType.MinQuantityOfProduct,
      operator: ERuleConditionOperator.GreaterThanOrEqual,
      value: "",
    },
    defaultHanhDong: {
      actionType: ERuleActionType.BuyXGetYFreeProducts,
      value: "",
      // Chỉ có GetProduct target, không có BuyProduct
      ruleActionTargets: [
        {
          targetType: EActionTargetType.Product,
          targetId: "",
          quantity: 1,
          role: EActionTargetRole.GetProduct,
        },
      ],
    },
  },

  // [EPromotionType.QuantityTier]: {
  //   moTa: "Giảm giá khi mua đủ số lượng nhất định",
  //   dieuKienChoPhep: [
  //     ERuleConditionType.TotalCartQuantity,
  //     ERuleConditionType.MinQuantityOfProduct,
  //     ERuleConditionType.CartSubtotal,
  //     ERuleConditionType.FirstOrder,
  //   ],
  //   hanhDongChoPhep: [
  //     ERuleActionType.CartPercentageDiscount,
  //     ERuleActionType.CartFixedDiscount,
  //     ERuleActionType.ItemPercentageDiscount,
  //     ERuleActionType.ItemFixedDiscount,
  //   ],
  //   vaiTroChoPhep: [EActionTargetRole.DiscountTarget],
  //   defaultDieuKien: {
  //     conditionType: ERuleConditionType.TotalCartQuantity,
  //     operator: ERuleConditionOperator.GreaterThanOrEqual,
  //     value: "",
  //   },
  //   defaultHanhDong: {
  //     actionType: ERuleActionType.CartPercentageDiscount,
  //     value: "",
  //     ruleActionTargets: [],
  //   },
  // },

  [EPromotionType.FreeGift]: {
    moTa: "Tặng quà cố định khi đạt điều kiện",
    dieuKienChoPhep: [
      ERuleConditionType.CartSubtotal,
      ERuleConditionType.TotalCartQuantity,
      ERuleConditionType.FirstOrder,
    ],
    hanhDongChoPhep: [ERuleActionType.FreeGiftProduct],
    vaiTroChoPhep: [EActionTargetRole.GiftProduct],
    defaultDieuKien: {
      conditionType: ERuleConditionType.CartSubtotal,
      operator: ERuleConditionOperator.GreaterThanOrEqual,
      value: "",
    },
    defaultHanhDong: {
      actionType: ERuleActionType.FreeGiftProduct,
      value: "",
      ruleActionTargets: [
        {
          targetType: EActionTargetType.Product,
          targetId: "",
          quantity: 1,
          role: EActionTargetRole.GiftProduct,
        },
      ],
    },
  },

  [EPromotionType.FreeShipping]: {
    moTa: "Miễn phí vận chuyển khi đơn đạt điều kiện",
    dieuKienChoPhep: [
      ERuleConditionType.CartSubtotal,
      ERuleConditionType.TotalCartQuantity,
      ERuleConditionType.FirstOrder,
    ],
    hanhDongChoPhep: [ERuleActionType.FreeShipping],
    vaiTroChoPhep: [],
    defaultDieuKien: {
      conditionType: ERuleConditionType.CartSubtotal,
      operator: ERuleConditionOperator.GreaterThanOrEqual,
      value: "",
    },
    defaultHanhDong: {
      actionType: ERuleActionType.FreeShipping,
      value: "",
      ruleActionTargets: [],
    },
  },
};

// Actions không cần khai báo value số tiền / phần trăm
const ACTION_KHONG_CO_VALUE = [
  ERuleActionType.BuyXGetYFreeProducts,
  ERuleActionType.FreeGiftProduct,
  ERuleActionType.FreeShipping,
];

// Actions không cần target
const ACTION_KHONG_CAN_TARGET = [
  ERuleActionType.CartPercentageDiscount,
  ERuleActionType.CartFixedDiscount,
  ERuleActionType.FreeShipping,
];

const getDieuKienOptions = (type: EPromotionType) =>
  TAT_CA_LOAI_DIEU_KIEN.filter((o) =>
    PROMOTION_CONFIG[type].dieuKienChoPhep.includes(o.value),
  );

const getToanTuOptions = (
  promotionType: EPromotionType,
  conditionType: ERuleConditionType,
) => {
  const allowed = PROMOTION_CONFIG[promotionType].dieuKienChoPhep.includes(
    conditionType,
  )
    ? CONDITION_TYPE_OPERATORS[conditionType]
    : [];
  return TAT_CA_TOAN_TU.filter((o) => allowed.includes(o.value));
};

const getHanhDongOptions = (type: EPromotionType) =>
  TAT_CA_LOAI_HANH_DONG.filter((o) =>
    PROMOTION_CONFIG[type].hanhDongChoPhep.includes(o.value),
  );

const getVaiTroOptions = (type: EPromotionType) =>
  TAT_CA_VAI_TRO.filter((o) =>
    PROMOTION_CONFIG[type].vaiTroChoPhep.includes(o.value),
  );

// ─── HangDieuKien ─────────────────────────────────────────────────────────────

const HangDieuKien = ({
  form,
  index,
  promotionType,
  onRemove,
  dangGui,
  coTheXoa,
}: {
  form: any;
  index: number;
  promotionType: EPromotionType;
  onRemove: () => void;
  dangGui: boolean;
  coTheXoa: boolean;
}) => {
  const conditionType: ERuleConditionType = useWatch({
    control: form.control,
    name: `ruleConditions.${index}.conditionType`,
  });

  const toanTuOptions = getToanTuOptions(promotionType, conditionType);

  const handleDoiConditionType = (v: string) => {
    const newType = Number(v) as ERuleConditionType;
    form.setValue(`ruleConditions.${index}.conditionType`, newType);
    const firstOp = CONDITION_TYPE_OPERATORS[newType]?.[0];
    if (firstOp !== undefined)
      form.setValue(`ruleConditions.${index}.operator`, firstOp);
    form.setValue(`ruleConditions.${index}.value`, "");
  };

  return (
    <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                disabled={dangGui}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getDieuKienOptions(promotionType).map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Toán tử — ẩn với FirstOrder vì không cần operator */}
        {conditionType !== ERuleConditionType.FirstOrder && (
          <FormField
            control={form.control}
            name={`ruleConditions.${index}.operator`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Toán tử</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                  disabled={dangGui}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {toanTuOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Giá trị */}
        <FormField
          control={form.control}
          name={`ruleConditions.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">
                {conditionType === ERuleConditionType.FirstOrder
                  ? "Điều kiện"
                  : "Giá trị"}
                {conditionType === ERuleConditionType.MinQuantityOfProduct && (
                  <span className="ml-1 text-muted-foreground font-normal">
                    (sản phẩm + số lượng)
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <ConditionValueInput
                  conditionType={conditionType}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={dangGui}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nút xóa */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
            disabled={dangGui || !coTheXoa}
            className="mb-0.5"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── DoiTuongRow ──────────────────────────────────────────────────────────────

const DoiTuongRow = ({
  form,
  actionIndex,
  doiTuongIndex,
  vaiTroOptions,
  onRemove,
  disabled,
}: {
  form: any;
  actionIndex: number;
  doiTuongIndex: number;
  vaiTroOptions: { value: EActionTargetRole; label: string }[];
  onRemove: () => void;
  disabled: boolean;
}) => {
  const targetType: EActionTargetType = useWatch({
    control: form.control,
    name: `ruleActions.${actionIndex}.ruleActionTargets.${doiTuongIndex}.targetType`,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-background border rounded-md">
      {/* Loại đối tượng */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${doiTuongIndex}.targetType`}
        render={({ field }: any) => (
          <FormItem>
            <FormLabel className="text-xs">Loại đối tượng</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={(v) => {
                field.onChange(Number(v));
                // reset targetId khi đổi loại
                form.setValue(
                  `ruleActions.${actionIndex}.ruleActionTargets.${doiTuongIndex}.targetId`,
                  "",
                );
              }}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LOAI_DOI_TUONG.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* targetId */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${doiTuongIndex}.targetId`}
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
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Vai trò */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${doiTuongIndex}.role`}
        render={({ field }: any) => (
          <FormItem>
            <FormLabel className="text-xs">Vai trò</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={(v) => field.onChange(Number(v))}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <FormMessage />
              <SelectContent>
                {vaiTroOptions.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* Số lượng */}
      <FormField
        control={form.control}
        name={`ruleActions.${actionIndex}.ruleActionTargets.${doiTuongIndex}.quantity`}
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
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-end">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={onRemove}
          disabled={disabled}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

// ─── KhoiHanhDong ─────────────────────────────────────────────────────────────

const KhoiHanhDong = ({
  form,
  actionIndex,
  promotionType,
  onRemove,
  dangGui,
  coTheXoa,
}: {
  form: any;
  actionIndex: number;
  promotionType: EPromotionType;
  onRemove: () => void;
  dangGui: boolean;
  coTheXoa: boolean;
}) => {
  const {
    fields: danhSachDoiTuong,
    append: themDoiTuong,
    remove: xoaDoiTuong,
  } = useFieldArray({
    control: form.control,
    name: `ruleActions.${actionIndex}.ruleActionTargets`,
  });

  const actionType: ERuleActionType = useWatch({
    control: form.control,
    name: `ruleActions.${actionIndex}.actionType`,
  });

  const vaiTroOptions = getVaiTroOptions(promotionType);
  const hienThiTarget = !ACTION_KHONG_CAN_TARGET.includes(actionType);
  const hienThiValue = !ACTION_KHONG_CO_VALUE.includes(actionType);
  const hienThiCap =
    actionType === ERuleActionType.CartPercentageDiscount ||
    actionType === ERuleActionType.ItemPercentageDiscount;

  const handleDoiActionType = (v: string) => {
    const newType = Number(v) as ERuleActionType;
    form.setValue(`ruleActions.${actionIndex}.actionType`, newType);
    form.setValue(`ruleActions.${actionIndex}.value`, "");
    form.setValue(
      `ruleActions.${actionIndex}.maxDiscountAmountForPercentage`,
      undefined,
    );
    if (ACTION_KHONG_CAN_TARGET.includes(newType)) {
      form.setValue(`ruleActions.${actionIndex}.ruleActionTargets`, []);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Loại hành động */}
        <FormField
          control={form.control}
          name={`ruleActions.${actionIndex}.actionType`}
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-xs">Loại hành động</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={handleDoiActionType}
                disabled={dangGui}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getHanhDongOptions(promotionType).map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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
                  <Input
                    placeholder={
                      actionType === ERuleActionType.CartPercentageDiscount ||
                      actionType === ERuleActionType.ItemPercentageDiscount
                        ? "VD: 20"
                        : "VD: 50000"
                    }
                    {...field}
                    disabled={dangGui}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Cap */}
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
                    disabled={dangGui}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Đối tượng */}
      {hienThiTarget && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Đối tượng áp dụng ({danhSachDoiTuong.length})
              {/* Ghi chú cho BuyXGetY: không có BuyProduct, chỉ GetProduct */}
              {promotionType === EPromotionType.BuyXGetY && (
                <span className="ml-2 text-xs text-amber-600 font-normal">
                  — chỉ khai báo sản phẩm được tặng (GetProduct). Sản phẩm cần
                  mua đã khai báo ở điều kiện MinQuantityOfProduct.
                </span>
              )}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                themDoiTuong({
                  targetType: EActionTargetType.Product,
                  targetId: "",
                  quantity: 1,
                  role: vaiTroOptions[0]?.value ?? EActionTargetRole.GetProduct,
                })
              }
              disabled={dangGui}
            >
              <Plus className="h-3 w-3 mr-1" />
              Thêm đối tượng
            </Button>
          </div>

          {danhSachDoiTuong.map((doiTuongField, doiTuongIndex) => (
            <DoiTuongRow
              key={doiTuongField.id}
              form={form}
              actionIndex={actionIndex}
              doiTuongIndex={doiTuongIndex}
              vaiTroOptions={vaiTroOptions}
              onRemove={() => xoaDoiTuong(doiTuongIndex)}
              disabled={dangGui}
            />
          ))}
        </div>
      )}

      {coTheXoa && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
            disabled={dangGui}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa hành động này
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const PromotionRuleCreatePage = () => {
  const navigate = useNavigate();
  const { createPromotionRule } = usePromotionRule();
  const createMutation = createPromotionRule();

  const form = useForm<TCreatePromotionRule>({
    resolver: zodResolver(CreatePromotionRuleSchema),
    defaultValues: {
      code: "",
      name: "",
      shortDescription: "",
      description: "",
      promotionType: EPromotionType.OrderDiscount,
      globalDiscountCap: undefined,
      priority: undefined,
      startDate: "",
      endDate: "",
      ruleConditions: [
        { ...PROMOTION_CONFIG[EPromotionType.OrderDiscount].defaultDieuKien },
      ],
      ruleActions: [
        { ...PROMOTION_CONFIG[EPromotionType.OrderDiscount].defaultHanhDong },
      ],
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const promotionType = useWatch({
    control: form.control,
    name: "promotionType",
  });
  const config = PROMOTION_CONFIG[promotionType];

  const {
    fields: danhSachDieuKien,
    append: themDieuKien,
    remove: xoaDieuKien,
    replace: thayTheDieuKien,
  } = useFieldArray({ control: form.control, name: "ruleConditions" });

  const {
    fields: danhSachHanhDong,
    append: themHanhDong,
    remove: xoaHanhDong,
    replace: thayTheHanhDong,
  } = useFieldArray({ control: form.control, name: "ruleActions" });

  const handleDoiLoaiKhuyenMai = (value: string) => {
    const loaiMoi = Number(value) as EPromotionType;
    form.setValue("promotionType", loaiMoi);
    const cfgMoi = PROMOTION_CONFIG[loaiMoi];
    thayTheDieuKien([{ ...cfgMoi.defaultDieuKien }]);
    thayTheHanhDong([{ ...cfgMoi.defaultHanhDong }]);
  };

  const onSubmit = async (data: TCreatePromotionRule) => {
    const errors = form.formState.errors;
    console.log("Current errors:", errors);
    if (createMutation.isPending) return;
    try {
      const result = await createMutation.mutateAsync(data);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success("Tạo khuyến mãi thành công");
        form.reset({
          code: "",
          name: "",
          shortDescription: "",
          description: "",
          promotionType: EPromotionType.OrderDiscount,
          globalDiscountCap: undefined,
          priority: undefined,
          startDate: "",
          endDate: "",
          ruleConditions: [
            {
              ...PROMOTION_CONFIG[EPromotionType.OrderDiscount].defaultDieuKien,
            },
          ],
          ruleActions: [
            {
              ...PROMOTION_CONFIG[EPromotionType.OrderDiscount].defaultHanhDong,
            },
          ],
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const dangGui = createMutation.isPending;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tạo khuyến mãi mới</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ── THÔNG TIN CƠ BẢN ──────────────────────────────────── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mã khuyến mãi <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: GIAM20K"
                        {...field}
                        disabled={dangGui}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="promotionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại khuyến mãi{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={handleDoiLoaiKhuyenMai}
                      disabled={dangGui}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROMOTION_TYPE_LABEL.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                      <Info className="h-3 w-3 mt-0.5 shrink-0" />
                      {config.moTa}
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên khuyến mãi <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Giảm 20% đơn từ 100k"
                      {...field}
                      disabled={dangGui}
                    />
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
                    <Input
                      placeholder="Mô tả ngắn hiển thị cho khách hàng"
                      {...field}
                      disabled={dangGui}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về chương trình khuyến mãi"
                      rows={3}
                      {...field}
                      disabled={dangGui}
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
                    <FormLabel>
                      Ngày bắt đầu <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={dangGui}
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
                      Ngày kết thúc <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={dangGui}
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
                    <FormLabel>Giảm tối đa (Giới hạn)</FormLabel>
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
                        disabled={
                          dangGui ||
                          promotionType === EPromotionType.FreeShipping
                        }
                      />
                    </FormControl>
                    {promotionType === EPromotionType.FreeShipping && (
                      <p className="text-xs text-muted-foreground">
                        FreeShipping không dùng GlobalDiscountCap
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ── ĐIỀU KIỆN ────────────────────────────────────────── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Điều kiện kích hoạt</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => themDieuKien({ ...config.defaultDieuKien })}
                disabled={dangGui}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm điều kiện
              </Button>
            </div>

            {/* Ghi chú cho BuyXGetY: MinQuantityOfProduct bắt buộc */}
            {promotionType === EPromotionType.BuyXGetY && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  <strong>
                    BuyXGetY yêu cầu điều kiện "Số lượng sản phẩm tối thiểu"
                  </strong>{" "}
                  — khai báo sản phẩm cần mua và số lượng tối thiểu (format:
                  chọn sản phẩm + nhập số lượng). Ví dụ: "Mua 3 Cà Phê A" → chọn
                  Cà Phê A, nhập số lượng 3.
                </span>
              </div>
            )}

            {danhSachDieuKien.map((field, index) => (
              <HangDieuKien
                key={field.id}
                form={form}
                index={index}
                promotionType={promotionType}
                onRemove={() => xoaDieuKien(index)}
                dangGui={dangGui}
                coTheXoa={danhSachDieuKien.length > 1}
              />
            ))}

            {form.formState.errors.ruleConditions?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.ruleConditions.root.message}
              </p>
            )}
          </div>

          {/* ── HÀNH ĐỘNG ────────────────────────────────────────── */}
          <div className="bg-background rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hành động áp dụng</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => themHanhDong({ ...config.defaultHanhDong })}
                disabled={dangGui}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm hành động
              </Button>
            </div>

            {danhSachHanhDong.map((actionField, actionIndex) => (
              <KhoiHanhDong
                key={actionField.id}
                form={form}
                actionIndex={actionIndex}
                promotionType={promotionType}
                onRemove={() => xoaHanhDong(actionIndex)}
                dangGui={dangGui}
                coTheXoa={danhSachHanhDong.length > 1}
              />
            ))}
          </div>

          {/* ── NÚT GỬI ──────────────────────────────────────────── */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(PATH_BRAND_DASHBOARD.promotionRule.root)}
              disabled={dangGui}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={dangGui}>
              {dangGui ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo khuyến mãi"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PromotionRuleCreatePage;
