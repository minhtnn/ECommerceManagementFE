import { productCategoryApi } from "@/apis/product-category.api";
import { EProductStatus } from "@/types/enums/product-status.enum";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface UseProductCategoryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  code?: string;
  name?: string;
  isLeafOnly?: boolean;
  status?: EProductStatus;
  allowFetch?: boolean;
}

export const useProductCategory = () => {
  const queryClient = useQueryClient();

  const getSuspendProductCategories = (
    params: UseProductCategoryParams = {},
  ) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code || null,
      name = params.name || null,
      isLeafOnly = params.isLeafOnly || null,
      status = params.status || null,
    } = params;
    return useSuspenseQuery({
      queryKey: ["product-categories", params],
      queryFn: () => productCategoryApi.getProductCategories(params),
    });
  };

  const getProductCategories = (params: UseProductCategoryParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code || null,
      name = params.name || null,
      isLeafOnly = params.isLeafOnly || null,
      status = params.status || null,
    } = params;
    return useQuery({
      queryKey: ["product-categories", params],
      queryFn: () => productCategoryApi.getProductCategories(params),
      enabled: params.allowFetch ?? true,
    });
  };

  // const getProductCategoriesinfinity = () => {
  //   return useInfiniteQuery({
  //     queryKey: ["categories-infinity"],
  //     queryFn: productCategoryApi.getProductCategories({
  //       page: 1,
  //       size: size,
  //       isAsc: true,
  //     }),
  //     initialPageParam: 0,
  //     getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  //   });
  // };

  const getProductCategoryById = (id: string, isAllowFetch?: boolean) => {
    return useQuery({
      queryKey: ["product-category", id],
      queryFn: () => productCategoryApi.getProductCategoryById(id),
      enabled: isAllowFetch ?? true,
    });
  };
  const getProductCategorySuspendById = (id: string) => {
    return useSuspenseQuery({
      queryKey: ["product-category", id],
      queryFn: () => productCategoryApi.getProductCategoryById(id),
    });
  };

  const createProductCategory = () =>
    useMutation({
      mutationFn: (data: FormData) =>
        productCategoryApi.createProductCategory(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["product-category"] });
      },
    });

  const updateProductCategory = (id: string) =>
    useMutation({
      mutationFn: (data: FormData) =>
        productCategoryApi.updateProductCategory(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["product-category", id] });
      },
    });

  return {
    getProductCategories,
    getSuspendProductCategories,
    getProductCategoryById,
    getProductCategorySuspendById,
    createProductCategory,
    updateProductCategory,
  };
};
