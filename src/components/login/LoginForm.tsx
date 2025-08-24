"use client";
import React, { useState, useEffect } from "react";
import { useLogin, useCsrfToken } from "@/hooks/useAuth";
import { sidebarMenu } from "@/components/core/sideBar/sideBar";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>();

  const { isLoading: isCsrfLoading, refetch: refetchCsrf } = useCsrfToken();
  const loginMutation = useLogin();

  // 로그아웃 후 재방문 시 입력 필드 초기화
  useEffect(() => {
    // localStorage에서 인증 상태 확인
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated === 'true') {
      // 이미 로그인된 경우 메인 페이지로 이동
      window.location.href = sidebarMenu[0].path;
    } else {
      // 로그아웃된 상태이거나 처음 방문한 경우 입력 필드 초기화
      setUsername("");
      setPassword("");
      setFormErrors({});
    }
  }, []);

  // 페이지 포커스 시 입력 필드 초기화 (로그아웃 후 재방문 대응)
  useEffect(() => {
    const handleFocus = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (isAuthenticated !== 'true') {
        setUsername("");
        setPassword("");
        setFormErrors({});
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const errors: FormErrors = {};
    if (!username.trim()) {
      errors.username = '사용자명을 입력해주세요.';
    }
    if (!password) {
      errors.password = '비밀번호를 입력해주세요.';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await refetchCsrf();
      setTimeout(() => {
        loginMutation.mutate(
          {
            username: username.trim(),
            password: password,
          },
          {
            onSuccess: () => {
              console.log('Login successful, clearing form fields...');
              
              // 입력 필드 즉시 초기화
              setUsername("");
              setPassword("");
              setFormErrors({});
              
              console.log('Form fields cleared, setting login state...');
              
              // 로그인 상태 설정
              localStorage.setItem('isAuthenticated', 'true');
              
              console.log('Login state set, redirecting in 200ms...');
              
              // 사용자가 입력 필드가 초기화된 것을 확인할 수 있도록 잠시 대기
              setTimeout(() => {
                console.log('Redirecting to:', sidebarMenu[0].path);
                window.location.href = sidebarMenu[0].path;
              }, 200);
            },
            onError: (error: unknown) => {
              console.log('Login failed:', error);
              // 에러 발생 시 비밀번호만 초기화
              setPassword("");
            }
          }
        );
      }, 100);
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
    }
  };

  // 입력 필드 변경 시 해당 에러 초기화
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (formErrors?.username) {
      setFormErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formErrors?.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* 로그인 폼 */}
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-4">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm font-bold">O</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Onething</h1>
          </div>
          <h2 className="text-xl font-medium text-gray-900">로그인</h2>
        </div>

        {/* 전역 에러 메시지 */}
        {loginMutation.error ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : '로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.'}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* 사용자명 입력 */}
            <div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="사용자명 입력하기"
                aria-label="사용자명"
                aria-invalid={!!formErrors?.username}
                aria-describedby={formErrors?.username ? "username-error" : undefined}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                  formErrors?.username
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200'
                }`}
                required
              />
              {formErrors?.username && (
                <span id="username-error" className="text-red-500 text-sm mt-1 block">
                  {formErrors.username}
                </span>
              )}
            </div>
            {/* 비밀번호 입력 */}
            <div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호 입력하기"
                aria-label="비밀번호"
                aria-invalid={!!formErrors?.password}
                aria-describedby={formErrors?.password ? "password-error" : undefined}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                  formErrors?.password
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200'
                }`}
                required
              />
              {formErrors?.password && (
                <span id="password-error" className="text-red-500 text-sm mt-1 block">
                  {formErrors.password}
                </span>
              )}
            </div>
            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loginMutation.isPending || isCsrfLoading || !username.trim() || !password}
              className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCsrfLoading ? "준비 중..." : loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}