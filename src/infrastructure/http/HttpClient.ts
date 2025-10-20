import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 HTTP ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ HTTP ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ HTTP ${error.response?.status || 'Unknown'} ${error.config?.url}:`, error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  private handleError<T>(error: AxiosError): ApiResponse<T> {
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as any;
      return {
        success: false,
        error: responseData?.error || `HTTP ${error.response.status}: ${error.response.statusText}`,
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error: Unable to connect to the server',
        status: 0,
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        status: 0,
      };
    }
  }
}