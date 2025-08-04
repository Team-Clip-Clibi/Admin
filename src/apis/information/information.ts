import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";
import { BannerInfo, HomeBannerInfoRequest, ImageUploadInfo, LoginBannerInfoRequest, NoticeInfo, NoticeInfoRequest } from "./informationType";

export const getLoginBannerInfo = async (): Promise<BannerInfo[]> => {
    const res = await callApi(API_ENDPOINTS.INFORMATION.LOGIN_BANNER, "GET");
    return res.json() as Promise<BannerInfo[]>;
}

export const getHomeBannerInfo = async (): Promise<BannerInfo[]> => {
    const res = await callApi(API_ENDPOINTS.INFORMATION.HOME_BANNER, "GET");
    return res.json() as Promise<BannerInfo[]>;
}

export const getNoticeInfo = async (): Promise<NoticeInfo[]> => {
    const res = await callApi(API_ENDPOINTS.INFORMATION.NOTICE, "GET");
    return res.json() as Promise<NoticeInfo[]>;
}

export const deleteLoginBanner = async (id: number): Promise<Response> => {
    return callApi(API_ENDPOINTS.INFORMATION.DELETE_LOGIN_BANNER(id), "DELETE");
}

export const deleteHomeBanner = async (id: number): Promise<Response> => {
    return callApi(API_ENDPOINTS.INFORMATION.DELETE_HOME_BANNER(id), "DELETE");
}

export const deleteNotice = async (id: number): Promise<Response> => {
    return callApi(API_ENDPOINTS.INFORMATION.DELETE_NOTICE(id), "DELETE");
}

export const createNotice = async (noticeInfo: NoticeInfoRequest): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.INFORMATION.NOTICE, "POST", noticeInfo);
    if (!response.ok) {
        throw new Error('공지 생성에 실패했습니다.');
    }
}

export const getUploadUrl = async (): Promise<ImageUploadInfo> => {
    const res = await callApi(API_ENDPOINTS.INFORMATION.UPLOAD_URL, "GET");
    return res.json() as Promise<ImageUploadInfo>;
}

export const createHomeBanner = async (homeBannerInfoRequest: HomeBannerInfoRequest): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.INFORMATION.HOME_BANNER, "POST", homeBannerInfoRequest);
    if (!response.ok) {
        throw new Error('홈 배너 생성에 실패했습니다.');
    }
}

export const createLoginBanner = async (loginBannerInfoRequest: LoginBannerInfoRequest): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.INFORMATION.LOGIN_BANNER, "POST", loginBannerInfoRequest);
    if (!response.ok) {
        throw new Error('로그인 배너 생성에 실패했습니다.');
    }
}