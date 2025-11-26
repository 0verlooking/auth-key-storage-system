import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { authService } from '@services/authService';
import { storageService } from '@services/storageService';
import { SESSION_TIMEOUT } from '@config/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storageService.getAuthToken();
        if (token) {
          // Verify session with server
          const sessionData = await authService.verifySession();
          setUser(sessionData.user);
          setIsAuthenticated(true);
          startSessionTimeout();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Session timeout management
  const startSessionTimeout = useCallback(() => {
    // Clear existing timeout using functional setState
    setSessionTimeout((prevTimeout) => {
      if (prevTimeout) {
        clearTimeout(prevTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        handleSessionExpired();
      }, SESSION_TIMEOUT);

      return timeout;
    });
  }, []); // No dependencies needed with functional setState

  const handleSessionExpired = async () => {
    console.log('Session expired');
    await logout();
  };

  // Update last activity
  const updateActivity = useCallback(() => {
    storageService.updateLastActivity();
    startSessionTimeout();
  }, [startSessionTimeout]);

  // Listen for user activity
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach((event) => {
        document.addEventListener(event, updateActivity);
      });

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, updateActivity);
        });
      };
    }
  }, [isAuthenticated, updateActivity]);

  // Register new user
  const register = async (userData) => {
    try {
      const { user: newUser, token } = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      startSessionTimeout();
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const { user: loggedInUser, token } = await authService.login(credentials);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      startSessionTimeout();
      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      setSessionTimeout(null);
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    const session = storageService.getSession();
    if (session) {
      session.user = updatedUser;
      storageService.setSession(session);
    }
  };

  // Verify master password
  const verifyMasterPassword = async (masterPassword) => {
    try {
      return await authService.verifyMasterPassword(masterPassword);
    } catch (error) {
      return false;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      register,
      login,
      logout,
      updateUser,
      verifyMasterPassword,
      updateActivity,
    }),
    [user, isAuthenticated, isLoading, register, login, logout, updateUser, verifyMasterPassword, updateActivity]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
