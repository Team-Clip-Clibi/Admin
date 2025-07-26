"use client";
import React, { useState } from "react";
import { useLogin, useCsrfToken } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { sidebarMenu } from "@/components/core/sideBar/sideBar";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { isLoading: isCsrfLoading } = useCsrfToken();
  const loginMutation = useLogin();
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!username.trim()) {
      errors.username = "사용자명을 입력해주세요";
    }
    
    if (!password) {
      errors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 4) {
      errors.password = "비밀번호는 4자리 이상이어야 합니다";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    loginMutation.mutate(
      {
        username: username.trim(),
        password: password,
      },
      {
        onSuccess: () => {
          router.push(sidebarMenu[0].path);
        }
      }
    );
  };

  // 입력 필드 변경 시 해당 에러 초기화
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (formErrors.username) {
      setFormErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 로그인 폼 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-xl font-medium text-gray-900 text-center mb-6">
            로그인
          </h1>
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
                  aria-invalid={!!formErrors.username}
                  aria-describedby={formErrors.username ? "username-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                    formErrors.username 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.username && (
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
                  aria-invalid={!!formErrors.password}
                  aria-describedby={formErrors.password ? "password-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                    formErrors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.password && (
                  <span id="password-error" className="text-red-500 text-sm mt-1 block">
                    {formErrors.password}
                  </span>
                )}
              </div>
              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={loginMutation.isPending || isCsrfLoading}
                className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}