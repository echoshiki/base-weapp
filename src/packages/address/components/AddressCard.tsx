import { View, Text } from '@tarojs/components';
import { Badge, Card, Divider } from '@/components/ui';
import { cn } from '@/utils/common';
import { AddressItem } from '../types';

export interface AddressCardProps {
	item: AddressItem;
	/** 是否处于选择地址模式（如从下单/预约页进入） */
	selectable?: boolean;
	/** 选择模式下当前是否已选中 */
	selected?: boolean;
	onSelect?: (item: AddressItem) => void;
	onEdit?: (item: AddressItem) => void;
	onDelete?: (item: AddressItem) => void;
	onSetDefault?: (item: AddressItem) => void;
}

/** 手机号中间四位脱敏 */
const formatPhone = (phone: string) => {
	if (!phone || phone.length !== 11) return phone;
	return `${phone.slice(0, 3)}****${phone.slice(7)}`;
};

/**
 * 收货地址卡片组件（兼容管理模式与选择模式）
 */
export function AddressCard({
	item,
	selectable = false,
	selected = false,
	onSelect,
	onEdit,
	onDelete,
	onSetDefault,
}: AddressCardProps) {
	const fullAddress = `${item.province}${item.city}${item.district} ${item.detail}`.trim();

	return (
		<Card
			className={cn(
				'gap-2.5 transition-colors',
				selectable && selected ? 'border-primary ring-1 ring-primary/20' : '',
			)}
		>
			{/* 主体信息区 */}
			<View
				className={cn('flex items-start gap-3', selectable && 'cursor-pointer active:opacity-75')}
				onClick={() => selectable && onSelect?.(item)}
			>
				{selectable && (
					<View
						className={cn(
							'size-5 shrink-0 mt-0.5',
							selected ? 'icon-[ph--check-circle-fill] text-primary' : 'icon-[ph--circle] text-zinc-300',
						)}
					/>
				)}

				<View className="flex-1 min-w-0 flex flex-col gap-1.5">
					<View className="flex items-center flex-wrap gap-2">
						<Text className="text-base font-bold">{item.name}</Text>
						<Text className="text-sm text-zinc-500">{formatPhone(item.phone)}</Text>
						{item.isDefault && <Badge variant="primary">默认</Badge>}
						{item.tag && <Badge variant="zinc">{item.tag}</Badge>}
					</View>

					<Text className="text-xs text-zinc-600 leading-relaxed">{fullAddress}</Text>
				</View>

				{selectable && (
					<View
						className="p-1.5 -mr-1.5 text-zinc-400 active:text-zinc-700 cursor-pointer shrink-0"
						onClick={(e) => {
							e.stopPropagation();
							onEdit?.(item);
						}}
					>
						<View className="icon-[ph--pencil-simple-line] size-4.5" />
					</View>
				)}
			</View>

			{/* 管理模式底部操作栏 */}
			{!selectable && (
				<>
					<Divider />
					<View className="flex items-center justify-between pt-0.5">
						<View
							className="flex items-center gap-1.5 cursor-pointer active:opacity-70"
							onClick={() => !item.isDefault && onSetDefault?.(item)}
						>
							<View
								className={cn(
									'size-4.5',
									item.isDefault
										? 'icon-[ph--check-circle-fill] text-primary'
										: 'icon-[ph--circle] text-zinc-300',
								)}
							/>
							<Text className={cn('text-xs', item.isDefault ? 'text-primary font-medium' : 'text-zinc-500')}>
								{item.isDefault ? '默认地址' : '设为默认'}
							</Text>
						</View>

						<View className="flex items-center gap-4">
							<View
								className="flex items-center gap-1 text-xs text-zinc-600 active:opacity-70 cursor-pointer"
								onClick={() => onEdit?.(item)}
							>
								<View className="icon-[ph--pencil-simple-line] size-3.5" />
								<Text>编辑</Text>
							</View>
							<View
								className="flex items-center gap-1 text-xs text-zinc-500 active:text-rose-500 cursor-pointer"
								onClick={() => onDelete?.(item)}
							>
								<View className="icon-[ph--trash] size-3.5" />
								<Text>删除</Text>
							</View>
						</View>
					</View>
				</>
			)}
		</Card>
	);
}
