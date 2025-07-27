"use client";
import React from "react";
import { useNoticeInfo, useDeleteNotice } from "@/hooks/useInformation";
import { NoticeInfo, getNoticeTypeKorean } from "@/apis/information/informationType";
import { formatDateTime } from "@/utils/dateUtils";

export default function HomeTopTable() {
  const { data: noticeData, isLoading, error, refetch } = useNoticeInfo();
  const deleteMutation = useDeleteNotice();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      const result = await refetch();
      console.log('refetch 결과:', result.data);
    } catch (error) {
      console.error('삭제 실패:', error);
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

  if (!noticeData || noticeData.length === 0) {
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
          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">텍스트</th>
          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">유형</th>
          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">상태변경</th>
        </tr>
      </thead>
      <tbody>
        {noticeData.map((notice: NoticeInfo, index: number) => (
          <tr key={notice.no} className="hover:bg-gray-50">
            <td className="border border-gray-200 px-4 py-3 text-gray-700">{index + 1}</td>
            <td className="border border-gray-200 px-4 py-3 text-gray-700">
              {formatDateTime(notice.exposureDate)}
            </td>
            <td className="border border-gray-200 px-4 py-3 text-gray-700">{notice.text}</td>
            <td className="border border-gray-200 px-4 py-3 text-gray-700">
              {getNoticeTypeKorean(notice.noticeType)}
            </td>
            <td className="border border-gray-200 px-4 py-3">
              <button
                onClick={() => handleDelete(notice.no)}
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