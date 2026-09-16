import { ReactNode, useMemo, useState, useEffect } from 'react';
import {
	View,
	Text,
	Picker,
	PickerDateProps,
	PickerRegionProps,
	PickerTimeProps,
	PickerMultiSelectorProps,
} from '@tarojs/components';
import { cn } from '@/utils/common';
import pcaData from '@/assets/data/pca-code.json';

export type SelectVariant = 'outlined' | 'underline' | 'ghost';

// ---------------------------------------------------------
// 省市区相关类型
// ---------------------------------------------------------
export interface RegionNode {
	code: string;
	name: string;
}

export interface RegionChangeResult {
	province: RegionNode;
	city: RegionNode;
	district: RegionNode;
	/** 兼容 area 别名 */
	area?: RegionNode;
	rawCodes?: string[];
	rawNames?: string[];
}

interface PcaNode {
	code: string;
	name: string;
	children?: PcaNode[];
}

const PCA_DATA = pcaData as PcaNode[];

// ---------------------------------------------------------
// Props 定义（基于 mode 的 Discriminated Union 判别联合类型）
// ---------------------------------------------------------

export interface BaseSelectProps {
	/** 变体风格：'outlined' (卡片边框) | 'underline' (单下划线) | 'ghost' (无边框行内)，默认 'outlined' */
	variant?: SelectVariant;
	/** 占位提示文案 */
	placeholder?: string;
	/** 左侧图标 (Iconify 类名或 ReactNode) */
	icon?: ReactNode;
	/** 自定义触发区插槽 (如果不传则使用内置标准样式) */
	children?: ReactNode;
	/** 是否禁用 */
	disabled?: boolean;
	/** 自定义外层类名 */
	className?: string;
}

/** 普通单列下拉数据源选择 */
export interface SelectorModeProps<T = any> extends BaseSelectProps {
	mode?: 'selector';
	/** 选项列表（支持 {label, value} 对象数组、字符串数组、或任意对象数组） */
	options: (T | string | number)[];
	/** 当前选中的值 */
	value?: string | number | null;
	/** 选中变更回调 */
	onChange?: (value: any, selectedOption: T) => void;
	/** 显示文本的 key，默认优先取 'name' 或 'label' */
	labelKey?: string;
	/** 对应值的 key，默认优先取 'id' 或 'value' */
	valueKey?: string;
}

/** 日期/生日选择 */
export interface DateModeProps extends BaseSelectProps {
	mode: 'date';
	/** 当前日期 (YYYY-MM-DD) */
	value?: string;
	/** 起始有效日期 */
	start?: string;
	/** 结束有效日期 */
	end?: string;
	/** 粒度：'year' | 'month' | 'day'，默认 'day' */
	fields?: 'year' | 'month' | 'day';
	/** 变更回调 */
	onChange?: (dateStr: string) => void;
}

/** 省市区级联选择 */
export interface RegionModeProps extends BaseSelectProps {
	mode: 'region';
	/** 当前省市区 code 或 name 数组，如 ['320000', '320100', '320102'] 或 ['江苏省', '南京市', '玄武区'] */
	value?: [string, string, string] | string[] | string;
	/** 是否强制使用本地 pca-code.json 多列联动数据，默认 true */
	fromLocal?: boolean;
	/** 变更回调 */
	onChange?: (result: RegionChangeResult) => void;
}

/** 时间选择 */
export interface TimeModeProps extends BaseSelectProps {
	mode: 'time';
	/** 当前时间 (HH:mm) */
	value?: string;
	/** 起始时间 */
	start?: string;
	/** 结束时间 */
	end?: string;
	/** 变更回调 */
	onChange?: (timeStr: string) => void;
}

export type SelectProps<T = any> = SelectorModeProps<T> | DateModeProps | RegionModeProps | TimeModeProps;

// 变体样式映射
const VARIANT_CLASS: Record<SelectVariant, string> = {
	outlined: 'px-4 py-3.5 rounded-card border border-gray-200/80 bg-gray-50/70 active:bg-gray-100 transition-colors',
	underline: 'px-0 py-3 border-b border-gray-200 bg-transparent rounded-none active:opacity-70 transition-opacity',
	ghost: 'px-0 py-1 bg-transparent active:opacity-70 transition-opacity',
};

/**
 * Select 全能选择器组件
 * 统一收归「普通数据源单选 (selector)」、「日期 (date)」、「省市区 (region，支持本地 pca-code.json)」、「时间 (time)」
 * 100% 支持 outlined / underline / ghost 主题风格与自定义 children 插槽
 */
export function Select<T extends Record<string, any>>(props: SelectProps<T>) {
	const { variant = 'outlined', placeholder, icon, children, disabled = false, className } = props;

	const renderIcon = () => {
		if (!icon) return null;
		if (typeof icon === 'string') {
			return <View className={cn('size-4 shrink-0', icon)} />;
		}
		return icon;
	};

	// 统一渲染触发框
	const renderTrigger = (displayLabel: string, defaultPlaceholder: string) => {
		if (children) {
			return (
				<View className={cn('w-full', disabled && 'opacity-50 pointer-events-none', className)}>
					{children}
				</View>
			);
		}
		return (
			<View
				className={cn(
					'flex items-center justify-between transition-all cursor-pointer',
					VARIANT_CLASS[variant] || VARIANT_CLASS.outlined,
					disabled && 'opacity-50 pointer-events-none',
					className,
				)}
			>
				<View className="flex items-center gap-2 min-w-0 flex-1">
					{renderIcon()}
					<Text className={cn('text-sm truncate', displayLabel ? 'text-text-title' : 'text-text-muted')}>
						{displayLabel || placeholder || defaultPlaceholder}
					</Text>
				</View>

				<View className="flex items-center gap-1 text-text-muted/70 shrink-0 ml-2">
					<Text className="text-xs">{displayLabel ? '切换' : '选择'}</Text>
					<View className="icon-[ph--caret-down-bold] size-3.5" />
				</View>
			</View>
		);
	};

	// -------------------------------------------------------------
	// 模式 1: mode="date" (日期选择)
	// -------------------------------------------------------------
	if (props.mode === 'date') {
		const { value, start, end, fields = 'day', onChange } = props;
		const handleDateChange: PickerDateProps['onChange'] = (e) => {
			if (e.detail.value) onChange?.(e.detail.value);
		};

		return (
			<Picker
				mode="date"
				value={value || ''}
				start={start}
				end={end}
				fields={fields}
				disabled={disabled}
				onChange={handleDateChange}
			>
				{renderTrigger(value || '', '请选择日期')}
			</Picker>
		);
	}

	// -------------------------------------------------------------
	// 模式 2: mode="region" (省市区级联选择)
	// -------------------------------------------------------------
	if (props.mode === 'region') {
		return <LocalOrNativeRegionSelect {...props} renderTrigger={renderTrigger} />;
	}

	// -------------------------------------------------------------
	// 模式 3: mode="time" (时间选择)
	// -------------------------------------------------------------
	if (props.mode === 'time') {
		const { value, start, end, onChange } = props;
		const handleTimeChange: PickerTimeProps['onChange'] = (e) => {
			if (e.detail.value) onChange?.(e.detail.value);
		};

		return (
			<Picker
				mode="time"
				value={value || ''}
				start={start}
				end={end}
				disabled={disabled}
				onChange={handleTimeChange}
			>
				{renderTrigger(value || '', '请选择时间')}
			</Picker>
		);
	}

	// -------------------------------------------------------------
	// 模式 4: mode="selector" (默认：普通下拉单选数据源)
	// -------------------------------------------------------------
	const { options = [], value, onChange, labelKey, valueKey } = props;

	const getOptionInfo = (opt: any) => {
		if (opt === null || opt === undefined) return { label: '', value: undefined, raw: opt };
		if (typeof opt === 'string' || typeof opt === 'number') {
			return { label: String(opt), value: opt, raw: opt };
		}
		const finalLabelKey = labelKey || (opt.name !== undefined ? 'name' : 'label');
		const finalValueKey = valueKey || (opt.id !== undefined ? 'id' : 'value');
		return {
			label: opt[finalLabelKey] !== undefined ? String(opt[finalLabelKey]) : String(opt.label ?? ''),
			value: opt[finalValueKey] !== undefined ? opt[finalValueKey] : opt.value,
			raw: opt,
		};
	};

	const { selectedIndex, displayLabel } = useMemo(() => {
		let foundIndex = -1;
		let foundLabel = '';

		for (let i = 0; i < options.length; i++) {
			const info = getOptionInfo(options[i]);
			if (info.value === value) {
				foundIndex = i;
				foundLabel = info.label;
				break;
			}
		}

		return {
			selectedIndex: foundIndex,
			displayLabel: foundLabel,
		};
	}, [options, value, labelKey, valueKey]);

	const pickerRange = useMemo(() => {
		return options.map((opt) => getOptionInfo(opt).label);
	}, [options, labelKey]);

	const handleSelectorChange = (e: any) => {
		const idx = Number(e.detail.value);
		const target = options[idx];
		if (target !== undefined) {
			const info = getOptionInfo(target);
			onChange?.(info.value, target as T);
		}
	};

	return (
		<Picker
			mode="selector"
			range={pickerRange}
			value={selectedIndex >= 0 ? selectedIndex : 0}
			disabled={disabled}
			onChange={handleSelectorChange}
		>
			{renderTrigger(displayLabel, '请点击选择')}
		</Picker>
	);
}

// ---------------------------------------------------------
// 省市区处理子组件 (支持 fromLocal 本地与原生 region 模式)
// ---------------------------------------------------------
function LocalOrNativeRegionSelect({
	value,
	fromLocal = true,
	onChange,
	disabled = false,
	renderTrigger,
}: RegionModeProps & {
	renderTrigger: (displayLabel: string, defaultPlaceholder: string) => ReactNode;
}) {
	const [indexes, setIndexes] = useState<[number, number, number]>([0, 0, 0]);

	// 解析传入的 value 对应的显示文字
	const displayRegionText = useMemo(() => {
		if (Array.isArray(value)) {
			// 如果是 codes 数组，尝试从 PCA_DATA 反查 name
			const isCodes = value.some((v) => /^\d+$/.test(String(v)));
			if (isCodes) {
				const p = PCA_DATA.find((item) => item.code === value[0]);
				const c = p?.children?.find((item) => item.code === value[1]);
				const d = c?.children?.find((item) => item.code === value[2]);
				if (p && c && d) return `${p.name} ${c.name} ${d.name}`;
			}
			return value.filter(Boolean).join(' ');
		}
		return value || '';
	}, [value]);

	// 本地 PCA 数据模式 (多列联动)
	if (fromLocal) {
		const cols = useMemo(() => {
			const provinces = PCA_DATA;
			const cities = PCA_DATA[indexes[0]]?.children || [];
			const districts = cities[indexes[1]]?.children || [];
			return [provinces.map((p) => p.name), cities.map((c) => c.name), districts.map((d) => d.name)];
		}, [indexes]);

		const handleColumnChange: PickerMultiSelectorProps['onColumnChange'] = (e) => {
			const { column, value: val } = e.detail;
			setIndexes((prev) => {
				const next: [number, number, number] = [...prev] as [number, number, number];
				next[column] = val;
				if (column === 0) {
					next[1] = 0;
					next[2] = 0;
				}
				if (column === 1) {
					next[2] = 0;
				}
				return next;
			});
		};

		const handleChange: PickerMultiSelectorProps['onChange'] = (e) => {
			const [pIdx, cIdx, dIdx] = e.detail.value as [number, number, number];
			const province = PCA_DATA[pIdx];
			const city = PCA_DATA[pIdx]?.children?.[cIdx];
			const district = PCA_DATA[pIdx]?.children?.[cIdx]?.children?.[dIdx];

			if (!province || !city || !district) return;

			onChange?.({
				province: { code: province.code, name: province.name },
				city: { code: city.code, name: city.name },
				district: { code: district.code, name: district.name },
				area: { code: district.code, name: district.name },
				rawCodes: [province.code, city.code, district.code],
				rawNames: [province.name, city.name, district.name],
			});
		};

		useEffect(() => {
			if (!value) return;
			const valArr = Array.isArray(value) ? value : value.split(' ');
			if (valArr.length < 3) return;

			const findIdx = (list: PcaNode[], val: string) => {
				let idx = list.findIndex((item) => item.code === val);
				if (idx === -1) idx = list.findIndex((item) => item.name === val);
				return idx === -1 ? 0 : idx;
			};

			const pIdx = findIdx(PCA_DATA, valArr[0]);
			const cities = PCA_DATA[pIdx]?.children || [];
			const cIdx = findIdx(cities, valArr[1]);
			const districts = cities[cIdx]?.children || [];
			const dIdx = findIdx(districts, valArr[2]);
			setIndexes([pIdx, cIdx, dIdx]);
		}, [value]);

		return (
			<Picker
				mode="multiSelector"
				range={cols}
				value={indexes}
				onColumnChange={handleColumnChange}
				onChange={handleChange}
				disabled={disabled}
			>
				{renderTrigger(displayRegionText, '请选择所在地区')}
			</Picker>
		);
	}

	// 微信原生 region 模式
	const handleNativeRegionChange: PickerRegionProps['onChange'] = (e) => {
		const names = e.detail.value;
		const codes = e.detail.code;
		if (codes && codes.length >= 3) {
			onChange?.({
				province: { code: codes[0], name: names[0] },
				city: { code: codes[1], name: names[1] },
				district: { code: codes[2], name: names[2] },
				area: { code: codes[2], name: names[2] },
				rawCodes: codes,
				rawNames: names,
			});
		}
	};

	return (
		<Picker
			mode="region"
			value={Array.isArray(value) ? value : []}
			disabled={disabled}
			onChange={handleNativeRegionChange}
		>
			{renderTrigger(displayRegionText, '请选择所在地区')}
		</Picker>
	);
}
