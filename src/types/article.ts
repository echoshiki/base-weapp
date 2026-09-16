/**
 * 文章/帮助文档实体
 */
export interface ArticleItem {
	/** 文章 ID */
	articleId: number;
	/** 文章标题 */
	title: string;
	/** 文章宣传封面图片路径 */
	imgPath: string;
	/** 作者 */
	author: string;
	/** 摘要文案 */
	summary: string;
	/** 文章正文内容 (支持富文本 HTML 或纯文本) */
	content: string;
	/** 创建时间 */
	createTime: string;
}
