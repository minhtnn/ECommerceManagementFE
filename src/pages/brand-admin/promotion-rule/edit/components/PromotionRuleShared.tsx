import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";

export const PROMOTION_TYPE_LABEL: Record<number, string> = {
  [EPromotionType.OrderDiscount]: "Giảm đơn hàng",
  [EPromotionType.LineItemDiscount]: "Giảm sản phẩm",
  [EPromotionType.BuyXGetY]: "Mua X tặng Y",
  // [EPromotionType.QuantityTier]: "Theo số lượng",
  [EPromotionType.FreeGift]: "Tặng quà",
  [EPromotionType.FreeShipping]: "Miễn phí ship",
};

export const STATUS_CONFIG: Record<
  EPromotionStatus,
  { label: string; className: string }
> = {
  [EPromotionStatus.Draft]: {
    label: "Nháp",
    className: "bg-gray-100 text-gray-600",
  },
  [EPromotionStatus.Pending]: {
    label: "Chưa kích hoạt",
    className: "bg-gray-100 text-gray-600",
  },
  [EPromotionStatus.Active]: {
    label: "Đang chạy",
    className: "bg-green-100 text-green-700",
  },
  [EPromotionStatus.Inactive]: {
    label: "Đã tắt",
    className: "bg-red-100 text-red-600",
  },
  [EPromotionStatus.Expired]: {
    label: "Hết hạn",
    className: "bg-slate-100 text-slate-500",
  },
};

export const CONDITION_TYPE_OPTIONS = [
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

export const CONDITION_OPERATOR_OPTIONS = [
  { value: ERuleConditionOperator.GreaterThanOrEqual, label: ">=" },
  { value: ERuleConditionOperator.GreaterThan, label: ">" },
  { value: ERuleConditionOperator.Equals, label: "=" },
  { value: ERuleConditionOperator.ContainsAny, label: "Chứa ít nhất 1" },
  { value: ERuleConditionOperator.ContainsAll, label: "Chứa tất cả" },
];

export const ACTION_TYPE_OPTIONS = [
  {
    value: ERuleActionType.CartPercentageDiscount,
    label: "Giảm theo phần trăm toàn đơn",
  },
  {
    value: ERuleActionType.CartFixedDiscount,
    label: "Giảm tiền cố định toàn đơn",
  },
  {
    value: ERuleActionType.ItemPercentageDiscount,
    label: "Giảm theo phần trăm cho sản phẩm",
  },
  {
    value: ERuleActionType.ItemFixedDiscount,
    label: "Giảm tiền cố định sản phẩm",
  },
  {
    value: ERuleActionType.BuyXGetYFreeProducts,
    label: "Mua X tặng Y sản phẩm",
  },
  {
    value: ERuleActionType.FreeGiftProduct,
    label: "Tặng quà cố định",
  },
  {
    value: ERuleActionType.FreeShipping,
    label: "Miễn phí vận chuyển",
  },
];

export const TARGET_TYPE_OPTIONS = [
  { value: EActionTargetType.Product, label: "Sản phẩm" },
  { value: EActionTargetType.Category, label: "Danh mục" },
];

export const TARGET_ROLE_OPTIONS = [
  { value: EActionTargetRole.DiscountTarget, label: "Áp giảm giá" },
  { value: EActionTargetRole.GetProduct, label: "Sản phẩm được tặng (Get)" },
  { value: EActionTargetRole.GiftProduct, label: "Quà tặng cố định" },
];

export type ConditionValueType =
  | "number"
  | "product-multi"
  | "category-multi"
  | "product-single-qty"
  | "none";

export const CONDITION_VALUE_TYPE: Record<
  ERuleConditionType,
  ConditionValueType
> = {
  [ERuleConditionType.CartSubtotal]: "number",
  [ERuleConditionType.TotalCartQuantity]: "number",
  [ERuleConditionType.MinQuantityInCategory]: "number",
  [ERuleConditionType.CartContainsProduct]: "product-multi",
  [ERuleConditionType.CartContainsCategory]: "category-multi",
  [ERuleConditionType.MinQuantityOfProduct]: "product-single-qty",
  [ERuleConditionType.FirstOrder]: "none",
};

export const CONDITION_VALUE_PLACEHOLDER: Record<ERuleConditionType, string> = {
  [ERuleConditionType.CartSubtotal]: "VD: 100000",
  [ERuleConditionType.TotalCartQuantity]: "VD: 5",
  [ERuleConditionType.MinQuantityInCategory]: "VD: 2",
  [ERuleConditionType.CartContainsProduct]: "",
  [ERuleConditionType.CartContainsCategory]: "",
  [ERuleConditionType.MinQuantityOfProduct]: "Số lượng tối thiểu",
  [ERuleConditionType.FirstOrder]: "",
};