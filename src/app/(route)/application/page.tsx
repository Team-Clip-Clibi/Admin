"use client";
import React from "react";

export default function ApplicationPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">신청정보 관리</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">신청 현황</h2>
          <p className="text-blue-600">신청 정보를 관리하고 모니터링합니다.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">신청 목록</h3>
            <p className="text-green-600">모든 신청 내역을 확인합니다.</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">승인 관리</h3>
            <p className="text-orange-600">신청 승인/거절을 처리합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 