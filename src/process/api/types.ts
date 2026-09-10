import type { AxiosRequestConfig, AxiosResponse } from "axios";

import endpoints from "Endpoints";

export type TokenType = string | null;

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface QueueItem {
  reject: (error: any) => void;
  resolve: (token: string) => void;
}

export interface ApiConfig extends AxiosRequestConfig {
  internal?: boolean;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface ApiMethods {
  API_CALL: string;
  API_ERROR: string;

  clearSessionAction: () => TokenType;
  delete: <T = any>(
    path: string,
    config?: ApiConfig,
  ) => Promise<AxiosResponse<T>>;
  endpoints: typeof endpoints;
  get: <T = any>(path: string, config?: ApiConfig) => Promise<AxiosResponse<T>>;
  getRefreshToken: () => TokenType;
  getToken: () => TokenType;
  NETWORK_ERROR: string;
  options: <T = any>(
    path: string,
    config?: ApiConfig,
  ) => Promise<AxiosResponse<T>>;
  patch: <T = any>(
    path: string,
    body?: any,
    config?: ApiConfig,
  ) => Promise<AxiosResponse<T>>;
  post: <T = any>(
    path: string,
    body?: any,
    config?: ApiConfig,
  ) => Promise<AxiosResponse<T>>;
  put: <T = any>(
    path: string,
    body?: any,
    config?: ApiConfig,
  ) => Promise<AxiosResponse<T>>;
  setRefreshToken: (refreshToken: TokenType) => void;
  setToken: (token: TokenType) => void;
}
