import { assignParticipant, deleteParticipant, getAssignedList, getUnAssignedList } from '@/apis/application/application';
import { AssignParticipantParams, RegisterOnethingParticipantDto, UnAssignedListParams } from '@/apis/application/applicationType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const useUnAssignedList = (params: UnAssignedListParams) => {
    return useQuery({
        queryKey: ['unAssignedList', params.page, params.date, params.onethingDistrict],
        queryFn: () => getUnAssignedList(params),
        enabled: !!params.date && !!params.onethingDistrict,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useAssignedList = (params: AssignParticipantParams) => {
    return useQuery({
        queryKey: ['assignedList', params.page, params.onethingMatchingId],
        queryFn: () => getAssignedList(params),
        enabled: !!params.onethingMatchingId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useAssignParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (registerOnethingParticipantDto: RegisterOnethingParticipantDto) => assignParticipant(registerOnethingParticipantDto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unAssignedList'] });
            queryClient.invalidateQueries({ queryKey: ['assignedList'] });
        }, 
        onError: (error) => {
            console.error('참가자 배정 실패:', error);
        },
    });
};

export const useDeleteParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userOnethingMatchingId: number) => deleteParticipant(userOnethingMatchingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unAssignedList'] });
            queryClient.invalidateQueries({ queryKey: ['assignedList'] });
        },
        onError: (error) => {
            console.error('참가자 삭제 실패:', error);
        },
    });
};



