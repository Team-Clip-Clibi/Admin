"use client";
import React from "react";
import { BannerInfo } from "@/apis/information/informationType";
import { useDeleteHomeBanner, useHomeBannerInfo } from "@/hooks/useInformation";
import { formatDateTime } from "@/utils/dateUtils";

export default function HomeBottomTable() {
  const { data: bannerData, isLoading, error, refetch } = useHomeBannerInfo();
  const deleteMutation = useDeleteHomeBanner();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      refetch();
      console.log(`삭제 완료: ${id}`);
    } catch (error) {
      console.error('삭제 실패:', error);
      // 여기서 에러 처리 (토스트 메시지 등)
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  if (!bannerData || bannerData.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">데이터가 없습니다.</div>
      </div>
    );
  }


  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 bg-gray-50">
        <tr>
          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">No</th>
          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">노출희망날짜</th>
          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">상태변경</th>
        </tr>
      </thead>
      <tbody>
        {bannerData.map((banner: BannerInfo, index: number) => (
          <tr key={banner.no} className="hover:bg-gray-50">
            <td className="border border-gray-200 px-4 py-3 text-gray-700">{index + 1}</td>
            <td className="border border-gray-200 px-4 py-3 text-gray-700">
              {formatDateTime(banner.exposureDate)}
            </td>
            <td className="border border-gray-200 px-4 py-3">
              <button
                onClick={() => handleDelete(banner.no)}
                disabled={deleteMutation.isPending}
                className={`font-medium ${
                  deleteMutation.isPending  
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-red-600 hover:text-red-800'
                }`}
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 