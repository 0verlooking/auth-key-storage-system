import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { authKeyService } from '@services/authKeyService';

export const AuthKeyContext = createContext(null);

export const AuthKeyProvider = ({ children }) => {
  const [authKeys, setAuthKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    folder_id: null,
    tag_ids: [],
    type: null,
  });

  // Fetch all auth keys
  const fetchAuthKeys = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authKeyService.getAuthKeys(params);
      setAuthKeys(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch single auth key
  const fetchAuthKey = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const key = await authKeyService.getAuthKeyById(id);
      setSelectedKey(key);
      return key;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new auth key
  const createAuthKey = useCallback(async (keyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newKey = await authKeyService.createAuthKey(keyData);
      setAuthKeys((prev) => [...prev, newKey]);
      return newKey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update auth key
  const updateAuthKey = useCallback(async (id, keyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedKey = await authKeyService.updateAuthKey(id, keyData);
      setAuthKeys((prev) => prev.map((key) => (key.id === id ? updatedKey : key)));
      if (selectedKey?.id === id) {
        setSelectedKey(updatedKey);
      }
      return updatedKey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedKey]);

  // Delete auth key
  const deleteAuthKey = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await authKeyService.deleteAuthKey(id);
      setAuthKeys((prev) => prev.filter((key) => key.id !== id));
      if (selectedKey?.id === id) {
        setSelectedKey(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedKey]);

  // Decrypt auth key
  const decryptAuthKey = useCallback(async (encryptedKey) => {
    try {
      return await authKeyService.decryptAuthKey(encryptedKey);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Search auth keys
  const searchAuthKeys = useCallback(async (query, params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await authKeyService.searchAuthKeys(query, params);
      setAuthKeys(results);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter auth keys by folder
  const filterByFolder = useCallback(async (folderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await authKeyService.getAuthKeysByFolder(folderId);
      setAuthKeys(results);
      setFilters((prev) => ({ ...prev, folder_id: folderId }));
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter auth keys by tag
  const filterByTag = useCallback(async (tagId) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await authKeyService.getAuthKeysByTag(tagId);
      setAuthKeys(results);
      setFilters((prev) => ({ ...prev, tag_ids: [tagId] }));
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      folder_id: null,
      tag_ids: [],
      type: null,
    });
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (value) => {
    try {
      await authKeyService.copyToClipboard(value);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    authKeys,
    selectedKey,
    isLoading,
    error,
    filters,
    fetchAuthKeys,
    fetchAuthKey,
    createAuthKey,
    updateAuthKey,
    deleteAuthKey,
    decryptAuthKey,
    searchAuthKeys,
    filterByFolder,
    filterByTag,
    updateFilters,
    clearFilters,
    copyToClipboard,
    setSelectedKey,
  };

  return <AuthKeyContext.Provider value={value}>{children}</AuthKeyContext.Provider>;
};

AuthKeyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
