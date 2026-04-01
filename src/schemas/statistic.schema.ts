import z from "zod";

export const GetAllProductsStaticByBrandResponseSchema = z.object({
    productId: z.string().uuid(),
    productNameSnapshot: z.string(),
    productImageUrl: z.string(),
    saleDate: z.date(),
    totalQuantitySold: z.number().int(),
    totalGiftQuantity: z.number().int(),
    totalRevenueGross: z.number(),
    totalOrderCount: z.number().int()
});

export const GetAllPromotionRulesStaticByBrandResponseSchema = z.object({
    promotionRuleId: z.string().uuid(),
    promotionNameSnapshot: z.string(),
    statDate: z.date(),
    totalDiscountIssued: z.number(),
    totalOrdersUsed: z.number().int(),
    totalRevenueWithPromo: z.number(),
});

export type TGetAllProductsStaticByBrandResponse = z.infer<typeof GetAllProductsStaticByBrandResponseSchema>;
export type TGetAllPromotionRulesStaticByBrandResponse = z.infer<typeof GetAllPromotionRulesStaticByBrandResponseSchema>;