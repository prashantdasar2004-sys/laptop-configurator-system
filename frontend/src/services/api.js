const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';




const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth API
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Session expired');
    return await res.json();
  },

  // Components API
  getComponents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/components?${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch components');
    return await res.json();
  },

  getComponentById: async (id) => {
    const res = await fetch(`${API_BASE}/components/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch component');
    return await res.json();
  },

  createComponent: async (componentData) => {
    const res = await fetch(`${API_BASE}/components`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(componentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create component');
    return data;
  },

  updateComponent: async (id, componentData) => {
    const res = await fetch(`${API_BASE}/components/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(componentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update component');
    return data;
  },

  updateComponentPrice: async (id, priceData) => {
    const res = await fetch(`${API_BASE}/components/${id}/price`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(priceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update price');
    return data;
  },

  deleteComponent: async (id) => {
    const res = await fetch(`${API_BASE}/components/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete component');
    return data;
  },

  // Quotations API
  getQuotations: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/quotations?${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch quotations');
    return await res.json();
  },

  getQuotationById: async (id) => {
    const res = await fetch(`${API_BASE}/quotations/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch quotation details');
    return await res.json();
  },

  createQuotation: async (quotationData) => {
    const res = await fetch(`${API_BASE}/quotations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(quotationData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save quotation');
    return data;
  },

  updateQuotationStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/quotations/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update quotation status');
    return data;
  },

  deleteQuotation: async (id) => {
    const res = await fetch(`${API_BASE}/quotations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete quotation');
    return data;
  },

  // Analytics API
  getDashboardAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return await res.json();
  },

  // Database Seed API
  triggerSeed: async () => {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST', headers: getHeaders() });
    return await res.json();
  }
};
