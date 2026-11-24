import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUserInfoAPI, updateUserProfileAPI } from '@/services/user';
import { getEnterpriseUserInfoAPI } from '@/services/auth';
import { extractEnterpriseInfo, mapEnterpriseToUserInfo } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { uploadImageAPI } from '@/services/upload';
import { delayBack, maskPhone } from '@/utils/common';
import { UpdateUserProfileRequest, UserInfo } from '@/types/user';

/** Query - 获取用户信息（自动按登录角色调用管理员或企业端接口） */
export const useUser = () => {
	const { updateUserInfo, updateEnterpriseInfo, authStage, loginType } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN';

	return useQuery({
		queryKey: ['user', 'profile', loginType],
		queryFn: async () => {
			const currentLoginType = useAuthStore.getState().loginType;
			if (currentLoginType === 'enterprise') {
				const res = await getEnterpriseUserInfoAPI();
				const entData = extractEnterpriseInfo(res);
				if (!entData) return null;
				updateEnterpriseInfo(entData);
				const data = mapEnterpriseToUserInfo(entData);
				updateUserInfo(data, entData.roles?.length ? entData.roles : ['enterpriseUser'], []);
				return data;
			}

			const res = await getUserInfoAPI();
			const rawUser = res.user;
			if (!rawUser) return null;
			// 格式化数据：保留原始 phonenumber，生成安全展示用的 maskedPhone
			const data: UserInfo = {
				...rawUser,
				maskedPhone: maskPhone(rawUser.phonenumber),
			};
			updateEnterpriseInfo(null);
			updateUserInfo(data, res.roles || [], res.permissions || []);
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
	const [form, setForm] = useState<UpdateUserProfileRequest>({
		nickName: userInfo?.nickName ?? userInfo?.userName ?? '',
		phonenumber: userInfo?.phonenumber ?? '',
		email: userInfo?.email ?? '',
		sex: userInfo?.sex ?? '0',
		avatar: userInfo?.avatar ?? '',
	});

	// 执行：统一更新表单字段状态
	const updateField = <K extends keyof UpdateUserProfileRequest>(field: K, value: UpdateUserProfileRequest[K]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	// 执行：获取头像并上传
	const onChooseAvatar = async (e: any) => {
		const { avatarUrl } = e.detail;
		if (!avatarUrl) return;
		Taro.showLoading({ title: '上传中...', mask: true });
		try {
			const res = await uploadImageAPI(avatarUrl);
			if (res.data?.list && res.data.list.length > 0) {
				setForm((prev) => ({ ...prev, avatar: res.data.list[0].filePath }));
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
