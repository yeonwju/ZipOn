/**
 * Fetch API Wrapper
 * 
 * axios처럼 사용할 수 있는 fetch 래퍼
 * - authFetch: 쿠키 포함 (인증 필요한 요청)
 * - publicFetch: 쿠키 미포함 (공개 요청)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

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
    fetchOptions.credentials = 'include'
  }

  // 요청 실행
  const response = await fetch(url, fetchOptions)

  // 에러 처리
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP Error: ${response.status}`)
  }

  // JSON 응답 파싱
  return response.json()
}

/**
 * 인증이 필요한 요청 (쿠키 포함)
 */
export const authFetch = {
  /**
   * GET 요청
   * @template TResponse - 응답 데이터 타입
   */
  get: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'GET' }, true) as Promise<TResponse>
  },

  /**
   * POST 요청
   * @template TResponse - 응답 데이터 타입
   * @template TData - 요청 데이터 타입
   */
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

  /**
   * PUT 요청
   * @template TResponse - 응답 데이터 타입
   * @template TData - 요청 데이터 타입
   */
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

  /**
   * PATCH 요청
   * @template TResponse - 응답 데이터 타입
   * @template TData - 요청 데이터 타입
   */
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

  /**
   * DELETE 요청
   * @template TResponse - 응답 데이터 타입
   */
  delete: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'DELETE' }, true) as Promise<TResponse>
  },
}

/**
 * 인증이 필요없는 공개 요청 (쿠키 미포함)
 */
export const publicFetch = {
  /**
   * GET 요청
   * @template TResponse - 응답 데이터 타입
   */
  get: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'GET' }, false) as Promise<TResponse>
  },

  /**
   * POST 요청
   * @template TResponse - 응답 데이터 타입
   * @template TData - 요청 데이터 타입
   */
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

  /**
   * PUT 요청
   * @template TResponse - 응답 데이터 타입
   * @template TData - 요청 데이터 타입
   */
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

  /**
   * PATCH 요청
   * @template TResponse - 응답 데이터 타입
   * @template TData - 요청 데이터 타입
   */
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

  /**
   * DELETE 요청
   * @template TResponse - 응답 데이터 타입
   */
  delete: <TResponse = unknown>(endpoint: string, options?: FetchOptions) => {
    return baseFetch(endpoint, { ...options, method: 'DELETE' }, false) as Promise<TResponse>
  },
}

