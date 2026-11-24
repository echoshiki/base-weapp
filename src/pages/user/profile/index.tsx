import { Avatar, Badge, FormItem, Button, Card } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useUpdateUser } from '@/hooks/useUser';
import { UserSex } from '@/types/user';
import { View, Text, Input } from '@tarojs/components';

const SEX_OPTIONS: { label: string; value: UserSex }[] = [
	{ label: '男', value: '0' },
	{ label: '女', value: '1' },
];

export default function UserProfilePage() {
	const { form, updateField, onChooseAvatar, handleSave, isSaving } = useUpdateUser();

	return (
		<BizPage paddingX={false} defaultShowHeader className="pb-10">
			<View className="container-x pt-4 flex flex-col gap-4">
				{/* 头像区 */}
				<Card>
					<View className="flex flex-col items-center py-6">
						<Button
							openType="chooseAvatar"
							onChooseAvatar={onChooseAvatar}
							appearance="ghost"
							className="w-24 h-24"
						>
							<View className="relative">
								<Avatar src={form.avatar} size="xl" name={form.nickName} />
								<View className="absolute bottom-0 right-0 size-6 rounded-full p-1 bg-primary flex justify-center items-center">
									<View className="icon-[ph--camera] size-4 text-white" />
								</View>
							</View>
						</Button>
						<Text className="text-sm text-text-body mt-5">点击更换头像</Text>
					</View>
				</Card>

				<Card>
					{/* 昵称 */}
					<FormItem label="昵称">
						<Input
							type="nickname"
							className="text-right text-sm text-text-title h-full"
							placeholder="请输入昵称"
							value={form.nickName}
							onInput={(e) => updateField('nickName', e.detail.value)}
							onBlur={(e) => updateField('nickName', e.detail.value)}
						/>
					</FormItem>

					{/* 手机号 */}
					<FormItem label="手机号">
						<Input
							className="text-right text-sm text-text-title h-full"
							placeholder="请输入手机号"
							value={form.phonenumber}
							onInput={(e) => updateField('phonenumber', e.detail.value)}
						/>
					</FormItem>

					{/* 邮箱 */}
					<FormItem label="邮箱">
						<Input
							className="text-right text-sm text-text-title h-full"
							placeholder="请输入邮箱"
							value={form.email}
							onInput={(e) => updateField('email', e.detail.value)}
						/>
					</FormItem>

					{/* 性别 */}
					<FormItem label="性别" border={false}>
						<View className="flex gap-3">
							{SEX_OPTIONS.map((opt) => (
								<Badge
									key={opt.value}
									variant={opt.value === form.sex ? 'primary' : 'slate'}
									onClick={() => updateField('sex', opt.value)}
								>
									{opt.label}
								</Badge>
							))}
						</View>
					</FormItem>
				</Card>

				{/* 保存 */}
				<Button size="xl" block variant="primary" loading={isSaving} disabled={isSaving} onClick={handleSave}>
					保存资料
				</Button>
			</View>
		</BizPage>
	);
}
