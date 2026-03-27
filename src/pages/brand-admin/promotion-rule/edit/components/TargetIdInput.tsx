import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { CategoryCombobox } from "./CategoryCombobox";
import { ProductCombobox } from "./ProductCombobox";

export const TargetIdInput = ({
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
