import { http } from '@/utils/http';
import { BaseResponse, UploadFileItem } from '@/types/common';

/**
 * 上传单个文件
 * POST /file/upload
 * @param filePath 本地临时文件路径
 * @param fileName 可选原始文件名（含后缀）
 */
export const uploadImageAPI = (filePath: string, fileName?: string) =>
	http.upload<BaseResponse<UploadFileItem>>('/file/upload', filePath, {
		name: 'file',
		fileName,
		showLoading: false,
	});
