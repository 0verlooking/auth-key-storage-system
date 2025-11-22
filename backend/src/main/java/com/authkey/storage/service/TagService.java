package com.authkey.storage.service;

import com.authkey.storage.dto.request.CreateTagRequest;
import com.authkey.storage.dto.response.TagResponse;
import com.authkey.storage.entity.Tag;

import java.util.List;

/**
 * Service interface for tag management
 */
public interface TagService {

    /**
     * Create a new tag
     * @param userId the user ID
     * @param request the create tag request
     * @return the created tag response
     */
    TagResponse createTag(Long userId, CreateTagRequest request);

    /**
     * Get tag by ID
     * @param userId the user ID
     * @param tagId the tag ID
     * @return the tag response
     */
    TagResponse getTagById(Long userId, Long tagId);

    /**
     * Get all tags for user
     * @param userId the user ID
     * @return list of tag responses
     */
    List<TagResponse> getAllTags(Long userId);

    /**
     * Update tag
     * @param userId the user ID
     * @param tagId the tag ID
     * @param request the update tag request
     * @return the updated tag response
     */
    TagResponse updateTag(Long userId, Long tagId, CreateTagRequest request);

    /**
     * Delete tag
     * @param userId the user ID
     * @param tagId the tag ID
     */
    void deleteTag(Long userId, Long tagId);

    /**
     * Convert Tag entity to TagResponse DTO
     * @param tag the tag entity
     * @return the tag response DTO
     */
    TagResponse convertToResponse(Tag tag);
}
