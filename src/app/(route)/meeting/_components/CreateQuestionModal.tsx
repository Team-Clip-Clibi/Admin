"use client";
import React, { useState } from "react";
import { MatchingType } from "@/apis/meeting/meetingType";
import { MatchingQuestionListParams } from "@/apis/meeting/questionType";
import { useCreateOneThingQuestion, useCreateRandomQuestion, useOneThingMatchingQuestionList, useRandomMatchingQuestionList } from "@/hooks/useQuestion";
import { useSlice } from "@/hooks/useSlice";
import { Pagination } from "@/components/core/pagination/Pagination";
import ConfirmModal from "@/components/core/modal/ConfirmModal";
import ValidationModal from "@/components/core/modal/ValidationModal";

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MeetingInfo {
  id: number;
  restaurantName: string;
  address: string;
  dateTime: string;
  type: MatchingType;
}

export default function CreateQuestionModal({ isOpen, onClose }: CreateQuestionModalProps) {
  const [currentStep, setCurrentStep] = useState<'meeting-list' | 'question-creation'>('meeting-list'); 
  const [questions, setQuestions] = useState<string[]>(['']);
  const [questionTitle, setQuestionTitle] = useState(''); 
  const [selectedType, setSelectedType] = useState<MatchingType>(MatchingType.ONETHING);
  const [currentPage, setCurrentPage] = useState(0);
  
  // 확인 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTypeChange, setPendingTypeChange] = useState<MatchingType | null>(null);
  
  // 입력 검증 모달 상태
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  // 원띵/랜덤 질문지 생성 훅
  const createOneThingQuestionMutation = useCreateOneThingQuestion();
  const createRandomQuestionMutation = useCreateRandomQuestion();

  // 타입별 선택된 모임 상태를 독립적으로 관리
  const [oneThingSelectedMeetings, setOneThingSelectedMeetings] = useState<MeetingInfo[]>([]);
  const [randomSelectedMeetings, setRandomSelectedMeetings] = useState<MeetingInfo[]>([]);

  // API 파라미터
  const apiParams: MatchingQuestionListParams = {
    page: Math.max(0, currentPage || 0),
    hasQuestion: false, // 질문이 없는 모임만 조회
  };

  // 원띵/랜덤 모임 리스트 API 호출
  const { data: oneThingMeetingList, isLoading: oneThingLoading, error: oneThingError } = useOneThingMatchingQuestionList(apiParams, {
    enabled: isOpen
  });
  const { data: randomMeetingList, isLoading: randomLoading, error: randomError } = useRandomMatchingQuestionList(apiParams, {
    enabled: isOpen
  });

  // 현재 선택된 타입에 따른 데이터와 로딩/에러 상태
  const currentMeetingList = selectedType === MatchingType.ONETHING ? oneThingMeetingList : randomMeetingList;
  const isLoading = selectedType === MatchingType.ONETHING ? oneThingLoading : randomLoading;
  const error = selectedType === MatchingType.ONETHING ? oneThingError : randomError;

  const sliceUtils = useSlice(currentMeetingList);
  const paginationState = sliceUtils.getPaginationState();

  // 현재 타입에 따른 선택된 모임들
  const currentTypeSelectedMeetings = selectedType === MatchingType.ONETHING 
    ? oneThingSelectedMeetings 
    : randomSelectedMeetings;

  const handleMeetingSelect = (meeting: MeetingInfo) => {
    if (selectedType === MatchingType.ONETHING) {
      setOneThingSelectedMeetings(prev => {
        const isAlreadySelected = prev.find(m => m.id === meeting.id);
        if (isAlreadySelected) {
          // 이미 선택된 경우 제거
          return prev.filter(m => m.id !== meeting.id);
        } else {
          // 선택되지 않은 경우 추가
          return [...prev, meeting];
        }
      });
    } else {
      setRandomSelectedMeetings(prev => {
        const isAlreadySelected = prev.find(m => m.id === meeting.id);
        if (isAlreadySelected) {
          // 이미 선택된 경우 제거
          return prev.filter(m => m.id !== meeting.id);
        } else {
          // 선택되지 않은 경우 추가
          return [...prev, meeting];
        }
      });
    }
  };

  const handleTypeChange = (type: MatchingType) => {
    // 이미 다른 타입에서 모임을 선택한 경우 확인 모달 표시
    if (type !== selectedType) {
      const otherTypeMeetings = type === MatchingType.ONETHING ? randomSelectedMeetings : oneThingSelectedMeetings;
      if (otherTypeMeetings.length > 0) {
        setPendingTypeChange(type);
        setShowConfirmModal(true);
        return;
      }
    }

    performTypeChange(type);
  };

  const performTypeChange = (type: MatchingType) => {
    // 다른 타입의 선택 초기화
    if (type === MatchingType.ONETHING) {
      setRandomSelectedMeetings([]);
    } else {
      setOneThingSelectedMeetings([]);
    }
    
    setSelectedType(type);
    setCurrentPage(0); // 타입 변경 시 첫 페이지로 이동
  };

  const handleConfirmTypeChange = () => {
    if (pendingTypeChange) {
      performTypeChange(pendingTypeChange);
      setPendingTypeChange(null);
      setShowConfirmModal(false);
    }
  };

  const handleCancelTypeChange = () => {
    setPendingTypeChange(null);
    setShowConfirmModal(false);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < paginationState.totalPages && !isNaN(page)) {
      setCurrentPage(page);
    }
  };

  const handleBackToList = () => {
    setCurrentStep('meeting-list');
    setQuestions(['']);
    setQuestionTitle('');
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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // 현재 선택된 타입에 따라 다른 API 호출
    const createQuestionDto = {
      title: questionTitle.trim(),
      questions: validQuestions,
      meetingIds: currentTypeSelectedMeetings.map(m => m.id)
    };
    
    if (selectedType === MatchingType.ONETHING) {
      createOneThingQuestionMutation.mutate(createQuestionDto);
    } else {
      createRandomQuestionMutation.mutate(createQuestionDto);
    }
    
    handleClose();
  };

  const handleClose = () => {
    // 모든 상태 초기화
    setCurrentStep('meeting-list');
    setQuestions(['']);
    setQuestionTitle('');
    setSelectedType(MatchingType.ONETHING);
    setCurrentPage(0);
    setOneThingSelectedMeetings([]);
    setRandomSelectedMeetings([]);
    setShowConfirmModal(false);
    setPendingTypeChange(null);
    setShowValidationModal(false);
    setValidationMessage('');
    
    // 모달 닫기
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {currentStep === 'meeting-list' ? '모임 선택' : '질문지 생성'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {currentStep === 'meeting-list' ? (
          /* 첫 번째 단계: 모임 정보 리스트 */
          <div>
            {/* 타입 필터 */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange(MatchingType.ONETHING)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedType === MatchingType.ONETHING
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  원띵
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange(MatchingType.RANDOM)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedType === MatchingType.RANDOM
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  랜덤
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">모임 정보를 불러오는 중...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-red-500">모임 정보를 불러오는 중 오류가 발생했습니다.</div>
              </div>
            ) : (
              <>
                {/* 테이블 형식으로 모임 리스트 표시 */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={sliceUtils.content.length > 0 && currentTypeSelectedMeetings.length === sliceUtils.content.length}
                            onChange={() => {
                              if (currentTypeSelectedMeetings.length === sliceUtils.content.length) {
                                // 현재 타입의 모든 선택 해제
                                if (selectedType === MatchingType.ONETHING) {
                                  setOneThingSelectedMeetings([]);
                                } else {
                                  setRandomSelectedMeetings([]);
                                }
                              } else {
                                // 현재 타입의 모든 항목 선택
                                const newSelectedMeetings = sliceUtils.content.map((item) => ({
                                  id: item.matchingId,
                                  restaurantName: item.restaurantName,
                                  address: item.address,
                                  dateTime: item.dateTime,
                                  type: selectedType
                                }));
                                
                                if (selectedType === MatchingType.ONETHING) {
                                  setOneThingSelectedMeetings(newSelectedMeetings);
                                } else {
                                  setRandomSelectedMeetings(newSelectedMeetings);
                                }
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">No</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">가게명</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">주소</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sliceUtils.content.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                            데이터가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        sliceUtils.content.map((item, index: number) => {
                          const isSelected = currentTypeSelectedMeetings.find(m => m.id === item.matchingId);
                          return (
                            <tr key={item.matchingId} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected ? true : false}
                                  onChange={() => handleMeetingSelect({
                                    id: item.matchingId,
                                    restaurantName: item.restaurantName,
                                    address: item.address,
                                    dateTime: item.dateTime,
                                    type: selectedType
                                  })}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-700">
                                {sliceUtils.getItemNumber(index)}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.restaurantName}</td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.address}</td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-700">{item.dateTime}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {!isLoading && !error && currentMeetingList && (
                  <div className="mt-6">
                    <Pagination
                      sliceUtils={{
                        currentPage: sliceUtils.currentPage,
                        pageSize: sliceUtils.pageSize,
                        isFirstPage: sliceUtils.isFirstPage,
                        isLastPage: sliceUtils.isLastPage,
                        hasPreviousPage: sliceUtils.hasPreviousPage,
                        hasNextPage: sliceUtils.hasNextPage,
                        shouldShowPagination: sliceUtils.shouldShowPagination,
                      }}
                      paginationState={{
                        pageNumbers: paginationState.pageNumbers,
                        totalPages: paginationState.totalPages,
                        showEllipsisAfter: paginationState.showEllipsisAfter,
                        showLastPage: paginationState.showLastPage,
                      }}
                      onPageChange={handlePageChange}
                      onPrevPage={() => {
                        if (currentPage > 0) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      onNextPage={() => {
                        if (paginationState.totalPages > 0 && currentPage < paginationState.totalPages - 1) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                    />
                  </div>
                )}
                
                {/* 다음 단계로 진행 버튼 */}
                {currentTypeSelectedMeetings.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setCurrentStep('question-creation')}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      선택된 모임으로 질문지 생성하기 ({currentTypeSelectedMeetings.length}개)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* 두 번째 단계: 질문지 생성 */
          <div>
            {/* 모든 타입에서 선택된 모임들을 표시 */}
            {(() => {
              const allSelectedMeetings = [...oneThingSelectedMeetings, ...randomSelectedMeetings];
              return allSelectedMeetings.length > 0 ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">선택된 모임 ({allSelectedMeetings.length}개)</h3>
                  <div className="space-y-2">
                    {allSelectedMeetings.map((meeting, index) => (
                      <div key={meeting.id} className="text-sm text-gray-600 border-l-4 border-blue-500 pl-3">
                        <p><strong>모임 {index + 1}:</strong> {meeting.restaurantName}</p>
                        <p><strong>주소:</strong> {meeting.address}</p>
                        <p><strong>날짜:</strong> {meeting.dateTime}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">질문지 생성</h3>
              
              {/* 질문지 제목 입력 */}
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
              
              <h4 className="font-semibold text-gray-900">질문 생성</h4>
              
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
            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={handleBackToList}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                ← 모임 목록으로
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
                >
                  완료
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmTypeChange}
          onCancel={handleCancelTypeChange}
          title="타입 변경 경고"
          message={`현재 ${pendingTypeChange === MatchingType.ONETHING ? '랜덤' : '원띵'}에서 선택된 모임이 있습니다. 타입을 변경하면 이전 선택이 초기화됩니다. 계속하시겠습니까?`}
          type="warning"
        />
      )}
      { showValidationModal && (
        <ValidationModal
          isOpen={showValidationModal}
          onConfirm={() => setShowValidationModal(false)}
          message={validationMessage}
        />
      )}  
    </div>
  );
}
