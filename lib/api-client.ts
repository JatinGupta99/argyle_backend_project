const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function buildUrl(endpoint: string) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

function buildHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const apiClient = {
  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(buildUrl(endpoint), {
      headers: buildHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GET ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    return result?.data !== undefined ? result.data : result;
  },

  async post<T = any>(endpoint: string, data: any): Promise<T> {
    console.log('[API Client] POST Request:', {
      endpoint: buildUrl(endpoint),
      data,
      hasAuthToken: !!getAuthToken()
    });

    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `POST ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    return result?.data !== undefined ? result.data : result;
  },

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(buildUrl(endpoint), {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PUT ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    return result?.data !== undefined ? result.data : result;
  },

  async patch<T = any>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(buildUrl(endpoint), {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PATCH ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    return result?.data !== undefined ? result.data : result;
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(buildUrl(endpoint), {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `DELETE ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    return result?.data !== undefined ? result.data : result;
  },
};
