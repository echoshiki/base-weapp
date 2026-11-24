import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEnterpriseSjcsAPI } from '@/services/config';
import { useAuthStore } from '@/store/auth';
import { setDefaultEmptyImage } from '@/components/ui';
import { SjcsPageConfigItem } from '@/types/common';
import { resolveResourcePhotoUrl } from './useResource';

/** 归一化页面路径（去除前导斜杠与查询参数） */
export const normalizeRoutePath = (path?: string): string => {
	if (!path) return '';
	return path.trim().replace(/^\/+/, '').split('?')[0];
};

/**
 * 获取内页展示区块、导航与空状态动图配置 (GET /enterprise/sjcs)
 */
export const useSjcsConfig = () => {
	const isLoggedIn = useAuthStore((s) => s.authStage === 'LOGGED_IN' && !!s.token);

	const query = useQuery({
		queryKey: ['enterprise', 'sjcs'],
		queryFn: async () => {
			const res = await getEnterpriseSjcsAPI();
			const data = res.data || null;
			if (data?.emptyPath) {
				setDefaultEmptyImage(resolveResourcePhotoUrl(data.emptyPath));
			}
			return data;
		},
		enabled: isLoggedIn,
		staleTime: 60 * 1000,
	});

	const pageMap = useMemo(() => {
		const map = new Map<string, SjcsPageConfigItem>();
		(query.data?.pages || []).forEach((item) => {
			const key = normalizeRoutePath(item.pagePath);
			if (key) {
				map.set(key, item);
			}
		});
		return map;
	}, [query.data?.pages]);

	return {
		...query,
		pageMap,
	};
};
