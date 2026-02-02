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
import { Switch } from "@/components/ui/switch";
import { usePayment } from "@/hooks/use-payment";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import {
  BrandPaymentMethodCreateSchema,
  TBrandPaymentMethodCreate,
} from "@/schemas/payment-method.schema";
import { TPaymentMethodListResponse } from "@/schemas/payment-method.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, LoaderCircleIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/** Parse "name,age,email" -> ["name", "age", "email"] */
const parseConfigurationKeys = (schema: string | null): string[] => {
  if (!schema) return [];
  return schema
    .split(", ")
    .map((key) => key.trim())
    .filter(Boolean);
};

const BrandPaymentMethodCreatePage = () => {
  const { currentPage, pageSize, sortBy, isAsc, filter } = useQueryParams({
    defaultSortBy: "name",
    defaultFilter: [
      { id: "code", value: null },
      { id: "name", value: null },
    ],
  });

  const codeFilter = String(filter.find((f) => f.id === "code")?.value ?? "");
  const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");

  const { getPaymentMethods, createBrandPaymentMethod } = usePayment();

  const { data, isLoading, isError } = getPaymentMethods({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    code: codeFilter,
    name: nameFilter,
  });

  const createBrandPaymentMethodMutation = createBrandPaymentMethod();

  const applicablePaymentMethods: TPaymentMethodListResponse[] =
    data?.data?.data?.items ?? [];

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<TPaymentMethodListResponse | null>(null);

  // Dynamic configuration keys từ systemConfigurationSchema
  const configurationKeys = parseConfigurationKeys(
    selectedPaymentMethod?.systemConfigurationSchema,
  );

  // State cho các dynamic fields: { name: "Minh", age: "13" }
  const [configurationValues, setConfigurationValues] = useState<
    Record<string, string>
  >({});

  // Reset configurationValues khi đổi payment method
  useEffect(() => {
    if (selectedPaymentMethod) {
      const keys = parseConfigurationKeys(
        selectedPaymentMethod.systemConfigurationSchema,
      );
      const initial = Object.fromEntries(keys.map((key) => [key, ""]));
      setConfigurationValues(initial);
    } else {
      setConfigurationValues({});
    }
  }, [selectedPaymentMethod]);

  const filteredPaymentMethods = applicablePaymentMethods.filter(
    (pm) =>
      pm.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      pm.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const form = useForm<TBrandPaymentMethodCreate>({
    resolver: zodResolver(BrandPaymentMethodCreateSchema),
    defaultValues: {
      paymentMethodId: "",
      isDefault: false,
      displayOrder: 1,
      isActive: true,
      configuration: undefined,
    },
  });

  const handleSelectPaymentMethod = (pm: TPaymentMethodListResponse) => {
    setSelectedPaymentMethod(pm);
    form.setValue("paymentMethodId", pm.id);
  };

  const handleConfigValueChange = (key: string, value: string) => {
    setConfigurationValues((prev) => ({ ...prev, [key]: value }));
  };

  /** Gộp configurationValues thành JSON string, hoặc undefined nếu không có keys */
  const buildConfigurationString = (): string | undefined => {
    if (configurationKeys.length === 0) return undefined;
    return JSON.stringify(configurationValues);
  };

  const onSubmit = async (data: TBrandPaymentMethodCreate) => {
    if (createBrandPaymentMethodMutation.isPending) return;
    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("PaymentMethodId", data.paymentMethodId);
      formData.append("IsDefault", data.isDefault.toString());
      formData.append("DisplayOrder", data.displayOrder.toString());
      formData.append("IsActive", data.isActive.toString());

      const configString = buildConfigurationString();
      if (configString) {
        formData.append("Configuration", configString);
      }

      const result =
        await createBrandPaymentMethodMutation.mutateAsync(formData);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success(
          result.data?.message || "Gán phương thức thanh toán thành công",
        );
        form.reset();
        setSelectedPaymentMethod(null);
        setConfigurationValues({});
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Phương thức thanh toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Payment method list */}
        <div className="bg-background rounded-lg border p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Phương thức thanh toán có thể áp dụng
            </h2>
            {applicablePaymentMethods.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {applicablePaymentMethods.length} mục
              </span>
            )}
          </div>

          {/* Search input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên..."
              className="pl-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto border rounded-lg min-h-0 max-h-[480px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <LoaderCircleIcon className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Đang tải...
                </span>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center h-full py-12">
                <span className="text-sm text-destructive">
                  Không thể tải dữ liệu. Vui lòng thử lại.
                </span>
              </div>
            ) : filteredPaymentMethods.length === 0 ? (
              <div className="flex items-center justify-center h-full py-12">
                <span className="text-sm text-muted-foreground">
                  Không tìm thấy phương thức thanh toán
                </span>
              </div>
            ) : (
              <ul className="divide-y">
                {filteredPaymentMethods.map((pm) => {
                  const isSelected = selectedPaymentMethod?.id === pm.id;
                  return (
                    <li
                      key={pm.id}
                      onClick={() => handleSelectPaymentMethod(pm)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                        ${isSelected ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/50"}`}
                    >
                      <div className="h-10 w-10 rounded-md border bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {pm.imageUrl ? (
                          <img
                            src={pm.imageUrl}
                            alt={pm.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">
                            {pm.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {pm.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pm.code}
                        </p>
                      </div>

                      {/* Badge nếu có configuration schema */}
                      {pm.systemConfigurationSchema && (
                        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded flex-shrink-0">
                          Cần cấu hình
                        </span>
                      )}

                      {isSelected && (
                        <CheckCircle2Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="bg-background rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Thiết lập phương thức thanh toán
            </h2>
          </div>

          {/* Selected payment method preview */}
          {selectedPaymentMethod ? (
            <div className="flex items-center gap-3 mb-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="h-10 w-10 rounded-md border bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                {selectedPaymentMethod.imageUrl ? (
                  <img
                    src={selectedPaymentMethod.imageUrl}
                    alt={selectedPaymentMethod.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">
                    {selectedPaymentMethod.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {selectedPaymentMethod.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPaymentMethod.code}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mb-6 p-4 border-2 border-dashed border-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                Chọn phương thức thanh toán từ danh sách bên trái
              </span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* isDefault + isActive toggles */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between border rounded-lg px-4 py-3">
                      <FormLabel className="text-sm">
                        Phương thức mặc định
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={createBrandPaymentMethodMutation.isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between border rounded-lg px-4 py-3">
                      <FormLabel className="text-sm">Hoạt động</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={createBrandPaymentMethodMutation.isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* displayOrder */}
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? "" : Number(e.target.value);
                          field.onChange(value);
                        }}
                        disabled={createBrandPaymentMethodMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic configuration fields */}
              {configurationKeys.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold">
                      Cấu hình phương thức thanh toán
                    </FormLabel>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {configurationKeys.length} trường
                    </span>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                    {configurationKeys.map((key) => (
                      <FormItem key={key}>
                        <FormLabel className="text-sm capitalize">
                          {key}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={`Nhập ${key}...`}
                            value={configurationValues[key] ?? ""}
                            onChange={(e) =>
                              handleConfigValueChange(key, e.target.value)
                            }
                            disabled={
                              createBrandPaymentMethodMutation.isPending
                            }
                          />
                        </FormControl>
                      </FormItem>
                    ))}
                  </div>

                  {/* Preview JSON output */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-muted-foreground">
                      Xem trước cấu hình (JSON)
                    </span>
                    <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
                      {JSON.stringify(configurationValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={
                    !selectedPaymentMethod ||
                    createBrandPaymentMethodMutation.isPending
                  }
                >
                  {createBrandPaymentMethodMutation.isPending ? (
                    <>
                      <LoaderCircleIcon className="h-4 w-4 animate-spin mr-2" />
                      Đang tạo...
                    </>
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BrandPaymentMethodCreatePage;
