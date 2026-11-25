import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUserInfoAPI, updateUserProfileAPI } from '@/services/user';
import { useAuthStore } from '@/store/auth';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { uploadImageAPI } from '@/services/upload';
import { delayBack, maskPhone } from '@/utils/common';
import { UpdateUserProfileRequest, UserInfo } from '@/types/user';

/** Query - 获取用户信息 */
export const useUser = () => {
	const { updateUserInfo, authStage } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN';

	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const res = await getUserInfoAPI();
			const rawUser = res.data?.user;
			if (!rawUser) return null;
			const data: UserInfo = {
				...rawUser,
				maskedPhone: maskPhone(rawUser.phonenumber),
			};
			updateUserInfo(data, res.data?.roles || [], res.data?.permissions || []);
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

	const [form, setForm] = useState<UpdateUserProfileRequest>({
		nickName: userInfo?.nickName ?? userInfo?.userName ?? '',
		phonenumber: userInfo?.phonenumber ?? '',
		email: userInfo?.email ?? '',
		sex: userInfo?.sex ?? '0',
		avatar: userInfo?.avatar ?? '',
	});

	const updateField = <K extends keyof UpdateUserProfileRequest>(field: K, value: UpdateUserProfileRequest[K]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const onChooseAvatar = async (e: any) => {
		const { avatarUrl } = e.detail;
		if (!avatarUrl) return;
		Taro.showLoading({ title: '上传中...', mask: true });
		try {
			const res = await uploadImageAPI(avatarUrl);
			if (res.data?.filePath) {
				setForm((prev) => ({ ...prev, avatar: res.data.filePath }));
				Taro.showToast({ title: '头像获取成功', icon: 'success' });
			}
		} catch (error) {
			console.error('头像上传失败', error);
		} finally {
			Taro.hideLoading();
		}
	};

	const mutation = useMutation({
		mutationFn: (data: UpdateUserProfileRequest) => updateUserProfileAPI(data),
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			if (userInfo) {
				updateUserInfo({
					...userInfo,
					...form,
					maskedPhone: maskPhone(form.phonenumber),
				});
			}
			queryClient.invalidateQueries(['user', 'profile']);
			delayBack();
		},
	});

	const handleSave = () => {
		if (!form.nickName.trim()) return Taro.showToast({ title: '请输入昵称', icon: 'none' });
		if (!form.phonenumber.trim()) return Taro.showToast({ title: '请输入手机号', icon: 'none' });
		if (!form.email.trim()) return Taro.showToast({ title: '请输入邮箱', icon: 'none' });
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
