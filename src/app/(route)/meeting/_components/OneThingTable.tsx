"use client";
import React, { useState } from "react";
import { MatchingInfoDto, OnethingDistrict, getOneThingDistrictKorean, CreateOneThingDto } from "@/apis/meeting/meetingType";
import { useCreateOneThing, useOneThingList, useDeleteOneThing, useCancelOneThing } from "@/hooks/useMatching";
import { useSlice } from "@/hooks/useSlice";
import { Pagination } from "@/components/core/pagination/Pagination";
import { formatDateForDisplay, formatDateTimeToLocalDateTime } from "@/utils/dateUtils";

export default function OneThingTable() {

  const [formData, setFormData] = useState(new CreateOneThingDto(
    OnethingDistrict.GANGNAM,
    "",
    "",
    "",
    "",
    ""
  ));

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const createOneThingMutation = useCreateOneThing();
  const deleteOneThingMutation = useDeleteOneThing();
  const cancelOneThingMutation = useCancelOneThing();

  // API 호출 파라미터 설정
  const apiParams = {
    page: Math.max(0, currentPage || 0), // currentPage가 유효하지 않으면 0으로 설정
    date: "", // 초기값은 빈 문자열
    district: formData.onethingDistrict // formData의 지역 사용하여 동적 업데이트
  };

  // 원띵 모임 리스트 API 호출
  const { data: meetingListResponse, isLoading, error, refetch } = useOneThingList(apiParams);

  // useSlice 훅을 사용하여 페이지네이션 정보 추출
  const sliceUtils = useSlice(meetingListResponse);
  
  // 페이지네이션 상태 계산
  const paginationState = sliceUtils.getPaginationState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 날짜 변경 시 페이지만 리셋 (자동 검색 방지)
    if (name === 'dateTime') {
      setCurrentPage(0);
    }
  };

  // 지역 변경 핸들러
  const handleRegionChange = (region: OnethingDistrict) => {
    setFormData(prev => ({ ...prev, onethingDistrict: region }));
    setCurrentPage(0); // 지역 변경 시 첫 페이지로 리셋
  };



  const handleSubmit = () => {
    const createOneThingDto = new CreateOneThingDto(
      formData.onethingDistrict,
      formData.restaurantName,
      formData.address,
      formatDateTimeToLocalDateTime(formData.dateTime),
      formData.menu,
      formData.cuisineType
    );

    createOneThingMutation.mutateAsync(createOneThingDto);
    refetch();
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      // 선택된 항목들을 하나씩 삭제
      for (const id of selectedItems) {
        await deleteOneThingMutation.mutateAsync(id);
      }
      
      // 삭제 완료 후 선택 초기화 및 데이터 새로고침
      setSelectedItems([]);
      refetch();
      
      console.log("삭제 완료:", selectedItems);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      // TODO: 에러 처리 (사용자에게 알림 등)
    }
  };

  const handleCancelMatching = async () => {
    if (selectedItems.length === 0) return;

    try {
      for (const id of selectedItems) {
        await cancelOneThingMutation.mutateAsync(id);
      }

      setSelectedItems([]);
      refetch();

    } catch (error) {
      console.error("매칭 취소 중 오류 발생:", error);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sliceUtils.content.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sliceUtils.content.map(item => item.matchingId));
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < paginationState.totalPages && !isNaN(page)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-[800px] flex flex-col">
      {/* 모임생성 폼 - 고정 높이 */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">원띵 모임 등록 및 관리</h2>
        
        {/* 첫 번째 행 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* 지역 선택 */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">지역</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleRegionChange(OnethingDistrict.GANGNAM)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.onethingDistrict === OnethingDistrict.GANGNAM
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getOneThingDistrictKorean(OnethingDistrict.GANGNAM)}
              </button>
              <button
                type="button"
                onClick={() => handleRegionChange(OnethingDistrict.HONGDAE_HAPJEONG)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.onethingDistrict === OnethingDistrict.HONGDAE_HAPJEONG
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getOneThingDistrictKorean(OnethingDistrict.HONGDAE_HAPJEONG)}
              </button>
            </div>
          </div>

          {/* 가게명 입력 */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">가게명</label>
                <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                placeholder="가게명"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 [&::-webkit-datetime-edit]:text-gray-700 [&::-webkit-calendar-picker-indicator]:text-gray-700"
              />
          </div>

          {/* 메뉴 입력 */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">메뉴</label>
                <input
                type="text"
                name="menu"
                value={formData.menu}
                onChange={handleInputChange}
                placeholder="메뉴"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 [&::-webkit-datetime-edit]:text-gray-700 [&::-webkit-calendar-picker-indicator]:text-gray-700"
              />
          </div>
        </div>

        {/* 두 번째 행 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* 날짜 입력 */}
          <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">날짜</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 [&::-webkit-datetime-edit]:text-gray-700 [&::-webkit-calendar-picker-indicator]:text-gray-700"
                />
          </div>

          {/* 가게주소 입력 */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">가게주소</label>
                <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="가게주소"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 [&::-webkit-datetime-edit]:text-gray-700 [&::-webkit-calendar-picker-indicator]:text-gray-700"
              />
          </div>

          {/* 요리 타입 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">요리 타입</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, cuisineType: "양식" }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.cuisineType === "양식"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                양식
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, cuisineType: "중식" }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.cuisineType === "중식"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                중식
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, cuisineType: "일식" }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.cuisineType === "일식"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                일식
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, cuisineType: "한식" }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.cuisineType === "한식"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                한식
              </button>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            등록
          </button>
          
          {/* 삭제 버튼 - participantCnt가 0인 경우에만 활성화 */}
          <button
            onClick={handleDelete}
            disabled={!selectedItems.every(id => {
              const item = sliceUtils.content.find(item => item.matchingId === id);
              return item && item.participantCnt === 0;
            }) || selectedItems.length === 0}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            삭제
          </button>
          
          {/* 매칭 취소 처리 버튼 - participantCnt가 0보다 큰 경우에만 활성화 */}
          <button
            onClick={handleCancelMatching}
            disabled={!selectedItems.some(id => {
              const item = sliceUtils.content.find(item => item.matchingId === id);
              return item && item.participantCnt > 0;
            }) || selectedItems.length === 0}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            매칭 취소 처리
          </button>
        </div>
      </div>

      {/* 테이블 섹션 - 남은 공간 모두 사용 */}
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

        {/* 데이터가 있을 때만 테이블 표시 */}
        {!isLoading && !error && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={sliceUtils.content.length > 0 && selectedItems.length === sliceUtils.content.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">No</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">가게명</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">주소</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">날짜/시간</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">참여자 수</th>
              </tr>
            </thead>
            <tbody>
              {sliceUtils.content.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                sliceUtils.content.map((item: MatchingInfoDto, index: number) => (
                  <tr key={item.matchingId} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.matchingId)}
                        onChange={() => handleCheckboxChange(item.matchingId)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">
                      {sliceUtils.getItemNumber(index)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.restaurantName}</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.address}</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">
                      {formatDateForDisplay(item.dateTime)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-700">
                      {item.participantCnt} 명
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이징 처리 */}
      {!isLoading && !error && sliceUtils.shouldShowPagination && (
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
    </div>
  );
}
