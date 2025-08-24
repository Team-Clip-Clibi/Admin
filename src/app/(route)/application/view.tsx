"use client";
import React, { useState, useEffect } from "react";
import AssignedTable from "./_components/AssignedTable";
import UnAssignedTable from "./_components/UnAssignedTable"
import ReviewTable from "./_components/ReviewTable";

type TabType = 'assigned' | 'unassigned' | 'review' | null;

export default function ApplicationView() {
  const [activeTab, setActiveTab] = useState<TabType>(null);

  useEffect(() => {
    const savedTab = window.localStorage.getItem('applicationActiveTab');
    if (savedTab === 'assigned' || savedTab === 'unassigned' || savedTab === 'review') {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const handleReset = () => {
      setActiveTab(null);
      window.localStorage.removeItem('applicationActiveTab');
    };
    window.addEventListener("resetApplicationTab", handleReset);
    return () => window.removeEventListener("resetApplicationTab", handleReset);
  }, []);

  const handleTabClick = (tab: 'assigned' | 'unassigned' | 'review') => {
    setActiveTab(tab);
    window.localStorage.setItem('applicationActiveTab', tab);
    window.history.pushState({ tab }, '', window.location.pathname);
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(null);
      window.localStorage.removeItem('applicationActiveTab');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderTable = () => {
    if (!activeTab) return null;
    
    switch (activeTab) {
      case 'assigned':
        return <AssignedTable />;
      case 'unassigned':
        return <UnAssignedTable />;
      case 'review':
        return <ReviewTable />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">신청 정보</h1>
      
      {activeTab === null && (
        <div className="space-y-6">
          <div 
            className="bg-purple-50 rounded-lg p-6 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => handleTabClick('assigned')}
          >
            <h2 className="text-lg font-semibold text-purple-800 mb-4">매칭 현황</h2>
            <p className="text-purple-600">매칭 현황을 관리합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleTabClick('unassigned')}
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">신청 현황</h3>
              <p className="text-blue-600">신청 현황을 관리합니다.</p>
            </div>
            <div 
              className="bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => handleTabClick('review')}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">리뷰 정보</h3>
              <p className="text-green-600">리뷰 정보를 관리합니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 탭이 선택된 경우 표 화면 */}
      {activeTab !== null && (
        <div className="h-[calc(100vh-200px)] overflow-y-auto border border-gray-200 rounded-lg">
          {renderTable()}
        </div>
      )}
    </div>
  );
} 