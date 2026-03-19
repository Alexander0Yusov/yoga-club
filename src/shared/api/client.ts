const baseURL = "https://yoga-club-back.vercel.app/api";

export interface ApiClientOptions extends RequestInit {
  path: string;
}

export async function apiClient<T>({
  path,
  headers,
  ...init
}: ApiClientOptions): Promise<T> {
  const response = await fetch(`${baseURL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export { baseURL };
