import { Avatar, Badge, FormItem, Page, Button, Card } from '@/components/ui';
import { USER_GENDER_OPTIONS } from '@/constants/common';
import { useUpdateUser } from '@/hooks/useUser';
import { View, Text, Input } from '@tarojs/components';

export default function UserProfilePage() {
	const { form, updateField, onChooseAvatar, handleSave, isSaving } = useUpdateUser();

	return (
		<Page className="pt-4 pb-10">
			<View className="container-x flex flex-col gap-4">
				{/* 头像区 */}
				<Card>
					<View className="flex flex-col items-center py-6">
						<Button
							openType="chooseAvatar"
							onChooseAvatar={onChooseAvatar}
							variant="ghost"
							className="w-24 h-24"
						>
							<View className="relative">
								<Avatar src={form.avatar} size="xl" name={form.name} />
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
							value={form.name}
							onInput={(e) => updateField('name', e.detail.value)}
							onBlur={(e) => updateField('name', e.detail.value)}
						/>
					</FormItem>

					{/* 性别 */}
					<FormItem label="性别">
						<View className="flex gap-3">
							{USER_GENDER_OPTIONS.map((opt) => (
								<Badge
									variant={opt.value === form.gender ? 'primary' : 'secondary'}
									onClick={() => updateField('gender', opt.value)}
									size="md"
								>
									{opt.label}
								</Badge>
							))}
						</View>
					</FormItem>

					{/* 详细地址 */}
					<FormItem label="详细地址" border={false}>
						<Input
							className="text-right text-sm text-text-title h-full"
							placeholder="请输入详细地址"
							value={form.address}
							onInput={(e) => updateField('address', e.detail.value)}
						/>
					</FormItem>
				</Card>

				{/* 保存 */}
				<Button size="xl" variant="primary" loading={isSaving} disabled={isSaving} onClick={handleSave}>
					保存资料
				</Button>
			</View>
		</Page>
	);
}
