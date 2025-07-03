import axios from 'axios';

/**
 * Extracts a user-friendly error message from various error types
 * @param error - The error object to extract message from
 * @param fallbackMessage - Optional fallback message if extraction fails
 * @returns A user-friendly error message
 */
export function getErrorMessage(error: unknown, fallbackMessage: string = 'Something went wrong'): string {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const responseMessage = error.response?.data?.message;

      if (responseMessage) {
        return responseMessage;
      }
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Handle other errors
    return error.message || fallbackMessage;
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  // Fallback for unknown error types
  return fallbackMessage;
}

export interface ErrorDetails {
  title: string;
  message: string;
  code: string;
}

/**
 * Checks if an error is a network-related error
 * @param error - The error to check
 * @returns True if it's a network error
 */
export function isNetworkError(error: unknown): boolean {
  console.log('🚀 ~ isNetworkError ~ error:', error);

  if (axios.isAxiosError(error)) {
    return !error.response || error.code === 'ERR_NETWORK';
  }
  return false;
}
