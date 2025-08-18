import { useMemo } from 'react';
import { SliceResponse } from '@/apis/common/SliceResponse';
import { SliceUtils } from '@/utils/sliceUtils';

export const useSlice = <T>(sliceResponse: SliceResponse<T> | undefined) => {
  const sliceUtils = useMemo(() => SliceUtils.from(sliceResponse), [sliceResponse]);

  return {
    isValid: sliceUtils.isValid,
    content: sliceUtils.content,
    currentPage: sliceUtils.currentPage,
    pageSize: sliceUtils.pageSize,
    isFirstPage: sliceUtils.isFirstPage,
    isLastPage: sliceUtils.isLastPage,
    hasPreviousPage: sliceUtils.hasPreviousPage,
    hasNextPage: sliceUtils.hasNextPage,
    shouldShowPagination: sliceUtils.shouldShowPagination,
    getPageNumbers: sliceUtils.getPageNumbers.bind(sliceUtils),
    getPaginationState: sliceUtils.getPaginationState.bind(sliceUtils),
    getItemNumber: sliceUtils.getItemNumber.bind(sliceUtils),
    isEmpty: sliceUtils.isEmpty,
    isLoading: sliceUtils.isLoading,
  };
};
