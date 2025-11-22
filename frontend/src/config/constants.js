// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Auth Key Storage System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Encryption Configuration
export const PBKDF2_ITERATIONS = parseInt(import.meta.env.VITE_PBKDF2_ITERATIONS) || 100000;
export const ENCRYPTION_ALGORITHM = import.meta.env.VITE_ENCRYPTION_ALGORITHM || 'AES-GCM';
export const KEY_LENGTH = parseInt(import.meta.env.VITE_KEY_LENGTH) || 256;
export const SALT_LENGTH = 16; // 16 bytes
export const IV_LENGTH = 12; // 12 bytes for GCM

// Session Configuration
export const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000; // 1 hour
export const REMEMBER_ME_DURATION = parseInt(import.meta.env.VITE_REMEMBER_ME_DURATION) || 2592000000; // 30 days
export const SESSION_STORAGE_KEY = 'auth_session';
export const MASTER_KEY_STORAGE_KEY = 'master_key';

// Feature Flags
export const ENABLE_REGISTRATION = import.meta.env.VITE_ENABLE_REGISTRATION !== 'false';
export const ENABLE_SHARE_LINKS = import.meta.env.VITE_ENABLE_SHARE_LINKS !== 'false';
export const ENABLE_AUDIT_LOGS = import.meta.env.VITE_ENABLE_AUDIT_LOGS !== 'false';

// Security
export const MAX_LOGIN_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
export const PASSWORD_MIN_LENGTH = parseInt(import.meta.env.VITE_PASSWORD_MIN_LENGTH) || 8;
export const MASTER_PASSWORD_MIN_LENGTH = parseInt(import.meta.env.VITE_MASTER_PASSWORD_MIN_LENGTH) || 12;
export const CLIPBOARD_CLEAR_TIMEOUT = 30000; // 30 seconds

// UI Configuration
export const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 20;
export const MAX_TAGS_PER_KEY = parseInt(import.meta.env.VITE_MAX_TAGS_PER_KEY) || 10;
export const MAX_FOLDER_DEPTH = parseInt(import.meta.env.VITE_MAX_FOLDER_DEPTH) || 5;
export const DEBOUNCE_DELAY = 300; // milliseconds

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FOLDERS: '/folders',
  TAGS: '/tags',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  AUDIT_LOGS: '/audit-logs',
  SHARE: '/share',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_VERIFY: '/api/auth/verify',

  // Users
  USERS_ME: '/api/users/me',
  USERS_UPDATE: '/api/users/me',
  USERS_CHANGE_PASSWORD: '/api/users/me/password',
  USERS_DELETE: '/api/users/me',

  // Auth Keys
  AUTH_KEYS: '/api/auth-keys',
  AUTH_KEYS_BY_ID: (id) => `/api/auth-keys/${id}`,
  AUTH_KEYS_SEARCH: '/api/auth-keys/search',
  AUTH_KEYS_BY_FOLDER: (folderId) => `/api/auth-keys/folder/${folderId}`,
  AUTH_KEYS_BY_TAG: (tagId) => `/api/auth-keys/tag/${tagId}`,

  // Folders
  FOLDERS: '/api/folders',
  FOLDERS_BY_ID: (id) => `/api/folders/${id}`,
  FOLDERS_TREE: '/api/folders/tree',

  // Tags
  TAGS: '/api/tags',
  TAGS_BY_ID: (id) => `/api/tags/${id}`,

  // Share Links
  SHARE_LINKS: '/api/share-links',
  SHARE_LINKS_BY_ID: (id) => `/api/share-links/${id}`,
  SHARE_LINKS_ACCESS: (token) => `/api/share-links/access/${token}`,
  SHARE_LINKS_REVOKE: (id) => `/api/share-links/${id}/revoke`,

  // Audit Logs
  AUDIT_LOGS: '/api/audit-logs',
  AUDIT_LOGS_BY_KEY: (keyId) => `/api/audit-logs/key/${keyId}`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME_MODE: 'theme_mode',
  SESSION: 'auth_session',
  MASTER_KEY: 'master_key',
  REMEMBER_ME: 'remember_me',
  LAST_ACTIVITY: 'last_activity',
  USER_PREFERENCES: 'user_preferences',
};

// Theme
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Password Strength
export const PASSWORD_STRENGTH = {
  WEAK: 'weak',
  MEDIUM: 'medium',
  STRONG: 'strong',
  VERY_STRONG: 'very_strong',
};

// Auth Key Types
export const AUTH_KEY_TYPES = {
  PASSWORD: 'password',
  API_KEY: 'api_key',
  TOKEN: 'token',
  SSH_KEY: 'ssh_key',
  CERTIFICATE: 'certificate',
  OTHER: 'other',
};

// Share Link Access Types
export const SHARE_ACCESS_TYPES = {
  VIEW_ONLY: 'view_only',
  COPY_ALLOWED: 'copy_allowed',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Sort Options
export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  UPDATED_ASC: 'updated_asc',
  UPDATED_DESC: 'updated_desc',
};

// Password Generator Options
export const PASSWORD_GENERATOR_DEFAULTS = {
  LENGTH: 16,
  USE_UPPERCASE: true,
  USE_LOWERCASE: true,
  USE_NUMBERS: true,
  USE_SYMBOLS: true,
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Invalid email address',
  PASSWORD_MIN_LENGTH: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  MASTER_PASSWORD_MIN_LENGTH: `Master password must be at least ${MASTER_PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_MUST_MATCH: 'Passwords must match',
  NAME_REQUIRED: 'Name is required',
  URL_INVALID: 'Invalid URL format',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  ENCRYPTION_ERROR: 'Encryption error. Please try again.',
  DECRYPTION_ERROR: 'Decryption error. Invalid master password or corrupted data.',
};
