import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getQuestionList, createOneThingQuestion, getOneThingMatchingQuestionList, getRandomMatchingQuestionList, createRandomQuestion, updateQuestion } from '@/apis/meeting/question';
import { CreateQuestionDto, QuestionInfoDto, QuestionListParams, MatchingQuestionListParams } from '@/apis/meeting/questionType';
import { MatchingType } from '@/apis/meeting/meetingType';

// 질문지 리스트 조회
export const useQuestionList = (params: QuestionListParams) => {
  return useQuery({
    queryKey: ['questionList', params],
    queryFn: () => getQuestionList(params),
    enabled: params.page !== undefined,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createQuestionDto: CreateQuestionDto) => createOneThingQuestion(createQuestionDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionList'] });
    },
    onError: (error) => {
      console.error('질문지 생성 실패:', error);
    },
  });
};

// 원띵 질문지 생성
export const useCreateOneThingQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createQuestionDto: CreateQuestionDto) => createOneThingQuestion(createQuestionDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionList'] });
      queryClient.invalidateQueries({ queryKey: ['oneThingMatchingQuestionList'] });
    },
    onError: (error) => {
      console.error('원띵 질문지 생성 실패:', error);
    },
  });
};

// 랜덤 질문지 생성
export const useCreateRandomQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createQuestionDto: CreateQuestionDto) => createRandomQuestion(createQuestionDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionList'] });
      queryClient.invalidateQueries({ queryKey: ['randomMatchingQuestionList'] });
    },
    onError: (error) => {
      console.error('랜덤 질문지 생성 실패:', error);
    },
  });
};

export const useOneThingMatchingQuestionList = (params: MatchingQuestionListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['oneThingMatchingQuestionList', params],
    queryFn: () => getOneThingMatchingQuestionList(params),
    enabled: options?.enabled !== false && params.page !== undefined,
  });
};

export const useRandomMatchingQuestionList = (params: MatchingQuestionListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['randomMatchingQuestionList', params],
    queryFn: () => getRandomMatchingQuestionList(params),
    enabled: options?.enabled !== false && params.page !== undefined,
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, questionInfoDto }: { id: number; questionInfoDto: QuestionInfoDto }) => 
      updateQuestion(id, questionInfoDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionList'] });
    },
    onError: (error) => {
      console.error('질문지 수정 실패:', error);
    },
  });
};