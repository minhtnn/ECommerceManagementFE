import { mapApi } from "@/apis/map.api";
import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface UseOpenApiParams {
  search?: string;
  depth?: number;
  allowFetch?: boolean;
  province?: number;
}

export const useOpenApi = () => {
  const getProvinces = (params: UseOpenApiParams = {}) => {
    const { search = params.search, allowFetch = params.allowFetch || true } =
      params;
    return useQuery({
      queryKey: ["open-api-provinces"],
      queryFn: () => mapApi.getProvinces({ search: search }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
      enabled: allowFetch,
    });
  };
  const getProvinceDetail = (code: number, params: UseOpenApiParams = {}) => {
    const { depth = params.depth, allowFetch = params.allowFetch || true } =
      params;
    return useQuery({
      queryKey: ["open-api-provinces", { code }],
      queryFn: () => mapApi.getProvinceDetail(code, { depth: depth }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
      enabled: allowFetch,
    });
  };
  const getWards = (params: UseOpenApiParams = {}) => {
    const {
      province = params.province,
      search = params.search,
      allowFetch = params.allowFetch || true,
    } = params;
    return useQuery({
      queryKey: ["open-api-wards"],
      queryFn: () => mapApi.getWards({ province: province, search: search }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
      enabled: allowFetch,
    });
  };
  const getWardDetail = (code: number) => {
    return useSuspenseQuery({
      queryKey: ["open-api-wards", { code }],
      queryFn: () => mapApi.getWardDetail(code),
      staleTime: 5 * 1000,
    });
  };
  return {
    getProvinces,
    getProvinceDetail,
    getWards,
    getWardDetail,
  };
};
