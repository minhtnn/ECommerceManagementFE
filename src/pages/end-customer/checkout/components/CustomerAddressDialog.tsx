import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useCustomer } from "@/hooks/use-customer";
import { useOpenApi } from "@/hooks/use-map";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  CreateCustomerAddressSchema,
  TCreateCustomerAddress,
  TCustomerAddressDetailResponse,
  TUpdateCustomerAddress,
  UpdateCustomerAddressSchema,
} from "@/schemas/customer.schema";
import {
  TOpenApiProvinceListResponse,
  TOpenApiWardDetailResponse,
} from "@/schemas/map.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [chosenProvince, setChosenProvince] =
    useState<TOpenApiProvinceListResponse | null>(null);
  const [chosenWard, setChosenWard] =
    useState<TOpenApiWardDetailResponse | null>(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [openProvincePopover, setOpenProvincePopover] = useState(false);
  const [openWardPopover, setOpenWardPopover] = useState(false);

  const { getProvinces, getWards } = useOpenApi();
  const { createCustomerAddress, updateCustomerAddress } = useCustomer();

  const {
    data: provincesData,
    isLoading: isProvincesLoading,
    isError: isProvincesError,
    error: provincesError,
  } = getProvinces();

  const {
    data: wardsData,
    isLoading: isWardsLoading,
    isError: isWardsError,
  } = getWards({
    province: chosenProvince?.code,
    depth: 2,
    allowFetch: !!chosenProvince?.code,
  });

  const createMutation = createCustomerAddress();
  const updateMutation = updateCustomerAddress();

  const provinces = provincesData?.data ?? [];
  const wards = wardsData?.data ?? [];

  const form = useForm<TCreateCustomerAddress | TUpdateCustomerAddress>({
    resolver: zodResolver(
      mode === "create"
        ? CreateCustomerAddressSchema
        : UpdateCustomerAddressSchema,
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
      setStreetAddress(null);
      setChosenProvince(null);
      setChosenWard(null);
    }
  }, [mode, address, open]);

  const onSubmit = async (
    data: TCreateCustomerAddress | TUpdateCustomerAddress,
  ) => {
    if (!chosenProvince || !chosenWard || !streetAddress) {
      toast.error(
        "Vui lòng chọn đầy đủ thông tin địa chỉ (tỉnh/thành phố, phường/xã, số nhà/tên đường)",
      );
      return;
    }
    const fullAddress = [streetAddress, chosenWard?.name, chosenProvince?.name]
      .filter(Boolean)
      .join(", ");
    try {
      if (mode === "create") {
        const result = await createMutation.mutateAsync({
          ...data,
          address: fullAddress,
        } as TCreateCustomerAddress);
        if (result?.data?.status >= 200 && result?.data?.status < 300) {
          toast.success(result.data?.message || "Thêm địa chỉ thành công");
          form.reset();
          setChosenProvince(null);
          setChosenWard(null);
          onOpenChange(false);
        }
      } else {
        const { id, ...updateData } = data as TUpdateCustomerAddress;
        const result = await updateMutation.mutateAsync({
          id,
          data: { id, ...updateData, address: fullAddress },
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
            {/* Tên người nhận */}
            <div className="space-y-2">
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
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Tỉnh / Thành phố</FormLabel>
                {isProvincesLoading ? (
                  <div className="flex items-center justify-center h-10 border rounded-md">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Đang tải...
                    </span>
                  </div>
                ) : isProvincesError ? (
                  <div className="flex items-center justify-center h-10 border rounded-md border-destructive/50 bg-destructive/5">
                    <span className="text-sm text-destructive">
                      Không thể tải dữ liệu tỉnh/thành phố
                    </span>
                  </div>
                ) : (
                  <Popover
                    open={openProvincePopover}
                    onOpenChange={setOpenProvincePopover}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openProvincePopover}
                        className="w-full justify-between"
                        disabled={isLoading}
                      >
                        {chosenProvince
                          ? provinces.find(
                              (p) => p.code === chosenProvince.code,
                            )?.name
                          : "Chọn tỉnh / thành phố..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm tỉnh/thành phố..." />
                        <CommandList>
                          <CommandEmpty>
                            Không tìm thấy tỉnh/thành phố
                          </CommandEmpty>
                          <CommandGroup>
                            {provinces.map((province) => (
                              <CommandItem
                                key={province.code}
                                value={province.name}
                                onSelect={() => {
                                  setChosenProvince(
                                    province.code === chosenProvince?.code
                                      ? null
                                      : province,
                                  );
                                  setChosenWard(null);
                                  setOpenProvincePopover(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    chosenProvince?.code === province.code
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {province.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <div className="space-y-2">
                <FormLabel>Phường / Xã</FormLabel>
                {chosenProvince == null ? (
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openWardPopover}
                    className="w-full justify-between"
                    disabled
                  >
                    {chosenWard ? chosenWard.name : "Chọn phường / xã..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                ) : isWardsLoading ? (
                  <div className="flex items-center justify-center h-10 border rounded-md">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Đang tải...
                    </span>
                  </div>
                ) : isWardsError ? (
                  <div className="flex items-center justify-center h-10 border rounded-md border-destructive/50 bg-destructive/5">
                    <span className="text-sm text-destructive">
                      Không thể tải dữ liệu phường/xã
                    </span>
                  </div>
                ) : (
                  <Popover
                    open={openWardPopover}
                    onOpenChange={setOpenWardPopover}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openWardPopover}
                        className="w-full justify-between"
                        disabled={isLoading}
                      >
                        {chosenWard ? chosenWard.name : "Chọn phường / xã..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm phường/xã..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy phường/xã</CommandEmpty>
                          <CommandGroup>
                            {wards.map((ward) => (
                              <CommandItem
                                key={ward.code}
                                value={ward.name}
                                onSelect={() => {
                                  setChosenWard(
                                    ward.code === chosenWard?.code
                                      ? null
                                      : ward,
                                  );
                                  setOpenWardPopover(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    chosenWard?.code === ward.code
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {ward.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            {/* Số nhà */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Số nhà, tên đường, phường/xã...{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Nhập số nhà, tên đường, phường/xã..."
                disabled={
                  isLoading || chosenProvince == null || chosenWard == null
                }
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </div>
            {/* Địa chỉ mặc định */}
            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded-lg px-4 py-3">
                  <FormLabel className="text-sm mb-0">
                    Địa chỉ mặc định
                  </FormLabel>
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
