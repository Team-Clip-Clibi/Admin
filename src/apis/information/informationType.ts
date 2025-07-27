export type BannerInfo = {
    no: number;
    exposureDate: string;
    text: string;
}

export type NoticeInfo = {
    no: number;
    text: string;
    noticeType: NoticeType;
    exposureDate: string;
}

export enum NoticeType {
    NOTICE = "NOTICE",
    ARTICLE = "ARTICLE",
}

export const getNoticeTypeKorean = (noticeType: NoticeType): string => {
    switch (noticeType) {
        case NoticeType.NOTICE:
            return "공지사항";
        case NoticeType.ARTICLE:
            return "새소식";
        default:
            return "알 수 없음";
    }
};


