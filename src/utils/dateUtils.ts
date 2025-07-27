/**
 * LocalDateTime 문자열을 한국어 형식으로 변환
 * @param dateTimeString - "2025-03-27T12:00:00" 형식의 문자열
 * @returns "2025.03.27 12:00" 형식의 문자열
 */
export const formatLocalDateTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    
    // 유효하지 않은 날짜인 경우
    if (isNaN(date.getTime())) {
      return dateTimeString; // 원본 반환
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('날짜 변환 실패:', error);
    return dateTimeString; // 에러 시 원본 반환
  }
};

/**
 * LocalDateTime 문자열을 상대적 시간으로 변환 (예: "3분 전", "1시간 전")
 * @param dateTimeString - "2025-03-27T12:00:00" 형식의 문자열
 * @returns 상대적 시간 문자열
 */
export const formatRelativeTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return dateTimeString;
    }

    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return formatLocalDateTime(dateTimeString);
    }
  } catch (error) {
    console.error('상대적 시간 변환 실패:', error);
    return dateTimeString;
  }
};

/**
 * LocalDateTime 문자열을 다양한 형식으로 변환
 * @param dateTimeString - "2025-03-27T12:00:00" 형식의 문자열
 * @param format - 'full' | 'date' | 'time' | 'relative'
 * @returns 포맷된 문자열
 */
export const formatDateTime = (
  dateTimeString: string, 
  format: 'full' | 'date' | 'time' | 'relative' = 'full'
): string => {
  try {
    const date = new Date(dateTimeString);
    
    if (isNaN(date.getTime())) {
      return dateTimeString;
    }

    switch (format) {
      case 'date':
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
      
      case 'time':
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      
      case 'relative':
        return formatRelativeTime(dateTimeString);
      
      case 'full':
      default:
        return formatLocalDateTime(dateTimeString);
    }
  } catch (error) {
    console.error('날짜 포맷 변환 실패:', error);
    return dateTimeString;
  }
}; 