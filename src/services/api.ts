const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  message?: string;
  [key: string]: T;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Auth methods
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(credentials: { login: string; password: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });
    return this.handleResponse(response);
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ password })
    });
    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // User methods
  async getUsers(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserProfile(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  async uploadProfilePhoto(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/profile/photo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(passwordData)
    });
    return this.handleResponse(response);
  }

  async approveUser(userId: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/approve`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateUserPermissions(userId: string, permissions: string[]): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/permissions`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ permissions })
    });
    return this.handleResponse(response);
  }

  // Permission methods
  async getPermissions(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getPermissionsByModule(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/permissions/by-module`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Product methods
  async getProducts(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getProduct(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createProduct(productData: any): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productData)
    });
    return this.handleResponse(response);
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(productData)
    });
    return this.handleResponse(response);
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();