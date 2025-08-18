"use client";
import React from "react";

interface ValidationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function ValidationModal({
  isOpen,
  title = "경고",
  message,
  confirmText = "확인",
  onConfirm
}: ValidationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onConfirm}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 메시지 */}
        <div className="mb-6">
          <p className="text-gray-700 text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* 확인 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
