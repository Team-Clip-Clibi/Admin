"use client";
import { useState, useEffect } from "react";
import { useSlice } from "@/hooks/useSlice";
import { Pagination } from "@/components/core/pagination/Pagination";
import { useUnAssignedList } from "@/hooks/useApplication";
import { ParticipantInfoDto, OnethingDistrict, getOnethingKeywordKorean, getJobCategoryKorean } from "@/apis/application/applicationType";
import { getCurrentDate } from "@/utils/dateUtils";
import MatchingModal from "./MatchingModal";

export default function UnAssignedTable() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<OnethingDistrict>(OnethingDistrict.GANGNAM);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);

  // API 호출 파라미터 설정
  const apiParams = {
    page: currentPage,
    date: selectedDate,
    onethingDistrict: selectedDistrict
  };

  // API 호출
  const { data: unAssignedListResponse, isLoading, error, refetch } = useUnAssignedList(apiParams);
  
  // useSlice 훅을 사용하여 페이지네이션 정보 추출
  const sliceUtils = useSlice(unAssignedListResponse);
  
  // 페이지네이션 상태 계산
  const paginationState = sliceUtils.getPaginationState();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(sliceUtils.content.map(item => item.userOnethingMatchingId));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleMatching = () => {
    if (selectedItems.length === 0) {
      alert("매칭할 항목을 선택해주세요.");
      return;
    }
    setIsMatchingModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]); // 페이지 변경 시 선택 초기화
  };

  const handleDistrictChange = (district: OnethingDistrict) => {
    setSelectedDistrict(district);
    setCurrentPage(0); // 지역 변경 시 첫 페이지로 리셋
    setSelectedItems([]); // 선택 초기화
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(0); // 날짜 변경 시 첫 페이지로 리셋
    setSelectedItems([]); // 선택 초기화
  };

  const handleReset = () => {
    setSelectedDate(getCurrentDate());
    setSelectedDistrict(OnethingDistrict.GANGNAM);
    setCurrentPage(0);
    setSelectedItems([]);
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
              <button
                onClick={handleMatching}
                disabled={selectedItems.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                매칭하기
              </button>
            </div>
          </div>
        </div>

        {/* 테이블 섹션 - 남은 공간 모두 사용 */}
        <div className="flex-1 overflow-x-auto p-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={sliceUtils.content.length > 0 && selectedItems.length === sliceUtils.content.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  닉네임
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전화번호
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  원띵
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직종
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  언어
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가능한 날짜
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  원띵문장
                </th>
              </tr>
            </thead>
            <tbody>
              {sliceUtils.content.length === 0 ? (
                <tr>
                  <td colSpan={9} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                sliceUtils.content.map((item: ParticipantInfoDto, index: number) => (
                  <tr key={item.userOnethingMatchingId} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.userOnethingMatchingId)}
                        onChange={(e) => handleSelectItem(item.userOnethingMatchingId, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {sliceUtils.getItemNumber(index)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.nickname}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.phoneNumber}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getOnethingKeywordKorean(item.onethingKeyword)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getJobCategoryKorean(item.job)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.language}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.preferredDateList.map(date => 
                        `${date.date}`
                      ).join(" / ")}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.onethingTopic}
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

      {/* 매칭 모달 - 조건부 렌더링으로 API 호출 방지 */}
      {isMatchingModalOpen && (
        <MatchingModal
          isOpen={isMatchingModalOpen}
          onClose={() => setIsMatchingModalOpen(false)}
          oneThingDistrict={selectedDistrict}
          date={selectedDate}
          selectedUserIds={selectedItems}
          onMatchingComplete={() => {
            setIsMatchingModalOpen(false);
            refetch(); // 매칭 완료 후 테이블 새로고침
          }}
        />
      )}
    </div>
  );
}