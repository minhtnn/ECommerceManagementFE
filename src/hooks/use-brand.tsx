import { brandApi } from "@/apis/brand.api";
import { EBrandStatus } from "@/types/enums/brand-status.enum";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface UseBrandParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  code?: string;
  name?: string;
  status?: EBrandStatus;
}

export const useBrand = () => {
  const queryClient = useQueryClient();
  const getBrands = (params: UseBrandParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code || null,
      name = params.name || null,
      status = params.status || null,
    } = params;
    return useQuery({
      queryKey: [
        "brands",
        {
          page,
          size,
          sortBy,
          isAsc,
          code,
          name,
          status,
        },
      ],
      queryFn: () =>
        brandApi.getBrands({
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          code: code,
          name: name,
          status: status,
        }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
    });
  };

  const getBrandById = (id: string) => {
    return useSuspenseQuery({
      queryKey: ["brand", id],
      queryFn: () => brandApi.getBrandById(id),
    });
  };

  const getBrandDetails = (isAllowQuery: boolean) => {
    return useQuery({
      queryKey: ["brand-details"],
      queryFn: () => brandApi.getBrandDetails(),
      enabled: isAllowQuery,
    });
  };

  //   const getPublicBrandById = (id: string) => {
  //     return useSuspenseQuery({
  //       queryKey: ["brandPublic", id],
  //       queryFn: async () => brandApi.getPublicBrandById(envConfig.BRAND_CODE, id),
  //     });
  //   };

  const createBrand = () =>
    useMutation({
      mutationFn: (data: FormData) => brandApi.createBrand(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brands"] });
      },
    });

  const updateBrand = (id: string) =>
    useMutation({
      mutationFn: (data: FormData) => brandApi.updateBrand(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        queryClient.invalidateQueries({ queryKey: ["brand", id] });
      },
    });
  return {
    getBrands,
    getBrandById,
    getBrandDetails,
    createBrand,
    updateBrand,
  };
};
