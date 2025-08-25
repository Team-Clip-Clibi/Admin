"use client";
import React, { useState } from "react";
import { useHomeBannerInfo, useDeleteHomeBanner } from "@/hooks/useInformation";
import { BannerInfo } from "@/apis/information/informationType";
import { formatDateTime } from "@/utils/dateUtils";
import CreateHomeBottomBannerModal from "./CreateHomeBottomBannerModal";

export default function HomeBottomTable() {
  const { data: bannerData, isLoading, error, refetch } = useHomeBannerInfo();
  const deleteMutation = useDeleteHomeBanner();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      await refetch();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const handleAddButtonClick = () => {
    console.log('배너 등록 버튼 클릭됨');
    setShowAddModal(true);
    console.log('showAddModal 상태:', true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  if (!bannerData || bannerData.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">홈 하단 배너</h2>
          <button
            onClick={handleAddButtonClick}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + 배너 등록
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          등록된 배너가 없습니다.
        </div>
        
        {/* CreateHomeBottomBannerModal 사용 */}
        <CreateHomeBottomBannerModal
          isOpen={showAddModal}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col">
      {/* 헤더 */}
      <div className="flex-shrink-0 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">홈 하단 배너</h2>
          <button
            onClick={handleAddButtonClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 배너 등록
          </button>
        </div>
      </div>
      
      {/* 테이블 */}
      <div className="flex-1 overflow-x-auto p-6">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">No</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">노출희망날짜</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">관리</th>
            </tr>
          </thead>
          <tbody>
            {bannerData.map((banner: BannerInfo, index: number) => (
              <tr key={banner.no} className="border border-gray-200">
                <td className="px-3 py-3 text-sm text-gray-900 border border-gray-200">{index + 1}</td>
                <td className="px-3 py-3 text-sm text-gray-900 border border-gray-200">{formatDateTime(banner.exposureDate)}</td>
                <td className="px-3 py-3 text-sm text-gray-900 border border-gray-200">
                  <button
                    onClick={() => handleDelete(banner.no)}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* CreateHomeBottomBannerModal 사용 */}
      <CreateHomeBottomBannerModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
} 