import { http } from '@/utils/http';
import { DataResponse, SjcsConfigData, WeappConfig } from '@/types/common';

/**
 * 获取小程序全局系统配置
 * GET /app/config
 * 包含：小程序信息、客服电话与邮箱、用户协议与隐私条款、轮播图列表 banners
 */
export const getAppConfigAPI = () => http.get<WeappConfig>('/app/config');

/**
 * 获取内页头部、展示区块与空状态动图配置
 * GET /enterprise/sjcs
 */
export const getEnterpriseSjcsAPI = () => http.get<DataResponse<SjcsConfigData>>('/enterprise/sjcs');
