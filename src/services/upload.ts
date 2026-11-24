import { http } from '@/utils/http';
import { DataResponse, ListRes, UploadFileItem } from '@/types/common';

/**
 * 前端上传文件
 * POST /file/upload
 * @param filePath 本地临时文件路径
 * @param fileName 可选原始文件名（含后缀）
 */
export const uploadImageAPI = (filePath: string, fileName?: string) => {
	return http.upload<DataResponse<ListRes<UploadFileItem>>>('/file/upload', filePath, {
		name: 'file',
		fileName,
		showLoading: false,
	});
};
