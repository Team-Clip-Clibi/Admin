import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  return useMutation({
    mutationFn: (loginData: LoginRequest) => {
      return login(loginData);
    },
    onSuccess: () => {
      router.push('/home');
    },
    onError: (error: unknown) => {
      console.error("로그인 오류:", error);
    }
  });
};
