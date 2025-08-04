import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHomeBannerInfo, getLoginBannerInfo, getNoticeInfo, deleteNotice, deleteHomeBanner, deleteLoginBanner, createNotice, createHomeBanner, getUploadUrl, createLoginBanner } from '@/apis/information/information';
import { HomeBannerInfoRequest, LoginBannerInfoRequest, NoticeInfoRequest } from '@/apis/information/informationType';

export const INFORMATION_QUERY_KEYS = {
  LOGIN_BANNER: 'loginBanner',
  HOME_BANNER: 'homeBanner',
  NOTICE: 'notice',
} as const;

export const useLoginBannerInfo = () => {
  return useQuery({
    queryKey: [INFORMATION_QUERY_KEYS.LOGIN_BANNER],
    queryFn: getLoginBannerInfo,
    staleTime: 30 * 60 * 1000, 
    gcTime: 60 * 60 * 1000, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useHomeBannerInfo = () => {
    return useQuery({
      queryKey: [INFORMATION_QUERY_KEYS.HOME_BANNER],
      queryFn: getHomeBannerInfo,
      staleTime: 30 * 60 * 1000, 
      gcTime: 60 * 60 * 1000, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });
  };

export const useNoticeInfo = () => {
    return useQuery({
        queryKey: [INFORMATION_QUERY_KEYS.NOTICE],
        queryFn: getNoticeInfo,
        staleTime: 30 * 60 * 1000, 
        gcTime: 60 * 60 * 1000, 
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useDeleteLoginBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteLoginBanner(id);
      if (!response.ok) throw new Error('삭제에 실패했습니다.');
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text);
    },
    onSuccess: () => {
      // 삭제 성공 시 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_QUERY_KEYS.LOGIN_BANNER],
      });
    },
    onError: (error) => {
      console.error('로그인 배너 삭제 실패:', error);
    },
  });
};

export const useDeleteHomeBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteHomeBanner(id);
      if (!response.ok) throw new Error('삭제에 실패했습니다.');
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_QUERY_KEYS.HOME_BANNER],
      });
    },
    onError: (error) => {
      console.error('홈 배너 삭제 실패:', error);
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteNotice(id);
      if (!response.ok) throw new Error('삭제에 실패했습니다.');
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_QUERY_KEYS.NOTICE],
      });
    },
    onError: (error) => {
      console.error('공지사항 삭제 실패:', error);
    },
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeInfo: NoticeInfoRequest) => {
      await createNotice(noticeInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_QUERY_KEYS.NOTICE],
      });
    },
    onError: (error) => {
      console.error('공지 생성 실패:', error);
    },
  });
};

export const useGetUploadUrl = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await getUploadUrl();
      return res;
    },
  });
};

export const useCreateHomeBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (homeBannerInfoRequest: HomeBannerInfoRequest) => {
      await createHomeBanner(homeBannerInfoRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_QUERY_KEYS.HOME_BANNER],
      });
    },
    onError: (error) => {
      console.error('홈 배너 생성 실패:', error);
    },
  });
};


export const useCreateLoginBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginBannerInfoRequest: LoginBannerInfoRequest) => {
      await createLoginBanner(loginBannerInfoRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INFORMATION_QUERY_KEYS.LOGIN_BANNER],
      });
    },
    onError: (error) => {
      console.error('로그인 배너 생성 실패:', error);
    },
  });
};