import React from 'react';
import { PaginationProps } from '@/apis/common/paginationTypes';

export const Pagination: React.FC<PaginationProps> = ({
  sliceUtils,
  paginationState,
  onPageChange,
  onPrevPage,
  onNextPage,
  className = "",
}) => {
  const { currentPage, isFirstPage, isLastPage, shouldShowPagination } = sliceUtils;
  const { pageNumbers, totalPages, showEllipsisAfter, showLastPage } = paginationState;
  
  // 페이지네이션이 필요하지 않으면 렌더링하지 않음
  if (!shouldShowPagination || totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center py-4 border-t border-gray-200 ${className}`}>
      
      {/* 페이지네이션 컨트롤 */}
      <div className="flex justify-center items-center">
        {/* 이전 페이지 버튼 */}
        <button 
          onClick={onPrevPage}
          disabled={isFirstPage}
          className={`px-3 py-1 ${
            isFirstPage 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          aria-label="이전 페이지"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 페이지 번호들 */}
        <div className="flex space-x-1 mx-4">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded ${
                currentPage === pageNum 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label={`${pageNum + 1}페이지로 이동`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum + 1}
            </button>
          ))}
          
          {/* 마지막 페이지가 보이지 않는 경우 ... 및 마지막 페이지 표시 */}
          {showEllipsisAfter && (
            <>
              <span className="px-2 py-1 text-gray-500" aria-hidden="true">...</span>
              {showLastPage && (
                <button
                  onClick={() => onPageChange(totalPages - 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages - 1 
                      ? "bg-purple-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label={`${totalPages}페이지로 이동`}
                >
                  {totalPages}
                </button>
              )}
            </>
          )}
        </div>
        
        {/* 다음 페이지 버튼 */}
        <button 
          onClick={onNextPage}
          disabled={isLastPage}
          className={`px-3 py-1 ${
            isLastPage 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          aria-label="다음 페이지"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
