
const API_BASE_URL = 'http://localhost:8000/api';

interface SignInResponse {
  user: {
    id: string;
    email: string;
    name: string;
    user_metadata: { name: string };
  };
  session: {
    access_token: string;
    user: {
      id: string;
      email: string;
    };
  };
}

interface SignUpResponse {
  user: {
    id: string;
    email: string;
    name: string;
    user_metadata: { name: string };
  };
  session: {
    access_token: string;
    user: {
      id: string;
      email: string;
    };
  };
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Token ${token}` }),
    };
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<SignInResponse> {
    console.log('API: Attempting signin with:', { email });
    
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.non_field_errors?.[0] || error.message || 'Erro ao fazer login');
    }

    const data = await response.json();
    
    if (data.session?.access_token) {
      localStorage.setItem('authToken', data.session.access_token);
    }
    
    console.log('API: Signin successful');
    return data;
  }

  async signUp(email: string, password: string, name: string): Promise<SignUpResponse> {
    console.log('API: Attempting signup with:', { email, name });
    
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.email?.[0] || error.password?.[0] || error.message || 'Erro ao criar conta');
    }

    const data = await response.json();
    
    if (data.session?.access_token) {
      localStorage.setItem('authToken', data.session.access_token);
    }
    
    console.log('API: Signup successful');
    return data;
  }

  async signOut(): Promise<void> {
    console.log('API: Attempting signout');
    
    try {
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('API: Signout error:', error);
    }
    
    localStorage.removeItem('authToken');
    console.log('API: Signout completed');
  }

  // User profile methods
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar perfil do usuário');
    }

    return response.json();
  }

  async updateUserProfile(profile: any) {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar perfil do usuário');
    }

    return response.json();
  }

  // User feedback methods
  async submitFeedback(feedback: any) {
    const response = await fetch(`${API_BASE_URL}/auth/feedback/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar feedback');
    }

    return response.json();
  }

  // Diary methods
  async getDiaryEntries() {
    const response = await fetch(`${API_BASE_URL}/diary/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar entradas do diário');
    }

    return response.json();
  }

  async createDiaryEntry(entry: any) {
    const response = await fetch(`${API_BASE_URL}/diary/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar entrada do diário');
    }

    return response.json();
  }

  async updateDiaryEntry(id: string, entry: any) {
    const response = await fetch(`${API_BASE_URL}/diary/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar entrada do diário');
    }

    return response.json();
  }

  async deleteDiaryEntry(id: string) {
    const response = await fetch(`${API_BASE_URL}/diary/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar entrada do diário');
    }
  }

  // Safe contacts methods
  async getSafeContacts() {
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar contatos seguros');
    }

    return response.json();
  }

  async createSafeContact(contact: any) {
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar contato seguro');
    }

    return response.json();
  }

  async updateSafeContact(id: string, contact: any) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar contato seguro');
    }

    return response.json();
  }

  async deleteSafeContact(id: string) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar contato seguro');
    }
  }

  // Emergency contacts methods
  async getEmergencyContacts() {
    const response = await fetch(`${API_BASE_URL}/contacts/emergency/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar contatos de emergência');
    }

    return response.json();
  }

  async createEmergencyContact(contact: any) {
    const response = await fetch(`${API_BASE_URL}/contacts/emergency/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar contato de emergência');
    }

    return response.json();
  }

  async updateEmergencyContact(id: string, contact: any) {
    const response = await fetch(`${API_BASE_URL}/contacts/emergency/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar contato de emergência');
    }

    return response.json();
  }

  async deleteEmergencyContact(id: string) {
    const response = await fetch(`${API_BASE_URL}/contacts/emergency/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar contato de emergência');
    }
  }

  // Emergency alert methods
  async sendEmergencyAlert(alert: any) {
    const response = await fetch(`${API_BASE_URL}/emergency/alert`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(alert),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar alerta de emergência');
    }

    return response.json();
  }

  async getEmergencyAlerts() {
    const response = await fetch(`${API_BASE_URL}/emergency/alerts/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar alertas de emergência');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
