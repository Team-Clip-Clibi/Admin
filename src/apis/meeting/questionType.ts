
export interface QuestionInfoDto {
  id: number;
  title: string;
  questions: string[];
}

export class CreateQuestionDto {
  constructor(
    public meetingIds: number[],
    public questions: string[],
    public title: string
  ) {}
}

export interface MatchingQuestionInfoDto{
  matchingId: number;
  restaurantName: string;
  address: string;
  dateTime: string;
  matchingType: MatchingType;
}

export enum MatchingType {
  ONETHING = "ONETHING",
  RANDOM = "RANDOM"
}

export const getMatchingTypeKorean = (matchingType: MatchingType): string => {
  switch (matchingType) {
    case MatchingType.ONETHING:
      return "원띵";
    case MatchingType.RANDOM:
      return "랜덤";
    default:
      return "알 수 없음";
  }
};

export interface QuestionListParams {
  page: number;
}

export interface MatchingQuestionListParams {
  page: number;
  hasQuestion: boolean;
}

export enum OnethingDistrict {
  GANGNAM = "GANGNAM",
  HONGDAE_HAPJEONG = "HONGDAE_HAPJEONG"
}

export enum RandomDistrict {
  GANGNAM = "GANGNAM",
  HONGDAE_HAPJEONG = "HONGDAE_HAPJEONG"
}

export const getOneThingDistrictKorean = (district: OnethingDistrict): string => {
  switch (district) {
    case OnethingDistrict.GANGNAM:
      return "강남";
    case OnethingDistrict.HONGDAE_HAPJEONG:
      return "홍대/합정";
    default:
      return "알 수 없음";
  }
};
