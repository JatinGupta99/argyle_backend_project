const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function buildUrl(endpoint: string) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

export const apiClient = {
  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(buildUrl(endpoint));
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
    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
