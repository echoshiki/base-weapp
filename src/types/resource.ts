import { PageQuery } from './common';

/** 链资源分类项 (GET /demand/lzyfl/list1) */
export interface ChainResourceCategoryItem {
	/** 资源分类主键 */
	zyflId: string;
	/** 资源分类名称 */
	zyflName: string;
	/** 详细说明 */
	detail?: string | null;
}

/** 链资源列表查询参数 (GET /demand/lzy/list) */
export interface ChainResourceListParams extends PageQuery {
	/** 综合搜索（资源名称，地点） */
	all?: string;
	/** 资源分类主键 */
	categoryId?: string;
}

/** 链资源实体 (GET /demand/lzy/list & GET /demand/lzy/{zyId}) */
export interface ChainResourceItem {
	/** 资源主键 */
	zyId: string;
	/** 资源名称 */
	zyName: string;
	/** 资源分类主键 */
	categoryId?: string;
	/** 资源分类主键 */
	zyflId?: string;
	/** 资源类别名称 */
	zyflName?: string;
	/** 资源描述 */
	zyDesc?: string;
	/** 配套设施 */
	zyFacility?: string;
	/** 联系人 */
	zyContact?: string;
	/** 联系方式 */
	zyPhone?: string;
	/** 资源地点 */
	zyAddress?: string;
	/** 金额 */
	zyMoney?: string;
	/** 图片地址，多张用英文逗号分隔 */
	zyPhoto?: string;
}

/** 修改链资源请求 (PUT /demand/lzy) */
export interface UpdateChainResourceRequest {
	/** 资源主键 */
	zyId?: string;
	/** 资源名称 */
	zyName?: string;
	/** 资源分类主键 */
	categoryId?: string;
	/** 资源描述 */
	zyDesc?: string;
	/** 配套设施 */
	zyFacility?: string;
	/** 联系人 */
	zyContact?: string;
	/** 联系方式 */
	zyPhone?: string;
	/** 资源地点 */
	zyAddress?: string;
	/** 金额 */
	zyMoney?: string;
	/** 图片地址，多张用英文逗号分隔 */
	zyPhoto?: string;
}

/** 政策文件列表查询参数 (GET /demand/zcwj/list) */
export interface PolicyListParams extends PageQuery {
	/** 文件标题 */
	bbTitle?: string;
}

/** 政策文件实体 (GET /demand/zcwj/list & GET /demand/zcwj/{id}) */
export interface PolicyItem {
	/** 文件主键 */
	id: number;
	/** 标题 */
	bbTitle: string;
	/** 原文链接 */
	bbcUrl?: string;
	/** 网页链接 */
	bbUrl?: string;
	/** 移动端链接 */
	phoneUrl?: string;
	/** 公开/公布日期 */
	publicdata?: string;
	/** 是否获取文件 1是 其他否 */
	haveinfo?: number;
	/** 发文字号 */
	issueCode?: string;
	/** 分类 */
	category?: string;
	/** 正文 HTML */
	nrb3?: string;
}

/** 知识科普列表查询参数 (GET /demand/zskp/list) */
export interface KnowledgeListParams extends PageQuery {
	/** 标题关键字 */
	title?: string;
}

/** 知识科普实体 (GET /demand/zskp/list & GET /demand/zskp/{articleId}) */
export interface KnowledgeItem {
	/** 文章主键 */
	articleId: string;
	/** 标题 */
	title: string;
	/** 正文 */
	content: string;
	/** 版本号 */
	verNum?: string;
}

/** 首页轮播与统计数据项 (GET /demand/home/list) */
export interface HomeDataItem {
	/** 轮播图（, 号分隔） */
	homePhoto: string;
	/** 内容 */
	total: string;
}
