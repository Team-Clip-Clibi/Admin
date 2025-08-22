"use client";
import { useState, useEffect } from "react";
import { OnethingDistrict } from "@/apis/application/applicationType";
import { useOneThingList } from "@/hooks/useMatching";
import { useAssignParticipant } from "@/hooks/useApplication";
import { Pagination } from "@/components/core/pagination/Pagination";
import { useSlice } from "@/hooks/useSlice";
import { formatDateTime } from "@/utils/dateUtils";
import { MatchingInfoDto } from "@/apis/meeting/meetingType";
import PopupModal from "@/components/core/modal/PopupModal";



interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  oneThingDistrict: OnethingDistrict;
  date: string;
  selectedUserIds: number[];
  onMatchingComplete: () => void;
}

export default function MatchingModal({ isOpen, onClose, oneThingDistrict, date, selectedUserIds, onMatchingComplete }: MatchingModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // API 호출 파라미터 설정
  const apiParams = {
    district: oneThingDistrict,
    page: currentPage,
    date: date
  };

  const { data: oneThingListResponse, isLoading, error } = useOneThingList(apiParams);
  const sliceUtils = useSlice(oneThingListResponse);
  const paginationState = sliceUtils.getPaginationState();
  const assignParticipantMutation = useAssignParticipant();

  // 모달이 닫혀있을 때 선택 상태 초기화
  useEffect(() => {
    if (!isOpen && selectedMeetingId !== null) {
      setSelectedMeetingId(null);
      setShowSuccessPopup(false);
      setShowErrorPopup(false);
      setErrorMessage("");
    }
  }, [isOpen, selectedMeetingId]);

  const handleMeetingSelect = (meetingId: number) => {
    setSelectedMeetingId(meetingId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      window.scrollTo(0, 0);
    }
  }, [currentPage, isOpen]);

  const handleMatchingConfirm = async () => {
    if (!selectedMeetingId) return;

    try {
      await assignParticipantMutation.mutateAsync({
        onethingMatchingId: selectedMeetingId,
        userOnethingMatchingIdList: selectedUserIds
      });
      
      setShowSuccessPopup(true);
      
      // 성공 팝업 표시 후 모달 닫기 및 테이블 새로고침
      setTimeout(() => {
        setShowSuccessPopup(false);
        onMatchingComplete();
      }, 1500);
      
    } catch (error) {
      console.error("매칭 실패:", error);
      
      // 에러 메시지를 더 구체적으로 표시
      let message = "매칭 처리 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        message = error.message || message;
      }
      setErrorMessage(message);
      setShowErrorPopup(true);
    }
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">모임 매칭</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                <span className="font-medium">지역:</span> {oneThingDistrict === OnethingDistrict.GANGNAM ? '강남' : '홍대/합정'}
              </span>
              <span>
                <span className="font-medium">날짜:</span> {date}
              </span>
            </div>
          </div>

          {/* 모임 리스트 */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">모임을 불러오는 중...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">모임 리스트를 불러오는데 실패했습니다.</div>
            </div>
          ) : sliceUtils.content.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              해당 조건에 맞는 모임이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {sliceUtils.content.map((meeting: MatchingInfoDto, index: number) => (
                <div
                  key={meeting.matchingId || index}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    selectedMeetingId === meeting.matchingId
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleMeetingSelect(meeting.matchingId)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{meeting.restaurantName || '가게명 없음'}</h3>
                      <p className="text-sm text-gray-600 mb-2">{meeting.address || '주소 없음'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {meeting.dateTime ? formatDateTime(meeting.dateTime, 'full') : '날짜 없음'}</span>
                        <span>👥 {meeting.participantCnt || 0}/4명</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (meeting.participantCnt || 0) >= 4
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {(meeting.participantCnt || 0) >= 4 ? '마감' : '모집중'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이징 처리 */}
          {sliceUtils.shouldShowPagination && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <Pagination
                sliceUtils={{
                  currentPage: currentPage,
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

        {/* 모달 푸터 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleMatchingConfirm}
            disabled={!selectedMeetingId || assignParticipantMutation.isPending}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assignParticipantMutation.isPending ? '처리 중...' : '매칭 확정'}
          </button>
        </div>
      </div>

      <PopupModal
        isOpen={showSuccessPopup}
        type="success"
        message="매칭이 확정되었습니다!"
        autoClose={true}
        autoCloseDelay={1500}
        onClose={() => setShowSuccessPopup(false)}
      />

      <PopupModal
        isOpen={showErrorPopup}
        type="error"
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
    </div>
  );
}
