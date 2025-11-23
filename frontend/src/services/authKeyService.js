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

      // Encrypt the main value with separate fields for backend
      const encryptedFields = await cryptoService.encryptWithSeparateFields(
        keyData.value,
        masterPassword
      );

      // Map frontend fields to backend DTO structure
      const requestData = {
        title: keyData.title,
        description: keyData.description,
        keyType: keyData.keyType,
        username: keyData.username, // Plain text
        email: keyData.email, // Plain text
        encryptedValue: encryptedFields.encryptedValue,
        encryptionIv: encryptedFields.encryptionIv,
        encryptionSalt: encryptedFields.encryptionSalt,
        url: keyData.url,
        notes: keyData.notes, // Plain text
        folderId: keyData.folderId,
        tagIds: keyData.tagIds,
        expiresAt: keyData.expiresAt,
        passwordStrength: keyData.passwordStrength,
      };

      const response = await apiClient.post(API_ENDPOINTS.AUTH_KEYS, requestData);
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

      // Build update request
      const requestData = {
        title: keyData.title,
        description: keyData.description,
        keyType: keyData.keyType,
        username: keyData.username,
        email: keyData.email,
        url: keyData.url,
        notes: keyData.notes,
        folderId: keyData.folderId,
        tagIds: keyData.tagIds,
        expiresAt: keyData.expiresAt,
        passwordStrength: keyData.passwordStrength,
      };

      // If value is being updated, encrypt it with separate fields
      if (keyData.value !== undefined) {
        const encryptedFields = await cryptoService.encryptWithSeparateFields(
          keyData.value,
          masterPassword
        );
        requestData.encryptedValue = encryptedFields.encryptedValue;
        requestData.encryptionIv = encryptedFields.encryptionIv;
        requestData.encryptionSalt = encryptedFields.encryptionSalt;
      }

      const response = await apiClient.put(API_ENDPOINTS.AUTH_KEYS_BY_ID(id), requestData);
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

      // Decrypt value using separate fields
      if (encryptedKey.encryptedValue && encryptedKey.encryptionIv && encryptedKey.encryptionSalt) {
        try {
          decryptedKey.value = await cryptoService.decryptWithSeparateFields(
            encryptedKey.encryptedValue,
            encryptedKey.encryptionIv,
            encryptedKey.encryptionSalt,
            masterPassword
          );
        } catch (error) {
          console.error('Error decrypting value:', error);
          decryptedKey.value = '[Decryption Failed]';
        }
      }

      // Username and notes are not encrypted (plain text)
      // They are already in the correct format

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
