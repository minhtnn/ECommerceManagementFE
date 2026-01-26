import { z } from "zod"

export const FELoginSchema = z
  .object({
    usernameOrEmail: z.string().max(50).optional(),
    password: z.string()
                .min(1, {message: "Mật khẩu không được bỏ trống"})
                .max(50, {message: "Mật khẩu không được vượt quá 50 ký tự"}),
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

export type TFELoginRequest = z.TypeOf<typeof FELoginSchema>;
export type TBELoginRequest = z.TypeOf<typeof BELoginSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
export type TAccountDetailResponse = z.TypeOf<typeof AccountDetailResponse>;

