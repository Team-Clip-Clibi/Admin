export type BannerInfo = {
    no: number;
    exposureDate: string;
    text: string;
}

export class LoginBannerInfoRequest {
    constructor(
        public text: string,
        public exposureDate: string,
        public imgName : string,
    ) {}

    // 유효성 검사
    validate(): boolean {
        return this.text.trim().length > 0 && 
               this.exposureDate.length > 0;
    }
}


export type NoticeInfo = {
    no: number;
    text: string;
    noticeType: NoticeType;
    exposureDate: string;
}

export class NoticeInfoRequest {
    constructor(
        public text: string,
        public noticeType: NoticeType,
        public exposureDate: string
    ) {}

    // 유효성 검사
    validate(): boolean {
        return this.text.trim().length > 0 && 
               this.exposureDate.length > 0;
    }
}

export type ImageUploadInfo =  {
    imgName : string;
    preSignedUrl : string;
}

export class HomeBannerInfoRequest {
    constructor(
        public imgName : string,
        public exposureDate: string,
    ) {}
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


