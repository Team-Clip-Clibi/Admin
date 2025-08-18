"use client";
import React, { useState } from "react";
import { useLoginBannerInfo, useDeleteLoginBanner, useGetUploadUrl, useCreateLoginBanner } from "@/hooks/useInformation";
import { BannerInfo, LoginBannerInfoRequest } from "@/apis/information/informationType";
import { formatDateTime, formatDateTimeToLocalDateTime } from "@/utils/dateUtils";
import { X } from "lucide-react";
import ImageUploader from "@/components/imageUploader/ImageUploader";
import { uploadToS3 } from "@/utils/s3Upload";

export default function LoginBannerTable() {
  const { data: bannerData, isLoading, error, refetch } = useLoginBannerInfo();
  const deleteMutation = useDeleteLoginBanner();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(new LoginBannerInfoRequest("", "", ""));
  const [imgFile, setImgFile] = useState<File>();
  const getUploadUrlMutation = useGetUploadUrl();
  const createLoginBannerMutation = useCreateLoginBanner();

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
    setFormData(prev => new LoginBannerInfoRequest(
      name === 'text' ? value : prev.text,
      name === 'exposureDate' ? formatDateTimeToLocalDateTime(value) : prev.exposureDate,
      prev.imgName
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
      const loginBannerInfoRequest = new LoginBannerInfoRequest(
        formData.text,
        formData.exposureDate,
        imageUploadInfo.imgName
      );

      await createLoginBannerMutation.mutateAsync(loginBannerInfoRequest);
      
      setShowAddModal(false);
      setFormData(new LoginBannerInfoRequest("", "", ""));
      setImgFile(undefined);
      await refetch();
    } catch (error) {
      console.error('등록 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData(new LoginBannerInfoRequest("", "", ""));
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
          <h2 className="text-lg font-semibold text-gray-800">로그인 배너</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">로그인 배너</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          + 배너 등록
        </button>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">No</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">노출희망날짜</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">배너 텍스트</th>
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">관리</th>
          </tr>
        </thead>
        <tbody>
          {bannerData.map((banner: BannerInfo, index: number) => (
            <tr key={banner.no} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-3 text-gray-700">{index + 1}</td>
              <td className="border border-gray-200 px-4 py-3 text-gray-700">{formatDateTime(banner.exposureDate)}</td>
              <td className="border border-gray-200 px-4 py-3 text-gray-700">{banner.text}</td>
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
      
      {/* 로그인 배너 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleBackgroundClick}>
          <div className="bg-white p-8 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
            {/* X 버튼 */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-left">로그인 배너</h3>
            
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
                    텍스트
                  </label>
                  <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="배너에 표시될 텍스트를 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    노출희망날짜 및 시간
                  </label>
                  <input
                    type="datetime-local"
                    name="exposureDate"
                    value={formData.exposureDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)} // 현재 시간부터 선택 가능
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* 완료 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-300 transition-colors font-medium"
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