import { PageLoader } from "@/components/LoadingScreen";
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
import { handleApiError } from "@/lib/error";
import { formatDateTimeInShort } from "@/lib/utils";
import {
  BrandPaymentMethodUpdateSchema,
  TBrandPaymentMethodUpdate,
} from "@/schemas/payment-method.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

/**
 * systemConfiguration là comma-separated string do system admin định nghĩa,
 * ví dụ: "name, age, email"
 * → parse thành ["name", "age", "email"] làm source of truth cho dynamic fields
 */
const parseSystemConfigurationKeys = (
  systemConfiguration: string | null,
): string[] => {
  if (!systemConfiguration) return [];
  return systemConfiguration
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
};

/**
 * brandConfiguration là JSON object chứa giá trị brand đã điền trước,
 * ví dụ: {"name": "Minh", "age": "13"}
 * → chỉ dùng để lookup values, không trust keys từ đây
 */
const parseBrandConfiguration = (
  brandConfiguration: string | null,
): Record<string, string> => {
  if (!brandConfiguration) return {};
  try {
    const parsed = JSON.parse(brandConfiguration);
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, String(value ?? "")]),
    );
  } catch {
    return {};
  }
};

const BrandPaymentMethodEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { getBrandPaymentMethodById, updateBrandPaymentMethod } = usePayment();

  const {
    data: detailData,
    isLoading,
    isError,
    error,
  } = getBrandPaymentMethodById(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError && error) {
    handleApiError(error);
  }

  const detail = detailData.data.data;
  const updateMutation = updateBrandPaymentMethod(id!);

  // Keys từ systemConfiguration (comma-separated) — source of truth
  const systemKeys = parseSystemConfigurationKeys(detail.systemConfiguration);
  // Values từ brandConfiguration (JSON) — chỉ lookup
  const existingBrandValues = parseBrandConfiguration(
    detail.brandConfiguration,
  );

  /**
   * Build initial config: iterate theo systemKeys,
   * fill value từ brandConfiguration nếu có.
   * → Keys không thuộc systemConfiguration sẽ bị bỏ qua tự động
   */
  const buildInitialConfigValues = (): Record<string, string> =>
    Object.fromEntries(
      systemKeys.map((key) => [key, existingBrandValues[key] ?? ""]),
    );

  const [configurationValues, setConfigurationValues] = useState<Record<string, string>>(buildInitialConfigValues);

  const form = useForm<TBrandPaymentMethodUpdate>({
    resolver: zodResolver(BrandPaymentMethodUpdateSchema),
    defaultValues: {
      id: detail.id,
      isDefault: detail.isDefault,
      displayOrder: detail.displayOrder,
      isActive: detail.isActive,
      configuration: undefined,
    },
  });

  // Sync lại khi detail thay đổi (e.g. sau refetch)
  useEffect(() => {
    form.reset({
      id: detail.id,
      isDefault: detail.isDefault,
      displayOrder: detail.displayOrder,
      isActive: detail.isActive,
      configuration: undefined,
    });
    setConfigurationValues(buildInitialConfigValues());
  }, [detail]);

  const handleConfigValueChange = (key: string, value: string) => {
    setConfigurationValues((prev) => ({ ...prev, [key]: value }));
  };

  const buildConfigurationString = (): string | undefined => {
    if (systemKeys.length === 0) return undefined;
    const filtered = Object.fromEntries(
      systemKeys.map((key) => [key, configurationValues[key] ?? ""]),
    );
    return JSON.stringify(filtered);
  };

  const isConfigurationChanged = (): boolean => {
    if (systemKeys.length === 0) return false;
    const initial = buildInitialConfigValues();
    return systemKeys.some((key) => configurationValues[key] !== initial[key]);
  };

  const onSubmit = async (data: TBrandPaymentMethodUpdate) => {
    const hasFormChanges = Object.keys(form.formState.dirtyFields).length > 0;
    const hasConfigChanges = isConfigurationChanged();

    if (!hasFormChanges && !hasConfigChanges) {
      toast.warning("Bạn chưa thay đổi dữ liệu nào!");
      return;
    }

    if (updateMutation.isPending) return;

    try {
      const formData = new FormData();
      formData.append("Id", data.id);
      formData.append("IsDefault", data.isDefault.toString());
      formData.append("DisplayOrder", data.displayOrder.toString());
      formData.append("IsActive", data.isActive.toString());

      const configString = buildConfigurationString();
      if (configString) {
        formData.append("Configuration", configString);
      }

      const result = await updateMutation.mutateAsync(formData);
      const { message, status } = result.data;

      if (message) {
        status >= 200 && status < 300
          ? toast.success(message)
          : toast.error(message);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chỉnh sửa phương thức thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Read-only info */}
        <div className="bg-background rounded-lg border p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">
            Thông tin phương thức thanh toán
          </h2>

          {/* Image */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 mb-6">
            <div className="h-32 w-32 rounded-lg border bg-muted flex items-center justify-center overflow-hidden mb-4">
              {detail.imageUrl ? (
                <img
                  src={detail.imageUrl}
                  alt={detail.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground">
                  {detail.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Detail fields */}
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Tên</span>
              <span className="text-sm font-medium">{detail.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Ngày cập nhật cuối
              </span>
              <span className="text-sm font-medium">
                {detail.lastModifiedDate
                  ? formatDateTimeInShort(detail.lastModifiedDate)
                  : "Chưa cập nhật"}
              </span>
            </div>

            {/* System configuration keys preview */}
            {systemKeys.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Cấu hình hệ thống
                  </span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {systemKeys.length} trường
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {systemKeys.map((key) => (
                    <span
                      key={key}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Edit form */}
        <div className="bg-background rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Chỉnh sửa cấu hình</h2>
          </div>

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
                          disabled={updateMutation.isPending}
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
                          disabled={updateMutation.isPending}
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
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic configuration fields — keys từ systemConfiguration (comma-separated) */}
              {systemKeys.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold">
                      Cấu hình phương thức thanh toán
                    </FormLabel>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {systemKeys.length} trường
                    </span>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                    {systemKeys.map((key) => (
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
                            disabled={updateMutation.isPending}
                          />
                        </FormControl>
                      </FormItem>
                    ))}
                  </div>

                  {/* JSON preview */}
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
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <LoaderCircleIcon className="h-4 w-4 animate-spin mr-2" />
                      Đang cập nhật...
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

export default BrandPaymentMethodEditPage;
