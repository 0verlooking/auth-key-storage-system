import { apiClient } from '@config/api';
import { API_ENDPOINTS } from '@config/constants';

/**
 * Folder Service
 * Handles folder operations for organizing auth keys
 */
class FolderService {
  /**
   * Get all folders
   */
  async getFolders(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FOLDERS, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get folder tree (hierarchical structure)
   */
  async getFolderTree() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FOLDERS_TREE);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get folder by ID
   */
  async getFolderById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FOLDERS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new folder
   */
  async createFolder(folderData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FOLDERS, folderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update folder
   */
  async updateFolder(id, folderData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.FOLDERS_BY_ID(id), folderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete folder
   */
  async deleteFolder(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.FOLDERS_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Move folder to another parent
   */
  async moveFolder(id, newParentId) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.FOLDERS_BY_ID(id), {
        parent_id: newParentId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Build folder breadcrumbs path
   */
  buildBreadcrumbs(folderId, folders) {
    const breadcrumbs = [];
    let currentFolder = folders.find((f) => f.id === folderId);

    while (currentFolder) {
      breadcrumbs.unshift({
        id: currentFolder.id,
        name: currentFolder.name,
      });

      currentFolder = currentFolder.parent_id
        ? folders.find((f) => f.id === currentFolder.parent_id)
        : null;
    }

    return breadcrumbs;
  }

  /**
   * Build folder tree structure from flat array
   */
  buildTree(folders, parentId = null) {
    return folders
      .filter((folder) => folder.parent_id === parentId)
      .map((folder) => ({
        ...folder,
        children: this.buildTree(folders, folder.id),
      }));
  }

  /**
   * Flatten folder tree to array
   */
  flattenTree(tree, level = 0) {
    let result = [];

    tree.forEach((node) => {
      result.push({
        ...node,
        level,
      });

      if (node.children && node.children.length > 0) {
        result = result.concat(this.flattenTree(node.children, level + 1));
      }
    });

    return result;
  }

  /**
   * Get all descendant folder IDs
   */
  getDescendantIds(folderId, folders) {
    const descendants = [];
    const children = folders.filter((f) => f.parent_id === folderId);

    children.forEach((child) => {
      descendants.push(child.id);
      descendants.push(...this.getDescendantIds(child.id, folders));
    });

    return descendants;
  }

  /**
   * Validate folder depth
   */
  validateDepth(parentId, folders, maxDepth = 5) {
    let depth = 0;
    let currentFolder = folders.find((f) => f.id === parentId);

    while (currentFolder) {
      depth++;
      if (depth >= maxDepth) {
        return false;
      }
      currentFolder = currentFolder.parent_id
        ? folders.find((f) => f.id === currentFolder.parent_id)
        : null;
    }

    return true;
  }
}

export const folderService = new FolderService();
export default folderService;
