"use client";
import React from "react";
import AdminHeader from "@/components/core/header/AdminHeader";

type AdminLayoutProps = {
  children: React.ReactNode;
  userName?: string;
  showLogout?: boolean;
};

export default function AdminLayout({ children, showLogout = true }: AdminLayoutProps) {
  // 공통 로그아웃 함수
  const callLogoutApi = async () => {
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

    try {
      const csrfToken = getCookieValue('XSRF-TOKEN');
      if (!csrfToken) throw new Error("CSRF 토큰을 찾을 수 없습니다.");

      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
      });

      if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
      window.location.href = "/";
    } catch (err) {
      // 에러 핸들링 (필요시)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        rightContent={
          showLogout ? (
            <button
              onClick={callLogoutApi}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              로그아웃
            </button>
          ) : undefined
        }
      />
      {children}
    </div>
  );
}