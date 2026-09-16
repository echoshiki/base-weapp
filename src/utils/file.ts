import Taro from '@tarojs/taro';

/** 支持的原生文档格式 */
export type SupportedDocType = 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'pdf';

/** 文件元数据描述 */
export interface FileMeta {
	ext: string;
	tag: string;
	iconClass: string;
	badgeClass: string;
	isImage: boolean;
	isDoc: boolean;
}

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp'];
const DOC_EXTS: SupportedDocType[] = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];

/**
 * 获取文件类型的图标、标签与展示风格
 */
export function getFileMeta(fileName = '', fileExt = ''): FileMeta {
	const rawExt = (fileExt || fileName.split('.').pop() || '').toLowerCase().split('?')[0];

	if (rawExt === 'pdf') {
		return {
			ext: 'pdf',
			tag: 'PDF',
			iconClass: 'icon-[ph--file-pdf-duotone] text-red-500',
			badgeClass: 'bg-red-50 text-red-600 border-red-200',
			isImage: false,
			isDoc: true,
		};
	}

	if (['doc', 'docx'].includes(rawExt)) {
		return {
			ext: rawExt,
			tag: 'WORD',
			iconClass: 'icon-[ph--file-doc-duotone] text-blue-600',
			badgeClass: 'bg-blue-50 text-blue-600 border-blue-200',
			isImage: false,
			isDoc: true,
		};
	}

	if (['xls', 'xlsx'].includes(rawExt)) {
		return {
			ext: rawExt,
			tag: 'EXCEL',
			iconClass: 'icon-[ph--file-xls-duotone] text-emerald-600',
			badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
			isImage: false,
			isDoc: true,
		};
	}

	if (['ppt', 'pptx'].includes(rawExt)) {
		return {
			ext: rawExt,
			tag: 'PPT',
			iconClass: 'icon-[ph--file-ppt-duotone] text-orange-600',
			badgeClass: 'bg-orange-50 text-orange-600 border-orange-200',
			isImage: false,
			isDoc: true,
		};
	}

	if (IMAGE_EXTS.includes(rawExt) || fileName.match(/\.(jpg|jpeg|png|webp|gif|svg|bmp)/i)) {
		return {
			ext: rawExt || 'img',
			tag: (rawExt || 'IMG').toUpperCase(),
			iconClass: 'icon-[ph--file-image-duotone] text-amber-600',
			badgeClass: 'bg-amber-50 text-amber-600 border-amber-200',
			isImage: true,
			isDoc: false,
		};
	}

	return {
		ext: rawExt || 'file',
		tag: (rawExt || 'FILE').toUpperCase(),
		iconClass: 'icon-[ph--file-text-duotone] text-zinc-500',
		badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
		isImage: false,
		isDoc: false,
	};
}

/**
 * 格式化文件大小 (B -> KB / MB)
 */
export function formatFileSize(bytes?: number): string {
	if (!bytes || bytes <= 0) return '';
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 微信小程序多格式文件通用预览/打开函数
 * - 图片：调起 Taro.previewImage，支持手势缩放、全屏滑动、长按保存
 * - 文档 (PDF, Word, Excel, PPT)：下载临时文件后调用 Taro.openDocument 打开，带右上角原生菜单（转发、保存到手机、其他应用打开）
 * - 其它格式：提示并引导用户复制文件链接到外部浏览器查看
 */
export function previewFileOrImage(fileUrl: string, fileName = '', fileExt = '') {
	if (!fileUrl) {
		Taro.showToast({ title: '文件地址无效', icon: 'none' });
		return;
	}

	const meta = getFileMeta(fileName, fileExt || fileUrl.split('.').pop());

	// 1. 图片类型直接原生预览
	if (meta.isImage) {
		Taro.previewImage({
			urls: [fileUrl],
			current: fileUrl,
		});
		return;
	}

	// 2. 微信原生支持的文档格式
	if (meta.isDoc) {
		Taro.showLoading({ title: '加载文件中...', mask: true });
		Taro.downloadFile({
			url: fileUrl,
			success: (res) => {
				Taro.hideLoading();
				if (res.statusCode === 200) {
					Taro.openDocument({
						filePath: res.tempFilePath,
						fileType: meta.ext as SupportedDocType,
						showMenu: true,
						fail: (err) => {
							console.error('打开文档失败:', err);
							Taro.showToast({ title: '打开文件失败，请重试', icon: 'none' });
						},
					});
				} else {
					Taro.showToast({ title: '文件获取失败', icon: 'none' });
				}
			},
			fail: (err) => {
				Taro.hideLoading();
				console.error('下载文件失败:', err);
				Taro.showToast({ title: '网络异常，文件下载失败', icon: 'none' });
			},
		});
		return;
	}

	// 3. 不在微信原生直接支持列表里的文件
	Taro.showModal({
		title: '文件查阅提示',
		content: `该文件为 ${meta.tag} 格式，微信暂不支持内嵌打开。是否复制文件下载链接到浏览器查看？`,
		confirmText: '复制链接',
		confirmColor: '#C5A059',
		success: (mRes) => {
			if (mRes.confirm) {
				Taro.setClipboardData({
					data: fileUrl,
					success: () => Taro.showToast({ title: '已复制下载链接', icon: 'success' }),
				});
			}
		},
	});
}
