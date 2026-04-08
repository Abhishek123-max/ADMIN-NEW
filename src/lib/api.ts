import axios from 'axios';
import type { AxiosError } from 'axios';

const rawBaseURL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim();
const isBrowser = typeof window !== 'undefined';
const isHttpsPage = isBrowser && window.location.protocol === 'https:';

// On HTTPS pages, always use same-origin API path to avoid mixed-content blocks.
const baseURL = isHttpsPage ? '/api' : (rawBaseURL || '/api');

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError?.response?.data?.message || axiosError?.message || fallback;
}

