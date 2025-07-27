import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";
import { BannerInfo, NoticeInfo } from "./informationType";

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
