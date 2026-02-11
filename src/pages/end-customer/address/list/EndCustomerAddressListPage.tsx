import { PageLoader } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/use-customer";
import { EndCustomerAccountLayout } from "@/layouts/EndCustomerAccountLayout";
import { handleApiError } from "@/lib/error";
import {
  Edit,
  LocateFixedIcon,
  MapPin,
  Phone,
  Plus,
  Star,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import CustomerAddressDialog from "./components/CustomerAddressDialog";
import { TCustomerAddressListResponse } from "@/schemas/customer.schema";

const EndCustomerAddressListPage = () => {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<TCustomerAddressListResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const { getCustomerAddresses } = useCustomer();

  const {
    data: addressesData,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
    error: addressesError,
  } = getCustomerAddresses({});

  const addresses = addressesData?.data?.data || [];

  if (isAddressesLoading) {
    return <PageLoader />;
  }
  if (isAddressesError && addressesError) {
    handleApiError(addressesError);
  }

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setEditingAddress(null);
    setAddressDialogOpen(true);
  };

  const handleOpenEditDialog = (address: TCustomerAddressListResponse) => {
    setDialogMode("edit");
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };
  return (
    <EndCustomerAccountLayout breadcrumbs={[{ label: "Sổ địa chỉ" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LocateFixedIcon className="w-7 h-7" />
          Sổ địa chỉ của bạn
        </h1>
        <p className="text-muted-foreground mt-1">Quản lý sổ địa chỉ của bạn</p>
      </div>
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
          <MapPin size={40} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Chưa có địa chỉ giao hàng
          </p>
          <Button onClick={handleOpenCreateDialog} size="sm">
            <Plus size={16} className="mr-2" />
            Thêm địa chỉ mới
          </Button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {addresses.map((address) => {
            return (
              <div
                key={address.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all`}
              >
                {address.isPrimary && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      <Star size={10} fill="currentColor" />
                      Mặc định
                    </span>
                  </div>
                )}

                <div className="pr-16">
                  <div className="flex items-start gap-2 mb-2">
                    <User size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{address.receiver}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {address.shippingContact}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="text-muted-foreground mt-0.5"
                    />
                    <p className="text-sm text-muted-foreground">
                      {address.address}
                    </p>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-2 right-2 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditDialog(address);
                  }}
                >
                  <Edit size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <CustomerAddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        address={editingAddress}
        mode={dialogMode}
      />
    </EndCustomerAccountLayout>
  );
};

export default EndCustomerAddressListPage;
