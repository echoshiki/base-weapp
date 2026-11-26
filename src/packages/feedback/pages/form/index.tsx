import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Page, Card, FormItem, Input, Textarea, ImageUploader, Button, Feedback } from '@/components/ui';
import { useUpload } from '@/hooks/useUpload';
import { mapsTo } from '@/utils/common';
import { useSubmitFeedback } from '../../hooks';
import { FEEDBACK_ROUTES } from '../../routes';
import { FEEDBACK_TYPE_OPTIONS, FeedbackType } from '../../types';

const MAX_IMAGES = 4;

export default function FeedbackFormPage() {
	const [type, setType] = useState<FeedbackType>('suggestion');
	const [content, setContent] = useState('');
	const [images, setImages] = useState<string[]>([]);
	const [contact, setContact] = useState('');
	const [contentError, setContentError] = useState('');
	const [submittedId, setSubmittedId] = useState<string | null>(null);

	const { triggerUpload, isUploading } = useUpload();
	const { mutateAsync: submitFeedback, isLoading: isSubmitting } = useSubmitFeedback();

	const handleSubmit = async () => {
		const trimmedContent = content.trim();
		if (trimmedContent.length < 5) {
			setContentError('请至少输入 5 个字的详细描述');
			return;
		}
		setContentError('');

		try {
			const res = await submitFeedback({
				type,
				content: trimmedContent,
				images: images.length > 0 ? images : undefined,
				contact: contact.trim() || undefined,
			});
			setSubmittedId(res?.id || 'ok');
		} catch (err: any) {
			Taro.showToast({ title: err?.msg || err?.message || '提交失败，请重试', icon: 'none' });
		}
	};

	// 提交成功后直接展示落地反馈态
	if (submittedId) {
		return (
			<Page>
				<View className="h-screen scrollbar-none flex flex-col justify-center -mt-10">
					<Feedback
						variant="success"
						title="提交成功"
						subtitle="感谢您的宝贵反馈，我们将尽快处理并通过消息或联系方式通知您。"
						extra={
							<View className="flex flex-col gap-3 px-2">
								<Button
									size="lg"
									block
									variant="primary"
									onClick={() => mapsTo(FEEDBACK_ROUTES.list, 'redirectTo')}
								>
									查看我的反馈记录
								</Button>
								<Button
									size="lg"
									block
									variant="zinc"
									appearance="outline"
									onClick={() => {
										setSubmittedId(null);
										setContent('');
										setImages([]);
										setContact('');
									}}
								>
									继续提交新反馈
								</Button>
							</View>
						}
					/>
				</View>
			</Page>
		);
	}

	return (
		<Page>
			<View className="py-4 flex flex-col gap-4">
				<Card className="gap-1">
					{/* 反馈类型选择 */}
					<FormItem layout="column" label="反馈类型" required>
						<View className="flex flex-wrap gap-2">
							{FEEDBACK_TYPE_OPTIONS.map((opt) => {
								const active = opt.value === type;
								return (
									<Button
										key={opt.value}
										size="xs"
										appearance={active ? 'soft' : 'outline'}
										variant={active ? 'primary' : 'zinc'}
										onClick={() => setType(opt.value)}
									>
										{opt.label}
									</Button>
								);
							})}
						</View>
					</FormItem>

					{/* 问题描述 */}
					<FormItem layout="column" label="问题描述" required error={contentError}>
						<Textarea
							variant="filled"
							placeholder="请详细描述您遇到的问题、复现步骤或改进建议..."
							value={content}
							onChange={(val) => {
								setContent(val);
								if (contentError && val.trim().length >= 5) setContentError('');
							}}
							maxlength={200}
							showCount
							error={Boolean(contentError)}
							textareaClassName="h-28"
						/>
					</FormItem>

					{/* 图片凭证 */}
					<FormItem layout="column" label="图片凭证" helper={`选填，最多 ${MAX_IMAGES} 张`}>
						<ImageUploader
							maxCount={MAX_IMAGES}
							value={images}
							onChange={setImages}
							onUpload={triggerUpload}
							isUploading={isUploading}
							label="上传截图"
						/>
					</FormItem>

					{/* 联系方式 */}
					<FormItem layout="column" label="联系方式" helper="选填，便于我们回复跟进">
						<Input
							variant="filled"
							maxlength={30}
							prefix="icon-[ph--phone]"
							placeholder="手机号 / 微信号 / 邮箱"
							value={contact}
							onChange={setContact}
							clearable
						/>
					</FormItem>
				</Card>

				<Button
					size="xl"
					block
					variant="primary"
					loading={isSubmitting}
					disabled={isSubmitting || isUploading}
					onClick={handleSubmit}
				>
					提交反馈
				</Button>

				<View className="flex justify-center pb-10">
					<Text
						onClick={() => mapsTo(FEEDBACK_ROUTES.list)}
						className="text-sm text-primary font-medium px-4 cursor-pointer active:opacity-70"
					>
						查看历史反馈记录 →
					</Text>
				</View>
			</View>
		</Page>
	);
}
