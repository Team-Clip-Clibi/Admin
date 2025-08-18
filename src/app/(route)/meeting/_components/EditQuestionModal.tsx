"use client";
import React, { useState, useEffect } from "react";
import { QuestionInfoDto } from "@/apis/meeting/questionType";
import { useUpdateQuestion } from "@/hooks/useQuestion";
import ValidationModal from "@/components/core/modal/ValidationModal";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: QuestionInfoDto | null;
  onSuccess?: () => void;
}

export default function EditQuestionModal({ 
  isOpen, 
  onClose, 
  questionData, 
  onSuccess 
}: EditQuestionModalProps) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 검증 모달 상태
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const updateQuestionMutation = useUpdateQuestion();

  // 모달이 열릴 때마다 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen && questionData) {
      setQuestionTitle(questionData.title);
      setQuestions([...questionData.questions]);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, questionData]);

  const handleClose = () => {
    setQuestionTitle('');
    setQuestions(['']);
    setIsLoading(false);
    setError(null);
    setShowValidationModal(false);
    setValidationMessage('');
    onClose();
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, '']);
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[index] = value;
      return newQuestions;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 제목과 질문이 있는지 확인
    if (!questionTitle.trim()) {
      setValidationMessage('질문지 제목을 입력해주세요.');
      setShowValidationModal(true);
      return;
    }
    
    const validQuestions = questions.filter(q => q.trim() !== '');
    if (validQuestions.length === 0) {
      setValidationMessage('질문을 하나 이상 입력해주세요.');
      setShowValidationModal(true);
      return;
    }

    try {
      const updateQuestionDto: QuestionInfoDto = {
        id: questionData?.id || 0, // questionData가 null일 수 있으므로 0으로 대체
        title: questionTitle.trim(),
        questions: validQuestions
      };

      await updateQuestionMutation.mutateAsync({ 
        id: questionData?.id || 0, // questionData가 null일 수 있으므로 0으로 대체
        questionInfoDto: updateQuestionDto 
      });
      
      // 성공 시 콜백 실행
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error) {
      console.error('질문지 수정 실패:', error);
      setError('질문지 수정 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">질문지 수정</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">질문지 정보를 불러오는 중...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 질문지 제목 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                질문지 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="질문지 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 placeholder:font-medium text-gray-600"
                required
              />
            </div>

            {/* 질문 목록 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">질문 목록</h3>
              
              {questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                    질문 {index + 1}
                  </span>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    placeholder="질문을 입력하세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 placeholder:font-medium text-gray-600"
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateQuestionMutation.isPending}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateQuestionMutation.isPending ? '수정 중...' : '수정 완료'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 검증 모달 */}
      {showValidationModal && (
        <ValidationModal
          isOpen={showValidationModal}
          onConfirm={() => setShowValidationModal(false)}
          message={validationMessage}
        />
      )}
    </div>
  );
}
