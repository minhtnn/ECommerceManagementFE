// components/EditAccountDialog.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import {
  handleSetRegisterEmail,
  handleToggleOTPModal,
} from "@/redux/modal/modal-slice";
import {
  TAccountDetailResponse,
  UpdateAccountRequestSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, LoaderCircleIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

type TEditAccountForm = z.infer<typeof UpdateAccountRequestSchema>;

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmailSuccess: (open: boolean) => void;
  account?: TAccountDetailResponse;
}

const EditAccountDialog = ({
  open,
  onOpenChange,
  onUpdateEmailSuccess,
  account,
}: EditAccountDialogProps) => {
  const dispatch = useDispatch();
  const { updateAccount } = useAuth();
  const updateAccountMutation = updateAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    account?.imageUrl ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageError, setImageError] = useState(false);

  const form = useForm<TEditAccountForm>({
    resolver: zodResolver(UpdateAccountRequestSchema),
    defaultValues: {
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      phoneNumber: account?.phoneNumber ?? "",
    },
  });

  useEffect(() => {
    if (open && account) {
      form.reset({
        fullName: account.fullName ?? "",
        email: account.email ?? "",
        phoneNumber: account.phoneNumber ?? "",
      });

      setImagePreview(account.imageUrl ?? null);
    }
  }, [open, account]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageError(false);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setIsImageChanged(true);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setIsImageChanged(true);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: TEditAccountForm) => {
    const isEmailChanged = values.email !== (account?.email ?? "");
    const hasFormChanges = Object.keys(form.formState.dirtyFields).length > 0;
    const hasImageChanges = isImageChanged;

    if (!hasFormChanges && !hasImageChanges) {
      toast.warning("Bạn chưa thay đổi dữ liệu nào!");
      return;
    }

    if (updateAccountMutation.isPending) return;

    const formData = new FormData();
    if (values.fullName) formData.append("fullName", values.fullName);
    if (values.email) formData.append("email", values.email);
    if (values.phoneNumber) formData.append("phoneNumber", values.phoneNumber);
    if (isImageChanged && imageFile) formData.append("image", imageFile);

    try {
      const result = await updateAccountMutation.mutateAsync(formData);
      const { message, status } = result.data;
      if (message) {
        if (status >= 200 && status < 300) {
          toast.success(message);
          handleClose();

          if (isEmailChanged) {
            console.log("EmailChange")
            dispatch(handleSetRegisterEmail(values.email));
            onUpdateEmailSuccess(true);
          }
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleClose = () => {
    form.reset({
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      phoneNumber: account?.phoneNumber ?? "",
    });
    setImagePreview(account?.imageUrl ?? null);
    setImageFile(null);
    setIsImageChanged(false);
    setImageError(false);
    onOpenChange(false);
  };

  const avatarFallback = account?.fullName?.charAt(0)?.toUpperCase() ?? "K";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Chỉnh sửa thông tin tài khoản
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    {imageError && !isImageChanged ? (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                    ) : (
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={imagePreview}
                          onError={() => setImageError(true)}
                        />
                        <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}

                {imagePreview && !imageError && (
                  <div
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {imageFile && (
                <p className="text-xs text-muted-foreground">
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Nhấn vào ảnh để thay đổi • JPG, PNG, GIF, WEBP (tối đa 5MB)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ và tên"
                      {...field}
                      disabled={updateAccountMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                      disabled={updateAccountMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0901234567"
                      {...field}
                      disabled={updateAccountMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateAccountMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={updateAccountMutation.isPending}
              >
                {updateAccountMutation.isPending ? (
                  <>
                    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDialog;
