import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import z from "zod";

export const BrandOrdersResponseSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  customerName: z.string().nullable(),
  customerPhone: z.string().nullable(),
  orderStatus: z.nativeEnum(EOrderStatus),
  paymentStatus: z.nativeEnum(EPaymentStatus),
  totalAmount: z.number(),
  itemCount: z.number().int(),
  createdDate: z.date()
});

export const CustomerOrdersResponseSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  orderStatus: z.nativeEnum(EOrderStatus),
  paymentStatus: z.nativeEnum(EPaymentStatus),
  totalAmount: z.number(),
  itemCount: z.number().int(),
  createdDate: z.coerce.date() 
});

export const CreateOrderRequestSchema = z.object({
  brandPaymentMethodId: z.string().uuid(),
  cartId: z.string().uuid(),
  shippingAddress: z.string().min(1).max(500),
  shippingContact: z.string().min(1).max(20),
  customerNote: z.string().max(500).optional().nullable(),
  timeZone: z.string(), 
});

export const CreateOrderResponseSchema = z.object({
  orderId: z.string().uuid(),
  orderCode: z.string(),
  totalAmount: z.number(),
  paymentUrl: z.string().nullable().optional(),
  qrCode: z.string().nullable().optional(),
  orderStatus: z.nativeEnum(EOrderStatus),
  paymentStatus: z.nativeEnum(EPaymentStatus),
  createdDate: z.string(),
});

export const OrderItemDetailResponseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productNameSnapshot: z.string(),
  quantity: z.number().int(),
  unitPriceSnapshot: z.number(),
  totalPriceSnapshot: z.number(),
});

export const OrderPaymentResponseSchema = z.object({
  id: z.string(),
  paymentMethodCodeSnapshot: z.string(),
  amount: z.number(),
  paymentStatus: z.nativeEnum(EPaymentStatus),
  transactionId: z.string().nullable(),
  paidAt: z.string().nullable(),
});

export const BrandOrderByIdResponseSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  orderStatus: z.nativeEnum(EOrderStatus),
  paymentStatus: z.nativeEnum(EPaymentStatus),
  totalAmountWithoutDiscount: z.number(),
  totalOrderDiscount: z.number(),
  totalOrderShippingFee: z.number(),
  totalAmount: z.number(),
  shippingAddress: z.string(),
  shippingContact: z.string(),
  customerNote: z.string().nullable(),
  createdDate: z.date(),
  lastModifiedDate: z.date().nullable(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string().nullable(),
  items: z.array(OrderItemDetailResponseSchema),
  payments: z.array(OrderPaymentResponseSchema)
});

export const CustomerOrderByIdResponseSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  orderStatus: z.nativeEnum(EOrderStatus),
  paymentStatus: z.nativeEnum(EPaymentStatus),
  totalAmountWithoutDiscount: z.number(),
  totalOrderDiscount: z.number(),
  totalOrderShippingFee: z.number(),
  totalAmount: z.number(),
  shippingAddress: z.string(),
  shippingContact: z.string(),
  customerNote: z.string().nullable(),
  createdDate: z.date(),
  lastModifiedDate: z.date().nullable(),
  items: z.array(OrderItemDetailResponseSchema),
  payments: z.array(OrderPaymentResponseSchema),
  paymentUrl: z.string().nullable().optional(),
  qrCode: z.string().nullable().optional(),
});

export const UpdateOrderRequestSchema = z.object({
  shippingAddress: z.string().max(500).optional(),
  shippingContact: z.string().max(20).optional(),
  customerNote: z.string().max(500).optional(),
  newOrderStatus: z.nativeEnum(EOrderStatus).optional(),
  cancelReason: z.string().max(500).optional(),
});

export const GetPaymentLinkResponseSchema = z.object({
  orderId: z.string().uuid(),
  orderCode: z.string(),
  paymentUrl: z.string().url(),
  qrCode: z.string().optional(),
  totalAmount: z.number(),
});

export type TBrandOrdersResponse = z.infer<typeof BrandOrdersResponseSchema>;
export type TCustomerOrdersResponse = z.infer<typeof CustomerOrdersResponseSchema>;

export type TOrderItemDetailResponse = z.infer<typeof OrderItemDetailResponseSchema>;
export type TOrderPaymentResponse = z.infer<typeof OrderPaymentResponseSchema>;
export type TBrandOrderByIdResponse = z.infer<typeof BrandOrderByIdResponseSchema>;
export type TCustomerOrderByIdResponse = z.infer<typeof CustomerOrderByIdResponseSchema>;


export type TCreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type TCreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;

export type TUpdateOrderRequest = z.infer<typeof UpdateOrderRequestSchema>;
export type TGetPaymentLinkResponse = z.infer<typeof GetPaymentLinkResponseSchema>;