import { z } from "zod"

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
export const AuthResponseSchema = z.object({
  // accountId: z.string(),
  username: z.string(),
  accessToken: z.string(),
});
export const AccountDetailResponse = z.object({
  fullName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  imageUrl: z.string().nullable(),
  address: z.string().nullable(),
  name: z.string(),
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
export const UpdateAccountRequestSchema = z.object({
  name: z.string().optional(),
  fullName: z.string().optional(),
  username: z.string()
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
    .max(50, { message: "Tên đăng nhập không được vượt quá 50 ký tự" })
    .optional(),
  phoneNumber: z.string().refine(
    (val) => val === "" || /^(0[0-9]{9})$/.test(val),
    { message: "Số điện thoại không hợp lệ" }
  ).optional(),
  email: z.string().email({ message: "Địa chỉ email không hợp lệ" }).optional(),
  address: z.string().max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }).optional(),
});
export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Địa chỉ email không hợp lệ" })
    .max(100, { message: "Email không được vượt quá 100 ký tự" }),
});
export const ResetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "Email là bắt buộc" })
      .email({ message: "Địa chỉ email không hợp lệ" }),
    token: z
      .string({ required_error: "Token là bắt buộc" })
      .min(32, { message: "Token không hợp lệ" }),
    newPassword: z
      .string({ required_error: "Mật khẩu mới là bắt buộc" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Mật khẩu phải có ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 số" })
      .regex(/[!@#$%^&*(),.?"':{}|<>]/, {
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      }),
    confirmNewPassword: z
      .string({ required_error: "Xác nhận mật khẩu là bắt buộc" })
      .min(1, { message: "Xác nhận mật khẩu không được để trống" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });
export const ValidateResetTokenSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email({ message: "Địa chỉ email không hợp lệ" }),
  token: z
    .string({ required_error: "Token là bắt buộc" })
    .min(32, { message: "Token không hợp lệ" }),
});
export const ForgotPasswordResponseSchema = z.object({
  email: z.string().email({ message: "Địa chỉ email không hợp lệ" }).optional(),
  expiryTime: z.string().optional(),
});

export type TFELoginRequest = z.TypeOf<typeof FELoginSchema>;
export type TBELoginRequest = z.TypeOf<typeof BELoginSchema>;
export type TFERegisterSchema = z.TypeOf<typeof FERegisterSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
export type TAccountDetailResponse = z.TypeOf<typeof AccountDetailResponse>;
export type TChangePasswordRequest = z.TypeOf<typeof ChangePasswordSchema>;
export type TUpdateAccountRequest = z.TypeOf<typeof UpdateAccountRequestSchema>;
export type TForgotPasswordRequest = z.TypeOf<typeof ForgotPasswordSchema>;
export type TResetPasswordRequest = z.TypeOf<typeof ResetPasswordSchema>;
export type TValidateResetTokenRequest = z.TypeOf<typeof ValidateResetTokenSchema>;
export type TForgotPasswordResponse = z.TypeOf<typeof ForgotPasswordResponseSchema>;


