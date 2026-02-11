import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCustomer } from "@/hooks/use-customer";
import { handleApiError } from "@/lib/error";
import {
  CreateCustomerAddressSchema,
  TCreateCustomerAddress,
  TCustomerAddressDetailResponse,
  TUpdateCustomerAddress,
  UpdateCustomerAddressSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CustomerAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: TCustomerAddressDetailResponse | null;
  mode: "create" | "edit";
}

const CustomerAddressDialog = ({
  open,
  onOpenChange,
  address,
  mode,
}: CustomerAddressDialogProps) => {
  const { createCustomerAddress, updateCustomerAddress } = useCustomer();

  const createMutation = createCustomerAddress();
  const updateMutation = updateCustomerAddress();

  const form = useForm<TCreateCustomerAddress | TUpdateCustomerAddress>({
    resolver: zodResolver(
      mode === "create" ? CreateCustomerAddressSchema : UpdateCustomerAddressSchema
    ),
    defaultValues: {
      receiver: "",
      address: "",
      shippingContact: "",
      latitude: undefined,
      longitude: undefined,
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && address) {
      form.reset({
        id: address.id,
        receiver: address.receiver,
        address: address.address,
        shippingContact: address.shippingContact,
        latitude: address.latitude ?? undefined,
        longitude: address.longitude ?? undefined,
        isPrimary: address.isPrimary,
      });
    } else if (mode === "create") {
      form.reset({
        receiver: "",
        address: "",
        shippingContact: "",
        latitude: undefined,
        longitude: undefined,
        isPrimary: false,
      });
    }
  }, [mode, address, open]);

  const onSubmit = async (data: TCreateCustomerAddress | TUpdateCustomerAddress) => {
    try {
      if (mode === "create") {
        const result = await createMutation.mutateAsync(data as TCreateCustomerAddress);
        if (result?.data?.status >= 200 && result?.data?.status < 300) {
          toast.success(result.data?.message || "Thêm địa chỉ thành công");
          form.reset();
          onOpenChange(false);
        }
      } else {
        const { id, ...updateData } = data as TUpdateCustomerAddress;
        const result = await updateMutation.mutateAsync({
          id,
          data: { id, ...updateData },
        });
        if (result?.data?.status >= 200 && result?.data?.status < 300) {
          toast.success(result.data?.message || "Cập nhật địa chỉ thành công");
          onOpenChange(false);
        }
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Nhập thông tin địa chỉ giao hàng mới"
              : "Chỉnh sửa thông tin địa chỉ giao hàng"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="receiver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên người nhận <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên người nhận"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số điện thoại <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Địa chỉ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập địa chỉ"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vĩ độ (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Nhập vĩ độ"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh độ (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Nhập kinh độ"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded-lg px-4 py-3">
                  <FormLabel className="text-sm mb-0">Địa chỉ mặc định</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircleIcon className="h-4 w-4 animate-spin mr-2" />
                    {mode === "create" ? "Đang thêm..." : "Đang cập nhật..."}
                  </>
                ) : mode === "create" ? (
                  "Thêm địa chỉ"
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerAddressDialog;