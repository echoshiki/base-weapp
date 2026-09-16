import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUserInfoAPI, updateUserInfoAPI, type UpdatesUserInfoRequest } from '@/services/user';
import { useAuthStore } from '@/store/auth';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { uploadImageAPI } from '@/services/upload';
import { delayBack, maskPhone } from '@/utils/common';
import { UserInfo } from '@/types/user';

/** Query - 获取用户信息 */
export const useUser = () => {
	const { updateUserInfo, authStage } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN';

	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const raw = await getUserInfoAPI();
			// 格式化数据：保留原始 phone，生成安全展示用的 maskedPhone
			const data: UserInfo = {
				...raw,
				maskedPhone: maskPhone(raw?.phone),
			};
			updateUserInfo(data);
			return data;
		},
		enabled: isLoggedIn,
		staleTime: 30 * 1000,
	});
};

/** Action - 更新用户资料 */
export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	const { userInfo, updateUserInfo } = useAuthStore();

	// 状态：表单数据，从全量用户资料里提取出表单字段数据
	const [form, setForm] = useState<UpdatesUserInfoRequest>({
		name: userInfo?.name ?? '微信用户',
		avatar: userInfo?.avatar ?? '',
		gender: userInfo?.gender ?? '1',
		address: userInfo?.address ?? '',
	});

	// 执行：统一更新表单字段状态
	const updateField = <K extends keyof UpdatesUserInfoRequest>(field: K, value: UpdatesUserInfoRequest[K]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	// 执行：获取微信头像并上传
	const onChooseAvatar = async (e: any) => {
		const { avatarUrl } = e.detail;
		if (!avatarUrl) return;
		Taro.showLoading({ title: '上传中...', mask: true });
		try {
			const data = await uploadImageAPI(avatarUrl);
			if (data.list && data.list.length > 0) {
				setForm((prev) => ({ ...prev, avatar: data.list[0].filePath }));
				Taro.showToast({ title: '头像获取成功', icon: 'success' });
			}
		} catch (error) {
			console.error('头像上传失败', error);
		} finally {
			Taro.hideLoading();
		}
	};

	const mutation = useMutation({
		mutationFn: (data: UpdatesUserInfoRequest) => updateUserInfoAPI(data),
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			if (userInfo) updateUserInfo({ ...userInfo, ...form });
			queryClient.invalidateQueries(['user', 'profile']);
			delayBack();
		},
	});

	const handleSave = () => {
		if (!form.avatar) return Taro.showToast({ title: '请设置头像', icon: 'none' });
		if (!form.name) return Taro.showToast({ title: '请输入昵称', icon: 'none' });
		mutation.mutate(form);
	};

	return {
		form,
		userInfo,
		updateField,
		onChooseAvatar,
		handleSave,
		isSaving: mutation.isLoading,
	};
};
