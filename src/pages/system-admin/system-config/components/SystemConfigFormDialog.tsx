import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  CreateSystemConfigSchema,
  TCreateSystemConfigRequest,
  TSystemConfigResponse,
  TUpdateSystemConfigRequest,
  UpdateSystemConfigSchema,
} from "@/schemas/system-config.schema";
import { EConfigDataType } from "@/types/enums/config-data-type.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface SystemConfigFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: TSystemConfigResponse;
  allConfigs: TSystemConfigResponse[];
  onSubmit: (
    data: TCreateSystemConfigRequest | TUpdateSystemConfigRequest,
  ) => Promise<void>;
  isPending: boolean;
}

export const SystemConfigFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialData,
  allConfigs,
  onSubmit,
  isPending,
}: SystemConfigFormDialogProps) => {
  const isEdit = mode === "edit";

  const createForm = useForm<TCreateSystemConfigRequest>({
    resolver: zodResolver(CreateSystemConfigSchema),
    defaultValues: {
      key: "",
      title: "",
      dataType: EConfigDataType.String,
      description: "",
      isRequired: false,
      defaultValue: "",
      value: "",
      displayOrder: 0,
      dependencies: [],
    },
  });

  const editForm = useForm<TUpdateSystemConfigRequest>({
    resolver: zodResolver(UpdateSystemConfigSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      isRequired: false,
      defaultValue: "",
      value: "",
      clearValue: false,
      displayOrder: 0,
      dependencies: [],
    },
  });

  const form = isEdit ? editForm : createForm;

  const { fields, append, remove } = useFieldArray({
    // @ts-ignore — union form type
    control: form.control,
    name: "dependencies",
  });

  // Reset form khi mở dialog
  useEffect(() => {
    if (!open) return;
    if (isEdit && initialData) {
      editForm.reset({
        id: initialData.id,
        title: initialData.title,
        description: initialData.description ?? "",
        isRequired: initialData.isRequired,
        defaultValue: initialData.defaultValue ?? "",
        value: initialData.value ?? "",
        clearValue: false,
        displayOrder: initialData.displayOrder,
        dependencies: initialData.dependencies.map((d) => ({
          triggerKeyId: d.triggerKeyId,
          triggerValue: d.triggerValue,
        })),
      });
    } else {
      createForm.reset({
        key: "",
        title: "",
        dataType: EConfigDataType.String,
        description: "",
        isRequired: false,
        defaultValue: "",
        value: "",
        displayOrder: 0,
        dependencies: [],
      });
    }
  }, [open, initialData, isEdit]);

  // Available trigger keys — loại bỏ chính nó khi edit
  const availableTriggerKeys = allConfigs.filter(
    (c) => !isEdit || c.id !== initialData?.id,
  );

  const handleSubmit = async (
    data: TCreateSystemConfigRequest | TUpdateSystemConfigRequest,
  ) => {
    await onSubmit(data);
  };

  const dataTypeLabel: Record<EConfigDataType, string> = {
    [EConfigDataType.Boolean]: "Boolean",
    [EConfigDataType.String]: "String",
    [EConfigDataType.Number]: "Number",
    [EConfigDataType.Json]: "JSON",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật system config" : "Tạo system config mới"}
          </DialogTitle>
        </DialogHeader>

        {/* @ts-ignore — union form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Key — chỉ hiện khi create */}
            {!isEdit && (
              <FormField
                control={createForm.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Key <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: EnabledForgotPasswordFunction"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Chỉ chứa chữ cái, số và dấu gạch dưới
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Key display khi edit */}
            {isEdit && initialData && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Key</p>
                <Badge variant="secondary" className="font-mono text-sm">
                  {initialData.key}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Key không thể thay đổi sau khi tạo
                </p>
              </div>
            )}

            {/* Title */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiêu đề <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Kích hoạt gửi email"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DataType — chỉ khi create */}
            {!isEdit && (
              <FormField
                control={createForm.control}
                name="dataType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Kiểu dữ liệu <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={String(field.value)}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kiểu dữ liệu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(EConfigDataType)
                          .filter((key) => isNaN(Number(key)))
                          .map((key) => {
                            const value =
                              EConfigDataType[
                                key as keyof typeof EConfigDataType
                              ];
                            return (
                              <SelectItem key={key} value={String(value)}>
                                {dataTypeLabel[value as EConfigDataType]}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* DataType display khi edit */}
            {isEdit && initialData && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Kiểu dữ liệu</p>
                <Badge variant="outline">{initialData.dataType}</Badge>
                <p className="text-xs text-muted-foreground">
                  Kiểu dữ liệu không thể thay đổi
                </p>
              </div>
            )}

            {/* Description */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về config này"
                      className="resize-none"
                      rows={2}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Default Value */}
              <FormField
                // @ts-ignore
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị mặc định</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: false, http://..."
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Order */}
              <FormField
                // @ts-ignore
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Value */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị hiện tại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Giá trị sẽ được lưu"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ClearValue — chỉ khi edit */}
            {isEdit && (
              <FormField
                control={editForm.control}
                name="clearValue"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="cursor-pointer">
                        Xóa giá trị hiện tại
                      </FormLabel>
                      <FormDescription>
                        Bật để xóa value đang lưu (bỏ qua trường "Giá trị hiện
                        tại")
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* IsRequired */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="cursor-pointer">Bắt buộc</FormLabel>
                    <FormDescription>
                      Key này bắt buộc phải có giá trị
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              // @ts-ignore
              control={form.control}
              name="isSecure"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="cursor-pointer">Bảo mật</FormLabel>
                    <FormDescription>
                      Key này bắt buộc phải có giá trị
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Dependencies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Phụ thuộc</p>
                  <p className="text-xs text-muted-foreground">
                    Key này sẽ bắt buộc có value khi trigger key thỏa điều kiện
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ triggerKeyId: "", triggerValue: "" })}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-3 border rounded-lg border-dashed">
                  Chưa có dependency
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start p-3 border rounded-lg"
                >
                  {/* Trigger Key */}
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name={`dependencies.${index}.triggerKeyId`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Trigger Key</FormLabel>
                        <Select
                          onValueChange={f.onChange}
                          value={f.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Chọn key..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTriggerKeys.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                <span className="font-mono text-xs">
                                  {c.key}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Trigger Value */}
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name={`dependencies.${index}.triggerValue`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Trigger Value</FormLabel>
                        <FormControl>
                          <Input
                            className="h-8 text-xs"
                            placeholder="VD: true"
                            {...f}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
