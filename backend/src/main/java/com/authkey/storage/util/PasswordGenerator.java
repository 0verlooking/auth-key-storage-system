package com.authkey.storage.util;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Password generator utility
 * Generates secure random passwords with customizable options
 */
public class PasswordGenerator {

    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    private static final String AMBIGUOUS_CHARACTERS = "il1Lo0O";

    private static final SecureRandom random = new SecureRandom();

    /**
     * Private constructor to prevent instantiation
     */
    private PasswordGenerator() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Generate a password with default settings
     * Default: 16 characters, includes uppercase, lowercase, digits, and special characters
     *
     * @return generated password
     */
    public static String generatePassword() {
        return generatePassword(16, true, true, true, true, false);
    }

    /**
     * Generate a password with specified length
     *
     * @param length desired password length
     * @return generated password
     */
    public static String generatePassword(int length) {
        return generatePassword(length, true, true, true, true, false);
    }

    /**
     * Generate a password with custom options
     *
     * @param length             desired password length (minimum 4)
     * @param includeUppercase   include uppercase letters
     * @param includeLowercase   include lowercase letters
     * @param includeDigits      include digits
     * @param includeSpecial     include special characters
     * @param excludeAmbiguous   exclude ambiguous characters (i, l, 1, L, o, 0, O)
     * @return generated password
     * @throws IllegalArgumentException if invalid parameters provided
     */
    public static String generatePassword(
            int length,
            boolean includeUppercase,
            boolean includeLowercase,
            boolean includeDigits,
            boolean includeSpecial,
            boolean excludeAmbiguous
    ) {
        // Validate parameters
        if (length < 4) {
            throw new IllegalArgumentException("Password length must be at least 4 characters");
        }

        if (!includeUppercase && !includeLowercase && !includeDigits && !includeSpecial) {
            throw new IllegalArgumentException("At least one character type must be included");
        }

        // Build character pool
        StringBuilder charPool = new StringBuilder();
        List<String> requiredChars = new ArrayList<>();

        if (includeLowercase) {
            String lowercase = excludeAmbiguous ? removeAmbiguous(LOWERCASE) : LOWERCASE;
            charPool.append(lowercase);
            requiredChars.add(String.valueOf(lowercase.charAt(random.nextInt(lowercase.length()))));
        }

        if (includeUppercase) {
            String uppercase = excludeAmbiguous ? removeAmbiguous(UPPERCASE) : UPPERCASE;
            charPool.append(uppercase);
            requiredChars.add(String.valueOf(uppercase.charAt(random.nextInt(uppercase.length()))));
        }

        if (includeDigits) {
            String digits = excludeAmbiguous ? removeAmbiguous(DIGITS) : DIGITS;
            charPool.append(digits);
            requiredChars.add(String.valueOf(digits.charAt(random.nextInt(digits.length()))));
        }

        if (includeSpecial) {
            charPool.append(SPECIAL_CHARACTERS);
            requiredChars.add(String.valueOf(SPECIAL_CHARACTERS.charAt(random.nextInt(SPECIAL_CHARACTERS.length()))));
        }

        // Generate password
        List<Character> password = new ArrayList<>();

        // Add required characters (at least one from each selected type)
        for (String reqChar : requiredChars) {
            password.add(reqChar.charAt(0));
        }

        // Fill remaining length with random characters
        String pool = charPool.toString();
        for (int i = requiredChars.size(); i < length; i++) {
            password.add(pool.charAt(random.nextInt(pool.length())));
        }

        // Shuffle to randomize positions
        Collections.shuffle(password, random);

        // Convert to string
        StringBuilder result = new StringBuilder(length);
        for (Character c : password) {
            result.append(c);
        }

        return result.toString();
    }

    /**
     * Generate a memorable password (pronounceable)
     * Uses alternating consonants and vowels
     *
     * @param length desired password length (minimum 6)
     * @return generated memorable password
     */
    public static String generateMemorablePassword(int length) {
        if (length < 6) {
            throw new IllegalArgumentException("Memorable password length must be at least 6 characters");
        }

        String consonants = "bcdfghjklmnpqrstvwxyz";
        String vowels = "aeiou";
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            if (i % 2 == 0) {
                // Add consonant (capitalize first letter and random others)
                char c = consonants.charAt(random.nextInt(consonants.length()));
                if (i == 0 || random.nextBoolean()) {
                    c = Character.toUpperCase(c);
                }
                password.append(c);
            } else {
                // Add vowel
                password.append(vowels.charAt(random.nextInt(vowels.length())));
            }
        }

        // Add a digit and special character at random positions
        int digitPos = random.nextInt(length);
        int specialPos = random.nextInt(length);
        while (specialPos == digitPos) {
            specialPos = random.nextInt(length);
        }

        password.setCharAt(digitPos, DIGITS.charAt(random.nextInt(DIGITS.length())));
        password.setCharAt(specialPos, SPECIAL_CHARACTERS.charAt(random.nextInt(SPECIAL_CHARACTERS.length())));

        return password.toString();
    }

    /**
     * Generate a PIN (numeric only)
     *
     * @param length PIN length (typically 4-8)
     * @return generated PIN
     */
    public static String generatePIN(int length) {
        if (length < 4) {
            throw new IllegalArgumentException("PIN length must be at least 4 digits");
        }

        StringBuilder pin = new StringBuilder();
        for (int i = 0; i < length; i++) {
            pin.append(random.nextInt(10));
        }
        return pin.toString();
    }

    /**
     * Remove ambiguous characters from a string
     *
     * @param input input string
     * @return string without ambiguous characters
     */
    private static String removeAmbiguous(String input) {
        StringBuilder result = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (AMBIGUOUS_CHARACTERS.indexOf(c) == -1) {
                result.append(c);
            }
        }
        return result.toString();
    }

    /**
     * Generate a passphrase (words separated by delimiter)
     * Uses simple common words for memorability
     *
     * @param wordCount number of words (minimum 3)
     * @param delimiter delimiter between words (e.g., "-", "_", " ")
     * @return generated passphrase
     */
    public static String generatePassphrase(int wordCount, String delimiter) {
        if (wordCount < 3) {
            throw new IllegalArgumentException("Passphrase must contain at least 3 words");
        }

        String[] words = {
                "correct", "horse", "battery", "staple", "ocean", "mountain", "river", "forest",
                "tiger", "eagle", "dolphin", "elephant", "sunset", "rainbow", "thunder", "lightning",
                "silver", "golden", "diamond", "crystal", "ancient", "modern", "future", "digital",
                "cosmic", "solar", "lunar", "stellar", "quantum", "magnetic", "electric", "nuclear"
        };

        StringBuilder passphrase = new StringBuilder();
        for (int i = 0; i < wordCount; i++) {
            if (i > 0) {
                passphrase.append(delimiter);
            }
            String word = words[random.nextInt(words.length)];
            // Capitalize first letter of each word
            passphrase.append(Character.toUpperCase(word.charAt(0)))
                    .append(word.substring(1));
        }

        // Add a random number at the end
        passphrase.append(delimiter).append(random.nextInt(1000));

        return passphrase.toString();
    }
}
