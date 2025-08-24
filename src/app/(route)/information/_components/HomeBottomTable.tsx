"use client";
import React, { useState } from "react";
import { useHomeBannerInfo, useDeleteHomeBanner, useGetUploadUrl, useCreateHomeBanner } from "@/hooks/useInformation";
import { BannerInfo, HomeBannerInfoRequest } from "@/apis/information/informationType";
import ImageUploader from "@/components/imageUploader/ImageUploader";
import { formatDateTime, formatDateTimeToLocalDateTime } from "@/utils/dateUtils";
import { uploadToS3 } from "@/utils/s3Upload";

export default function HomeBottomTable() {
  const { data: bannerData, isLoading, error, refetch } = useHomeBannerInfo();
  const deleteMutation = useDeleteHomeBanner();
  const [showAddModal, setShowAddModal] = useState(false);
  const getUploadUrlMutation = useGetUploadUrl();
  const createHomeBannerMutation = useCreateHomeBanner();
  const [formData, setFormData] = useState(new HomeBannerInfoRequest("", ""));
  const [imgFile, setImgFile] = useState<File>();

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
    setFormData(prev => new HomeBannerInfoRequest(
      name === 'imgName' ? value : prev.imgName,
      name === 'exposureDate' ? formatDateTimeToLocalDateTime(value) : prev.exposureDate
    ));
  };

  const handleImageChange = (file: File | undefined) => {
    setImgFile(file);
  };

  const handleSubmit = async () => {
    try {
      // 1. 이미지 업로드 정보 가져오기
      const imageUploadInfo = await getUploadUrlMutation.mutateAsync();
      
      // 2. S3에 이미지 업로드 
      if (imgFile) {
        const uploadSuccess = await uploadToS3(imgFile, imageUploadInfo);
        if (!uploadSuccess) {
          throw new Error('S3 이미지 업로드에 실패했습니다.');
        }
      }
      
      // 3. 배너 정보 생성
      const homeBannerInfoRequest = new HomeBannerInfoRequest(
        imageUploadInfo.imgName, 
        formData.exposureDate
      );
      await createHomeBannerMutation.mutateAsync(homeBannerInfoRequest);
      
      setShowAddModal(false);
      setFormData(new HomeBannerInfoRequest("", ""));
      setImgFile(undefined);
      await refetch();
    } catch (error) {
      console.error('등록 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData(new HomeBannerInfoRequest("", ""));
    setImgFile(undefined);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
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

  if (!bannerData || bannerData.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">홈 하단 배너</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + 배너 등록
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          등록된 배너가 없습니다.
        </div>
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
            onClick={() => setShowAddModal(true)}
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
      
      {/* 홈 하단 배너 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleBackgroundClick}>
          <div className="bg-white p-8 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
            {/* X 버튼 */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-left">홈 하단 배너</h3>
            
            {/* 이미지 업로드 영역 */}
            <div className="mb-6">
              <ImageUploader
                label="사진(원본, 크기 맞춰서 넣기)"
                value={imgFile}
                onChange={handleImageChange}
              />
            </div>

            {/* 배너 정보 입력 영역 */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-4">배너 정보</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    노출희망 날짜 및 시간
                  </label>
                  <input
                    type="datetime-local"
                    name="exposureDate"
                    value={formData.exposureDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)} 
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