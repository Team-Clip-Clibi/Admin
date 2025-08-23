"use client";
import React, { useState, useEffect } from "react";
import OneThingTable from "./_components/OneThingTable";
import RandomTable from "./_components/RandomTable";
import QuestionTable from "./_components/QuestionTable";

type TabType = 'oneThing' | 'random' | 'question' | null;

export default function InformationView() {
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedTab = window.localStorage.getItem('informationActiveTab');
    if (savedTab === 'oneThing' || savedTab === 'random' || savedTab === 'question') {
      setActiveTab(savedTab);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    const handleReset = () => {
      setActiveTab(null);
      window.localStorage.removeItem('informationActiveTab');
    };
    window.addEventListener("resetInformationTab", handleReset);
    return () => window.removeEventListener("resetInformationTab", handleReset);
  }, []);

  const handleTabClick = (tab: 'oneThing' | 'random' | 'question') => {
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

  if (!initialized) return null;



  const renderTable = () => {
    if (!activeTab) return null;
    
    switch (activeTab) {
      case 'oneThing':
        return <OneThingTable />;
      case 'random':
        return <RandomTable />;
      case 'question':
        return <QuestionTable />;
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
            onClick={() => handleTabClick('oneThing')}
          >
            <h2 className="text-lg font-semibold text-purple-800 mb-4">원띵 모임</h2>
            <p className="text-purple-600">원띵 모임을 관리합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleTabClick('random')}
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">랜덤 모임</h3>
              <p className="text-blue-600">랜덤 모임을 관리합니다.</p>
            </div>
            
            <div 
              className="bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => handleTabClick('question')}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">질문지</h3>
              <p className="text-green-600">질문지를 관리합니다.</p>
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