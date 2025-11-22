package com.authkey.storage.service.impl;

import com.authkey.storage.dto.request.CreateTagRequest;
import com.authkey.storage.dto.response.TagResponse;
import com.authkey.storage.entity.Tag;
import com.authkey.storage.entity.User;
import com.authkey.storage.exception.BadRequestException;
import com.authkey.storage.exception.ResourceNotFoundException;
import com.authkey.storage.repository.TagRepository;
import com.authkey.storage.service.TagService;
import com.authkey.storage.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of TagService interface
 * Handles tag management operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final UserService userService;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public TagResponse createTag(Long userId, CreateTagRequest request) {
        log.info("Creating tag for user ID: {}", userId);

        User user = userService.getUserById(userId);

        // Check if tag with same name already exists for this user
        if (tagRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new BadRequestException("Tag with name '" + request.getName() + "' already exists");
        }

        // Build tag
        Tag tag = Tag.builder()
                .name(request.getName())
                .color(request.getColor())
                .user(user)
                .build();

        tag = tagRepository.save(tag);

        log.info("Tag created successfully with ID: {}", tag.getId());
        return convertToResponse(tag);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public TagResponse getTagById(Long userId, Long tagId) {
        log.debug("Fetching tag ID: {} for user ID: {}", tagId, userId);

        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + tagId));

        return convertToResponse(tag);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags(Long userId) {
        log.debug("Fetching all tags for user ID: {}", userId);

        List<Tag> tags = tagRepository.findByUserId(userId);
        return tags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public TagResponse updateTag(Long userId, Long tagId, CreateTagRequest request) {
        log.info("Updating tag ID: {} for user ID: {}", tagId, userId);

        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + tagId));

        // Check if tag with same name already exists for this user (excluding current tag)
        if (request.getName() != null && !request.getName().equals(tag.getName())) {
            if (tagRepository.existsByUserIdAndName(userId, request.getName())) {
                throw new BadRequestException("Tag with name '" + request.getName() + "' already exists");
            }
            tag.setName(request.getName());
        }

        // Update color if provided
        if (request.getColor() != null) {
            tag.setColor(request.getColor());
        }

        tag.setUpdatedAt(LocalDateTime.now());
        tag = tagRepository.save(tag);

        log.info("Tag updated successfully with ID: {}", tagId);
        return convertToResponse(tag);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteTag(Long userId, Long tagId) {
        log.info("Deleting tag ID: {} for user ID: {}", tagId, userId);

        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + tagId));

        // Soft delete
        tag.setIsDeleted(true);
        tag.setUpdatedAt(LocalDateTime.now());
        tagRepository.save(tag);

        log.info("Tag deleted successfully with ID: {}", tagId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TagResponse convertToResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .color(tag.getColor())
                .authKeysCount(tag.getAuthKeys() != null ? tag.getAuthKeys().size() : 0)
                .createdAt(tag.getCreatedAt())
                .updatedAt(tag.getUpdatedAt())
                .build();
    }
}
