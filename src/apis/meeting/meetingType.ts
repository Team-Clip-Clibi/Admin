export interface MatchingInfoDto {
  matchingId: number;
  restaurantName: string;
  address: string;
  dateTime: string;
  matchingType: MatchingType;
  participantCnt: number;
  onethingKeyword: OnethingKeyword;
}

export class CreateOneThingDto {
  constructor(
    public onethingDistrict: OnethingDistrict,
    public restaurantName: string,
    public address: string,
    public dateTime: string
  ) {}
}

export class CreateRandomMeetingDto {
  constructor(
    public randomDistrict: RandomDistrict,
    public restaurantName: string,
    public address: string,
    public dateTime: string
  ) {}
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

export enum OnethingKeyword {
  HEALTH = "HEALTH",
  MONEY = "MONEY",
  LIFE = "LIFE",
  LOVE = "LOVE",
  SELF_DEVELOPMENT = "SELF_DEVELOPMENT",
  JOB = "JOB",
  HOBBY = "HOBBY"
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

export const getRandomDistrictKorean = (district: RandomDistrict): string => {
  switch (district) {
    case RandomDistrict.GANGNAM:
      return "강남";
    case RandomDistrict.HONGDAE_HAPJEONG:
      return "홍대/합정";
    default:
      return "알 수 없음";
  }
};

export interface OneThingListParams {
  page: number;
  date: string;
  district: OnethingDistrict;
}

export interface RandomMeetingListParams {
  page: number;
  date: string;
  district: RandomDistrict;
}