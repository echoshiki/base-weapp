import { PageQuery, UploadFileItem } from './common';

/** 企业诉求列表查询参数 (GET /demand/qysq/list) */
export interface AppealListParams extends PageQuery {
	/** 综合搜索（诉求标题,详细描述,企业名称） */
	all?: string;
}

/** 企业诉求实体 (GET /demand/qysq/list & GET /demand/qysq/{requId}) */
export interface AppealItem {
	/** 诉求主键 */
	requId: string;
	/** 诉求标题 */
	title: string;
	/** 企业主键 */
	enteId?: string;
	/** 企业主键（详情接口返回字段） */
	entId?: string;
	/** 企业名称 */
	entName?: string;
	/** 诉求类别主键，多选为英文逗号分隔 */
	typeId?: string;
	/** 诉求类别名称 */
	typeName?: string;
	/** 诉求描述 */
	detail?: string;
	/** 提交时间 */
	subTime?: string;
	/** 创建时间 */
	createTime?: string;
	/** 图片文件列表 */
	imageFiles?: UploadFileItem[];
	/** 视频文件列表 */
	videoFiles?: UploadFileItem[];
	/** 附件文件列表 */
	files?: UploadFileItem[];
}

/** 诉求类别项 (GET /demand/sqlb/list1) */
export interface AppealTypeItem {
	/** 类别主键 */
	typeId: string;
	/** 类别名称 */
	typeName: string;
}

/** 新增诉求请求 (POST /enterprise/addAppeal) */
export interface AddAppealRequest {
	/** 诉求标题 */
	title: string;
	/** 诉求类别（多选时英文逗号分隔） */
	typeId: string;
	/** 诉求描述 */
	detail: string;
	/** 图片文件列表 */
	imageFiles?: UploadFileItem[];
	/** 视频文件列表 */
	videoFiles?: UploadFileItem[];
	/** 附件文件列表 */
	files?: UploadFileItem[];
}

/** 修改诉求请求 (PUT /enterprise/uploadAppeal) */
export interface UpdateAppealRequest {
	/** 诉求 id */
	requId: string;
	/** 诉求标题 */
	title: string;
	/** 诉求类别 id（多选时英文逗号分隔） */
	typeId: string;
	/** 诉求描述 */
	detail: string;
	/** 图片文件列表 */
	imageFiles?: UploadFileItem[];
	/** 视频文件列表 */
	videoFiles?: UploadFileItem[];
	/** 附件文件列表 */
	files?: UploadFileItem[];
}

/** 诉求跟踪处理状态：0 待处理，1 处理中，2 已完成 */
export type TrackingStatus = 0 | 1 | 2;

/** 诉求跟踪列表查询参数 (GET /demand/sqgz/listQySqgzVO) */
export interface AppealTrackingListParams extends PageQuery {
	/** 处理状态（0 待处理，1 处理中，2 已完成） */
	status?: TrackingStatus;
	/** 综合搜索（企业名称，标题，处理描述） */
	all?: string;
}

/** 诉求跟踪视图实体 (GET /demand/sqgz/listQySqgzVO & GET /demand/sqgz/{statusId}) */
export interface AppealTrackingItem {
	/** 跟踪主键 */
	statusId: string;
	/** 诉求主键 */
	requId: string;
	/** 企业主键 */
	entId?: string;
	/** 企业名称 */
	entName?: string;
	/** 诉求标题 */
	title: string;
	/** 诉求类别主键 */
	typeId?: string;
	/** 诉求类别名称 */
	typeName?: string;
	/** 处理状态：0 待处理，1 处理中，2 已完成 */
	status: TrackingStatus;
	/** 负责人用户主键 */
	userId?: number;
	/** 负责人 */
	userName?: string;
	/** 处理描述 / 详细信息 */
	description?: string;
	/** 诉求描述 */
	detail?: string;
	/** 创建时间 */
	createTime?: string;
}

/** 诉求跟踪记录列表项 (GET /sqgzjl/sqgzjl/list) */
export interface AppealTrackingRecord {
	/** 记录主键 */
	recordId: string;
	/** 诉求主键 */
	requId: string;
	/** 处理人，进度时间轴标题 */
	handler: string;
	/** 处理时间 */
	hTime?: string;
	/** 处理描述，进度时间轴内容 */
	hDescription: string;
}
