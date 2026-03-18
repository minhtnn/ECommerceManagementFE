import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Textarea } from "@/components/ui/textarea";
import { usePromotionRule } from "@/hooks/use-promotion-rule";
import { useProduct } from "@/hooks/use-product";
import { useProductCategory } from "@/hooks/use-product-category";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import {
  CreatePromotionRuleSchema,
  TCreatePromotionRule,
} from "@/schemas/promotion-rule.schema";
import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { EProductStatus } from "@/types/enums/product-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  Info,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ─── Static options ───────────────────────────────────────────────────────────

const LOAI_KHUYEN_MAI = [
  { value: EPromotionType.OrderDiscount, label: "Giảm giá đơn hàng" },
  { value: EPromotionType.LineItemDiscount, label: "Giảm sản phẩm cụ thể" },
  { value: EPromotionType.BuyXGetY, label: "Mua X tặng Y" },
  // { value: EPromotionType.QuantityTier, label: "Theo số lượng" },
  { value: EPromotionType.FreeGift, label: "Tặng quà cố định" },
  { value: EPromotionType.FreeShipping, label: "Miễn phí vận chuyển" },
];

const TAT_CA_LOAI_DIEU_KIEN = [
  { value: ERuleConditionType.CartSubtotal, label: "Tổng giá trị giỏ hàng" },
  {
    value: ERuleConditionType.CartContainsProduct,
    label: "Giỏ hàng có sản phẩm",
  },
  {
    value: ERuleConditionType.CartContainsCategory,
    label: "Giỏ hàng có danh mục",
  },
  {
    value: ERuleConditionType.MinQuantityOfProduct,
    label: "Số lượng sản phẩm tối thiểu",
  },
  {
    value: ERuleConditionType.MinQuantityInCategory,
    label: "Số lượng trong danh mục",
  },
  {
    value: ERuleConditionType.TotalCartQuantity,
    label: "Tổng số lượng giỏ hàng",
  },
];

const TAT_CA_TOAN_TU = [
  {
    value: ERuleConditionOperator.GreaterThanOrEqual,
    label: ">= (Lớn hơn hoặc bằng)",
  },
  { value: ERuleConditionOperator.GreaterThan, label: "> (Lớn hơn)" },
  { value: ERuleConditionOperator.Equals, label: "= (Bằng)" },
  { value: ERuleConditionOperator.ContainsAny, label: "Chứa ít nhất 1" },
  { value: ERuleConditionOperator.ContainsAll, label: "Chứa tất cả" },
];

const TAT_CA_LOAI_HANH_DONG = [
  {
    value: ERuleActionType.CartPercentageDiscount,
    label: "Giảm toàn đơn theo phần trăm",
  },
  {
    value: ERuleActionType.CartFixedDiscount,
    label: "Giảm tiền cố định toàn đơn",
  },
  {
    value: ERuleActionType.ItemPercentageDiscount,
    label: "Giảm sản phẩm theo phần trăm",
  },
  {
    value: ERuleActionType.ItemFixedDiscount,
    label: "Giảm tiền cố định sản phẩm",
  },
  {
    value: ERuleActionType.BuyXGetYFreeProducts,
    label: "Mua X tặng Y sản phẩm",
  },
  { value: ERuleActionType.FreeGiftProduct, label: "Tặng quà cố định" },
  { value: ERuleActionType.FreeShipping, label: "Miễn phí vận chuyển" },
];

const LOAI_DOI_TUONG = [
  { value: EActionTargetType.Product, label: "Sản phẩm" },
  { value: EActionTargetType.Category, label: "Danh mục" },
];

// BuyProduct đã bị bỏ khỏi hệ thống.
// Vai trò "sản phẩm cần mua" nằm trong condition MinQuantityOfProduct.
const TAT_CA_VAI_TRO = [
  { value: EActionTargetRole.DiscountTarget, label: "Áp giảm giá" },
  { value: EActionTargetRole.GetProduct, label: "Sản phẩm được tặng (Get)" },
  { value: EActionTargetRole.GiftProduct, label: "Quà tặng cố định" },
];

// ─── conditionType → operators được phép ─────────────────────────────────────

const CONDITION_TYPE_OPERATORS: Record<
  ERuleConditionType,
  ERuleConditionOperator[]
> = {
  [ERuleConditionType.CartSubtotal]: [
    ERuleConditionOperator.GreaterThanOrEqual,
    ERuleConditionOperator.GreaterThan,
    ERuleConditionOperator.Equals,
  ],
  [ERuleConditionType.TotalCartQuantity]: [
    ERuleConditionOperator.GreaterThanOrEqual,
    ERuleConditionOperator.GreaterThan,
    ERuleConditionOperator.Equals,
  ],
  [ERuleConditionType.MinQuantityOfProduct]: [
    ERuleConditionOperator.GreaterThanOrEqual,
    ERuleConditionOperator.GreaterThan,
  ],
  [ERuleConditionType.MinQuantityInCategory]: [
    ERuleConditionOperator.GreaterThanOrEqual,
    ERuleConditionOperator.GreaterThan,
  ],
  [ERuleConditionType.CartContainsProduct]: [
    ERuleConditionOperator.ContainsAny,
    ERuleConditionOperator.ContainsAll,
  ],
  [ERuleConditionType.CartContainsCategory]: [
    ERuleConditionOperator.ContainsAny,
    ERuleConditionOperator.ContainsAll,
  ],
};

// ─── conditionType nào cần combobox ──────────────────────────────────────────

type ConditionValueType =
  | "number"
  | "product-multi"
  | "category-multi"
  | "product-single-qty";

const CONDITION_VALUE_TYPE: Record<ERuleConditionType, ConditionValueType> = {
  [ERuleConditionType.CartSubtotal]: "number",
  [ERuleConditionType.TotalCartQuantity]: "number",
  [ERuleConditionType.MinQuantityInCategory]: "number",
  [ERuleConditionType.CartContainsProduct]: "product-multi",
  [ERuleConditionType.CartContainsCategory]: "category-multi",
  // MinQuantityOfProduct = ProductCombobox (single) + InputNumber → ghép "uuid:qty"
  [ERuleConditionType.MinQuantityOfProduct]: "product-single-qty",
};

const CONDITION_VALUE_PLACEHOLDER: Record<ERuleConditionType, string> = {
  [ERuleConditionType.CartSubtotal]: "VD: 100000 (đơn từ 100k)",
  [ERuleConditionType.TotalCartQuantity]: "VD: 5 (từ 5 sản phẩm)",
  [ERuleConditionType.MinQuantityInCategory]:
    "VD: 2 (ít nhất 2 sp trong danh mục)",
  [ERuleConditionType.CartContainsProduct]: "",
  [ERuleConditionType.CartContainsCategory]: "",
  [ERuleConditionType.MinQuantityOfProduct]: "Số lượng tối thiểu",
};

// ─── Promotion config ─────────────────────────────────────────────────────────

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

// ─── Helper functions ─────────────────────────────────────────────────────────

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

// ─── ProductCombobox (single) ─────────────────────────────────────────────────

const ProductCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { getProducts } = useProduct();

  const { data, isLoading } = getProducts({ size: 100, allowFetch: open });
  const products = data?.data?.data?.items ?? [];
  const selected = products.find((p: any) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between h-8 text-xs font-normal truncate"
        >
          <span className="truncate">
            {selected ? selected.name : "Chọn sản phẩm..."}
          </span>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm sản phẩm..." className="text-xs" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {products.map((p: any) => (
                    <CommandItem
                      key={p.id}
                      value={p.id}
                      onSelect={() => {
                        onChange(p.id);
                        setOpen(false);
                      }}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          value === p.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {p.code} — {p.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ─── ProductMultiCombobox ─────────────────────────────────────────────────────

const ProductMultiCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { getProducts } = useProduct();

  const { data, isLoading } = getProducts({ size: 100, allowFetch: open });
  const products = data?.data?.data?.items ?? [];
  const selectedIds = value ? value.split(",").filter(Boolean) : [];

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next.join(","));
  };

  const getNameById = (id: string) =>
    products.find((p: any) => p.id === id)?.name ?? id.slice(0, 8) + "...";

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-full justify-between h-8 text-xs font-normal"
          >
            {selectedIds.length > 0
              ? `Đã chọn ${selectedIds.length} sản phẩm`
              : "Chọn sản phẩm..."}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Tìm sản phẩm..." className="text-xs" />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>Không tìm thấy</CommandEmpty>
                  <CommandGroup>
                    {products.map((p: any) => (
                      <CommandItem
                        key={p.id}
                        value={p.id}
                        onSelect={() => toggle(p.id)}
                        className="text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3 w-3",
                            selectedIds.includes(p.id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {p.code} — {p.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map((id) => (
            <Badge key={id} variant="secondary" className="text-xs gap-1 pr-1">
              <span className="max-w-[100px] truncate">{getNameById(id)}</span>
              <button
                type="button"
                onClick={() => toggle(id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── CategoryCombobox (single) ────────────────────────────────────────────────

const CategoryCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { getProductCategories } = useProductCategory();

  const { data, isLoading } = getProductCategories({
    size: 100,
    isLeafOnly: true,
    status: EProductStatus.Active,
    allowFetch: open,
  });
  const categories = data?.data?.data?.items ?? [];
  const selected = categories.find((c: any) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between h-8 text-xs font-normal truncate"
        >
          <span className="truncate">
            {selected ? selected.name : "Chọn danh mục..."}
          </span>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm danh mục..." className="text-xs" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {categories.map((c: any) => (
                    <CommandItem
                      key={c.id}
                      value={c.id}
                      onSelect={() => {
                        onChange(c.id);
                        setOpen(false);
                      }}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          value === c.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {c.code} — {c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ─── CategoryMultiCombobox ────────────────────────────────────────────────────

const CategoryMultiCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { getProductCategories } = useProductCategory();

  const { data, isLoading } = getProductCategories({
    size: 100,
    isLeafOnly: true,
    status: EProductStatus.Active,
    allowFetch: open,
  });
  const categories = data?.data?.data?.items ?? [];
  const selectedIds = value ? value.split(",").filter(Boolean) : [];

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next.join(","));
  };

  const getNameById = (id: string) =>
    categories.find((c: any) => c.id === id)?.name ?? id.slice(0, 8) + "...";

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-full justify-between h-8 text-xs font-normal"
          >
            {selectedIds.length > 0
              ? `Đã chọn ${selectedIds.length} danh mục`
              : "Chọn danh mục..."}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Tìm danh mục..." className="text-xs" />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>Không tìm thấy</CommandEmpty>
                  <CommandGroup>
                    {categories.map((c: any) => (
                      <CommandItem
                        key={c.id}
                        value={c.id}
                        onSelect={() => toggle(c.id)}
                        className="text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3 w-3",
                            selectedIds.includes(c.id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {c.code} — {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map((id) => (
            <Badge key={id} variant="secondary" className="text-xs gap-1 pr-1">
              <span className="max-w-[100px] truncate">{getNameById(id)}</span>
              <button
                type="button"
                onClick={() => toggle(id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ConditionValueInput ──────────────────────────────────────────────────────
// MinQuantityOfProduct → ProductCombobox (single) + InputNumber
//   → ghép thành "uuid:qty" khi lưu (format BE yêu cầu)
// CartContainsProduct  → ProductMultiCombobox  → "uuid1,uuid2"
// CartContainsCategory → CategoryMultiCombobox → "uuid1,uuid2"
// Còn lại             → InputNumber thường

const ConditionValueInput = ({
  conditionType,
  value,
  onChange,
  disabled,
}: {
  conditionType: ERuleConditionType;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const valueType = CONDITION_VALUE_TYPE[conditionType];

  if (valueType === "product-multi") {
    return (
      <ProductMultiCombobox
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (valueType === "category-multi") {
    return (
      <CategoryMultiCombobox
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (valueType === "product-single-qty") {
    // value = "uuid:qty" — tách ra để hiển thị 2 control
    const parts = value.split(":");
    const productId = parts[0] ?? "";
    const qty = parts[1] ?? "1";

    const handleProductChange = (id: string) => onChange(`${id}:${qty}`);
    const handleQtyChange = (q: string) => onChange(`${productId}:${q}`);

    return (
      <div className="flex gap-2">
        <div className="flex-1">
          <ProductCombobox
            value={productId}
            onChange={handleProductChange}
            disabled={disabled}
          />
        </div>
        <Input
          type="number"
          min={1}
          className="h-8 text-xs w-20 shrink-0"
          placeholder="SL"
          value={qty}
          onChange={(e) => handleQtyChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }

  // number
  return (
    <Input
      className="h-8 text-xs"
      placeholder={CONDITION_VALUE_PLACEHOLDER[conditionType]}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

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

        {/* Toán tử */}
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

        {/* Giá trị */}
        <FormField
          control={form.control}
          name={`ruleConditions.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">
                Giá trị
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

// ─── TargetIdInput ────────────────────────────────────────────────────────────

const TargetIdInput = ({
  targetType,
  value,
  onChange,
  disabled,
}: {
  targetType: EActionTargetType;
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) => {
  if (targetType === EActionTargetType.Product) {
    return (
      <ProductCombobox value={value} onChange={onChange} disabled={disabled} />
    );
  }
  return (
    <CategoryCombobox value={value} onChange={onChange} disabled={disabled} />
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
                  — chỉ khai báo sản phẩm được tặng (GetProduct).
                  Sản phẩm cần mua đã khai báo ở điều kiện MinQuantityOfProduct.
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
                  role:
                    vaiTroOptions[0]?.value ?? EActionTargetRole.GetProduct,
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
    if (createMutation.isPending) return;
    try {
      const result = await createMutation.mutateAsync(data);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success("Tạo khuyến mãi thành công");
        navigate(PATH_BRAND_DASHBOARD.promotionRule.root);
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
                        {LOAI_KHUYEN_MAI.map((opt) => (
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
                  <strong>BuyXGetY yêu cầu điều kiện "Số lượng sản phẩm tối thiểu"</strong> —
                  khai báo sản phẩm cần mua và số lượng tối thiểu (format: chọn sản phẩm + nhập số lượng).
                  Ví dụ: "Mua 3 Cà Phê A" → chọn Cà Phê A, nhập số lượng 3.
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