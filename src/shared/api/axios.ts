import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor - adds token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Queue to hold requests that arrive while a refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: AxiosError) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Response interceptor - silently refreshes expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ expired?: boolean }>) => {
    const originalRequest = error.config as RetryableRequest;
    const isExpired = error.response?.status === 401 && error.response?.data?.expired === true;

    if (!isExpired || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request until it finishes
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      // Use bare axios (not api) to avoid triggering this interceptor again
      const { data } = await axios.post<{
        token: string;
        refreshToken: string;
        data?: { permissions?: string[] };
      }>(
        `${import.meta.env.VITE_BASE_URL}/login/refresh`,
        { refreshToken }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      if (data.data?.permissions) {
        localStorage.setItem("permissions", JSON.stringify(data.data.permissions));
      }

      processQueue(null, data.token);
      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
