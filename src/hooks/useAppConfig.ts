import { useQuery } from '@tanstack/react-query';
import { getAppConfigAPI } from '@/services/config';

/**
 * 获取应用全局配置 Hook
 */
export const useAppConfig = () => {
	return useQuery({
		queryKey: ['appConfig'],
		queryFn: async () => {
			const res = await getAppConfigAPI();
			return res.data;
		},
		staleTime: 1000 * 60 * 10, // 10 分钟缓存
	});
};
