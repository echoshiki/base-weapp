import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { BaseResponse } from '@/types/common';
import { getCurrentPageUrl } from './common';

/**
 * 扩展请求配置
 */
type RequestConfig = Taro.request.Option & {
	/** 是否显示全局 Loading，默认 false */
	showLoading?: boolean;
	/** 静默模式：失败时不弹 Toast，401 时仅清登录态不弹跳转弹窗 */
	silent?: boolean;
	/** 局部请求/响应拦截器 */
	interceptors?: {
		request?: (config: RequestConfig) => RequestConfig;
		response?: (response: any) => any;
	};
};

/**
 * 上传配置项
 */
type UploadConfig = Omit<RequestConfig, 'url' | 'data' | 'method'> & {
	/** 文件对应的 key，默认 'file' */
	name?: string;
	/** 指定上传文件名（H5 blob 路径自动补全后缀时优先使用） */
	fileName?: string;
	/** 额外的表单数据 */
	formData?: Record<string, any>;
};

const AUTH_ERROR_CODES = new Set([401, 410000, 410001, 410002]);

const MIME_EXT_MAP: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif',
	'video/mp4': 'mp4',
	'video/quicktime': 'mov',
	'video/webm': 'webm',
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

/**
 * 统一 HTTP 请求客户端
 */
class HttpRequest {
	private baseUrl: string = process.env.TARO_APP_API || '';
	private static loadingCount = 0;
	private static isRedirecting = false;
	private readonly TOKEN_HEADER = 'Authorization';

	private showLoading() {
		if (HttpRequest.loadingCount === 0) Taro.showLoading({ title: '加载中...', mask: true });
		HttpRequest.loadingCount++;
	}

	private hideLoading() {
		if (HttpRequest.loadingCount > 0) HttpRequest.loadingCount--;
		if (HttpRequest.loadingCount === 0) Taro.hideLoading();
	}

	/** 构造通用请求头（无 token 时不发送空的 Authorization 字段） */
	private getBaseHeader(header: Record<string, any> = {}) {
		const { token } = useAuthStore.getState();
		const base: Record<string, any> = {
			'Content-Type': 'application/json',
		};
		if (token) {
			base[this.TOKEN_HEADER] = `Bearer ${token}`;
		}
		return { ...base, ...header };
	}

	// ==========================================
	// 通用接口请求函数
	// ==========================================
	public async request<T = any>(config: RequestConfig): Promise<T> {
		let options: RequestConfig = {
			timeout: 15000,
			...config,
			header: this.getBaseHeader(config.header),
		};

		if (options.url && !options.url.startsWith('http')) {
			options.url = `${this.baseUrl}${options.url}`;
		}

		if (options.interceptors?.request) options = options.interceptors.request(options);
		if (options.showLoading) this.showLoading();

		return new Promise((resolve, reject) => {
			Taro.request({
				...options,
				success: (res) => this.handleSuccess<T>(res.statusCode, res.data, options, resolve, reject),
				fail: (err) => this.handleNetworkFail(err, options, reject),
				complete: () => {
					if (options.showLoading) this.hideLoading();
				},
			});
		});
	}

	// ==========================================
	// 上传接口请求函数
	// ==========================================
	public async upload<T = any>(url: string, filePath: string, config?: UploadConfig): Promise<T> {
		const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
		const header = this.getBaseHeader(config?.header);
		delete header['Content-Type'];

		if (config?.showLoading) this.showLoading();

		// H5 端 blob:/data: URL 补全文件扩展名后通过 fetch + FormData 上传
		if (
			process.env.TARO_ENV === 'h5' &&
			(filePath.startsWith('blob:') || filePath.startsWith('data:')) &&
			typeof window !== 'undefined'
		) {
			try {
				const blobRes = await fetch(filePath);
				const blob = await blobRes.blob();
				const mimeExt = MIME_EXT_MAP[blob.type] || blob.type.split('/')[1]?.split(';')[0] || 'bin';
				const rawName = config?.fileName?.trim() || '';
				const finalName = rawName.includes('.') ? rawName : `${rawName || `upload_${Date.now()}`}.${mimeExt}`;
				const fileObj = new File([blob], finalName, { type: blob.type || undefined });

				const formData = new FormData();
				formData.append(config?.name || 'file', fileObj, finalName);
				if (config?.formData) {
					Object.entries(config.formData).forEach(([k, v]) => {
						if (v !== undefined && v !== null) formData.append(k, String(v));
					});
				}

				const fetchRes = await fetch(fullUrl, {
					method: 'POST',
					headers: header,
					body: formData,
				});

				let parsedData: any = null;
				try {
					parsedData = await fetchRes.json();
				} catch {
					parsedData = { code: fetchRes.status, msg: `上传响应解析失败(${fetchRes.status})`, data: null };
				}

				return await new Promise<T>((resolve, reject) => {
					this.handleSuccess<T>(fetchRes.status, parsedData, config || {}, resolve, reject);
				});
			} catch (err) {
				return await new Promise<T>((_, reject) => {
					this.handleNetworkFail(err, config || {}, reject);
				});
			} finally {
				if (config?.showLoading) this.hideLoading();
			}
		}

		return new Promise((resolve, reject) => {
			Taro.uploadFile({
				url: fullUrl,
				filePath,
				name: config?.name || 'file',
				fileName: config?.fileName,
				formData: config?.formData,
				header,
				success: (res) => {
					let parsedData: any;
					try {
						parsedData = JSON.parse(res.data);
					} catch {
						if (!config?.silent) Taro.showToast({ title: '返回数据解析失败', icon: 'none' });
						reject(new Error('JSON parse error'));
						return;
					}

					this.handleSuccess<T>(res.statusCode, parsedData, config || {}, resolve, reject);
				},
				fail: (err) => this.handleNetworkFail(err, config || {}, reject),
				complete: () => {
					if (config?.showLoading) this.hideLoading();
				},
			});
		});
	}

	/** 统一响应处理（兼容 HTTP 2xx 与 HTTP 401） */
	private handleSuccess<T>(
		statusCode: number,
		responseData: any,
		options: Partial<RequestConfig>,
		resolve: (value: T) => void,
		reject: (reason?: any) => void,
	) {
		// HTTP 层 401 直接走鉴权失效处理
		if (statusCode === 401) {
			this.handleAuthError(options.silent);
			reject(responseData || { code: 401, msg: '登录已过期', data: null });
			return;
		}

		if (statusCode >= 200 && statusCode < 300) {
			const { code, msg } = (responseData || {}) as Partial<BaseResponse<any>>;

			if (code === 200 || code === 0) {
				const finalData = options.interceptors?.response
					? options.interceptors.response(responseData)
					: responseData;
				resolve(finalData as T);
			} else if (code !== undefined && AUTH_ERROR_CODES.has(code)) {
				this.handleAuthError(options.silent);
				reject(responseData);
			} else {
				if (!options.silent) Taro.showToast({ title: msg || '服务器繁忙', icon: 'none' });
				reject(responseData);
			}
			return;
		}

		const msg = responseData?.msg || responseData?.message || `网络请求错误(${statusCode})`;
		if (!options.silent) Taro.showToast({ title: msg, icon: 'none' });
		reject({ code: statusCode, msg, data: responseData });
	}

	/** 处理网络连接失败 */
	private handleNetworkFail(err: any, options: Partial<RequestConfig>, reject: (reason?: any) => void) {
		if (!options.silent) Taro.showToast({ title: '网络异常，请检查网络', icon: 'none' });
		reject(err);
	}

	/** 处理鉴权失败（401） */
	private handleAuthError(silent = false) {
		const authStore = useAuthStore.getState();
		const hasTokenBefore = !!authStore.token;
		authStore.setLogout();

		const backUrl = getCurrentPageUrl();
		// 静默请求或当前已在登录页，仅清登录态，不弹窗也不套娃跳转
		if (silent || backUrl.includes('/pages/login/')) return;

		if (HttpRequest.isRedirecting) return;
		HttpRequest.isRedirecting = true;

		const modalContent = hasTokenBefore ? '您的登录已过期，请重新登录' : '当前操作需要您登录账户';

		Taro.showModal({
			title: '提示',
			content: modalContent,
			showCancel: !hasTokenBefore,
			success: (res) => {
				if (res.confirm) {
					Taro.navigateTo({
						url: `/pages/login/index?back_url=${encodeURIComponent(backUrl)}`,
						complete: () => {
							HttpRequest.isRedirecting = false;
						},
					});
				} else {
					HttpRequest.isRedirecting = false;
				}
			},
			fail: () => {
				HttpRequest.isRedirecting = false;
			},
		});
	}

	/** 过滤掉参数里所有的 undefined 与 null */
	private cleanParams = (params: any) => {
		if (!params) return params;
		return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null));
	};

	private formRequest<T>(method: 'POST' | 'PUT', url: string, data?: any, config?: Partial<RequestConfig>) {
		return this.request<T>({
			...config,
			url,
			data,
			method,
			header: { ...config?.header, 'Content-Type': 'application/x-www-form-urlencoded' },
		});
	}

	public get<T = any>(url: string, params?: any, config?: Partial<RequestConfig>) {
		return this.request<T>({ ...config, url, data: this.cleanParams(params), method: 'GET' });
	}

	public post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
		return this.request<T>({ ...config, url, data, method: 'POST' });
	}

	public put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
		return this.request<T>({ ...config, url, data, method: 'PUT' });
	}

	public delete<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
		return this.request<T>({ ...config, url, data, method: 'DELETE' });
	}

	public postForm<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
		return this.formRequest<T>('POST', url, data, config);
	}

	public putForm<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
		return this.formRequest<T>('PUT', url, data, config);
	}
}

export const http = new HttpRequest();
