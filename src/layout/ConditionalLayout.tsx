"use client";
import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // 로그인 페이지인지 확인
  const isLoginPage = pathname === "/"
  
  return (
    <AdminLayout showLogout={!isLoginPage} showSidebar={!isLoginPage}>
      {children}
    </AdminLayout>
  );
} 