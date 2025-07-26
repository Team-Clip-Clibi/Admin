"use client";
import React from "react";

export default function MeetingPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">모임 관리</h1>
      
      <div className="space-y-6">
        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">모임 현황</h2>
          <p className="text-purple-600">모임 정보를 관리하고 일정을 조정합니다.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">모임 생성</h3>
            <p className="text-blue-600">새로운 모임을 생성합니다.</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">일정 관리</h3>
            <p className="text-green-600">모임 일정을 관리합니다.</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">참석자 관리</h3>
            <p className="text-orange-600">참석자 목록을 관리합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 