"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { getAuthStatus } from "@/hooks/useAuth";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // 로그인 페이지인지 확인
  const isLoginPage = pathname === "/";
  
  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 보호된 라우트에서 인증 상태 확인
  useEffect(() => {
    if (!isClient || isLoginPage) return;
    
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!getAuthStatus()) {
      router.push("/");
    }
  }, [isClient, isLoginPage, router]);
  
  // 로그인 페이지일 때는 AdminLayout 없이 직접 렌더링
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  // 보호된 페이지일 때는 AdminLayout 사용
  return (
    <AdminLayout showLogout={true} showSidebar={true}>
      {children}
    </AdminLayout>
  );
} 