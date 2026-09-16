import Taro from '@tarojs/taro';

/**
 * Tailwind 类名合并与过滤工具函数 (cn - classNames)
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
	return inputs.filter(Boolean).join(' ');
}

/**
 * 将对象转换为查询参数字符串，用于拼接到 URL 后面
 * @param params 要转换的对象
 */
export const serializeParams = (params: any = {}): string => {
	const query = Object.entries(params)
		.filter(([, value]) => value !== undefined && value !== null && value !== '')
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join('&');
	return query ? `?${query}` : '';
};

/**
 * 获取当前页面的 URL
 */
export const getCurrentPageUrl = (): string => {
	const pages = Taro.getCurrentPages();
	const currentPage = pages[pages.length - 1];
	if (!currentPage) return '/pages/index/index';
	const route = `/${currentPage.route}`;
	const queryString = serializeParams(currentPage.options);
	return `${route}${queryString}`;
};

/**
 * 判断是否为 TabBar 页面
 * @param path 页面路径
 */
export const isTabBarPage = (path: string): boolean => {
	const tabBars = ['pages/index/index', 'pages/example/index', 'pages/user/index'];
	const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
	const purePath = normalizedPath.split('?')[0];
	return tabBars.includes(purePath);
};

/**
 * 跳转到指定页面
 * @param url 页面路径
 * @param type 跳转类型
 */
export const mapsTo = (url: string, type: 'navigateTo' | 'redirectTo' | 'reLaunch' = 'navigateTo') => {
	const path = url.split('?')[0];
	isTabBarPage(path) ? Taro.switchTab({ url }) : Taro[type]({ url });
};

/**
 * 引导跳转登录页
 * @param targetUrl 目标页面 URL
 * @param method 跳转类型
 */
export const toLogin = (targetUrl?: string, method: 'navigateTo' | 'redirectTo' = 'navigateTo') => {
	const backUrl = encodeURIComponent(targetUrl || getCurrentPageUrl());
	mapsTo(`/pages/login/index?back_url=${backUrl}`, method);
};

/**
 * 获取占位图
 * @param width 宽度
 * @param height 高度
 * @param bgColor 背景颜色
 * @param textColor 文字颜色
 * @param text 文字内容
 */
export const getPlaceholder = (
	width: number,
	height: number,
	bgColor: string = 'cdcdcd',
	textColor: string = '969696',
	text: string = '加载中',
) => {
	return `https://placehold.jp/${bgColor}/${textColor}/${width}x${height}.png?text=${encodeURIComponent(text)}`;
};

/**
 * 一键复制功能
 * @param text 要复制的文本
 */
export const handleCopy = (text: string) => {
	Taro.setClipboardData({
		data: text,
		success: () => Taro.showToast({ title: '已复制', icon: 'success' }),
	});
};

/**
 * 格式化销量数字
 * 超过 10000 时显示为 x.xx万 格式
 */
export const formatSales = (num: number | string): string => {
	const n = Number(num);
	if (Number.isNaN(n)) return '0';
	if (n >= 10000) {
		const wan = n / 10000;
		// 去掉末尾多余的 0，如 1.50 → 1.5，1.00 → 1
		return parseFloat(wan.toFixed(2)) + '万';
	}
	return String(n);
};

/**
 * 格式化志愿时长 (单位：分钟或小时)
 * @param minutes 分钟数
 */
export const formatDuration = (minutes: number): string => {
	if (!minutes || Number.isNaN(minutes)) return '0';
	if (minutes < 60) return `${minutes}分钟`;
	const hours = (minutes / 60).toFixed(1);
	return `${parseFloat(hours)}小时`;
};

/**
 * 格式化富文本中的图片
 * @param html
 * @returns
 */
export const cleanHTML = (html: string, noMargin: boolean = false) => {
	if (!html) return '';
	return (
		html
			// 移除 figure 标签但保留内部内容
			.replace(/<figure[^>]*>/g, '')
			.replace(/<\/figure>/g, '')
			// 移除危险标签
			.replace(/<script[^>]*>.*?<\/script>/gi, '')
			.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
			// 视频标签转换
			.replace(/<video/gi, '<video style="max-width:100%;height:auto;" ')
			// 移除 figcaption 标签
			.replace(/<figcaption[^>]*>.*?<\/figcaption>/g, '')
			// 移除 data-trix-* 自定义属性
			.replace(/ data-trix-[^=]+="[^"]*"/g, '')
			// 为图片添加自适应样式（核心修改）
			.replace(/<img([^>]*)>/gi, (_match, attrs) => {
				// 保留原有属性，移除可能存在的width/height
				const cleanAttrs = attrs
					.replace(/(width|height)\s*=\s*["']\d+["']/gi, '')
					.replace(/style\s*=\s*["'][^"']*["']/gi, '');
				return `<img style="display:block;margin-top:${noMargin ? '0' : '12px'};margin-bottom:${noMargin ? '0' : '12px'};max-width:100%;height:auto;${cleanAttrs.match(/style\s*=\s*["']([^"']*)["']/)?.[1] || ''}" ${cleanAttrs}>`;
			})
	);
};

/**
 * 清除 HTML 标签并返回纯文本
 */
export const stripHtml = (htmlStr: string): string => {
	if (!htmlStr) return '';
	return htmlStr
		.replace(/<[^>]+>/g, '') // 核心：刮掉所有 <...> 标签
		.replace(/&nbsp;/gi, ' ') // 替换常见的 HTML 实体空格
		.trim();
};

/**
 * 安全下载网络图片并保存到手机相册
 * @param imageUrl 后端返回的证书图片绝对路径
 */
export const saveImageToAlbum = async (imageUrl: string): Promise<void> => {
	if (!imageUrl) return;

	Taro.showLoading({ title: '正在下载证书...', mask: true });

	try {
		const downloadRes = await Taro.downloadFile({ url: imageUrl });
		if (downloadRes.statusCode !== 200) throw new Error('下载文件服务器响应异常');

		// 保存到相册
		await Taro.saveImageToPhotosAlbum({ filePath: downloadRes.tempFilePath });
		Taro.hideLoading();
		Taro.showToast({ title: '证书已保存到相册', icon: 'success' });
	} catch (error: any) {
		Taro.hideLoading();
		if (error.errMsg?.includes('auth deny') || error.errMsg?.includes('auth denied')) {
			Taro.showModal({
				title: '提示',
				content: '需要您授权保存图片到相册的权限，请在后续打开的设置页中勾选。',
				confirmText: '去开启',
				success: (res) => {
					if (res.confirm) Taro.openSetting();
				},
			});
		} else {
			Taro.showToast({ title: '保存失败，请稍后再试', icon: 'none' });
			console.error('保存证书发生错误:', error);
		}
	}
};

/** 统一错误提示 */
export const showErrorToast = (err: any, fallback: string) =>
	Taro.showToast({ title: err?.message || err?.msg || fallback, icon: 'none' });

/** 延迟返回上一页 */
export const delayBack = (delay = 1500) => setTimeout(() => Taro.navigateBack(), delay);

/**
 * 手机号脱敏
 * @example maskPhone('13812345678') => '138****5678'
 */
export const maskPhone = (phone?: string): string => {
	if (!phone) return '';
	return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 银行卡号脱敏 (保留前4后4)
 * @example maskBankCard('6222021234567890') => '6222 **** **** 7890'
 */
export const maskBankCard = (cardNo?: string): string => {
	if (!cardNo) return '';
	const clean = cardNo.replace(/\s+/g, '');
	if (clean.length < 8) return clean;
	return `${clean.slice(0, 4)} **** **** ${clean.slice(-4)}`;
};

/**
 * 身份证号脱敏 (保留前6后4)
 * @example maskIdCard('440106199001011234') => '440106********1234'
 */
export const maskIdCard = (idCard?: string): string => {
	if (!idCard) return '';
	return idCard.replace(/^(\d{6})\d+(\d{4})$/, '$1********$2');
};

/**
 * 姓名脱敏
 * @example maskName('张三') => '*三', maskName('诸葛孔明') => '诸**明'
 */
export const maskName = (name?: string): string => {
	if (!name) return '';
	if (name.length <= 1) return name;
	if (name.length === 2) return `*${name.slice(1)}`;
	return `${name[0]}${'*'.repeat(name.length - 2)}${name.slice(-1)}`;
};

/**
 * 格式化日期为 YYYY-MM-DD 精确到日
 * @param dateStr 日期时间字符串 (如 '2026-09-02 14:00:00' 或 '2026-09-02T14:00:00')
 */
export const formatDateToDay = (dateStr?: string): string => {
	if (!dateStr) return '--';
	return dateStr.split(' ')[0].split('T')[0];
};
