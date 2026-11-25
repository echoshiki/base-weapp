import { useState } from 'react';
import Taro from '@tarojs/taro';
import { uploadImageAPI } from '@/services/upload';
import { UploadFileItem } from '@/types/common';

/**
 * 上传文件/图片/视频 Hook
 */
export const useUpload = () => {
	const [isUploading, setIsUploading] = useState(false);

	/**
	 * 批量上传并返回完整文件元数据数组 (UploadFileItem[])
	 */
	const triggerUploadFiles = async (
		filePaths: string[],
		fallbackMetas?: Partial<UploadFileItem>[],
	): Promise<UploadFileItem[]> => {
		if (filePaths.length === 0) return [];
		setIsUploading(true);
		Taro.showLoading({ title: '上传中...', mask: true });
		try {
			const uploadedItems: UploadFileItem[] = [];
			for (let i = 0; i < filePaths.length; i++) {
				const path = filePaths[i];
				const fallback = fallbackMetas?.[i];
				const res = await uploadImageAPI(path, fallback?.fileName);
				const item = res.data;
				if (item?.filePath) {
					const rawName = item.fileName || fallback?.fileName || path.split('/').pop() || 'file';
					const ext = item.fileType || fallback?.fileType || rawName.split('.').pop() || '';
					uploadedItems.push({
						filePath: item.filePath,
						fileName: rawName,
						fileType: ext,
						fileSize: item.fileSize ?? fallback?.fileSize ?? 0,
					});
				}
			}
			return uploadedItems;
		} catch (error) {
			console.error('上传文件中断或失败:', error);
			throw error;
		} finally {
			setIsUploading(false);
			Taro.hideLoading();
		}
	};

	/** 批量上传并仅返回远程路径数组 */
	const triggerUpload = async (filePaths: string[]): Promise<string[]> => {
		const items = await triggerUploadFiles(filePaths);
		return items.map((item) => item.filePath);
	};

	return { triggerUpload, triggerUploadFiles, isUploading };
};
