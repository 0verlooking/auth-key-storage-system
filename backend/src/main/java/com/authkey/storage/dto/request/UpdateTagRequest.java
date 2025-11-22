package com.authkey.storage.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for updating a tag
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTagRequest {

    @NotBlank(message = "Tag name is required")
    @Size(min = 1, max = 50, message = "Tag name must be between 1 and 50 characters")
    private String name;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "Color must be in hex format (e.g., #FF5733)")
    private String color;

    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;
}
