
const API_BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Token ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signIn(email: string, password: string) {
    const response = await this.request<{user: any, session: any}>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.session?.access_token) {
      this.setToken(response.session.access_token);
    }
    
    return response;
  }

  async signUp(email: string, password: string, name: string) {
    const response = await this.request<{user: any, session: any}>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (response.session?.access_token) {
      this.setToken(response.session.access_token);
    }
    
    return response;
  }

  async signOut() {
    await this.request('/auth/signout', { method: 'POST' });
    this.clearToken();
  }

  // User endpoints
  async getUserProfile() {
    return this.request<{profile: any}>('/auth/profile/');
  }

  async updateUserProfile(data: {name?: string, avatar_url?: string}) {
    return this.request<{profile: any}>('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Diary endpoints
  async getDiaryEntries() {
    return this.request<{entries: any[]}>('/diary/');
  }

  async createDiaryEntry(data: {title: string, content: string, location?: string, attachments?: any[]}) {
    return this.request<{entry: any}>('/diary/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiaryEntry(id: string, data: {title: string, content: string, location?: string, attachments?: any[]}) {
    return this.request<{entry: any}>(`/diary/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiaryEntry(id: string) {
    return this.request(`/diary/${id}/`, { method: 'DELETE' });
  }

  // Contacts endpoints
  async getContacts() {
    return this.request<{contacts: any[]}>('/contacts/');
  }

  async createContact(data: {name: string, phone: string, email?: string, relationship: string}) {
    return this.request<{contact: any}>('/contacts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContact(id: string, data: {name: string, phone: string, email?: string, relationship: string}) {
    return this.request<{contact: any}>(`/contacts/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: string) {
    return this.request(`/contacts/${id}/`, { method: 'DELETE' });
  }

  // Emergency endpoints
  async sendEmergencyAlert(data: {location?: string, message?: string, contacts: string[]}) {
    return this.request<{message: string, alertId: string}>('/emergency/alert', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Feedback endpoint
  async submitFeedback(data: {feedback_type: string, content: string}) {
    return this.request<{message: string}>('/auth/feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
