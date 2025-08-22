"use client";
import { useState, useEffect } from "react";
import { useSlice } from "@/hooks/useSlice";
import { Pagination } from "@/components/core/pagination/Pagination";
import { useOneThingList } from "@/hooks/useMatching";
import { MatchingInfoDto, OnethingDistrict, getOneThingDistrictKorean } from "@/apis/meeting/meetingType";
import { getCurrentDate, formatLocalDateTime } from "@/utils/dateUtils";
import ParticipantInfoModal from "./ParticipantInfoModal";

export default function AssignedTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<OnethingDistrict>(OnethingDistrict.GANGNAM);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [selectedMatchingId, setSelectedMatchingId] = useState<number | null>(null);

  // API 호출 파라미터 설정
  const apiParams = {
    page: currentPage,
    date: selectedDate,
    district: selectedDistrict
  };

  // API 호출 - 원띵 매칭 리스트 조회
  const { data: assignedListResponse, isLoading, error, refetch } = useOneThingList(apiParams);
  
  // useSlice 훅을 사용하여 페이지네이션 정보 추출
  const sliceUtils = useSlice(assignedListResponse);
  
  // 페이지네이션 상태 계산
  const paginationState = sliceUtils.getPaginationState();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDistrictChange = (district: OnethingDistrict) => {
    setSelectedDistrict(district);
    setCurrentPage(0); // 지역 변경 시 첫 페이지로 리셋
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(0); // 날짜 변경 시 첫 페이지로 리셋
  };

  const handleReset = () => {
    setSelectedDate(getCurrentDate());
    setSelectedDistrict(OnethingDistrict.GANGNAM);
    setCurrentPage(0);
  };

  // 행 클릭 시 참여자 정보 모달 열기
  const handleRowClick = (matchingId: number) => {
    setSelectedMatchingId(matchingId);
    setIsParticipantModalOpen(true);
  };

  // 참여자 삭제 완료 후 처리
  const handleParticipantDeleted = () => {
    refetch(); // AssignedTable 새로고침
  };

  // 초기 날짜 설정 (클라이언트에서만 실행)
  useEffect(() => {
    if (typeof window !== 'undefined' && !selectedDate) {
      setSelectedDate(getCurrentDate());
    }
  }, [selectedDate]);

  // 상태 변경 시 자동으로 API 호출
  useEffect(() => {
    if (selectedDate && selectedDistrict !== undefined) {
      refetch();
    }
  }, [selectedDate, selectedDistrict, currentPage, refetch]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[800px] flex flex-col">
      {/* 검색/필터 섹션 - 고정 높이 */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-6 items-center">
          {/* 장소 필터 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">장소</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDistrictChange(OnethingDistrict.GANGNAM)}
                className={`px-4 py-2 text-sm border rounded-md transition-colors font-medium ${
                  selectedDistrict === OnethingDistrict.GANGNAM
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                강남
              </button>
              <button
                onClick={() => handleDistrictChange(OnethingDistrict.HONGDAE_HAPJEONG)}
                className={`px-4 py-2 text-sm border rounded-md transition-colors font-medium ${
                  selectedDistrict === OnethingDistrict.HONGDAE_HAPJEONG
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                홍대/합정
              </button>
            </div>
          </div>

          {/* 날짜 필터 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">날짜</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-700 text-gray-700"
            />
          </div>

          {/* 액션 버튼들 */}
          <div className="flex space-x-3 ml-auto">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가게명
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주소
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜/시간
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                참여자 수
              </th>
            </tr>
          </thead>
          <tbody>
            {sliceUtils.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              sliceUtils.content.map((item: MatchingInfoDto, index: number) => (
                <tr 
                  key={item.matchingId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item.matchingId)}
                >
                  <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {sliceUtils.getItemNumber(index)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.restaurantName}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.address}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatLocalDateTime(item.dateTime)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.participantCnt}명
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 처리 */}
      {sliceUtils.shouldShowPagination && (
        <div className="border-t border-gray-200">
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

      {/* 참여자 정보 모달 */}
      {isParticipantModalOpen && selectedMatchingId && (
        <ParticipantInfoModal
          isOpen={isParticipantModalOpen}
          onClose={() => setIsParticipantModalOpen(false)}
          onParticipantDeleted={handleParticipantDeleted}
          onethingMatchingId={selectedMatchingId}
        />
      )}
    </div>
  );
}