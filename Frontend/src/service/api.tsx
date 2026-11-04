import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuth } from "../secure/AuthContext.tsx";
import { Misc } from "../constants/misc.tsx";
// import { useAppStore } from "@/stores/app/app.store"; SPINNER

interface ApiError {
  message: string;
  status: number | null;
  config: InternalAxiosRequestConfig | null;
  response: any;
}

interface ApiResponse<T = any> {
  status: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp?: string;
  message?: string;
}

class ApiResponseWrapper<T> implements ApiResponse<T> {
  constructor(
    public status: boolean,
    public data: T | null,
    public error: ApiError | null = null,
    public timestamp?: string,
    public message?: string
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponseWrapper(true, data);
  }

  static error(error: ApiError): ApiResponse<never> {
    return new ApiResponseWrapper(false, null, error);
  }
}

export const useApiService = () => {
  const { accessToken, setAccessToken, logout, setLoading, user } = useAuth();
  const { ERROR_MESSAGE, HTTP_STATUS_CODE, NUMBER } = Misc();
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const apiClient: AxiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/`,
    timeout: 10000,
    headers: defaultHeaders,
    withCredentials: true,
  });

  // Request interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    async (error: AxiosError): Promise<ApiResponse<never>> => {
      // const appStore = useAppStore();
      // appStore.setSpinnerEnd(false);

      const { status, headers } = error.response || {};

      if (!error || status === undefined || status === NUMBER.ZERO) {
        return Promise.reject(
          ApiResponseWrapper.error({
            message: ERROR_MESSAGE.NETWORK_ERROR,
            status: null,
            config: error.config!,
            response: error.response,
          })
        );
      }

      if (status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
        return Promise.reject(
          ApiResponseWrapper.error({
            message: ERROR_MESSAGE.SERVER_ERROR,
            status,
            config: error.config!,
            response: error.response,
          })
        );
      }

      if (status === HTTP_STATUS_CODE.BAD_REQUEST) {
        return Promise.reject(
          ApiResponseWrapper.error({
            message: ERROR_MESSAGE.CLIENT_ERROR,
            status,
            config: error.config!,
            response: error.response,
          })
        );
      }

      if (status === HTTP_STATUS_CODE.FORBIDDEN) {
        //   const { default: NavigationService } = await getNavigationService()
        // appStore.setStatusUser(false);
        //   NavigationService.Base.toForbidden()

        return Promise.reject(
          ApiResponseWrapper.error({
            message: ERROR_MESSAGE.FORBIDDEN,
            status,
            config: error.config!,
            response: error.response,
          })
        );
      }

      if (status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        const plainHeaders: Record<string, string> = {};

        if (headers) {
          Object.keys(headers).forEach((key) => {
            const headerValue = headers[key];

            if (headerValue !== undefined) {
              plainHeaders[key] = headerValue;
            }
          });
        }

        return Promise.resolve(
          ApiResponseWrapper.error({
            message: ERROR_MESSAGE.INVALID_SESSION,
            status,
            config: error.config!,
            response: error.response,
          })
        );
      }

      return Promise.reject(
        ApiResponseWrapper.error({
          message: ERROR_MESSAGE.ERROR,
          status,
          config: error.config!,
          response: error.response,
        })
      );
    }
  );

  // Handle refresh token
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  apiClient.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.error.config;
      if (!user) return Promise.reject(err);
      if (!err.error.response || !originalRequest) {
        return Promise.reject(err);
      }

      const status = err.error.status;
      const shouldRetry = status === 401 || status === 403;

      if (shouldRetry && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest._retry = true;
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshRes = await apiClient.post(
            "/refresh",
            {},
            { withCredentials: true }
          );

          if (refreshRes.status !== 200) {
            processQueue(new Error("Refresh failed"), null);
            logout();
            return Promise.reject(err);
          }

          const newToken = refreshRes.data.accessToken;
          setAccessToken(newToken);
          apiClient.defaults.headers.common["Authorization"] =
            "Bearer " + newToken;
          processQueue(null, newToken);
          isRefreshing = false;

          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );

  // Handle response data
  const handleResponse = (response: AxiosResponse): ApiResponse<any> => {
    const { data } = response;

    if (data === "Blob" || data instanceof Blob) {
      return ApiResponseWrapper.success(window.URL.createObjectURL(data));
    }

    if (
      typeof data === "boolean" ||
      typeof data === "number" ||
      typeof data === "string"
    ) {
      return ApiResponseWrapper.success(data);
    }

    if (Array.isArray(data)) {
      return ApiResponseWrapper.success(data || []);
    }

    if (typeof data === "object") {
      return ApiResponseWrapper.success(data);
    }

    return ApiResponseWrapper.error({
      message: ERROR_MESSAGE.ERROR,
      status: null,
      config: null,
      response: response,
    });
  };

  // API service
  const apiService = {
    async getNoLoading<T>(
      endpoint: string,
      params: Record<string, any> = {}
    ): Promise<ApiResponse<T>> {
      try {
        const response = await apiClient.get<T>(endpoint, { params });
        return handleResponse(response);
      } catch (error: any) {
        return error;
      }
    },

    async postNoLoading<T>(
      endpoint: string,
      data: Record<string, any> = {}
    ): Promise<ApiResponse<T>> {
      try {
        const response = await apiClient.post<T>(endpoint, data);
        return handleResponse(response);
      } catch (error: any) {
        return error;
      }
    },
    async putNoLoading<T>(
      endpoint: string,
      data: Record<string, any> = {}
    ): Promise<ApiResponse<T>> {
      try {
        const response = await apiClient.put<T>(endpoint, data);
        return handleResponse(response);
      } catch (error: any) {
        return error;
      }
    },
    async get<T>(
      endpoint: string,
      params: Record<string, any> = {}
    ): Promise<ApiResponse<T>> {
      setLoading(true);
      try {
        const response = await apiClient.get<T>(endpoint, { params });
        setLoading(false);
        return handleResponse(response);
      } catch (error: any) {
        setLoading(false);

        return error;
      }
    },

    async post<T>(
      endpoint: string,
      data: Record<string, any> = {}
    ): Promise<ApiResponse<T>> {
      setLoading(true);
      try {
        const response = await apiClient.post<T>(endpoint, data);
        setLoading(false);
        return handleResponse(response);
      } catch (error: any) {
        setLoading(false);
        return error;
      }
    },

    async put<T>(
      endpoint: string,
      data: Record<string, any> = {}
    ): Promise<ApiResponse<T>> {
      setLoading(true);
      try {
        const response = await apiClient.put<T>(endpoint, data);
        setLoading(false);
        return handleResponse(response);
      } catch (error: any) {
        setLoading(false);
        return error;
      }
    },
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
      setLoading(true);

      try {
        const response = await apiClient.delete<T>(endpoint);
        setLoading(false);
        return handleResponse(response);
      } catch (error: any) {
        setLoading(false);
        return error;
      }
    },
  };

  return apiService;
};
