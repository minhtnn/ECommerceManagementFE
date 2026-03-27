import { Input } from "@/components/ui/input";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";
import { CategoryMultiCombobox } from "./CategoryMultiCombobox";
import { ProductCombobox } from "./ProductCombobox";
import { ProductMultiCombobox } from "./ProductMultiCombobox";
import { CONDITION_VALUE_PLACEHOLDER, CONDITION_VALUE_TYPE } from "./PromotionRuleShared";

export const ConditionValueInput = ({
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

  // FirstOrder: không cần nhập giá trị — BE tự kiểm tra lịch sử đơn hàng
  if (valueType === "none") {
    return (
      <p className="text-xs text-muted-foreground h-8 flex items-center italic">
        Không cần nhập — hệ thống tự kiểm tra đơn hàng đầu tiên
      </p>
    );
  }

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
