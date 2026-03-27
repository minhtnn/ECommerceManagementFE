// hooks/use-system-config.ts
import { systemConfigApi } from "@/apis/system-config.api";
import {
    TCreateSystemConfigRequest,
    TUpdateSystemConfigRequest,
} from "@/schemas/system-config.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SYSTEM_CONFIG_QUERY_KEY = "system-configs";

export const useSystemConfig = () => {
    const queryClient = useQueryClient();

    const getSystemConfigs = () =>
        useQuery({
            queryKey: [SYSTEM_CONFIG_QUERY_KEY],
            queryFn: () => systemConfigApi.getSystemConfigs(),
            staleTime: 5 * 60 * 1000,
        });

    const createSystemConfig = () =>
        useMutation({
            mutationFn: (data: TCreateSystemConfigRequest) =>
                systemConfigApi.createSystemConfig(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [SYSTEM_CONFIG_QUERY_KEY] });
            },
        });

    const updateSystemConfig = () =>
        useMutation({
            mutationFn: ({ id, ...data }: TUpdateSystemConfigRequest) =>
                systemConfigApi.updateSystemConfig(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [SYSTEM_CONFIG_QUERY_KEY] });
            },
        });

    return {
        getSystemConfigs,
        createSystemConfig,
        updateSystemConfig,
    };
};