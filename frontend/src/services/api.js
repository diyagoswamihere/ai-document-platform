import axios from 'axios';

const API_BASE_URL = 'https://ai-document-platform.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email, password, fullName) =>
    api.post('/auth/register', { email, password, full_name: fullName }),
  
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  
  getById: (id) => api.get(`/projects/${id}`),
  
  create: (projectData) => api.post('/projects', projectData),
  
  delete: (id) => api.delete(`/projects/${id}`),
};

// AI API
export const aiAPI = {
  generateOutline: (topic, documentType, numSections) =>
    api.post('/ai/generate-outline', {
      topic,
      document_type: documentType,
      num_sections: numSections,
    }),
  
  generateSectionContent: (projectId, sectionId) =>
    api.post('/ai/generate-section-content', {
      project_id: projectId,
      section_id: sectionId,
    }),
  
  refineContent: (sectionId, instruction) =>
    api.post('/ai/refine-content', {
      section_id: sectionId,
      refinement_instruction: instruction,
    }),
};

// Export API
export const exportAPI = {
  exportDocument: (projectId) => 
    api.get(`/export/${projectId}`, { responseType: 'blob' }),
};

export default api;
