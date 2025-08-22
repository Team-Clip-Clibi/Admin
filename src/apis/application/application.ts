import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";
import { SliceResponse } from "@/apis/common/SliceResponse";
import { ParticipantInfoDto, UnAssignedListParams, AssignParticipantParams, RegisterOnethingParticipantDto } from "./applicationType";

export const getUnAssignedList = async (params: UnAssignedListParams): Promise<SliceResponse<ParticipantInfoDto>> => {
    const { page, date, onethingDistrict } = params;

    const queryParams = new URLSearchParams({
        date: date,
        onethingDistrict: onethingDistrict
    });

    const url = `${API_ENDPOINTS.APPLICATION.UNASSIGNED}/${page}?${queryParams.toString()}`;
    const response = await callApi(url, "GET");
    return response.json() as Promise<SliceResponse<ParticipantInfoDto>>;
};

export const getAssignedList = async (params: AssignParticipantParams): Promise<SliceResponse<ParticipantInfoDto>> => {
    const { page, onethingMatchingId } = params;

    const queryParams = new URLSearchParams({
        onethingMatchingId: onethingMatchingId.toString()
    });

    const url = `${API_ENDPOINTS.APPLICATION.ASSIGNED}/${page}?${queryParams.toString()}`;
    const response = await callApi(url, "GET");
    return response.json() as Promise<SliceResponse<ParticipantInfoDto>>;
};

export const assignParticipant = async (registerOnethingParticipantDto: RegisterOnethingParticipantDto): Promise<void> => {
    const url = `${API_ENDPOINTS.APPLICATION.PARTICIPANT}`;
    const response = await callApi(url, "PATCH", registerOnethingParticipantDto);
    
    if (response.status === 204 || response.status === 200) {
        return; 
    }
    
    try {
        const responseText = await response.text();
        if (responseText) {
            return JSON.parse(responseText);
        }
        return;
    } catch (error) {
        return;
    }
};

export const deleteParticipant = async (userOnethingMatchingId: number): Promise<void> => {
    const url = `${API_ENDPOINTS.APPLICATION.ASSIGNED}/${userOnethingMatchingId}`;
    const response = await callApi(url, "DELETE");

    if (response.status === 204 || response.status === 200) {
        return; 
    }

    try {
        const responseText = await response.text();
        if (responseText) {
            return JSON.parse(responseText);
        }
        return;
    } catch (error) {
        return;
    }
};

