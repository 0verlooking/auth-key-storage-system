package com.authkey.storage.util;

import java.util.regex.Pattern;

/**
 * Validation utility class
 * Provides common validation methods for input data
 */
public class ValidationUtils {

    // Email validation pattern (RFC 5322 compliant)
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    // Username validation pattern (alphanumeric, underscore, hyphen)
    private static final Pattern USERNAME_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_-]{3,50}$"
    );

    // URL validation pattern
    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",
            Pattern.CASE_INSENSITIVE
    );

    // IP address validation pattern
    private static final Pattern IP_PATTERN = Pattern.compile(
            "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    );

    // Hex color validation pattern
    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile(
            "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    );

    /**
     * Private constructor to prevent instantiation
     */
    private ValidationUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Validate email address
     *
     * @param email the email address to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validate username
     * Must be 3-50 characters, alphanumeric with underscore and hyphen allowed
     *
     * @param username the username to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return USERNAME_PATTERN.matcher(username.trim()).matches();
    }

    /**
     * Validate password strength
     * Must be at least 8 characters with uppercase, lowercase, and digit
     *
     * @param password the password to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        return PasswordStrengthCalculator.meetsMinimumRequirements(password);
    }

    /**
     * Validate URL
     *
     * @param url the URL to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        return URL_PATTERN.matcher(url.trim()).matches();
    }

    /**
     * Validate IP address (IPv4)
     *
     * @param ip the IP address to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidIpAddress(String ip) {
        if (ip == null || ip.trim().isEmpty()) {
            return false;
        }
        return IP_PATTERN.matcher(ip.trim()).matches();
    }

    /**
     * Validate hex color code
     *
     * @param color the color code to validate (e.g., #FF5733 or #F57)
     * @return true if valid, false otherwise
     */
    public static boolean isValidHexColor(String color) {
        if (color == null || color.trim().isEmpty()) {
            return false;
        }
        return HEX_COLOR_PATTERN.matcher(color.trim()).matches();
    }

    /**
     * Validate string is not null or empty
     *
     * @param str the string to validate
     * @return true if not null and not empty, false otherwise
     */
    public static boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    /**
     * Validate string length is within range
     *
     * @param str       the string to validate
     * @param minLength minimum length (inclusive)
     * @param maxLength maximum length (inclusive)
     * @return true if length is within range, false otherwise
     */
    public static boolean isLengthValid(String str, int minLength, int maxLength) {
        if (str == null) {
            return false;
        }
        int length = str.length();
        return length >= minLength && length <= maxLength;
    }

    /**
     * Validate number is within range
     *
     * @param value the number to validate
     * @param min   minimum value (inclusive)
     * @param max   maximum value (inclusive)
     * @return true if value is within range, false otherwise
     */
    public static boolean isInRange(int value, int min, int max) {
        return value >= min && value <= max;
    }

    /**
     * Validate number is within range
     *
     * @param value the number to validate
     * @param min   minimum value (inclusive)
     * @param max   maximum value (inclusive)
     * @return true if value is within range, false otherwise
     */
    public static boolean isInRange(long value, long min, long max) {
        return value >= min && value <= max;
    }

    /**
     * Validate number is positive
     *
     * @param value the number to validate
     * @return true if positive, false otherwise
     */
    public static boolean isPositive(int value) {
        return value > 0;
    }

    /**
     * Validate number is positive
     *
     * @param value the number to validate
     * @return true if positive, false otherwise
     */
    public static boolean isPositive(long value) {
        return value > 0;
    }

    /**
     * Validate number is non-negative (zero or positive)
     *
     * @param value the number to validate
     * @return true if non-negative, false otherwise
     */
    public static boolean isNonNegative(int value) {
        return value >= 0;
    }

    /**
     * Validate number is non-negative (zero or positive)
     *
     * @param value the number to validate
     * @return true if non-negative, false otherwise
     */
    public static boolean isNonNegative(long value) {
        return value >= 0;
    }

    /**
     * Validate phone number (basic validation)
     * Accepts formats: +1234567890, (123) 456-7890, 123-456-7890
     *
     * @param phone the phone number to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidPhoneNumber(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }

        // Remove common formatting characters
        String cleaned = phone.replaceAll("[\\s()-]", "");

        // Check if it starts with + (for international)
        if (cleaned.startsWith("+")) {
            cleaned = cleaned.substring(1);
        }

        // Must be 10-15 digits
        return cleaned.matches("\\d{10,15}");
    }

    /**
     * Validate that string contains only alphanumeric characters
     *
     * @param str the string to validate
     * @return true if alphanumeric, false otherwise
     */
    public static boolean isAlphanumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        return str.matches("^[a-zA-Z0-9]+$");
    }

    /**
     * Validate that string contains only letters
     *
     * @param str the string to validate
     * @return true if only letters, false otherwise
     */
    public static boolean isAlpha(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        return str.matches("^[a-zA-Z]+$");
    }

    /**
     * Validate that string contains only digits
     *
     * @param str the string to validate
     * @return true if only digits, false otherwise
     */
    public static boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        return str.matches("^\\d+$");
    }

    /**
     * Sanitize string by removing special characters
     * Keeps only alphanumeric characters and spaces
     *
     * @param str the string to sanitize
     * @return sanitized string
     */
    public static String sanitize(String str) {
        if (str == null) {
            return null;
        }
        return str.replaceAll("[^a-zA-Z0-9\\s]", "");
    }

    /**
     * Truncate string to maximum length
     *
     * @param str       the string to truncate
     * @param maxLength maximum length
     * @return truncated string
     */
    public static String truncate(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }

    /**
     * Validate JSON string (basic check)
     *
     * @param json the JSON string to validate
     * @return true if appears to be valid JSON, false otherwise
     */
    public static boolean isValidJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return false;
        }

        String trimmed = json.trim();
        return (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
                (trimmed.startsWith("[") && trimmed.endsWith("]"));
    }

    /**
     * Check if two strings are equal (null-safe)
     *
     * @param str1 first string
     * @param str2 second string
     * @return true if equal, false otherwise
     */
    public static boolean equals(String str1, String str2) {
        if (str1 == null && str2 == null) {
            return true;
        }
        if (str1 == null || str2 == null) {
            return false;
        }
        return str1.equals(str2);
    }

    /**
     * Check if two strings are equal ignoring case (null-safe)
     *
     * @param str1 first string
     * @param str2 second string
     * @return true if equal (case-insensitive), false otherwise
     */
    public static boolean equalsIgnoreCase(String str1, String str2) {
        if (str1 == null && str2 == null) {
            return true;
        }
        if (str1 == null || str2 == null) {
            return false;
        }
        return str1.equalsIgnoreCase(str2);
    }
}
