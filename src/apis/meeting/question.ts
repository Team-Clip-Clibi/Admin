import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";
import { SliceResponse } from "@/apis/common/SliceResponse";
import { QuestionInfoDto, CreateQuestionDto, QuestionListParams, MatchingQuestionInfoDto, MatchingQuestionListParams } from "./questionType";
  
  // 질문지 관련 API 함수들
    export const getQuestionList = async (params: QuestionListParams): Promise<SliceResponse<QuestionInfoDto>> => {
    const { page } = params;
    
    const url = `${API_ENDPOINTS.QUESTION.QUESTION}/${page}`;
    const response = await callApi(url, "GET");
    
    return response.json() as Promise<SliceResponse<QuestionInfoDto>>;
  };

  export const createOneThingQuestion = async (createQuestionDto: CreateQuestionDto): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.QUESTION.ONE_THING, "POST", createQuestionDto);
    if (!response.ok) {
      throw new Error('질문지 생성에 실패했습니다.');
    }
  };

  export const createRandomQuestion = async (createQuestionDto: CreateQuestionDto): Promise<void> => {
    const response = await callApi(API_ENDPOINTS.QUESTION.RANDOM, "POST", createQuestionDto);
    if (!response.ok) {
      throw new Error('질문지 생성에 실패했습니다.');
    }
  };

  export const getOneThingMatchingQuestionList = async (params: MatchingQuestionListParams): Promise<SliceResponse<MatchingQuestionInfoDto>> => {
    const { page, hasQuestion } = params;

    const queryParams = new URLSearchParams({
      hasQuestion: hasQuestion.toString()
    });

    const url = `${API_ENDPOINTS.QUESTION.ONE_THING}/${page}?${queryParams.toString()}`;
    const response = await callApi(url, "GET");
    return response.json() as Promise<SliceResponse<MatchingQuestionInfoDto>>;
  };

  export const getRandomMatchingQuestionList = async (params: MatchingQuestionListParams): Promise<SliceResponse<MatchingQuestionInfoDto>> => {
    const { page, hasQuestion } = params;

    const queryParams = new URLSearchParams({
      hasQuestion: hasQuestion.toString()
    });

    const url = `${API_ENDPOINTS.QUESTION.RANDOM}/${page}?${queryParams.toString()}`;
    const response = await callApi(url, "GET");
    return response.json() as Promise<SliceResponse<MatchingQuestionInfoDto>>;
  };  

  export const updateQuestion = async (id: number, questionInfoDto: QuestionInfoDto): Promise<void> => {
    const response = await callApi(`${API_ENDPOINTS.QUESTION.QUESTION}/${id}`, "PATCH", questionInfoDto);
    if (!response.ok) {
      throw new Error('질문지 수정에 실패했습니다.');
    }
  };

