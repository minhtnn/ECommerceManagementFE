import z from "zod";

export const GetCustomerCartItemsResponseSchema = z.object({
  id: z.string().uuid(),
  getCustomerCartId: z.string().uuid(),
  imageUrl: z.string().nullable(),
  productId: z.string().uuid(),
  productNameSnapshot: z.string(),
  quantity: z.number(),
  unitPriceSnapshot: z.number(),
  totalAmountSnapshot: z.number(),
});

export const GetCustomerCartAppliedPromotionsResponseSchema = z.object({
  getCustomerCartId: z.string().uuid(),
  promotionId: z.string().uuid(),
  promotionRuleNameSnapshot: z.string(),
  discountAmountApplied: z.number(),
  createdDate: z.number(),
});

export const GetCustomerCartResponseSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  cartName: z.string(),
  isActive: z.boolean(),
  totalAmountWithoutDiscount: z.number(),
  totalOrderDiscount: z.number(),
  totalOrderShippingFee: z.number(),
  totalAmount: z.number(),
  customerNote: z.string().nullable(),
  createdDate: z.string(),
  lastModifiedDate: z.string(),
  items: z.array(GetCustomerCartItemsResponseSchema),
  appliedPromotions: z.array(GetCustomerCartAppliedPromotionsResponseSchema),
});

export const CreateEndCustomerCartSchema = z.object({
  cartId: z.string().uuid().optional(),
  cartName: z.string().optional(),
});

export const UpdateCartItemRequest = z.object({
  productId: z.string().uuid(),
  productNameSnapshot: z.string(),
  quantity: z.number(),
  unitPriceSnapshot: z.number(),
});

export const UpdateAppliedPromotionRequest = z.object({
  promotionId: z.string().uuid(),
  promotionRuleNameSnapshot: z.string(),
  discountAmountApplied: z.number(),
});

export const UpdateEndCustomerCartSchema = z.object({
  cartId: z.string().uuid().optional(),
  customerNote: z.string().optional().nullable(),
  items: z.array(UpdateCartItemRequest),
  appliedPromotions: z.array(UpdateAppliedPromotionRequest).optional(),
});

export type TGetCustomerCartResponse = z.infer<typeof GetCustomerCartResponseSchema>;
export type TGetCustomerCartItemsResponse = z.infer<typeof GetCustomerCartItemsResponseSchema>;
export type TCreateEndCustomerCartRequest = z.infer<typeof CreateEndCustomerCartSchema>;
export type TUpdateEndCustomerCartRequest = z.infer<typeof UpdateEndCustomerCartSchema>;
export type TUpdateCartItemRequest = z.infer<typeof UpdateCartItemRequest>;