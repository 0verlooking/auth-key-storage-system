import { apiClient } from '@config/api';
import { API_ENDPOINTS } from '@config/constants';
import { cryptoService } from './cryptoService';
import { storageService } from './storageService';

/**
 * Share Link Service
 * Handles share link operations for temporary key sharing
 */
class ShareLinkService {
  /**
   * Get all share links
   */
  async getShareLinks(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHARE_LINKS, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get share link by ID
   */
  async getShareLinkById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHARE_LINKS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new share link
   */
  async createShareLink(shareLinkData) {
    try {
      const masterPassword = storageService.getMasterKey();
      if (!masterPassword) {
        throw new Error('Master password not found. Please log in again.');
      }

      // Prepare data
      const data = {
        auth_key_id: shareLinkData.auth_key_id,
        access_type: shareLinkData.access_type,
        expires_at: shareLinkData.expires_at,
        max_access_count: shareLinkData.max_access_count,
      };

      // If sharing decrypted value, encrypt it for the share link
      if (shareLinkData.share_decrypted && shareLinkData.decrypted_value) {
        // Generate a random password for this share link
        const sharePassword = cryptoService.generateSecureToken(32);
        data.encrypted_value = await cryptoService.encrypt(
          shareLinkData.decrypted_value,
          sharePassword
        );
        data.share_password = sharePassword;
      }

      const response = await apiClient.post(API_ENDPOINTS.SHARE_LINKS, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Access share link (public endpoint)
   */
  async accessShareLink(token, password = null) {
    try {
      const data = password ? { password } : {};
      const response = await apiClient.post(API_ENDPOINTS.SHARE_LINKS_ACCESS(token), data);

      // If encrypted value is included, decrypt it
      if (response.data.encrypted_value && response.data.share_password) {
        try {
          response.data.decrypted_value = await cryptoService.decrypt(
            response.data.encrypted_value,
            response.data.share_password
          );
        } catch (error) {
          console.error('Error decrypting shared value:', error);
        }
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke share link
   */
  async revokeShareLink(id) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SHARE_LINKS_REVOKE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete share link
   */
  async deleteShareLink(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SHARE_LINKS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate share link URL
   */
  generateShareUrl(token) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${token}`;
  }

  /**
   * Check if share link is expired
   */
  isExpired(shareLink) {
    if (!shareLink.expires_at) return false;
    return new Date(shareLink.expires_at) < new Date();
  }

  /**
   * Check if share link has exceeded max access count
   */
  hasExceededMaxAccess(shareLink) {
    if (!shareLink.max_access_count) return false;
    return shareLink.access_count >= shareLink.max_access_count;
  }

  /**
   * Check if share link is still active
   */
  isActive(shareLink) {
    if (shareLink.revoked_at) return false;
    if (this.isExpired(shareLink)) return false;
    if (this.hasExceededMaxAccess(shareLink)) return false;
    return true;
  }

  /**
   * Get share link status
   */
  getStatus(shareLink) {
    if (shareLink.revoked_at) return 'revoked';
    if (this.isExpired(shareLink)) return 'expired';
    if (this.hasExceededMaxAccess(shareLink)) return 'exceeded';
    return 'active';
  }

  /**
   * Format expiration time remaining
   */
  getTimeRemaining(shareLink) {
    if (!shareLink.expires_at) return 'Never expires';

    const expiresAt = new Date(shareLink.expires_at);
    const now = new Date();
    const diff = expiresAt - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  }
}

export const shareLinkService = new ShareLinkService();
export default shareLinkService;
