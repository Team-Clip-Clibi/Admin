"use client";
import React, { useState } from "react";
import { useAssignedList, useDeleteParticipant } from "@/hooks/useApplication";
import { AssignParticipantParams, ParticipantInfoDto } from "@/apis/application/applicationType";

import { X } from "lucide-react";
import { useSlice } from "@/hooks/useSlice";
import { Pagination } from "@/components/core/pagination/Pagination";
import PopupModal from "@/components/core/modal/PopupModal";

interface ParticipantInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParticipantDeleted: () => void;
  onethingMatchingId: number;
}

export default function ParticipantInfoModal({ 
  isOpen, 
  onClose, 
  onParticipantDeleted,
  onethingMatchingId 
}: ParticipantInfoModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // API 호출 파라미터 설정
  const apiParams: AssignParticipantParams = {
    page: currentPage,
    onethingMatchingId: onethingMatchingId
  };

  const { data: assignedListResponse, isLoading, error } = useAssignedList(apiParams);
  const sliceUtils = useSlice(assignedListResponse);
  const paginationState = sliceUtils.getPaginationState();
  const deleteParticipantMutation = useDeleteParticipant();

  const handleClose = () => {
    setIsDeleting(false);
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setErrorMessage("");
    setCurrentPage(0);
    onClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 참가자 삭제 처리
  const handleDeleteParticipant = async (userOnethingMatchingId: number) => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteParticipantMutation.mutateAsync(userOnethingMatchingId);
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        onParticipantDeleted();
        handleClose();
      }, 1500);
      
    } catch {
      setErrorMessage("참가자 삭제에 실패했습니다.");
      setShowErrorPopup(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <>
      {/* 메인 모달 */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
          {/* X 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-6 text-left">참여자 정보</h3>
          
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">참여자 정보를 불러오는 중...</div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">참여자 정보를 불러오는 중 오류가 발생했습니다.</div>
            </div>
          )}

          {/* 참여자 정보 테이블 */}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">닉네임</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">전화번호</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">원띵</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">직종</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">언어</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">가능한 날짜</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">원띵문장</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {sliceUtils.content && sliceUtils.content.length > 0 ? (
                    sliceUtils.content.map((participant: ParticipantInfoDto, index: number) => (
                      <tr key={participant.userOnethingMatchingId} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {sliceUtils.getItemNumber(index)}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.nickname}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.phoneNumber}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.onethingKeyword}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.job}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.language}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.preferredDateList?.map((date) => 
                            `${date.date}`
                          ).join(" / ") || "-"}
                        </td>
                        <td className="border border-gray-200 px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {participant.onethingTopic}
                        </td>
                        <td className="border border-gray-200 px-3 py-3">
                          <button
                            onClick={() => handleDeleteParticipant(participant.userOnethingMatchingId)}
                            disabled={isDeleting}
                            className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                              isDeleting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {isDeleting ? '삭제 중...' : '삭제'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                        참여자가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이징 처리 */}
          {sliceUtils.shouldShowPagination && (
            <div className="border-t border-gray-200 mt-6">
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
            </div>
          )}
        </div>
      </div>

      <PopupModal
        isOpen={showSuccessPopup}
        type="success"
        message="참가자가 성공적으로 삭제되었습니다."
        autoClose={true}
        autoCloseDelay={1500}
        onClose={() => {
          setShowSuccessPopup(false);
          onParticipantDeleted();
          handleClose();
        }}
      />

      <PopupModal
        isOpen={showErrorPopup}
        type="error"
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
    </>
  );
}
