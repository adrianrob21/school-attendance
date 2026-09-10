import axios, {
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import endpoints from "Endpoints";

import type {
  TokenType,
  RefreshTokenResponse,
  QueueItem,
  ApiConfig,
  ApiErrorResponse,
  ApiMethods,
} from "./types";

let TOKEN: TokenType = null;
let REFRESH_TOKEN: TokenType = null;

let isRefreshing: boolean = false;
let failedQueue: QueueItem[] = [];

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_TIME_OUT),
});

const defaultConfig: ApiConfig = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  internal: false,
};

const interceptors = {
  config: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (TOKEN && (config as ApiConfig & InternalAxiosRequestConfig).internal) {
      config.headers = config.headers || {};
      config.headers.Authorization = "Bearer " + TOKEN;
    }

    return config;
  },

  response: (response: AxiosResponse): AxiosResponse => response,

  responseError: async (
    error: AxiosError<ApiErrorResponse>,
  ): Promise<AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.config?.url === endpoints.REFRESH_TOKEN &&
      error.response?.status === 401
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ reject, resolve });
          });
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshAccessToken();

        Api.setToken(data.accessToken);
        Api.setRefreshToken(data.refreshToken);

        processQueue(null, data.accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        Api.setRefreshToken(null);
        Api.setToken(null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error?.response?.data || error);
  },
};

const resolveQueueItem = (
  error: any,
  token: string | null,
  prom: QueueItem,
): void => {
  if (error) {
    prom.reject(error);
  } else {
    prom.resolve(token!);
  }
};

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(resolveQueueItem.bind(null, error, token));
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  const response = await Api.post<RefreshTokenResponse>(
    endpoints.REFRESH_TOKEN,
    {
      refreshToken: REFRESH_TOKEN,
    },
  );

  return response.data;
};

api.interceptors.request.use(interceptors.config);
api.interceptors.response.use(
  interceptors.response,
  interceptors.responseError,
);

const Api: ApiMethods = {
  API_CALL: "API_CALL",
  API_ERROR: "API_ERROR",

  clearSessionAction: (): TokenType => (TOKEN = null),

  delete: <T = any>(
    path: string,
    config: ApiConfig = defaultConfig,
  ): Promise<AxiosResponse<T>> => {
    const request = api.delete<T>(path, {
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return request;
  },

  endpoints,

  get: (
    path: string,
    config: ApiConfig = defaultConfig,
  ): Promise<AxiosResponse> => {
    const { signal, ...restOfConfig } = config || {};
    const request = api.get(path, {
      ...restOfConfig,
      headers: {
        ...(config ? config.headers : defaultConfig.headers),
      },
      signal,
    });
    return request;
  },

  getRefreshToken: (): TokenType => REFRESH_TOKEN,

  getToken: (): TokenType => TOKEN,

  NETWORK_ERROR: "NETWORK_ERROR",

  options: <T = any>(
    path: string,
    config: ApiConfig = defaultConfig,
  ): Promise<AxiosResponse<T>> => {
    const request = api.options<T>(path, {
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return request;
  },

  patch: <T = any>(
    path: string,
    body?: any,
    config: ApiConfig = defaultConfig,
  ): Promise<AxiosResponse<T>> => {
    const request = api.patch<T>(path, body, {
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return request;
  },

  post: <T = any>(
    path: string,
    body?: any,
    config: ApiConfig = defaultConfig,
  ): Promise<AxiosResponse<T>> => {
    const { signal, ...restOfConfig } = config || {};

    const request = api.post<T>(path, body, {
      ...restOfConfig,
      headers: {
        ...config.headers,
      },
      signal,
    });
    return request;
  },

  put: <T = any>(
    path: string,
    body?: any,
    config: ApiConfig = defaultConfig,
  ): Promise<AxiosResponse<T>> => {
    const request = api.put<T>(path, body, {
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return request;
  },

  setRefreshToken: (refreshToken: TokenType): void => {
    if (refreshToken) {
      REFRESH_TOKEN = refreshToken;
    } else {
      REFRESH_TOKEN = null;
    }
  },

  setToken: (token: TokenType): void => {
    if (token) {
      TOKEN = token;
    } else {
      TOKEN = null;
    }
  },
};

export default Api;
