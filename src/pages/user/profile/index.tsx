import { View, Text, Button as TaroButton } from '@tarojs/components';
import { Page, Avatar, FormItem, Input, Button, Card, Gender } from '@/components/ui';
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
				{/* 头像区：通透居中主视觉 + 白环阴影 + 白边相机徽标 */}
				<View className="flex flex-col items-center pt-4 pb-2">
					<TaroButton
						openType="chooseAvatar"
						onChooseAvatar={onChooseAvatar}
						className="inline-flex w-fit m-0 p-0 bg-transparent after:border-0 overflow-visible leading-none active:scale-95 transition-transform"
					>
						<View className="relative inline-flex w-fit p-1 rounded-full bg-white shadow-sm ring-1 ring-zinc-200/70">
							<Avatar src={form.avatar} size="xl" name={form.nickName} className="border-0 shadow-none" />
							<View className="absolute right-0.5 bottom-0.5 size-7 rounded-full bg-zinc-900 border-2 border-white shadow-sm flex items-center justify-center">
								<View className="icon-[ph--camera-fill] size-3.5 text-white" />
							</View>
						</View>
					</TaroButton>

					<Text className="text-base font-semibold mt-3">{form.nickName || '未设置昵称'}</Text>
					<Text className="text-xs text-zinc-400 mt-0.5">点击头像更换</Text>
				</View>

				{/* 基本信息表单 */}
				<Card>
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
						<View className="flex items-center gap-1">
							{SEX_OPTIONS.map((opt) => {
								const active = opt.value === form.sex;
								return (
									<Button
										key={opt.value}
										size="sm"
										appearance={active ? 'soft' : 'ghost'}
										variant={active ? (opt.value === '0' ? 'sky' : 'rose') : 'zinc'}
										icon={<Gender gender={opt.value} size="sm" />}
										onClick={() => updateField('sex', opt.value)}
									>
										{opt.label}
									</Button>
								);
							})}
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
