import { useMutation, useQuery } from '@tanstack/react-query';
import { login, getCsrfToken, logout } from '@/apis/auth/auth';
import { LoginRequest } from '@/apis/auth/authType';

export const useCsrfToken = () => {
  return useQuery({
    queryKey: ['csrf-token'],
    queryFn: getCsrfToken,
    staleTime: 5 * 60 * 1000, // 5분으로 단축
    retry: 3, // 재시도 횟수 증가
    retryDelay: 1000, // 재시도 간격 1초
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (loginData: LoginRequest) => login(loginData),
    // onSuccess는 LoginForm에서 처리
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 로그아웃 시 인증 상태 제거
      localStorage.removeItem('isAuthenticated');
      window.location.href = "/";
    },
  });
};

// 클라이언트 사이드에서 인증 상태 확인 (localStorage 기반)
export const getAuthStatus = (): boolean => {
  // 서버 사이드 렌더링 시에는 항상 false 반환
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem('isAuthenticated') === 'true';
  } catch {
    // localStorage 접근 실패 시 false 반환
    return false;
  }
};
