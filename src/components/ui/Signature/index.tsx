import { useState, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Canvas, Text } from '@tarojs/components';
import { Button } from '../Button';
import { cn } from '@/utils/common';

export interface SignatureProps {
	/** 确认签名并导出后的回调 (返回本地临时文件路径 tempFilePath) */
	onConfirm?: (tempFilePath: string) => void;
	/** 清空签名回调 */
	onClear?: () => void;
	/** 笔触颜色，默认 '#000000' */
	strokeColor?: string;
	/** 笔触粗细，默认 3 */
	strokeWidth?: number;
	/** 画板占位背景提示文案 */
	placeholder?: string;
	/** 画板高度 (rpx 或 px，默认 200) */
	height?: number;
	/** 是否展示内置的操作按钮栏（重写 / 确认），默认 true */
	showActions?: boolean;
	/** 是否禁用 */
	disabled?: boolean;
	/** 自定义类名 */
	className?: string;
}

/**
 * Signature 亲笔手写签名画板组件
 * 基于微信原生 Canvas 2D 高清绘制，0 外部依赖，支持平滑笔触、防空白拦截、透明 PNG 导出
 */
export function Signature({
	onConfirm,
	onClear,
	strokeColor = '#000000',
	strokeWidth = 3,
	placeholder = '请在此框体内端正书写您的亲笔签名',
	height = 200,
	showActions = true,
	disabled = false,
	className,
}: SignatureProps) {
	const [hasDrawn, setHasDrawn] = useState(false);
	const [canvasId] = useState(() => `sign_canvas_${Math.random().toString(36).slice(2, 9)}`);
	const canvasRef = useRef<any>(null);
	const ctxRef = useRef<any>(null);
	const isDrawingRef = useRef(false);

	// 初始化 Canvas 2D 上下文
	const initCanvas = () => {
		const query = Taro.createSelectorQuery();
		query
			.select(`#${canvasId}`)
			.fields({ node: true, size: true })
			.exec((res) => {
				if (!res[0] || !res[0].node) return;
				const canvas = res[0].node;
				const ctx = canvas.getContext('2d');
				const dpr = Taro.getSystemInfoSync().pixelRatio || 2;

				canvas.width = res[0].width * dpr;
				canvas.height = res[0].height * dpr;
				ctx.scale(dpr, dpr);
				ctx.strokeStyle = strokeColor;
				ctx.lineWidth = strokeWidth;
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';

				canvasRef.current = canvas;
				ctxRef.current = ctx;
			});
	};

	useEffect(() => {
		// 稍微延时确保 DOM 节点挂载完毕
		const timer = setTimeout(initCanvas, 150);
		return () => clearTimeout(timer);
	}, [canvasId]);

	// 触摸开始
	const handleTouchStart = (e: any) => {
		if (disabled || !ctxRef.current) return;
		isDrawingRef.current = true;
		const touch = e.touches[0];
		ctxRef.current.beginPath();
		ctxRef.current.moveTo(touch.x, touch.y);
	};

	// 触摸移动（连续画线）
	const handleTouchMove = (e: any) => {
		if (disabled || !isDrawingRef.current || !ctxRef.current) return;
		const touch = e.touches[0];
		ctxRef.current.lineTo(touch.x, touch.y);
		ctxRef.current.stroke();
		if (!hasDrawn) {
			setHasDrawn(true);
		}
	};

	// 触摸结束
	const handleTouchEnd = () => {
		if (disabled || !ctxRef.current) return;
		isDrawingRef.current = false;
		ctxRef.current.closePath();
	};

	// 清空画板
	const handleClear = () => {
		if (!canvasRef.current || !ctxRef.current) return;
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		const dpr = Taro.getSystemInfoSync().pixelRatio || 2;
		ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
		setHasDrawn(false);
		onClear?.();
	};

	// 确认签名并导出
	const handleConfirm = () => {
		if (!hasDrawn) {
			Taro.showToast({ title: '请先完成亲笔签名', icon: 'none' });
			return;
		}

		if (!canvasRef.current) return;

		Taro.canvasToTempFilePath({
			canvas: canvasRef.current,
			fileType: 'png',
			quality: 1,
			success: (res) => {
				onConfirm?.(res.tempFilePath);
			},
			fail: (err) => {
				console.error('签名图片导出失败', err);
				Taro.showToast({ title: '签名导出失败，请重试', icon: 'none' });
			},
		});
	};

	return (
		<View className={cn('flex flex-col gap-3 w-full', className)}>
			{/* Canvas 签名画板容器 */}
			<View
				className={cn(
					'relative w-full rounded-card border border-dashed border-gray-300 bg-gray-50/80 overflow-hidden transition-all',
					disabled && 'opacity-60 pointer-events-none',
				)}
				style={{ height: `${height}px` }}
			>
				{/* 背景引导水印 */}
				{!hasDrawn && (
					<View className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-text-muted/40 gap-1.5">
						<View className="icon-[ph--pencil-line-duotone] size-6" />
						<Text className="text-xs tracking-wider">{placeholder}</Text>
					</View>
				)}

				{/* 真实 Canvas 画布 (disableScroll 阻止绘制时页面上下晃动) */}
				<Canvas
					id={canvasId}
					type="2d"
					className="w-full h-full"
					disableScroll
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				/>
			</View>

			{/* 底部操作工具栏 */}
			{showActions && (
				<View className="flex items-center justify-between pt-1">
					<Button
						size="sm"
						variant="outline"
						className="px-4 text-xs"
						onClick={handleClear}
						disabled={disabled || !hasDrawn}
					>
						<View className="icon-[ph--arrow-counter-clockwise] size-3.5 mr-1" />
						清空重写
					</Button>

					<Button
						size="sm"
						variant="primary"
						className="px-6 text-xs font-bold"
						onClick={handleConfirm}
						disabled={disabled}
					>
						<View className="icon-[ph--check-bold] size-3.5 mr-1" />
						确认签名
					</Button>
				</View>
			)}
		</View>
	);
}
