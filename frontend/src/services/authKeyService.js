import { apiClient } from '@config/api';
import { API_ENDPOINTS } from '@config/constants';
import { cryptoService } from './cryptoService';
import { storageService } from './storageService';

/**
 * Auth Key Service
 * Handles authentication key operations with client-side encryption
 */
class AuthKeyService {
  /**
   * Get all auth keys
   */
  async getAuthKeys(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_KEYS, { params });
      // Backend returns a Page object with content array
      return response.data.content || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get auth key by ID
   */
  async getAuthKeyById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_KEYS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new auth key
   */
  async createAuthKey(keyData) {
    try {
      const masterPassword = storageService.getMasterKey();
      if (!masterPassword) {
        throw new Error('Master password not found. Please log in again.');
      }

      // Encrypt sensitive fields
      const encryptedData = {
        ...keyData,
      };

      // Encrypt value (password, API key, etc.)
      if (keyData.value) {
        encryptedData.value = await cryptoService.encrypt(keyData.value, masterPassword);
      }

      // Encrypt username if provided
      if (keyData.username) {
        encryptedData.username = await cryptoService.encrypt(keyData.username, masterPassword);
      }

      // Encrypt notes if provided
      if (keyData.notes) {
        encryptedData.notes = await cryptoService.encrypt(keyData.notes, masterPassword);
      }

      // Encrypt metadata if provided
      if (keyData.metadata) {
        encryptedData.metadata = await cryptoService.encryptObject(keyData.metadata, masterPassword);
      }

      const response = await apiClient.post(API_ENDPOINTS.AUTH_KEYS, encryptedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update auth key
   */
  async updateAuthKey(id, keyData) {
    try {
      const masterPassword = storageService.getMasterKey();
      if (!masterPassword) {
        throw new Error('Master password not found. Please log in again.');
      }

      // Encrypt sensitive fields if they are being updated
      const encryptedData = {
        ...keyData,
      };

      if (keyData.value !== undefined) {
        encryptedData.value = await cryptoService.encrypt(keyData.value, masterPassword);
      }

      if (keyData.username !== undefined) {
        encryptedData.username = await cryptoService.encrypt(keyData.username, masterPassword);
      }

      if (keyData.notes !== undefined) {
        encryptedData.notes = await cryptoService.encrypt(keyData.notes, masterPassword);
      }

      if (keyData.metadata !== undefined) {
        encryptedData.metadata = await cryptoService.encryptObject(keyData.metadata, masterPassword);
      }

      const response = await apiClient.put(API_ENDPOINTS.AUTH_KEYS_BY_ID(id), encryptedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete auth key
   */
  async deleteAuthKey(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.AUTH_KEYS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Decrypt auth key
   */
  async decryptAuthKey(encryptedKey) {
    try {
      const masterPassword = storageService.getMasterKey();
      if (!masterPassword) {
        throw new Error('Master password not found. Please log in again.');
      }

      const decryptedKey = {
        ...encryptedKey,
      };

      // Decrypt value
      if (encryptedKey.value) {
        try {
          decryptedKey.value = await cryptoService.decrypt(encryptedKey.value, masterPassword);
        } catch (error) {
          console.error('Error decrypting value:', error);
          decryptedKey.value = '[Decryption Failed]';
        }
      }

      // Decrypt username
      if (encryptedKey.username) {
        try {
          decryptedKey.username = await cryptoService.decrypt(encryptedKey.username, masterPassword);
        } catch (error) {
          console.error('Error decrypting username:', error);
          decryptedKey.username = '[Decryption Failed]';
        }
      }

      // Decrypt notes
      if (encryptedKey.notes) {
        try {
          decryptedKey.notes = await cryptoService.decrypt(encryptedKey.notes, masterPassword);
        } catch (error) {
          console.error('Error decrypting notes:', error);
          decryptedKey.notes = '[Decryption Failed]';
        }
      }

      // Decrypt metadata
      if (encryptedKey.metadata) {
        try {
          decryptedKey.metadata = await cryptoService.decryptObject(encryptedKey.metadata, masterPassword);
        } catch (error) {
          console.error('Error decrypting metadata:', error);
          decryptedKey.metadata = {};
        }
      }

      return decryptedKey;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search auth keys
   */
  async searchAuthKeys(query, params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_KEYS_SEARCH, {
        params: { q: query, ...params },
      });
      // Backend returns a Page object with content array
      return response.data.content || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get auth keys by folder
   */
  async getAuthKeysByFolder(folderId, params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_KEYS_BY_FOLDER(folderId), { params });
      // Backend returns a Page object with content array
      return response.data.content || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get auth keys by tag
   */
  async getAuthKeysByTag(tagId, params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_KEYS_BY_TAG(tagId), { params });
      // Backend returns a Page object with content array
      return response.data.content || response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk decrypt auth keys
   */
  async bulkDecryptAuthKeys(encryptedKeys) {
    try {
      const decryptedKeys = await Promise.all(
        encryptedKeys.map((key) => this.decryptAuthKey(key))
      );
      return decryptedKeys;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Copy auth key value to clipboard with auto-clear
   */
  async copyToClipboard(value, clearAfter = 30000) {
    try {
      await navigator.clipboard.writeText(value);

      // Auto-clear clipboard after timeout
      if (clearAfter > 0) {
        setTimeout(async () => {
          try {
            const currentClipboard = await navigator.clipboard.readText();
            if (currentClipboard === value) {
              await navigator.clipboard.writeText('');
            }
          } catch (error) {
            // Ignore clipboard read errors (some browsers don't allow it)
          }
        }, clearAfter);
      }

      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      throw new Error('Failed to copy to clipboard');
    }
  }
}

export const authKeyService = new AuthKeyService();
export default authKeyService;
