"use client";
import React, { useState } from "react";
import { QuestionInfoDto } from "@/apis/meeting/questionType";
import { useQuestionList } from "@/hooks/useQuestion";
import { useSlice } from "@/hooks/useSlice";
import { Pagination } from "@/components/core/pagination/Pagination";
import CreateQuestionModal from "./CreateQuestionModal";
import EditQuestionModal from "./EditQuestionModal";

export default function QuestionTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestionData, setSelectedQuestionData] = useState<QuestionInfoDto | null>(null);

  const apiParams = {
    page: Math.max(0, currentPage || 0),
  };

  const { data: questionListResponse, isLoading, error } = useQuestionList(apiParams);

  // useSlice 훅을 사용하여 페이지네이션 정보 추출
  const sliceUtils = useSlice(questionListResponse);
  
  // 페이지네이션 상태 계산
  const paginationState = sliceUtils.getPaginationState();

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < paginationState.totalPages && !isNaN(page)) {
      setCurrentPage(page);
    }
  };

  // 질문지 수정 모달 열기
  const handleRowClick = (questionId: number) => {
    setSelectedQuestionData(null); // 기존 데이터 초기화
    // 해당 질문지의 전체 데이터를 가져와서 상태에 저장
    const question = questionListResponse?.content.find(q => q.id === questionId);
    if (question) {
      setSelectedQuestionData(question);
    }
    setIsEditModalOpen(true);
  };

  // 수정 성공 시 콜백
  const handleEditSuccess = () => {
    // TODO: 질문지 리스트를 새로고침하는 로직 추가
    console.log('질문지 수정 완료');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
      {/* 헤더 - 고정 높이 */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">질문지 생성</h2>
        <div className="flex items-center space-x-4">
          {/* 생성하기 버튼 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            생성하기
          </button>
        </div>
      </div>

      {/* 데이터 테이블 - 남은 공간 모두 사용 */}
      <div className="flex-1 overflow-x-auto p-6">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex justify-center items-center py-8">
            <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
          </div>
        )}

        {/* 테이블 - 항상 표시 */}
        <table className="w-full border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">No</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">제목</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">질문 수</th>
            </tr>
          </thead>
          <tbody>
            {sliceUtils.content.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              sliceUtils.content.map((item: QuestionInfoDto, index: number) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    {sliceUtils.getItemNumber(index)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.title}</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.questions.length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {!isLoading && !error && questionListResponse && (
        <Pagination
          sliceUtils={{
            currentPage: sliceUtils.currentPage,
            pageSize: sliceUtils.pageSize,
            isFirstPage: sliceUtils.isFirstPage,
            isLastPage: sliceUtils.isLastPage,
            hasPreviousPage: sliceUtils.hasPreviousPage,
            hasNextPage: sliceUtils.hasNextPage,
            shouldShowPagination: sliceUtils.shouldShowPagination,
          }}
          paginationState={{
            pageNumbers: paginationState.pageNumbers,
            totalPages: paginationState.totalPages,
            showEllipsisAfter: paginationState.showEllipsisAfter,
            showLastPage: paginationState.showLastPage,
          }}
          onPageChange={handlePageChange}
          onPrevPage={() => {
            if (currentPage > 0) {
              setCurrentPage(currentPage - 1);
            }
          }}
          onNextPage={() => {
            if (paginationState.totalPages > 0 && currentPage < paginationState.totalPages - 1) {
              setCurrentPage(currentPage + 1);
            }
          }}
        />
      )}

      {/* 질문지 생성 모달 */}
      <CreateQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 질문지 수정 모달 */}
      {selectedQuestionData && (
        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuestionData(null);
          }}
          questionData={selectedQuestionData}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
