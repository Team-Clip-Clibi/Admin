"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/layout/AdminHeader";

export default function LoginForm() {
  const [username, setUsername] = useState(""); // email -> username으로 변경
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 쿠키에서 값을 가져오는 함수
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

  // 1. CSRF 토큰을 백엔드에서 받아오는 함수
  useEffect(() => {
    fetch("http://localhost:8080/login", { 
      method: "GET",
      credentials: "include" 
    })
      .then(async (res) => {
        // 응답 후 쿠키에서 CSRF 토큰 추출
        const token = getCookieValue('XSRF-TOKEN');
        if (token) {
          setCsrfToken(token);
        } else {
          throw new Error("CSRF 토큰을 찾을 수 없습니다.");
        }
      })
      .catch((err) => {
        console.error("CSRF 토큰 요청 오류:", err);
      });
  }, []);

  // 2. 로그인 폼 제출 핸들러 (Spring Security 기본 폼 로그인 방식)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!csrfToken) {
      setError("CSRF 토큰이 없습니다.");
      return;
    }

    try {
      // FormData를 사용하여 Spring Security 기본 폼 로그인 형식으로 전송
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('_csrf', csrfToken);

      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include", // 세션 쿠키 포함
        headers: {
          'X-XSRF-TOKEN': csrfToken, // 헤더에 CSRF 토큰 포함
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData // JSON이 아닌 FormData 사용
      });

      if (res.ok) {
        // 로그인 성공 시 홈 화면으로 리다이렉트
        window.location.href = "/home";
      } else {
        throw new Error("로그인 실패");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError("로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.");
    }
  };

  // 인증된 API 호출을 위한 헬퍼 함수
  const callProtectedApi = async (url: string, method: string = 'GET', data: any = null) => {
    const token = getCookieValue('XSRF-TOKEN');
    
    const options: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': token || ''
      }
    };

    if (data && method !== 'GET') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(data);
    }

    return await fetch(url, options);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <AdminHeader />

      {/* 로그인 폼 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-xl font-medium text-gray-900 text-center mb-6">
            로그인
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자명 입력하기"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-900"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력하기"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-900"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}