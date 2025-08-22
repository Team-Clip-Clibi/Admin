"use client";
import React, { useState } from "react";
import { useNoticeInfo, useDeleteNotice, useCreateNotice } from "@/hooks/useInformation";
import { NoticeInfo, getNoticeTypeKorean, NoticeType, NoticeInfoRequest } from "@/apis/information/informationType";
import { formatDateTime, formatDateTimeToLocalDateTime } from "@/utils/dateUtils";
import { X } from "lucide-react";

export default function HomeTopTable() {
  const { data: noticeData, isLoading, error, refetch } = useNoticeInfo();
  const deleteMutation = useDeleteNotice();
  const createNoticeMutation = useCreateNotice();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(new NoticeInfoRequest("", NoticeType.ARTICLE, ""));

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      await refetch(); 
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => new NoticeInfoRequest(
      name === 'text' ? value : prev.text,
      name === 'noticeType' ? value as NoticeType : prev.noticeType,
      name === 'exposureDate' ? formatDateTimeToLocalDateTime(value) : prev.exposureDate
    ));
  };

  const handleNoticeTypeChange = (type: NoticeType) => {
    setFormData(prev => new NoticeInfoRequest(
      prev.text,
      type,
      prev.exposureDate
    ));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData(new NoticeInfoRequest("", NoticeType.ARTICLE, ""));
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSubmit = async () => {
    try {
      // 유효성 검사
      if (!formData.validate()) {
        console.error('입력값이 올바르지 않습니다.');
        return;
      }

      await createNoticeMutation.mutateAsync(formData);
      setShowAddModal(false);
      setFormData(new NoticeInfoRequest("", NoticeType.ARTICLE, ""));
      await refetch();
    } catch (error) {
      console.error('등록 실패:', error);
    }
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

  if (!noticeData || noticeData.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">홈 상단 공지</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 공지 등록
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          등록된 공지가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
      {/* 헤더 - 고정 높이 */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">홈 상단 공지</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 공지 등록
        </button>
              </div>
      </div>
      
      {/* 테이블 섹션 - 남은 공간 모두 사용 */}
      <div className="flex-1 overflow-x-auto p-6">
        <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">No</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">노출희망날짜</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">공지 내용</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">유형</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">관리</th>
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
      </div>
      
      {/* 홈 상단 공지 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleBackgroundClick}>
          <div className="bg-white p-8 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-left">홈 상단</h3>
            
            {/* 내용 입력 영역 */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-4 text-left">내용</h4>
              
              <div className="space-y-4">
                {/* 유형 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    유형
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleNoticeTypeChange(NoticeType.ARTICLE)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        formData.noticeType === NoticeType.ARTICLE
                          ? 'bg-gray-200 border-gray-300 text-gray-800'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {getNoticeTypeKorean(NoticeType.ARTICLE)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNoticeTypeChange(NoticeType.NOTICE)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        formData.noticeType === NoticeType.NOTICE
                          ? 'bg-gray-200 border-gray-300 text-gray-800'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {getNoticeTypeKorean(NoticeType.NOTICE)}
                    </button>
                  </div>
                </div>
                
                {/* 텍스트 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    텍스트
                  </label>
                  <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="공지 내용을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                </div>
                
                {/* 노출희망날짜 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    노출희망 날짜 및 시간
                  </label>
                  <input
                    type="datetime-local"
                    name="exposureDate"
                    value={formData.exposureDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)} // 현재 시간부터 선택 가능
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* 완료 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 