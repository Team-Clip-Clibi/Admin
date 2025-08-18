/**
 * 페이징 옵션
 */
export interface PaginationOptions {
  initialPage?: number;
  maxVisiblePages?: number;
}

/**
 * 페이징 핸들러들
 */
export interface PaginationHandlers {
  goToPage: (page: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  resetToFirstPage: () => void;
}

/**
 * 페이징 상태
 */
export interface PaginationState {
  currentPage: number;
  pageNumbers: number[];
  isFirstPage: boolean;
  isLastPage: boolean;
  showEllipsisAfter: boolean;
  showLastPage: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
}


export interface PaginationProps {
  // SliceUtils에서 제공하는 정보들
  sliceUtils: {
    currentPage: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    shouldShowPagination: boolean;
  };
  
  // 페이지네이션 UI 상태
  paginationState: {
    pageNumbers: number[];
    totalPages: number;
    showEllipsisAfter: boolean;
    showLastPage: boolean;
  };
  
  // 이벤트 핸들러
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  
  // 스타일링
  className?: string;
}
