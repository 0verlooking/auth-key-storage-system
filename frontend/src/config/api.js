import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, ROUTES, HTTP_STATUS, ERROR_MESSAGES } from './constants';
import { storageService } from '@services/storageService';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = storageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for timeout tracking
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    response.duration = duration;

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Network error
    if (!error.response) {
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        type: 'network_error',
      });
    }

    const { status, data } = error.response;

    // Handle different error status codes
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Token expired - try to refresh
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = storageService.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                refresh_token: refreshToken,
              });

              const { token } = response.data;
              storageService.setAuthToken(token);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - clear storage and redirect to login
            storageService.clearAuth();
            window.location.href = ROUTES.LOGIN;
            return Promise.reject({
              message: ERROR_MESSAGES.SESSION_EXPIRED,
              type: 'session_expired',
            });
          }
        }

        // Clear auth and redirect to login
        storageService.clearAuth();
        window.location.href = ROUTES.LOGIN;
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          type: 'unauthorized',
        });

      case HTTP_STATUS.FORBIDDEN:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.FORBIDDEN,
          type: 'forbidden',
        });

      case HTTP_STATUS.NOT_FOUND:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.NOT_FOUND,
          type: 'not_found',
        });

      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          type: 'validation_error',
          errors: data?.errors || {},
        });

      case HTTP_STATUS.CONFLICT:
        return Promise.reject({
          message: data?.message || 'Resource already exists',
          type: 'conflict',
        });

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      default:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
          type: 'server_error',
        });
    }
  }
);

// Helper methods for API calls
export const apiClient = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

// Request cancellation helper
export const createCancelToken = () => {
  const CancelToken = axios.CancelToken;
  return CancelToken.source();
};

// Check if error is cancellation
export const isCancel = (error) => {
  return axios.isCancel(error);
};

export default api;
