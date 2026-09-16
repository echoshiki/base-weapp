import { Gender } from '@/types/common';

/** 性别选项 */
export const USER_GENDER_OPTIONS: { label: '男' | '女' | '未知'; value: Gender }[] = [
	{ label: '男', value: '0' },
	{ label: '女', value: '1' },
	{ label: '未知', value: '2' },
];
