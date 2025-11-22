import { PBKDF2_ITERATIONS, KEY_LENGTH, SALT_LENGTH, IV_LENGTH } from '@config/constants';

/**
 * Crypto Service - Client-side encryption/decryption using Web Crypto API
 * Implements zero-knowledge encryption with AES-256-GCM
 */
class CryptoService {
  constructor() {
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder();
  }

  /**
   * Generate random bytes
   */
  generateRandomBytes(length) {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Convert ArrayBuffer to Base64 string
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 string to ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Derive encryption key from master password using PBKDF2
   */
  async deriveKey(masterPassword, salt) {
    try {
      // Import master password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        this.textEncoder.encode(masterPassword),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      // Derive key using PBKDF2
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: PBKDF2_ITERATIONS,
          hash: 'SHA-256',
        },
        keyMaterial,
        {
          name: 'AES-GCM',
          length: KEY_LENGTH,
        },
        false,
        ['encrypt', 'decrypt']
      );

      return key;
    } catch (error) {
      console.error('Error deriving key:', error);
      throw new Error('Failed to derive encryption key');
    }
  }

  /**
   * Encrypt data with AES-256-GCM
   */
  async encrypt(data, masterPassword) {
    try {
      // Generate salt and IV
      const salt = this.generateRandomBytes(SALT_LENGTH);
      const iv = this.generateRandomBytes(IV_LENGTH);

      // Derive key from master password
      const key = await this.deriveKey(masterPassword, salt);

      // Encrypt data
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        this.textEncoder.encode(data)
      );

      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Return as base64
      return this.arrayBufferToBase64(combined.buffer);
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data with AES-256-GCM
   */
  async decrypt(encryptedData, masterPassword) {
    try {
      // Convert from base64
      const combined = new Uint8Array(this.base64ToArrayBuffer(encryptedData));

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, SALT_LENGTH);
      const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const data = combined.slice(SALT_LENGTH + IV_LENGTH);

      // Derive key from master password
      const key = await this.deriveKey(masterPassword, salt);

      // Decrypt data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        data
      );

      return this.textDecoder.decode(decryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt data. Invalid master password or corrupted data.');
    }
  }

  /**
   * Hash password using SHA-256 (for server authentication)
   */
  async hashPassword(password) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', this.textEncoder.encode(password));
      return this.arrayBufferToBase64(hashBuffer);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Generate random password
   */
  generatePassword(options = {}) {
    const {
      length = 16,
      useUppercase = true,
      useLowercase = true,
      useNumbers = true,
      useSymbols = true,
    } = options;

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let password = '';

    // Build charset
    if (useUppercase) charset += uppercase;
    if (useLowercase) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (charset.length === 0) {
      charset = lowercase; // Default to lowercase if nothing selected
    }

    // Generate password
    const randomValues = this.generateRandomBytes(length);
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }

    // Ensure at least one character from each selected type
    if (useUppercase && !/[A-Z]/.test(password)) {
      const pos = randomValues[0] % length;
      password = password.substring(0, pos) + uppercase[randomValues[1] % uppercase.length] + password.substring(pos + 1);
    }
    if (useLowercase && !/[a-z]/.test(password)) {
      const pos = randomValues[2] % length;
      password = password.substring(0, pos) + lowercase[randomValues[3] % lowercase.length] + password.substring(pos + 1);
    }
    if (useNumbers && !/[0-9]/.test(password)) {
      const pos = randomValues[4] % length;
      password = password.substring(0, pos) + numbers[randomValues[5] % numbers.length] + password.substring(pos + 1);
    }
    if (useSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      const pos = randomValues[6] % length;
      password = password.substring(0, pos) + symbols[randomValues[7] % symbols.length] + password.substring(pos + 1);
    }

    return password;
  }

  /**
   * Calculate password strength
   * Returns: weak, medium, strong, very_strong
   */
  calculatePasswordStrength(password) {
    if (!password) return 'weak';

    let strength = 0;

    // Length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;

    // Character types
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    // Patterns (reduce strength)
    if (/(.)\1{2,}/.test(password)) strength -= 1; // Repeating characters
    if (/^[0-9]+$/.test(password)) strength -= 1; // Only numbers
    if (/^[a-zA-Z]+$/.test(password)) strength -= 1; // Only letters

    // Return strength level
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    if (strength <= 6) return 'strong';
    return 'very_strong';
  }

  /**
   * Generate secure token for share links
   */
  generateSecureToken(length = 32) {
    const randomBytes = this.generateRandomBytes(length);
    return this.arrayBufferToBase64(randomBytes)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, length);
  }

  /**
   * Encrypt object (converts to JSON first)
   */
  async encryptObject(obj, masterPassword) {
    const jsonString = JSON.stringify(obj);
    return await this.encrypt(jsonString, masterPassword);
  }

  /**
   * Decrypt object (parses JSON after decryption)
   */
  async decryptObject(encryptedData, masterPassword) {
    const jsonString = await this.decrypt(encryptedData, masterPassword);
    return JSON.parse(jsonString);
  }
}

export const cryptoService = new CryptoService();
export default cryptoService;
