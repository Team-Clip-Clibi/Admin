"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

export default function HomePage() {
  const [apiResult, setApiResult] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 쿠키에서 CSRF 토큰을 가져오는 함수
  const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

  // API 호출 함수
  const callTest1Api = async () => {
    try {
      const csrfToken = getCookieValue('XSRF-TOKEN');
      
      if (!csrfToken) {
        throw new Error("CSRF 토큰을 찾을 수 없습니다.");
      }

      const response = await fetch("http://localhost:8080/office/admin/test1", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const result = await response.text();
      setApiResult(result);
    } catch (err) {
      console.error("API 호출 오류:", err);
      setError(err instanceof Error ? err.message : "API 호출에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callTest1Api();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <AdminLayout>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">홈 대시보드</h1>
          
          <div className="space-y-6">
            {/* API 결과 섹션 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">API 테스트 결과</h2>
              
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-gray-600">API 호출 중...</span>
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
                  {error}
                </div>
              )}
              
              {apiResult && !loading && (
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <h3 className="font-medium text-green-800 mb-2">API 응답:</h3>
                  <pre className="text-sm text-green-700 bg-white p-3 rounded border">
                    {apiResult}
                  </pre>
                </div>
              )}
              
              <button
                onClick={callTest1Api}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                API 다시 호출
              </button>
            </div>

            {/* 추가 콘텐츠 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">사용자 관리</h3>
                <p className="text-blue-600">사용자 계정 및 권한 관리</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">시스템 모니터링</h3>
                <p className="text-green-600">시스템 상태 및 성능 모니터링</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">설정</h3>
                <p className="text-orange-600">시스템 설정 및 구성 관리</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
    </div>
  );
}
