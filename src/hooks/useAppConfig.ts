import { useQuery } from '@tanstack/react-query';
import { getAppConfigAPI } from '@/services/config';

/**
 * 获取小程序全局配置 Hook
 * 包含：banners 轮播图、客服联系方式、用户协议与隐私条款等
 */
export const useAppConfig = () => {
	return useQuery({
		queryKey: ['appConfig'],
		queryFn: getAppConfigAPI,
		staleTime: 1000 * 60 * 10, // 10 分钟缓存
	});
};
