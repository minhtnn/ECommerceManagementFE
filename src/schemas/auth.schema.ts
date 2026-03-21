import { z } from "zod"

//#region Login
export const FELoginSchema = z
  .object({
    usernameOrEmail: z.string().max(50).optional(),
    password: z.string()
      .min(1, { message: "Mật khẩu không được bỏ trống" })
      .max(50, { message: "Mật khẩu không được vượt quá 50 ký tự" }),
  })
  .superRefine((data, ctx) => {
    if (!data.usernameOrEmail || data.usernameOrEmail.trim() === "") {
      ctx.addIssue({
        path: ["usernameOrEmail"],
        message: "Phải nhập tên đăng nhập hoặc email",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const BELoginSchema = z
  .object({
    username: z.string().max(50).optional(),
    email: z.string().email().optional(),
    password: z.string(),
  })
//#endregion

//#region Register
export const FERegisterSchema = z
  .object({
    phoneNumber: z.string()
      .refine(
        (val) => val === "" || /^(0[0-9]{9})$/.test(val),
        { message: "Số điện thoại không hợp lệ" }
      )
      .optional(),
    email: z.string({ required_error: "Email là bắt buộc" }).email({ message: "Địa chỉ email không hợp lệ" }),
    username: z.string().min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" }).max(50, { message: "Tên đăng nhập không được vượt quá 50 ký tự" }),
    fullName: z.string().min(1, { message: "Họ và tên không được bỏ trống" }).max(100, { message: "Họ và tên không được vượt quá 100 ký tự" }),
    passwordString: z.string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(50, { message: "Mật khẩu không được vượt quá 50 ký tự" }),
  });
//#endregion

export const AuthResponseSchema = z.object({
  // accountId: z.string(),
  username: z.string(),
  accessToken: z.string(),
});

export const AccountDetailResponse = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional()
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Mật khẩu hiện tại không được bỏ trống" }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu mới phải có ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Mật khẩu mới phải có ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Mật khẩu mới phải có ít nhất 1 chữ số" })
      .regex(/[@$!%*?&#]/, {
        message: "Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt (@$!%*?&#)",
      }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Xác nhận mật khẩu không được bỏ trống" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type TFELoginRequest = z.TypeOf<typeof FELoginSchema>;
export type TBELoginRequest = z.TypeOf<typeof BELoginSchema>;
export type TFERegisterSchema = z.TypeOf<typeof FERegisterSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
export type TAccountDetailResponse = z.TypeOf<typeof AccountDetailResponse>;
export type TChangePasswordRequest = z.TypeOf<typeof ChangePasswordSchema>;

