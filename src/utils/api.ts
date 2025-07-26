import { getCookieValue } from "./cookie";

export interface ApiOptions {
  isFormData?: boolean; 
}

export async function callApi(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  options: ApiOptions = {}
) {
  const csrfToken = getCookieValue("XSRF-TOKEN");
  const { isFormData = false } = options;

  const headers: Record<string, string> = {};
  
  if (isFormData) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else {
    headers["Content-Type"] = "application/json";
  }
  
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  const fetchOptions: RequestInit = {
    method,
    credentials: "include",
    headers,
    redirect: "follow", // 리디렉트 자동 처리
  };

  if (data && method !== "GET") {
    if (isFormData) {
      const formData = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      fetchOptions.body = formData.toString();
    } else {
      fetchOptions.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // 리디렉트가 발생했는지 확인
    if (response.redirected) {
      console.log('리디렉트 발생:', response.url);
    }

    // Spring Security 로그인 성공/실패 판단
    if (response.url.includes('/login?error')) {
      // 명시적 에러 페이지 - 로그인 실패
      console.log('로그인 실패 감지: /login?error');
      throw new Error('로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.');
    } else if (response.url.endsWith('/') || response.url === 'http://localhost:8080/') {
      // 루트로 리디렉트 - 로그인 성공으로 처리
      console.log('로그인 성공 감지: 루트로 리디렉트');
      return response; // 성공으로 처리
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API 호출 실패: ${response.status}`);
    }

    return response;
  } catch (error) {
    throw error;
  }
}   
