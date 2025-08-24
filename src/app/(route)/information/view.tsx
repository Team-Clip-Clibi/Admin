"use client";
import React, { useState, useEffect } from "react";
import LoginBannerTable from "./_components/LoginBannerTable";
import HomeTopTable from "./_components/HomeTopTable";
import HomeBottomTable from "./_components/HomeBottomTable";

type TabType = 'login' | 'homeTop' | 'homeBottom' | null;

export default function InformationView() {
  const [activeTab, setActiveTab] = useState<TabType>(null);

  useEffect(() => {
    const savedTab = window.localStorage.getItem('informationActiveTab');
    if (savedTab === 'login' || savedTab === 'homeTop' || savedTab === 'homeBottom') {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const handleReset = () => {
      setActiveTab(null);
      window.localStorage.removeItem('informationActiveTab');
    };
    window.addEventListener("resetInformationTab", handleReset);
    return () => window.removeEventListener("resetInformationTab", handleReset);
  }, []);

  const handleTabClick = (tab: 'login' | 'homeTop' | 'homeBottom') => {
    setActiveTab(tab);
    window.localStorage.setItem('informationActiveTab', tab);
    window.history.pushState({ tab }, '', window.location.pathname);
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(null);
      window.localStorage.removeItem('informationActiveTab');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const renderTable = () => {
    if (!activeTab) return null;
    
    switch (activeTab) {
      case 'login':
        return <LoginBannerTable />;
      case 'homeTop':
        return <HomeTopTable />;
      case 'homeBottom':
        return <HomeBottomTable />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">정보 관리</h1>
      
      {activeTab === null && (
        <div className="space-y-6">
          <div 
            className="bg-purple-50 rounded-lg p-6 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => handleTabClick('login')}
          >
            <h2 className="text-lg font-semibold text-purple-800 mb-4">로그인 배너</h2>
            <p className="text-purple-600">로그인 배너를 관리합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleTabClick('homeTop')}
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">홈 상단 공지</h3>
              <p className="text-blue-600">홈 상단 공지를 관리합니다.</p>
            </div>
            
            <div 
              className="bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => handleTabClick('homeBottom')}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">홈 하단 배너</h3>
              <p className="text-green-600">홈 하단 배너를 관리합니다.</p>
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