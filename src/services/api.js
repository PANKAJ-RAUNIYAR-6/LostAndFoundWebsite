const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('findit_token');
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  sendOTP: (email) => request('/auth/otp/send', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOTP: (email, code) => request('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ email, code }) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),

  // Items
  getItems: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/items?${query}`);
  },
  getItemById: (id) => request(`/items/${id}`),
  createItem: (itemData) => request('/items', { method: 'POST', body: JSON.stringify(itemData) }),
  updateItem: (id, itemData) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(itemData) }),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE' }),
  getMyItems: (type) => request(`/items/my${type ? `?type=${type}` : ''}`),

  // Claims
  createClaim: (claimData) => request('/claims', { method: 'POST', body: JSON.stringify(claimData) }),
  getMyClaims: () => request('/claims/my'),
  updateClaimStatus: (id, statusData) => request(`/claims/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  getAllClaimsAdmin: () => request('/claims/admin'),

  // Chat
  getConversations: () => request('/chat/conversations'),
  startConversation: (recipientId, itemId) => request('/chat/conversations', { method: 'POST', body: JSON.stringify({ recipientId, itemId }) }),
  getMessages: (conversationId) => request(`/chat/messages/${conversationId}`),
  sendMessage: (conversationId, text) => request('/chat/messages', { method: 'POST', body: JSON.stringify({ conversationId, text }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Feedback
  getFeedbacks: () => request('/feedback'),
  createFeedback: (feedbackData) => request('/feedback', { method: 'POST', body: JSON.stringify(feedbackData) }),

  // Rewards
  getMyRewards: () => request('/rewards/my'),
  getAllRewardsAdmin: () => request('/rewards/admin'),
  awardPointsAdmin: (payload) => request('/rewards/admin/award', { method: 'POST', body: JSON.stringify(payload) }),

  // Abuse Reports
  createAbuseReport: (reportData) => request('/abuse-reports', { method: 'POST', body: JSON.stringify(reportData) }),
  getAbuseReportsAdmin: () => request('/abuse-reports/admin'),
  updateAbuseReportStatus: (id, status) => request(`/abuse-reports/admin/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Categories
  getCategories: () => request('/categories'),
  createCategoryAdmin: (catData) => request('/categories', { method: 'POST', body: JSON.stringify(catData) }),
  deleteCategoryAdmin: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  updateUserStatusAdmin: (id, statusData) => request(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  deleteUserAdmin: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  getActivityLogsAdmin: () => request('/admin/activity-logs'),

  // Upload
  uploadImages: (formData) => request('/upload', { method: 'POST', body: formData }),
  uploadSingleImage: (formData) => request('/upload/single', { method: 'POST', body: formData }),

  // System Health
  getHealth: () => request('/health')
};

export default api;
