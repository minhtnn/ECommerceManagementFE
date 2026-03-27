import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";

export const PROMOTION_TYPE_LABEL = [
  { value: EPromotionType.OrderDiscount, label: "Giảm giá đơn hàng" },
  { value: EPromotionType.LineItemDiscount, label: "Giảm sản phẩm cụ thể" },
  { value: EPromotionType.BuyXGetY, label: "Mua X tặng Y" },
  { value: EPromotionType.FreeGift, label: "Tặng quà cố định" },
  { value: EPromotionType.FreeShipping, label: "Miễn phí vận chuyển" },
];

export const TAT_CA_LOAI_DIEU_KIEN = [
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
  {
    value: ERuleConditionType.FirstOrder,
    label: "Đơn hàng đầu tiên",
  },
];

export const TAT_CA_TOAN_TU = [
  {
    value: ERuleConditionOperator.GreaterThanOrEqual,
    label: ">= (Lớn hơn hoặc bằng)",
  },
  { value: ERuleConditionOperator.GreaterThan, label: "> (Lớn hơn)" },
  { value: ERuleConditionOperator.Equals, label: "= (Bằng)" },
  { value: ERuleConditionOperator.ContainsAny, label: "Chứa ít nhất 1" },
  { value: ERuleConditionOperator.ContainsAll, label: "Chứa tất cả" },
];

export const TAT_CA_LOAI_HANH_DONG = [
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

export const LOAI_DOI_TUONG = [
  { value: EActionTargetType.Product, label: "Sản phẩm" },
  { value: EActionTargetType.Category, label: "Danh mục" },
];

// BuyProduct đã bị bỏ khỏi hệ thống.
// Vai trò "sản phẩm cần mua" nằm trong condition MinQuantityOfProduct.
export const TAT_CA_VAI_TRO = [
  { value: EActionTargetRole.DiscountTarget, label: "Áp giảm giá" },
  { value: EActionTargetRole.GetProduct, label: "Sản phẩm được tặng (Get)" },
  { value: EActionTargetRole.GiftProduct, label: "Quà tặng cố định" },
];

// ─── conditionType → operators được phép ─────────────────────────────────────

export const CONDITION_TYPE_OPERATORS: Record<
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
  // FirstOrder: không có operator — BE không đọc operator khi evaluate
  [ERuleConditionType.FirstOrder]: [],
};

// ─── conditionType nào cần combobox ──────────────────────────────────────────

type ConditionValueType =
  | "number"
  | "product-multi"
  | "category-multi"
  | "product-single-qty"
  | "none";  // FirstOrder — không cần input

export const CONDITION_VALUE_TYPE: Record<ERuleConditionType, ConditionValueType> = {
  [ERuleConditionType.CartSubtotal]: "number",
  [ERuleConditionType.TotalCartQuantity]: "number",
  [ERuleConditionType.MinQuantityInCategory]: "number",
  [ERuleConditionType.CartContainsProduct]: "product-multi",
  [ERuleConditionType.CartContainsCategory]: "category-multi",
  // MinQuantityOfProduct = ProductCombobox (single) + InputNumber → ghép "uuid:qty"
  [ERuleConditionType.MinQuantityOfProduct]: "product-single-qty",
  // FirstOrder: BE tự kiểm tra, không cần value từ người dùng
  [ERuleConditionType.FirstOrder]: "none",
};

export const CONDITION_VALUE_PLACEHOLDER: Record<ERuleConditionType, string> = {
  [ERuleConditionType.CartSubtotal]: "VD: 100000 (đơn từ 100k)",
  [ERuleConditionType.TotalCartQuantity]: "VD: 5 (từ 5 sản phẩm)",
  [ERuleConditionType.MinQuantityInCategory]:
    "VD: 2 (ít nhất 2 sp trong danh mục)",
  [ERuleConditionType.CartContainsProduct]: "",
  [ERuleConditionType.CartContainsCategory]: "",
  [ERuleConditionType.MinQuantityOfProduct]: "Số lượng tối thiểu",
  [ERuleConditionType.FirstOrder]: "",
};
