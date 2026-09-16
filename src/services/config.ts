import { http } from '@/utils/http';
import { WeappConfig } from '@/types/common';

/**
 * 获取小程序全局系统配置
 * GET /app/config
 * 包含：小程序信息、客服电话与邮箱、用户协议与隐私条款、轮播图列表 banners
 */
export const getAppConfigAPI = () => http.get<WeappConfig>('/app/config');
