const VALIDATION_ERROR_MESSAGES = {
  required: "이 필드는 필수입니다.",
  minLength: (min: number) => `최소 ${min}자 이상 입력해야 합니다.`,
  maxLength: (max: number) => `최대 ${max}자까지 입력할 수 있습니다.`,
  invalidImage: ".svg 포맷의 이미지만 업로드가 가능합니다.",
};

export default VALIDATION_ERROR_MESSAGES;
