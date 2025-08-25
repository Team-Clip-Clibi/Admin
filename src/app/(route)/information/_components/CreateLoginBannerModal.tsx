"use client";
import React, { useState } from "react";
import { useCreateLoginBanner, useGetUploadUrl } from "@/hooks/useInformation";
import { LoginBannerInfoRequest } from "@/apis/information/informationType";
import ImageUploader from "@/components/imageUploader/ImageUploader";
import { formatDateTimeToLocalDateTime } from "@/utils/dateUtils";
import { uploadToS3 } from "@/utils/s3Upload";
import { X } from "lucide-react";

interface CreateLoginBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLoginBannerModal({ isOpen, onClose, onSuccess }: CreateLoginBannerModalProps) {
  const createLoginBannerMutation = useCreateLoginBanner();
  const getUploadUrlMutation = useGetUploadUrl();
  const [formData, setFormData] = useState(new LoginBannerInfoRequest("", "", ""));
  const [imgFile, setImgFile] = useState<File>();

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

  const handleCloseModal = () => {
    setFormData(new LoginBannerInfoRequest("", "", ""));
    setImgFile(undefined);
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSubmit = async () => {
    try {
      // 유효성 검사
      if (!formData.text.trim()) {
        console.error('텍스트를 입력해주세요.');
        return;
      }
      if (!imgFile) {
        console.error('이미지를 선택해주세요.');
        return;
      }
      if (!formData.exposureDate) {
        console.error('노출희망 날짜를 입력해주세요.');
        return;
      }

      // 1. 이미지 업로드 정보 가져오기
      const imageUploadInfo = await getUploadUrlMutation.mutateAsync();
      
      // 2. S3에 이미지 업로드 
      const uploadSuccess = await uploadToS3(imgFile, imageUploadInfo);
      if (!uploadSuccess) {
        throw new Error('S3 이미지 업로드에 실패했습니다.');
      }
      
      // 3. 배너 정보 생성
      const loginBannerInfoRequest = new LoginBannerInfoRequest(
        formData.text,
        formData.exposureDate,
        imageUploadInfo.imgName
      );
      await createLoginBannerMutation.mutateAsync(loginBannerInfoRequest);
      
      handleCloseModal();
      onSuccess();
    } catch (error) {
      console.error('등록 실패:', error);
    }
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleBackgroundClick}>
      <div className="bg-white p-8 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
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

        {/* 내용 입력 영역 */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">배너 정보</h4>
          
          <div className="space-y-4">
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
                placeholder="배너 텍스트를 입력하세요"
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
  );
}
