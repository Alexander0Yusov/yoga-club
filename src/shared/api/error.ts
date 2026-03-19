export interface NormalizedApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Unknown API error",
    details: error,
  };
}
