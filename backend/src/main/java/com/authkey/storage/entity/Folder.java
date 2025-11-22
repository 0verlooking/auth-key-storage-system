package com.authkey.storage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Folder entity for organizing authentication keys
 * Implements Composite Pattern for folder hierarchy
 */
@Entity
@Table(name = "folders", indexes = {
        @Index(name = "idx_folder_user", columnList = "user_id"),
        @Index(name = "idx_folder_parent", columnList = "parent_folder_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Folder extends BaseEntity {

    @NotBlank(message = "Folder name is required")
    @Size(min = 1, max = 100, message = "Folder name must be between 1 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 7)
    private String color;

    @Column(length = 50)
    private String icon;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder;

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Folder> subFolders = new ArrayList<>();

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AuthKey> authKeys = new ArrayList<>();

    // Helper methods
    public void addSubFolder(Folder folder) {
        subFolders.add(folder);
        folder.setParentFolder(this);
    }

    public void removeSubFolder(Folder folder) {
        subFolders.remove(folder);
        folder.setParentFolder(null);
    }

    public void addAuthKey(AuthKey authKey) {
        authKeys.add(authKey);
        authKey.setFolder(this);
    }

    public void removeAuthKey(AuthKey authKey) {
        authKeys.remove(authKey);
        authKey.setFolder(null);
    }

    public boolean isRootFolder() {
        return parentFolder == null;
    }

    public int getDepth() {
        int depth = 0;
        Folder current = this.parentFolder;
        while (current != null) {
            depth++;
            current = current.getParentFolder();
        }
        return depth;
    }
}
