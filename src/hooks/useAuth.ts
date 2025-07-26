import { useMutation, useQuery } from '@tanstack/react-query';
import { login, getCsrfToken} from '@/apis/auth/auth';
import { LoginRequest } from '@/apis/auth/authType';

export const useCsrfToken = () => {
  return useQuery({
    queryKey: ['csrf-token'],
    queryFn: getCsrfToken,
    staleTime: 30 * 60 * 1000, // 30분
    retry: 1,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (loginData: LoginRequest) => login(loginData),
  });
};
