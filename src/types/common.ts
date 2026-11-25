/** 统一接口响应信封结构 */
export interface BaseResponse<T = null> {
	code: number;
	msg: string;
	data: T;
}

/** 通用分页查询参数 */
export interface PageQuery {
	/** 页码，从 1 开始 */
	page?: number;
	/** 每页条数 */
	pageSize?: number;
}

/** 通用分页数据体（统一包裹在 BaseResponse<PageData<T>> 的 data 中） */
export interface PageData<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore?: boolean;
}

/**
 * 推广分享配置
 */
export interface ShareConfig {
	title?: string;
	path?: string;
	imageUrl?: string;
	params?: Record<string, any>;
}

/**
 * 性别标识
 * '0': 男 | '1': 女 | '2': 未知
 */
export type Gender = '0' | '1' | '2';

/**
 * 全局系统配置
 */
export interface WeappConfig {
	/** 平台名称 */
	appName: string;
	/** 平台全局 Logo URL */
	appLogo?: string;
	/** 平台描述 */
	appDescription?: string;
	/** 全局客服热线 */
	servicePhone?: string;
	/** 全局客服邮箱 */
	serviceEmail?: string;
	/** 版权信息 */
	copyright?: string;
	/** 备案号 */
	icp?: string;
	/** 轮播图列表 */
	banners?: string[];
}

/** 文件上传返回元数据 */
export interface UploadFileItem {
	fileName: string;
	filePath: string;
	fileSize: number;
	fileType: string;
}
