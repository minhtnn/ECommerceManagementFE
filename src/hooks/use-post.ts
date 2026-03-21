import { postApi } from "@/apis/post.api";
import envConfig from "@/schemas/config.schema";
import { EPostStatus } from "@/types/enums/post-status.enum";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface UsePostParams {
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    code?: string;
    status?: EPostStatus | null;
    fromDate?: string | null;
    toDate?: string | null;
    timeZone?: string;
    allowFetch?: boolean;
}

interface UsePublicPostParams {
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
}

export const usePost = () => {
    const queryClient = useQueryClient();

    const getPosts = (params: UsePostParams = {}) => {
        return useQuery({
            queryKey: ["posts", params],
            queryFn: () => postApi.getPosts(params),
            enabled: params.allowFetch ?? true,
        });
    };

    const getSuspendPosts = (params: UsePostParams = {}) => {
        return useSuspenseQuery({
            queryKey: ["posts", params],
            queryFn: () => postApi.getPosts(params),
        });
    };

    const getPostById = (id: string, allowFetch?: boolean) => {
        return useQuery({
            queryKey: ["post", id],
            queryFn: () => postApi.getPostById(id),
            enabled: allowFetch ?? true,
        });
    };

    const getSuspendPostById = (id: string) => {
        return useSuspenseQuery({
            queryKey: ["post", id],
            queryFn: () => postApi.getPostById(id),
        });
    };

    const createPost = () =>
        useMutation({
            mutationFn: (data: FormData) => postApi.createPost(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
            },
        });

    const updatePost = (id: string) =>
        useMutation({
            mutationFn: (data: FormData) => postApi.updatePost(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["post", id] });
            },
        });

    const getInfinitePublicPosts = (
        params: Omit<UsePublicPostParams, "page"> = {}
    ) => {
        return useInfiniteQuery({
            queryKey: ["public-posts", envConfig.BRAND_CODE, params],
            queryFn: ({ pageParam }) =>
                postApi.getPublicPosts({
                    ...params,
                    page: pageParam,
                }),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                const pagination = lastPage.data?.data;
                if (!pagination) return undefined;
                const { page, totalPages } = pagination;
                return page < totalPages ? page + 1 : undefined;
            },
            staleTime: 2 * 60 * 1000,
        });
    };

    const getPublicPostById = (id: string) =>
        useQuery({
            queryKey: ["public-post", envConfig.BRAND_CODE, id],
            queryFn: () => postApi.getPublicPostById(envConfig.BRAND_CODE, id),
            enabled: !!id && !!envConfig.BRAND_CODE,
        });
    return {
        getPosts,
        getSuspendPosts,
        getPostById,
        getSuspendPostById,
        createPost,
        updatePost,
        getInfinitePublicPosts,
        getPublicPostById
    };
};