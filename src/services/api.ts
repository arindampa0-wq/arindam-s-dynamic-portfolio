const API_BASE_URL = 'http://localhost:8080';

// Public API calls (no authentication required)
export const publicApi = {
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  getCertificates: async () => {
    const response = await fetch(`${API_BASE_URL}/certificates`);
    if (!response.ok) throw new Error('Failed to fetch certificates');
    return response.json();
  },

  sendMessage: async (data: { name: string; email: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
};

// Admin API calls (require JWT token)
export const adminApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Projects
  createProject: async (data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  updateProject: async (id: number, data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  deleteProject: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
  },

  // Certificates
  createCertificate: async (data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to create certificate');
    return response.json();
  },

  updateCertificate: async (id: number, data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to update certificate');
    return response.json();
  },

  deleteCertificate: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete certificate');
    return response.json();
  },

  // Messages
  getMessages: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  deleteMessage: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete message');
    return response.json();
  },
};
