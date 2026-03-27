import { apiRequest } from "@/lib/http";
import {
    TCreateSystemConfigRequest,
    TSystemConfigResponse,
    TUpdateSystemConfigRequest,
} from "@/schemas/system-config.schema";
import { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getSystemConfigs = async () =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TSystemConfigResponse[]>>(
        `${API_SUFFIX.SYSTEM_CONFIG_API}`
    );

const createSystemConfig = async (data: TCreateSystemConfigRequest) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.SYSTEM_CONFIG_API}`,
        data
    );

const updateSystemConfig = async (
    id: string,
    data: Omit<TUpdateSystemConfigRequest, "id">
) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.SYSTEM_CONFIG_API}/${id}`,
        data
    );

export const systemConfigApi = {
    getSystemConfigs,
    createSystemConfig,
    updateSystemConfig,
};