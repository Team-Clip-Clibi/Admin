"use client";
import React from "react";

interface PopupModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function PopupModal({ 
  isOpen, 
  type, 
  message, 
  onClose, 
  autoClose = false, 
  autoCloseDelay = 1500 
}: PopupModalProps) {
  React.useEffect(() => {
    if (autoClose && isOpen && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const borderColor = isSuccess ? 'border-green-400' : 'border-red-400';
  const textColor = isSuccess ? 'text-green-700' : 'text-red-700';
  const buttonBgColor = isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className={`${bgColor} border ${borderColor} ${textColor} px-6 py-4 rounded-lg shadow-lg`}>
        <div className="flex items-center">
          {isSuccess ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {message}
        </div>
        {!autoClose && onClose && (
          <button
            onClick={onClose}
            className={`mt-3 ${buttonBgColor} text-white px-4 py-2 rounded-md transition-colors text-sm`}
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
}
