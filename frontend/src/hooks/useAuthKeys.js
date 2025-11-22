import { useContext } from 'react';
import { AuthKeyContext } from '@context/AuthKeyContext';

/**
 * Custom hook to use AuthKey context
 */
export const useAuthKeys = () => {
  const context = useContext(AuthKeyContext);

  if (!context) {
    throw new Error('useAuthKeys must be used within an AuthKeyProvider');
  }

  return context;
};

export default useAuthKeys;
