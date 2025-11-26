const API_BASE_URL = 'http://localhost:8080';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Public API endpoints
export const publicApi = {
  // Projects
  getProjects: async (page = 0, size = 6) => {
    const response = await fetch(`${API_BASE_URL}/api/projects?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Certificates
  getCertificate: async (page = 0, size = 6) => {
    const response = await fetch(`${API_BASE_URL}/api/certificate?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch certificate');
    return response.json();
  },

  downloadResume: async (): Promise<void> => {
    const resLink = await fetch(`${API_BASE_URL}/api/resume`);
    if (!resLink.ok) throw new Error("Failed to fetch resume URL");

    const cloudinaryUrl = await resLink.text();
    const pdfResponse = await fetch(cloudinaryUrl);
    if (!pdfResponse.ok) throw new Error("Cloudinary download failed");

    const blob = await pdfResponse.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "ARINDAMPALRESUME.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  },

  getProject: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  getProjectsByType: async (type: 'team' | 'solo', page = 0, size = 6) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/type/${type}?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch projects by type');
    return response.json();
  },

  getProjectTags: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/tags`);
    if (!response.ok) throw new Error('Failed to fetch project tags');
    return response.json();
  },

  // Contact
  submitContact: async (data: { name: string; email: string; message: string }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit contact form');
  },
};

// Admin API endpoints
export const adminApi = {
  // Authentication
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.username, password: credentials.password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Projects
  getAllProjects: async (page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admin projects');
    return response.json();
  },

  createProject: async (data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  updateProject: async (id: string, data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  deleteProject: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete project');
  },

  toggleProjectPublish: async (id: string, published: boolean, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}/publish?state=${published}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to toggle project publish status');
    return response.json();
  },

  // Certificates
  createCertificate: async (data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to create certificate');
    return response.json();
  },

  updateCertificate: async (id: string, data: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to update certificate');
    return response.json();
  },

  deleteCertificate: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete certificate');
  },

  // Messages
  getMessages: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  markMessageAsRead: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to mark message as read');
    return response.json();
  },

  getUnreadCount: async (token: string): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/admin/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get unread count');
    return response.json();
  },

  // Resume
  uploadResume: async (file: File, token: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/resume`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload resume');
  },

  downloadResume: async (token: string): Promise<void> => {
    const resLink = await fetch(`${API_BASE_URL}/admin/resume`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!resLink.ok) throw new Error("Failed to fetch resume URL");

    const cloudinaryUrl = await resLink.text();
    const pdfResponse = await fetch(cloudinaryUrl);
    if (!pdfResponse.ok) throw new Error("Cloudinary download failed");

    const blob = await pdfResponse.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "ARINDAMPALRESUME.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  },
};
