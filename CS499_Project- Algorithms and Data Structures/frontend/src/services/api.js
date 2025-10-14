import { getToken, clearAuth } from './auth.js';
import { API_BASE_URL } from '../utils/constants.js';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAuth();
          window.location.href = '/login.html';
          return;
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  // Item endpoints
  async getItems() {
    return this.request('/api/items');
  }

  async createItem(item) {
    return this.request('/api/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(id, updates) {
    return this.request(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteItem(id) {
    return this.request(`/api/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getUsers() {
    return this.request('/api/admin/users');
  }

  async createUser(user) {
    return this.request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id, updates) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminItems() {
    return this.request('/api/admin/items');
  }

  async deleteItemAsAdmin(id) {
    return this.request(`/api/admin/items/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();