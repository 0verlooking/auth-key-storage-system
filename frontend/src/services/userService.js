import { apiClient } from '@config/api';
import { API_ENDPOINTS } from '@config/constants';
import { storageService } from './storageService';
import { cryptoService } from './cryptoService';

/**
 * User Service
 * Handles user profile and settings operations
 */
class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS_ME);

      // Update cached user in session
      const session = storageService.getSession();
      if (session) {
        session.user = response.data;
        storageService.setSession(session);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS_UPDATE, userData);

      // Update cached user in session
      const session = storageService.getSession();
      if (session) {
        session.user = response.data;
        storageService.setSession(session);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordData) {
    try {
      const { current_password, new_password } = passwordData;

      // Hash passwords
      const current_password_hash = await cryptoService.hashPassword(current_password);
      const new_password_hash = await cryptoService.hashPassword(new_password);

      const response = await apiClient.post(API_ENDPOINTS.USERS_CHANGE_PASSWORD, {
        current_password: current_password_hash,
        new_password: new_password_hash,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(password) {
    try {
      const password_hash = await cryptoService.hashPassword(password);

      const response = await apiClient.delete(API_ENDPOINTS.USERS_DELETE, {
        data: { password: password_hash },
      });

      // Clear all local data
      storageService.clearAuth();

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  getUserPreferences() {
    return storageService.getUserPreferences();
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(preferences) {
    return storageService.setUserPreferences(preferences);
  }

  /**
   * Update single preference
   */
  updatePreference(key, value) {
    return storageService.updateUserPreference(key, value);
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const response = await apiClient.get('/api/users/me/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;
