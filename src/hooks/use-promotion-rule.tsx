import {
  promotionRuleApi,
  GetPromotionRulesParams,
} from "@/apis/promotion-rule.api";
import {
  TCreatePromotionRule,
  TUpdatePromotionRule,
} from "@/schemas/promotion-rule.schema";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { ERole } from "@/types/enums/role.enum";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const PROMOTION_RULE_QUERY_KEY = "promotionRules";
export const APPLICABLE_PROMOTION_RULE_QUERY_KEY = "applicablePromotionRules";

export const usePromotionRule = () => {
  const queryClient = useQueryClient();

  const getPromotionRules = (params: GetPromotionRulesParams = {}) => {
    const {
      page = 1,
      size = 20,
      sortBy = "createdDate",
      isAsc = false,
      code,
      name,
      status,
      timeZone,
    } = params;

    return useQuery({
      queryKey: [
        PROMOTION_RULE_QUERY_KEY,
        { page, size, sortBy, isAsc, code, name, status },
      ],
      queryFn: () =>
        promotionRuleApi.getPromotionRules({
          page,
          size,
          sortBy,
          isAsc,
          code,
          name,
          status,
          timeZone,
        }),
    });
  };

  const getPromotionRuleById = (id: string, timeZone: string) =>
    useSuspenseQuery({
      queryKey: [PROMOTION_RULE_QUERY_KEY, id],
      queryFn: () => promotionRuleApi.getPromotionRuleById(id, timeZone),
    });

  const getApplicablePromotionRules = ({
    isAllowFetch = true,
  }: { isAllowFetch?: boolean } = {}) =>
    useQuery({
      queryKey: [APPLICABLE_PROMOTION_RULE_QUERY_KEY],
      queryFn: () => promotionRuleApi.getApplicablePromotionRules(),
      enabled: isAllowFetch,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData,
    });

  const createPromotionRule = () =>
    useMutation({
      mutationFn: (data: TCreatePromotionRule) =>
        promotionRuleApi.createPromotionRule(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PROMOTION_RULE_QUERY_KEY] });
      },
    });

  const updatePromotionRule = () =>
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: Omit<TUpdatePromotionRule, "id">;
      }) => promotionRuleApi.updatePromotionRule(id, data),
      onSuccess: (_data, variables) => {
        // Invalidate cả list lẫn detail cache
        queryClient.invalidateQueries({ queryKey: [PROMOTION_RULE_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [PROMOTION_RULE_QUERY_KEY, variables.id],
        });
      },
    });

  const deactivatePromotionRule = () =>
    useMutation({
      mutationFn: (id: string) =>
        promotionRuleApi.updatePromotionRule(id, {
          id: id,
          status: EPromotionStatus.Inactive,
        }),
      onSuccess: (_data, id) => {
        queryClient.invalidateQueries({ queryKey: [PROMOTION_RULE_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [PROMOTION_RULE_QUERY_KEY, id],
        });
      },
    });

  return {
    getPromotionRules,
    getPromotionRuleById,
    createPromotionRule,
    updatePromotionRule,
    deactivatePromotionRule,
    getApplicablePromotionRules,
  };
};
