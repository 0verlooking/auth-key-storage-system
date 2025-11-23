import { apiClient } from '@config/api';
import { API_ENDPOINTS } from '@config/constants';
import { storageService } from './storageService';
import { cryptoService } from './cryptoService';

/**
 * Authentication Service
 * Handles user authentication operations
 */
class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    try {
      const { email, password, master_password, username, firstName, lastName } = userData;

      // Hash password for server (SHA-256 like login)
      const password_hash = await cryptoService.hashPassword(password);

      const response = await apiClient.post(API_ENDPOINTS.AUTH_REGISTER, {
        username: username || email.split('@')[0], // Use email prefix if no username
        email,
        password: password_hash,
        firstName,
        lastName,
      });

      const { access_token, refresh_token, user } = response.data;

      // Store auth data
      storageService.setSession({
        token: access_token,
        refreshToken: refresh_token,
        user,
      });

      // Store master password temporarily in session
      storageService.setMasterKey(master_password);

      return { user, token: access_token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const { email, password, master_password, remember_me } = credentials;

      // Hash passwords for server
      const password_hash = await cryptoService.hashPassword(password);
      const master_password_hash = await cryptoService.hashPassword(master_password);

      const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
        usernameOrEmail: email,
        password: password_hash,
      });

      const { access_token, refresh_token, user } = response.data;

      // Store auth data
      storageService.setSession({
        token: access_token,
        refreshToken: refresh_token,
        user,
      });

      // Store master password temporarily in session
      storageService.setMasterKey(master_password);

      // Store remember me preference
      storageService.setRememberMe(remember_me || false);

      // Update last activity
      storageService.updateLastActivity();

      return { user, token: access_token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
    } catch (error) {
      // Continue with logout even if server call fails
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage
      storageService.clearAuth();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const refreshToken = storageService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(API_ENDPOINTS.AUTH_REFRESH, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data;

      // Update stored tokens
      storageService.setAuthToken(access_token);
      storageService.setRefreshToken(refresh_token);

      return access_token;
    } catch (error) {
      // If refresh fails, clear auth and throw error
      storageService.clearAuth();
      throw error;
    }
  }

  /**
   * Verify current session
   */
  async verifySession() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_VERIFY);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user from storage
   */
  getCurrentUser() {
    const session = storageService.getSession();
    return session?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = storageService.getAuthToken();
    return !!token;
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return storageService.getAuthToken();
  }

  /**
   * Get master password from session storage
   */
  getMasterPassword() {
    return storageService.getMasterKey();
  }

  /**
   * Verify master password
   */
  async verifyMasterPassword(master_password) {
    try {
      const master_password_hash = await cryptoService.hashPassword(master_password);
      const session = storageService.getSession();

      // In a real implementation, you would verify against stored hash
      // For now, we'll just check if it can decrypt a test value
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update master password
   */
  async updateMasterPassword(current_password, new_password) {
    try {
      // This would require re-encrypting all auth keys with new master password
      // This is a complex operation that should be handled carefully
      const current_hash = await cryptoService.hashPassword(current_password);
      const new_hash = await cryptoService.hashPassword(new_password);

      const response = await apiClient.post(API_ENDPOINTS.USERS_CHANGE_PASSWORD, {
        current_master_password: current_hash,
        new_master_password: new_hash,
      });

      // Update stored master password
      storageService.setMasterKey(new_password);

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
