export interface ParticipantInfoDto {
  userOnethingMatchingId: number;
  nickname: string;
  phoneNumber: string;
  dietaryOption: string;
  onethingKeyword: OnethingKeyword;
  job: JobCategory;
  language: string;
  preferredDateList: PreferredDate[];
  onethingTopic: string;
  assignedRestaurantName: string;
}

export interface PreferredDate {
  date: string;
  timeSlot: OneThingTimeSlot;
}

export enum OneThingTimeSlot {
  DINNER = "DINNER"
}

export const getOneThingTimeSlotKorean = (timeSlot: OneThingTimeSlot): string => {
  const koreanMap = {
    [OneThingTimeSlot.DINNER]: "저녁"
  };
  return koreanMap[timeSlot] || timeSlot;
};
export interface UnAssignedListParams {
    page: number;
    date: string;
    onethingDistrict: OnethingDistrict;
}

export interface AssignParticipantParams {
    page: number;
    onethingMatchingId: number;
}

export enum OnethingDistrict {
    GANGNAM = "GANGNAM",
    HONGDAE_HAPJEONG = "HONGDAE_HAPJEONG"
  }

export enum OnethingKeyword {
  HEALTH = "HEALTH",
  MONEY = "MONEY",
  LIFE = "LIFE",
  LOVE = "LOVE",
  SELF_DEVELOPMENT = "SELF_DEVELOPMENT",
  JOB = "JOB",
  HOBBY = "HOBBY"
}

export enum JobCategory {
  STUDENT = "STUDENT",
  MANUFACTURING = "MANUFACTURING",
  MEDICAL = "MEDICAL",
  ART = "ART",
  IT = "IT",
  SERVICE = "SERVICE",
  SALES = "SALES",
  BUSINESS = "BUSINESS",
  POLITICS = "POLITICS",
  ETC = "ETC"
}

export const getOnethingKeywordKorean = (keyword: OnethingKeyword): string => {
  const koreanMap = {
    [OnethingKeyword.HEALTH]: "건강",
    [OnethingKeyword.MONEY]: "돈",
    [OnethingKeyword.LIFE]: "인생",
    [OnethingKeyword.LOVE]: "사랑",
    [OnethingKeyword.SELF_DEVELOPMENT]: "자기계발",
    [OnethingKeyword.JOB]: "직업",
    [OnethingKeyword.HOBBY]: "취미"
  };
  return koreanMap[keyword] || keyword;
};

export const getJobCategoryKorean = (job: JobCategory): string => {
  const koreanMap = {
    [JobCategory.STUDENT]: "학생",
    [JobCategory.MANUFACTURING]: "제조업",
    [JobCategory.MEDICAL]: "의료업",
    [JobCategory.ART]: "예술",
    [JobCategory.IT]: "IT업",
    [JobCategory.SERVICE]: "서비스업",
    [JobCategory.SALES]: "영업",
    [JobCategory.BUSINESS]: "사업",
    [JobCategory.POLITICS]: "정치",
    [JobCategory.ETC]: "기타"
  };
  return koreanMap[job] || job;
}; 

export class RegisterOnethingParticipantDto {
    constructor(
        public onethingMatchingId: number,
        public userOnethingMatchingIdList: number[]
    ) {}
}