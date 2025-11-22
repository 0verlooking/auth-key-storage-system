import * as Yup from 'yup';
import { PASSWORD_MIN_LENGTH, MASTER_PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES } from '@config/constants';

// Auth validation schemas
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  master_password: Yup.string()
    .min(MASTER_PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.MASTER_PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  remember_me: Yup.boolean(),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED),
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password_confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  master_password: Yup.string()
    .min(MASTER_PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.MASTER_PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  master_password_confirm: Yup.string()
    .oneOf([Yup.ref('master_password'), null], VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Auth Key validation schemas
export const authKeySchema = Yup.object().shape({
  name: Yup.string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED)
    .max(255, 'Name must be less than 255 characters'),
  type: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(['password', 'api_key', 'token', 'ssh_key', 'certificate', 'other']),
  value: Yup.string()
    .required('Value is required'),
  username: Yup.string()
    .max(255, 'Username must be less than 255 characters'),
  url: Yup.string()
    .url(VALIDATION_MESSAGES.URL_INVALID)
    .max(2048, 'URL must be less than 2048 characters'),
  notes: Yup.string()
    .max(5000, 'Notes must be less than 5000 characters'),
  folder_id: Yup.number()
    .nullable(),
  tag_ids: Yup.array()
    .of(Yup.number()),
  metadata: Yup.object(),
});

// Folder validation schemas
export const folderSchema = Yup.object().shape({
  name: Yup.string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED)
    .max(255, 'Name must be less than 255 characters'),
  parent_id: Yup.number()
    .nullable(),
  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters'),
});

// Tag validation schemas
export const tagSchema = Yup.object().shape({
  name: Yup.string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED)
    .max(100, 'Name must be less than 100 characters'),
  color: Yup.string()
    .matches(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Share Link validation schemas
export const shareLinkSchema = Yup.object().shape({
  auth_key_id: Yup.number()
    .required(VALIDATION_MESSAGES.REQUIRED),
  access_type: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(['view_only', 'copy_allowed']),
  expires_at: Yup.date()
    .nullable()
    .min(new Date(), 'Expiration date must be in the future'),
  max_access_count: Yup.number()
    .nullable()
    .min(1, 'Max access count must be at least 1'),
});

// Profile update validation
export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED),
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Password change validation
export const changePasswordSchema = Yup.object().shape({
  current_password: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED),
  new_password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  new_password_confirm: Yup.string()
    .oneOf([Yup.ref('new_password'), null], VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Master password change validation
export const changeMasterPasswordSchema = Yup.object().shape({
  current_master_password: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED),
  new_master_password: Yup.string()
    .min(MASTER_PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.MASTER_PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  new_master_password_confirm: Yup.string()
    .oneOf([Yup.ref('new_master_password'), null], VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Custom validators
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePasswordStrength = (password) => {
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length >= PASSWORD_MIN_LENGTH;

  return {
    isValid: hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isLongEnough,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    isLongEnough,
  };
};
