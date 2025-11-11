/**
 * Fetch API Wrapper
 *
 * - authFetch: 쿠키 포함 (인증 필요한 요청)
 * - publicFetch: 쿠키 미포함 (공개 요청)
 * 
 * Note: cookies()는 동적 import로 Server Component에서만 사용
 */
import { API_BASE_URL } from '@/constants'

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

/**
 * 공통 fetch 로직
 */
async function baseFetch(
  endpoint: string,
  options: FetchOptions = {},
  includeCredentials: boolean = false
) {
  const { params, headers, ...restOptions } = options

  // URL 생성
  let url = `${API_BASE_URL}${endpoint}`

  // 쿼리 파라미터 추가
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    url += `?${searchParams.toString()}`
  }

  // 요청 옵션 설정
  const fetchOptions: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // 쿠키 포함 여부
  if (includeCredentials) {
    if (typeof window === 'undefined') {
      // 서버 사이드: cookies()로 읽어서 헤더에 추가
      try {
        // 동적 import로 Server Component에서만 사용
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('AT')?.value

        if (accessToken) {
          fetchOptions.headers = {
            ...fetchOptions.headers,
            Cookie: `AT=${accessToken}`,
            Authorization: `Bearer ${accessToken}`,
          }
        }
      } catch (error) {
        // 개발 환경에서는 상세 에러 숨김
        if (process.env.NODE_ENV === 'development') {
          // cookies() 사용 실패는 정상적인 경우 (Client Component에서 호출)
        } else {
          console.error('[authFetch] 쿠키 읽기 실패:', error)
        }
      }
    } else {
      // 클라이언트 사이드: credentials: 'include'
      fetchOptions.credentials = 'include'
    }
  }

  // 요청 실행
  const response = await fetch(url, fetchOptions)

  // 에러 처리
  if (!response.ok) {
    const contentType = response.headers.get('content-type')

    console.error('=== API 에러 발생 ===')
    console.error('URL:', url)
    console.error('Method:', fetchOptions.method)
    console.error('Status:', response.status, response.statusText)
    console.error('Content-Type:', contentType)

    // JSON 에러 응답 처리
    if (contentType?.includes('application/json')) {
      try {
        const error = await response.json()
        console.error('에러 응답 body:', error)
        throw new Error(error.message || error.error || `HTTP Error: ${response.status}`)
      } catch (parseError) {
        console.error('에러 응답 파싱 실패:', parseError)
        throw new Error(`HTTP Error: ${response.status}`)
      }
    }

    // HTML 또는 기타 에러 응답 처리
    try {
      const errorText = await response.text()
      console.error('에러 응답 텍스트:', errorText.substring(0, 500)) // 처음 500자만
    } catch (e) {
      console.error('에러 응답 읽기 실패:', e)
    }
    
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
  }

  // 성공 응답 파싱
  return response.json()
}

/**
 * 인증이 필요한 요청 (쿠키 포함)
 */
export const authFetch = {
  get: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'GET' }, true) as Promise<TResponse>
  },

  post: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: FetchOptions
  ) => {
    return baseFetch(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      true
    ) as Promise<TResponse>
  },

  put: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: FetchOptions
  ) => {
    return baseFetch(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      true
    ) as Promise<TResponse>
  },

  patch: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: FetchOptions
  ) => {
    return baseFetch(
      endpoint,
      {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      true
    ) as Promise<TResponse>
  },

  delete: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'DELETE' }, true) as Promise<TResponse>
  },
}

/**
 * 인증이 필요없는 공개 요청 (쿠키 미포함)
 */
export const publicFetch = {
  get: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'GET' }, false) as Promise<TResponse>
  },

  post: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: FetchOptions
  ) => {
    return baseFetch(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      false
    ) as Promise<TResponse>
  },

  put: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: FetchOptions
  ) => {
    return baseFetch(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      false
    ) as Promise<TResponse>
  },

  patch: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: FetchOptions
  ) => {
    return baseFetch(
      endpoint,
      {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      false
    ) as Promise<TResponse>
  },

  delete: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'DELETE' }, false) as Promise<TResponse>
  },
}
