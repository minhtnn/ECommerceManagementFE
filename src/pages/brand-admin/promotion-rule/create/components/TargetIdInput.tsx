import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { ProductCombobox } from "./ProductCombobox";
import { CategoryCombobox } from "./CategoryCombobox";

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
