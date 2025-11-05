const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/';

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GET ${endpoint} failed: ${response.status} - ${errorText}`
      );
    }
    // Safely handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    return text ? JSON.parse(text) : null;
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
