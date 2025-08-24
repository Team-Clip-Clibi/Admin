"use client";
import React, { useState } from "react";
import { useCreateLoginBanner } from "@/hooks/useInformation";
import { LoginBannerInfoRequest } from "@/apis/information/informationType";
import { X } from "lucide-react";

interface CreateLoginBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLoginBannerModal({ isOpen, onClose, onSuccess }: CreateLoginBannerModalProps) {
  const createLoginBannerMutation = useCreateLoginBanner();
  const [formData, setFormData] = useState(new LoginBannerInfoRequest("", "", ""));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => new LoginBannerInfoRequest(
      name === 'text' ? value : prev.text,
      name === 'exposureDate' ? value : prev.exposureDate,
      name === 'imgName' ? value : prev.imgName
    ));
  };

  const handleCloseModal = () => {
    setFormData(new LoginBannerInfoRequest("", "", ""));
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
      if (!formData.validate()) {
        console.error('입력값이 올바르지 않습니다.');
        return;
      }

      await createLoginBannerMutation.mutateAsync(formData);
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
        
        {/* 내용 입력 영역 */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4 text-left">내용</h4>
          
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
            
            {/* 이미지명 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지명
              </label>
              <input
                type="text"
                name="imgName"
                value={formData.imgName}
                onChange={handleInputChange}
                placeholder="이미지명을 입력하세요"
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
