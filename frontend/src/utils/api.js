// src/utils/api.js
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:8000'; // Backend serves routes from root, no /api prefix

class ApiClient {
  async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Room endpoints
  async getRooms() {
    return this.request('/rooms/');
  }

  async getRoom(roomId) {
    return this.request(`/rooms/${roomId}`);
  }

  async addRoom(roomData) {
    return this.request('/rooms/', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });
  }

  async getRecommendedRooms() {
    return this.request('/rooms/recommend');
  }

  // Swipe endpoints
  async swipeRoom(swipeData) {
    return this.request('/swipe/', {
      method: 'POST',
      body: JSON.stringify(swipeData)
    });
  }

  async getSwipeHistory() {
    return this.request('/swipe/history');
  }

  // Onboarding endpoints
  async onboardUser(userData) {
    return this.request('/onboard/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getOnboardStatus() {
    return this.request('/onboard/status');
  }
}

export const apiClient = new ApiClient();