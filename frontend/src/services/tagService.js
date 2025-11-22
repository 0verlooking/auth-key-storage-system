import { apiClient } from '@config/api';
import { API_ENDPOINTS } from '@config/constants';

/**
 * Tag Service
 * Handles tag operations for categorizing auth keys
 */
class TagService {
  /**
   * Get all tags
   */
  async getTags(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TAGS, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get tag by ID
   */
  async getTagById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TAGS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new tag
   */
  async createTag(tagData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TAGS, tagData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update tag
   */
  async updateTag(id, tagData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.TAGS_BY_ID(id), tagData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete tag
   */
  async deleteTag(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.TAGS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get popular colors for tags
   */
  getPopularColors() {
    return [
      '#f44336', // Red
      '#e91e63', // Pink
      '#9c27b0', // Purple
      '#673ab7', // Deep Purple
      '#3f51b5', // Indigo
      '#2196f3', // Blue
      '#03a9f4', // Light Blue
      '#00bcd4', // Cyan
      '#009688', // Teal
      '#4caf50', // Green
      '#8bc34a', // Light Green
      '#cddc39', // Lime
      '#ffeb3b', // Yellow
      '#ffc107', // Amber
      '#ff9800', // Orange
      '#ff5722', // Deep Orange
      '#795548', // Brown
      '#9e9e9e', // Grey
      '#607d8b', // Blue Grey
    ];
  }

  /**
   * Generate random color
   */
  generateRandomColor() {
    const colors = this.getPopularColors();
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Sort tags by usage count
   */
  sortByUsage(tags) {
    return [...tags].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
  }

  /**
   * Sort tags alphabetically
   */
  sortAlphabetically(tags) {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Filter tags by search query
   */
  filterTags(tags, query) {
    if (!query) return tags;
    const lowerQuery = query.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(lowerQuery));
  }

  /**
   * Get tag statistics
   */
  getTagStats(tags) {
    return {
      total: tags.length,
      mostUsed: this.sortByUsage(tags)[0] || null,
      totalUsage: tags.reduce((sum, tag) => sum + (tag.usage_count || 0), 0),
    };
  }
}

export const tagService = new TagService();
export default tagService;
