"use client";
import React from "react";
import AdminHeader from "@/components/core/header/AdminHeader";
import Sidebar from "@/components/core/sideBar/sideBar";
import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";

type AdminLayoutProps = {
  children: React.ReactNode;
  showLogout?: boolean;
  showSidebar?: boolean;
};

export default function AdminLayout({ children, showLogout = true, showSidebar = true }: AdminLayoutProps) {

  const callLogoutApi = async () => {
    try {
      await callApi(API_ENDPOINTS.AUTH.LOGOUT, "POST");
      // 로그아웃 시 인증 상태 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
      }
      window.location.href = "/";
    } catch {
      // 에러가 발생해도 인증 상태는 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
      }
      window.location.href = "/";
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
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}