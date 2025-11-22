import { STORAGE_KEYS } from '@config/constants';

/**
 * Service for managing local storage operations
 */
class StorageService {
  /**
   * Get item from localStorage
   */
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Auth related methods
  getAuthToken() {
    const session = this.getItem(STORAGE_KEYS.SESSION);
    return session?.token || null;
  }

  setAuthToken(token) {
    const session = this.getItem(STORAGE_KEYS.SESSION) || {};
    session.token = token;
    return this.setItem(STORAGE_KEYS.SESSION, session);
  }

  getRefreshToken() {
    const session = this.getItem(STORAGE_KEYS.SESSION);
    return session?.refreshToken || null;
  }

  setRefreshToken(refreshToken) {
    const session = this.getItem(STORAGE_KEYS.SESSION) || {};
    session.refreshToken = refreshToken;
    return this.setItem(STORAGE_KEYS.SESSION, session);
  }

  getSession() {
    return this.getItem(STORAGE_KEYS.SESSION);
  }

  setSession(session) {
    return this.setItem(STORAGE_KEYS.SESSION, session);
  }

  clearAuth() {
    this.removeItem(STORAGE_KEYS.SESSION);
    this.removeItem(STORAGE_KEYS.MASTER_KEY);
    this.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  }

  // Master key methods (stored temporarily in memory/session)
  getMasterKey() {
    return sessionStorage.getItem(STORAGE_KEYS.MASTER_KEY);
  }

  setMasterKey(masterKey) {
    sessionStorage.setItem(STORAGE_KEYS.MASTER_KEY, masterKey);
  }

  clearMasterKey() {
    sessionStorage.removeItem(STORAGE_KEYS.MASTER_KEY);
  }

  // Remember me
  getRememberMe() {
    return this.getItem(STORAGE_KEYS.REMEMBER_ME) || false;
  }

  setRememberMe(value) {
    return this.setItem(STORAGE_KEYS.REMEMBER_ME, value);
  }

  // Theme mode
  getThemeMode() {
    return this.getItem(STORAGE_KEYS.THEME_MODE) || 'light';
  }

  setThemeMode(mode) {
    return this.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }

  // User preferences
  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
  }

  setUserPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  updateUserPreference(key, value) {
    const preferences = this.getUserPreferences();
    preferences[key] = value;
    return this.setUserPreferences(preferences);
  }

  // Last activity tracking
  getLastActivity() {
    return this.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  }

  setLastActivity(timestamp = Date.now()) {
    return this.setItem(STORAGE_KEYS.LAST_ACTIVITY, timestamp);
  }

  updateLastActivity() {
    return this.setLastActivity();
  }
}

export const storageService = new StorageService();
export default storageService;
