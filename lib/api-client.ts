const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function buildUrl(endpoint: string) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(buildUrl(endpoint));
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GET ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }
    const text = await response.text();
    console.log('Fetching URL:', buildUrl(endpoint));
    const data = text ? JSON.parse(text) : null;
    return data ? data : null;
  },

  async post(endpoint: string, data: any) {
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
    return result ? result.data : null;
  },

  async put(endpoint: string, data: any) {
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
    return text ? JSON.parse(text) : null;
  },

  async delete(endpoint: string) {
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
    return text ? JSON.parse(text) : null;
  },
};
