import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentMethodStatus } from "@/types/enums/payment-method-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import z from "zod";

//#region System Payment Method Schemas
export const PaymentMethodListResponseSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    systemConfigurationSchema: z.string().nullable(),
    status: z.nativeEnum(EPaymentMethodStatus),
});

export const PaymentMethodDetailResponseSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    configurationSchema: z.string().nullable(),
    imageUrl: z.string().nullable(),
    status: z.nativeEnum(EPaymentMethodStatus),
});

export const CreatePaymentMethodSchema = z.object({
    code: z.string(
        {
            required_error: "Mã phương thức thanh toán không được bỏ trống",
            invalid_type_error: "Mã phương thức thanh toán không hợp lệ",
        },
    )
        .min(2, { message: "Mã phương thức thanh toán không ít hơn 2 kí tự" })
        .max(20, { message: "Mã phương thức thanh toán không vượt quá 20 ký tự" }),
    name: z.string(
        {
            required_error: "Tên phương thức thanh toán không được bỏ trống"
        },
    )
        .min(2, { message: "Tên phương thức thanh toán không ít hơn 2 kí tự" })
        .max(50, { message: "Tên phương thức thanh toán không được vượt quá 50 ký tự" }),
    configurationSchema: z.string().optional(),
    status: z.nativeEnum(EPaymentMethodStatus, {
        required_error: "Trạng thái phương thức thanh toán không được bỏ trống",
        invalid_type_error: "Trạng thái phương thức thanh toán không hợp lệ",
    }),
});

export const UpdatePaymentMethodSchema = z.object({
    id: z.string().uuid(),
    name: z.string(
        {
            required_error: "Tên phương thức thanh toán không được bỏ trống"
        },
    )
        .min(2, { message: "Tên phương thức thanh toán không ít hơn 2 kí tự" })
        .max(50, { message: "Tên phương thức thanh toán không được vượt quá 50 ký tự" }),
    configurationSchema: z.string().optional().nullable(),
    status: z.nativeEnum(EPaymentMethodStatus, {
        required_error: "Trạng thái phương thức thanh toán không được bỏ trống",
        invalid_type_error: "Trạng thái phương thức thanh toán không hợp lệ",
    }),
});
//#endregion

//#region Brand Payment Method Schemas
export const BrandPaymentMethodListResponseSchema = z.object({
    id: z.string(),
    paymentMethodId: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

export const BrandPaymentMethodDetailResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
    displayOrder: z.number(),
    brandConfiguration: z.string().nullable(),
    systemConfiguration: z.string().nullable(),
    createdDate: z.date(),
    lastModifiedDate: z.date(),
});

export const BrandPaymentMethodCreateSchema = z.object({
    paymentMethodId: z.string({ required_error: "Không được để trống" }),
    isDefault: z.boolean(),
    displayOrder: z.number().int(),
    isActive: z.boolean(),
    configuration: z.string().optional(),
});
export const BrandPaymentMethodUpdateSchema = z.object({
    id: z.string().uuid(),
    isDefault: z.boolean(),
    displayOrder: z.number().int(),
    isActive: z.boolean(),
    configuration: z.string().optional(),
});

export const BrandPublicPaymentMethodListResponseSchema = z.object({
    id: z.string(),
    paymentMethodId: z.string(),
    brandPaymentMethodCode: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

export const PaymentCallbackResponseSchema = z.object({
    orderCode: z.string(),
    orderStatus: z.nativeEnum(EOrderStatus),
    paymentStatus: z.nativeEnum(EPaymentStatus),
});

export const GetPaymentStatusResponseSchema = z.object({
    orderId: z.string().uuid(),
    orderCode: z.string(),
    orderStatus: z.nativeEnum(EOrderStatus),
    paymentStatus: z.nativeEnum(EPaymentStatus),
    amount: z.number(),
    transactionId: z.string().nullable(),
    paidAt: z.string().nullable(),
    createdDate: z.string(),
});

export const CancelPaymentRequestSchema = z.object({
    cancelReason: z.string().optional().nullable(),
});

//#endregion

export type TPaymentMethodListResponse = z.infer<typeof PaymentMethodListResponseSchema>;
export type TPaymentMethodDetailResponse = z.infer<typeof PaymentMethodDetailResponseSchema>;
export type TCreatePaymentMethod = z.infer<typeof CreatePaymentMethodSchema>;
export type TUpdatePaymentMethod = z.infer<typeof UpdatePaymentMethodSchema>;

export type TBrandPaymentMethodListResponse = z.infer<typeof BrandPaymentMethodListResponseSchema>;
export type TBrandPaymentMethodDetailResponse = z.infer<typeof BrandPaymentMethodDetailResponseSchema>;
export type TBrandPaymentMethodCreate = z.infer<typeof BrandPaymentMethodCreateSchema>;
export type TBrandPaymentMethodUpdate = z.infer<typeof BrandPaymentMethodUpdateSchema>;

export type TBrandPublicPaymentMethodListResponse = z.infer<typeof BrandPublicPaymentMethodListResponseSchema>;

export type TPaymentCallbackResponse = z.infer<typeof PaymentCallbackResponseSchema>;
export type TGetPaymentStatusResponse = z.infer<typeof GetPaymentStatusResponseSchema>;
export type TCancelPaymentRequest = z.infer<typeof CancelPaymentRequestSchema>;

