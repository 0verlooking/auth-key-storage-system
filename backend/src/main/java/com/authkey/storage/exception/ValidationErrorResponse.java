package com.authkey.storage.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Validation error response structure
 * Used for returning field-level validation errors to API clients
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {

    /**
     * HTTP status code (typically 400)
     */
    private int status;

    /**
     * Error type
     */
    private String error;

    /**
     * General error message
     */
    private String message;

    /**
     * Request path where error occurred
     */
    private String path;

    /**
     * Timestamp when error occurred
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * List of field-specific validation errors
     */
    @Builder.Default
    private List<FieldError> fieldErrors = new ArrayList<>();

    /**
     * Add a field error to the response
     *
     * @param field   the field name
     * @param message the error message
     */
    public void addFieldError(String field, String message) {
        if (fieldErrors == null) {
            fieldErrors = new ArrayList<>();
        }
        fieldErrors.add(new FieldError(field, message));
    }

    /**
     * Field-specific error details
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldError {
        /**
         * Name of the field that failed validation
         */
        private String field;

        /**
         * Validation error message for the field
         */
        private String message;
    }
}
