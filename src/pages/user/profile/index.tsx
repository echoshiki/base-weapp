import { View, Text } from '@tarojs/components';
import { Page, Avatar, Badge, FormItem, Input, Button, Card } from '@/components/ui';
import { useUpdateUser } from '@/hooks/useUser';
import { UserSex } from '@/types/user';

const SEX_OPTIONS: { label: string; value: UserSex }[] = [
	{ label: '男', value: '0' },
	{ label: '女', value: '1' },
];

export default function UserProfilePage() {
	const { form, updateField, onChooseAvatar, handleSave, isSaving } = useUpdateUser();

	return (
		<Page>
			<View className="py-4 flex flex-col gap-4">
				{/* 头像区 */}
				<Card>
					<View className="flex flex-col items-center py-4">
						<Button
							openType="chooseAvatar"
							onChooseAvatar={onChooseAvatar}
							appearance="ghost"
							className="size-24 p-0"
						>
							<View className="relative">
								<Avatar src={form.avatar} size="xl" name={form.nickName} />
								<View className="absolute bottom-0 right-0 size-6 rounded-full p-1 bg-primary flex justify-center items-center">
									<View className="icon-[ph--camera] size-3.5 text-white" />
								</View>
							</View>
						</Button>
						<Text className="text-xs opacity-60 mt-3">点击更换头像</Text>
					</View>
				</Card>

				{/* 基本信息表单 */}
				<Card className="py-2">
					<FormItem label="昵称">
						<Input
							variant="ghost"
							type="nickname"
							inputClassName="text-right"
							placeholder="请输入昵称"
							value={form.nickName}
							onChange={(val) => updateField('nickName', val)}
							onBlur={(e) => updateField('nickName', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="手机号">
						<Input
							variant="ghost"
							type="number"
							maxlength={11}
							inputClassName="text-right"
							placeholder="请输入手机号"
							value={form.phonenumber}
							onChange={(val) => updateField('phonenumber', val)}
						/>
					</FormItem>

					<FormItem label="邮箱">
						<Input
							variant="ghost"
							inputClassName="text-right"
							placeholder="请输入邮箱"
							value={form.email}
							onChange={(val) => updateField('email', val)}
						/>
					</FormItem>

					<FormItem label="性别" border={false}>
						<View className="flex gap-2">
							{SEX_OPTIONS.map((opt) => (
								<Badge
									key={opt.value}
									variant={opt.value === form.sex ? 'primary' : 'zinc'}
									onClick={() => updateField('sex', opt.value)}
								>
									{opt.label}
								</Badge>
							))}
						</View>
					</FormItem>
				</Card>

				<Button size="lg" block variant="primary" loading={isSaving} disabled={isSaving} onClick={handleSave}>
					保存资料
				</Button>
			</View>
		</Page>
	);
}
