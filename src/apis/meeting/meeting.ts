import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";
import { SliceResponse } from "@/apis/common/SliceResponse";
import { MatchingInfoDto, OneThingListParams, RandomMeetingListParams, CreateOneThingDto, CreateRandomMeetingDto } from "./meetingType";

// 원띵 모임 리스트 조회
export const getOneThingList = async (params: OneThingListParams): Promise<SliceResponse<MatchingInfoDto>> => {
    const { page, date, district } = params;
    
    // Query parameter를 URL에 직접 추가
    const queryParams = new URLSearchParams({
      date: date,
      district: district
    });
    
    const url = `${API_ENDPOINTS.MEETING.ONE_THING_LIST}/${page}?${queryParams.toString()}`;
    const response = await callApi(url, "GET");
    
    return response.json() as Promise<SliceResponse<MatchingInfoDto>>;
  };

  export const getRandomMeetingList = async (params: RandomMeetingListParams): Promise<SliceResponse<MatchingInfoDto>> => {
    const { page, date, district } = params;
    
    const queryParams = new URLSearchParams({
      date: date,
      district: district
    });

    const url = `${API_ENDPOINTS.MEETING.RANDOM}/${page}?${queryParams.toString()}`;
    const response = await callApi(url, "GET");
    
    return response.json() as Promise<SliceResponse<MatchingInfoDto>>;  
  }

  export const createOneThing = async (createOneThingDto: CreateOneThingDto): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.MEETING.ONE_THING, "POST", createOneThingDto);
    if (!response.ok) {
      throw new Error('원띵 모임 생성에 실패했습니다.');
    }
  }

  export const createRandom = async (createRandomMeetingDto: CreateRandomMeetingDto): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.MEETING.RANDOM, "POST", createRandomMeetingDto);
    if (!response.ok) {
      throw new Error('랜덤 모임 생성에 실패했습니다.');
    }
  }

  // 원띵 모임 삭제
  export const deleteOneThingMeeting = async (id: number): Promise<void> => {
    const response = await callApi(`${API_ENDPOINTS.MEETING.ONE_THING}/${id}`, "DELETE");
    if (!response.ok) {
      throw new Error('원띵 모임 삭제에 실패했습니다.');
    }
  }

  // 랜덤 모임 삭제
  export const deleteRandomMeeting = async (id: number): Promise<void> => {
    const response = await callApi(`${API_ENDPOINTS.MEETING.RANDOM}/${id}`, "DELETE");
    if (!response.ok) {
      throw new Error('랜덤 모임 삭제에 실패했습니다.');
    }
  }

  //원띵 모임 취소
  export const cancelOneThingMeeting = async (id: number): Promise<void> => {
    const response = await callApi(`${API_ENDPOINTS.MEETING.ONE_THING}/${id}/cancel`, "POST");
    if (!response.ok) {
      throw new Error('원띵 모임 취소에 실패했습니다.');
    }
  }

  //랜덤 모임 취소
  export const cancelRandomMeeting = async (id: number): Promise<void> => {
    const response = await callApi(`${API_ENDPOINTS.MEETING.RANDOM}/${id}/cancel`, "POST");
    if (!response.ok) {
      throw new Error('랜덤 모임 취소에 실패했습니다.');
    }
  }