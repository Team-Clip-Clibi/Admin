import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelOneThingMeeting, cancelRandomMeeting, createOneThing, createRandom, deleteOneThingMeeting, deleteRandomMeeting, getOneThingList, getRandomMeetingList } from '@/apis/meeting/meeting';
import { CreateOneThingDto, CreateRandomMeetingDto, OneThingListParams, RandomMeetingListParams } from '@/apis/meeting/meetingType';

// 원띵 모임 리스트 조회
export const useOneThingList = (params: OneThingListParams) => {
    return useQuery({
      queryKey: ['oneThingList', params.district, params.page, params.date],
      queryFn: () => getOneThingList(params),
      enabled: !!params.district, // district만 있으면 활성화
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh하게 유지
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    });
  };

  export const useRandomMeetingList = (params: RandomMeetingListParams) => {
    return useQuery({
      queryKey: ['randomMeetingList', params],
      queryFn: () => getRandomMeetingList(params),
      enabled: !!params.district,
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh하게 유지
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    });
  };

  export const useCreateOneThing = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (createOneThingDto: CreateOneThingDto) => createOneThing(createOneThingDto),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['oneThingList'] });
      },
      onError: (error) => {
        console.error('원띵 모임 생성 실패:', error);
      },
    });
  };

  export const useCreateRandomMeeting = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (createRandomMeetingDto: CreateRandomMeetingDto) => createRandom(createRandomMeetingDto),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['randomMeetingList'] });
      },
      onError: (error) => {
        console.error('랜덤 모임 생성 실패:', error);
      },
    });
  }

  export const useDeleteOneThing = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => deleteOneThingMeeting(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['oneThingList'] });
      },
      onError: (error) => {
        console.error('원띵 모임 삭제 실패:', error);
      },
    });
  };

  export const useDeleteRandom = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => deleteRandomMeeting(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['randomMeetingList'] });
      },
      onError: (error) => {
        console.error('랜덤 모임 삭제 실패:', error);
      },
    });
  };

  export const useCancelOneThing = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => cancelOneThingMeeting(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['oneThingList'] });
      },
      onError: (error) => {
        console.error('원띵 모임 취소 실패:', error);
      },
    });
  };

  export const useCancelRandom = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => cancelRandomMeeting(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['randomMeetingList'] });
      },
      onError: (error) => {
        console.error('랜덤 모임 취소 실패:', error);
      },
    });
  };