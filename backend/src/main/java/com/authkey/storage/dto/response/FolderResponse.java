package com.authkey.storage.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for folder response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderResponse {

    private Long id;

    private String name;

    private String description;

    private String color;

    private String icon;

    @JsonProperty("parent_folder_id")
    private Long parentFolderId;

    @JsonProperty("sub_folders")
    private List<FolderResponse> subFolders;

    @JsonProperty("auth_keys_count")
    private Integer authKeysCount;

    @JsonProperty("is_root")
    private Boolean isRoot;

    private Integer depth;

    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}
