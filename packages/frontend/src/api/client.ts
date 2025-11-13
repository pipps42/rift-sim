/**
 * API Client
 *
 * Base HTTP client for communicating with the Riftbound backend API.
 * Uses native fetch with error handling and type safety.
 */

import { ApiError } from './types';

/**
 * Base API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * HTTP request options
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Create abort controller with timeout
 */
function createAbortController(timeout: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
}

/**
 * Base API client with error handling
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an HTTP request to the API
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = DEFAULT_TIMEOUT,
    } = options;

    // Build request URL
    const url = `${this.baseUrl}${endpoint}`;

    // Create abort controller for timeout
    const controller = createAbortController(timeout);

    // Build request headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Build request init
    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    // Add body if present
    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    try {
      // Make the request
      const response = await fetch(url, requestInit);

      // Parse response
      const json = await response.json();

      // Check for error status
      if (!response.ok) {
        throw new ApiError(
          json.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          json.code
        );
      }

      // Backend wraps responses in { success, data } - extract the data property
      if (json && typeof json === 'object' && 'data' in json) {
        return json.data as T;
      }

      // Fallback: return as-is if no wrapper
      return json as T;
    } catch (error) {
      // Handle abort (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError('Network error: Unable to reach server', 0);
      }

      // Re-throw API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Unknown error
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();
