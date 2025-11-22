package com.authkey.storage.util;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Password strength calculator utility
 * Calculates password strength score and provides feedback
 */
public class PasswordStrengthCalculator {

    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("\\d");
    private static final Pattern SPECIAL_PATTERN = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?]");

    // Common weak passwords
    private static final Set<String> COMMON_PASSWORDS = new HashSet<>();

    static {
        COMMON_PASSWORDS.add("password");
        COMMON_PASSWORDS.add("123456");
        COMMON_PASSWORDS.add("12345678");
        COMMON_PASSWORDS.add("qwerty");
        COMMON_PASSWORDS.add("abc123");
        COMMON_PASSWORDS.add("monkey");
        COMMON_PASSWORDS.add("letmein");
        COMMON_PASSWORDS.add("trustno1");
        COMMON_PASSWORDS.add("dragon");
        COMMON_PASSWORDS.add("baseball");
        COMMON_PASSWORDS.add("iloveyou");
        COMMON_PASSWORDS.add("master");
        COMMON_PASSWORDS.add("sunshine");
        COMMON_PASSWORDS.add("ashley");
        COMMON_PASSWORDS.add("bailey");
        COMMON_PASSWORDS.add("passw0rd");
        COMMON_PASSWORDS.add("shadow");
        COMMON_PASSWORDS.add("superman");
        COMMON_PASSWORDS.add("qazwsx");
        COMMON_PASSWORDS.add("michael");
    }

    /**
     * Password strength levels
     */
    public enum PasswordStrength {
        VERY_WEAK("Very Weak", 0),
        WEAK("Weak", 1),
        FAIR("Fair", 2),
        GOOD("Good", 3),
        STRONG("Strong", 4),
        VERY_STRONG("Very Strong", 5);

        private final String description;
        private final int level;

        PasswordStrength(String description, int level) {
            this.description = description;
            this.level = level;
        }

        public String getDescription() {
            return description;
        }

        public int getLevel() {
            return level;
        }
    }

    /**
     * Password strength result
     */
    @Data
    @AllArgsConstructor
    public static class PasswordStrengthResult {
        private PasswordStrength strength;
        private int score;
        private String feedback;
        private boolean hasLowercase;
        private boolean hasUppercase;
        private boolean hasDigits;
        private boolean hasSpecialChars;
        private int length;
    }

    /**
     * Private constructor to prevent instantiation
     */
    private PasswordStrengthCalculator() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Calculate password strength
     *
     * @param password the password to evaluate
     * @return PasswordStrengthResult with score and feedback
     */
    public static PasswordStrengthResult calculateStrength(String password) {
        if (password == null || password.isEmpty()) {
            return new PasswordStrengthResult(
                    PasswordStrength.VERY_WEAK,
                    0,
                    "Password is required",
                    false, false, false, false, 0
            );
        }

        int score = 0;
        StringBuilder feedback = new StringBuilder();

        // Check length
        int length = password.length();
        boolean hasLowercase = LOWERCASE_PATTERN.matcher(password).find();
        boolean hasUppercase = UPPERCASE_PATTERN.matcher(password).find();
        boolean hasDigits = DIGIT_PATTERN.matcher(password).find();
        boolean hasSpecialChars = SPECIAL_PATTERN.matcher(password).find();

        // Length scoring
        if (length < 6) {
            feedback.append("Password is too short. ");
        } else if (length >= 6 && length < 8) {
            score += 1;
        } else if (length >= 8 && length < 12) {
            score += 2;
        } else if (length >= 12 && length < 16) {
            score += 3;
        } else {
            score += 4;
        }

        // Character variety scoring
        int varietyCount = 0;
        if (hasLowercase) {
            varietyCount++;
            score += 1;
        } else {
            feedback.append("Add lowercase letters. ");
        }

        if (hasUppercase) {
            varietyCount++;
            score += 1;
        } else {
            feedback.append("Add uppercase letters. ");
        }

        if (hasDigits) {
            varietyCount++;
            score += 1;
        } else {
            feedback.append("Add numbers. ");
        }

        if (hasSpecialChars) {
            varietyCount++;
            score += 2;
        } else {
            feedback.append("Add special characters. ");
        }

        // Bonus for using all character types
        if (varietyCount == 4) {
            score += 2;
        }

        // Check for common passwords
        if (COMMON_PASSWORDS.contains(password.toLowerCase())) {
            score = Math.max(0, score - 5);
            feedback.append("This is a commonly used password. ");
        }

        // Check for repeated characters
        if (hasRepeatedCharacters(password)) {
            score = Math.max(0, score - 2);
            feedback.append("Avoid repeated characters. ");
        }

        // Check for sequential characters
        if (hasSequentialCharacters(password)) {
            score = Math.max(0, score - 2);
            feedback.append("Avoid sequential characters. ");
        }

        // Calculate unique characters ratio
        double uniqueRatio = calculateUniqueCharRatio(password);
        if (uniqueRatio < 0.6) {
            score = Math.max(0, score - 1);
            feedback.append("Use more varied characters. ");
        }

        // Determine strength level
        PasswordStrength strength;
        if (score <= 3) {
            strength = PasswordStrength.VERY_WEAK;
        } else if (score <= 6) {
            strength = PasswordStrength.WEAK;
        } else if (score <= 9) {
            strength = PasswordStrength.FAIR;
        } else if (score <= 12) {
            strength = PasswordStrength.GOOD;
        } else if (score <= 15) {
            strength = PasswordStrength.STRONG;
        } else {
            strength = PasswordStrength.VERY_STRONG;
            feedback = new StringBuilder("Excellent password!");
        }

        // Clean up feedback
        String finalFeedback = feedback.toString().trim();
        if (finalFeedback.isEmpty()) {
            finalFeedback = "Good password!";
        }

        return new PasswordStrengthResult(
                strength,
                Math.min(100, (score * 100) / 16), // Normalize to 0-100
                finalFeedback,
                hasLowercase,
                hasUppercase,
                hasDigits,
                hasSpecialChars,
                length
        );
    }

    /**
     * Check if password meets minimum requirements
     *
     * @param password the password to check
     * @return true if password meets minimum requirements
     */
    public static boolean meetsMinimumRequirements(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        boolean hasLowercase = LOWERCASE_PATTERN.matcher(password).find();
        boolean hasUppercase = UPPERCASE_PATTERN.matcher(password).find();
        boolean hasDigits = DIGIT_PATTERN.matcher(password).find();

        return hasLowercase && hasUppercase && hasDigits;
    }

    /**
     * Check for repeated characters (e.g., "aaa", "111")
     *
     * @param password the password to check
     * @return true if password contains repeated characters
     */
    private static boolean hasRepeatedCharacters(String password) {
        for (int i = 0; i < password.length() - 2; i++) {
            if (password.charAt(i) == password.charAt(i + 1) &&
                    password.charAt(i) == password.charAt(i + 2)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check for sequential characters (e.g., "abc", "123")
     *
     * @param password the password to check
     * @return true if password contains sequential characters
     */
    private static boolean hasSequentialCharacters(String password) {
        String lower = password.toLowerCase();
        for (int i = 0; i < lower.length() - 2; i++) {
            char c1 = lower.charAt(i);
            char c2 = lower.charAt(i + 1);
            char c3 = lower.charAt(i + 2);

            // Check for sequential ascending
            if (c2 == c1 + 1 && c3 == c2 + 1) {
                return true;
            }

            // Check for sequential descending
            if (c2 == c1 - 1 && c3 == c2 - 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Calculate ratio of unique characters to total characters
     *
     * @param password the password to analyze
     * @return ratio of unique characters (0.0 to 1.0)
     */
    private static double calculateUniqueCharRatio(String password) {
        if (password.isEmpty()) {
            return 0.0;
        }

        Set<Character> uniqueChars = new HashSet<>();
        for (char c : password.toCharArray()) {
            uniqueChars.add(c);
        }

        return (double) uniqueChars.size() / password.length();
    }

    /**
     * Get password strength description
     *
     * @param password the password to evaluate
     * @return strength description string
     */
    public static String getStrengthDescription(String password) {
        PasswordStrengthResult result = calculateStrength(password);
        return result.getStrength().getDescription();
    }

    /**
     * Get password strength score (0-100)
     *
     * @param password the password to evaluate
     * @return strength score
     */
    public static int getStrengthScore(String password) {
        PasswordStrengthResult result = calculateStrength(password);
        return result.getScore();
    }
}
