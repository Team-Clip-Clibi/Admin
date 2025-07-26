"use client";
import React from "react";

export default function InformationPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">정보 관리</h1>
      
      <div className="space-y-6">
        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-4">시스템 정보</h2>
          <p className="text-indigo-600">시스템 설정과 정보를 관리합니다.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">사용자 관리</h3>
            <p className="text-blue-600">사용자 계정과 권한을 관리합니다.</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">시스템 설정</h3>
            <p className="text-green-600">시스템 설정을 변경합니다.</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">데이터 백업</h3>
            <p className="text-orange-600">데이터를 백업하고 복원합니다.</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">로그 관리</h3>
            <p className="text-red-600">시스템 로그를 확인합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 