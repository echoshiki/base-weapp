import { http } from '@/utils/http';
import { BaseResponse, WeappConfig } from '@/types/common';

/**
 * 获取应用全局配置
 * GET /app/config
 */
export const getAppConfigAPI = () => http.get<BaseResponse<WeappConfig>>('/app/config', undefined, { silent: true });
