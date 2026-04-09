import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Add auth token to admin requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public APIs
export const publicApi = {
  getNotes: (params?: { subject?: string; search?: string }) =>
    api.get('/notes', { params }),

  getNote: (id: string) => api.get(`/notes/${id}`),

  trackDownload: (id: string) => api.post(`/notes/${id}/download`),

  getSubjects: () => api.get('/subjects'),

  getVideos: () => api.get('/videos'),
};

// Admin APIs
export const adminApi = {
  login: (username: string, password: string) =>
    api.post('/admin/login', { username, password }),

  uploadNote: (formData: FormData) =>
    api.post('/admin/notes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: () => {},
    }),

  deleteNote: (id: string) => api.delete(`/admin/notes/${id}`),

  getNotes: () => api.get('/admin/notes'),

  addVideo: (data: { title: string; subject: string; youtubeId: string; description?: string }) =>
    api.post('/admin/videos', data),

  deleteVideo: (id: string) => api.delete(`/admin/videos/${id}`),

  getVideos: () => api.get('/admin/videos'),
};

export default api;
