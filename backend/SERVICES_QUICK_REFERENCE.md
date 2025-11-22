# Services Quick Reference Guide

## 1. UserService

**Purpose:** User profile management

**Key Methods:**
- `getUserById(Long userId)` - Fetch user by ID
- `getUserByUsername(String username)` - Fetch user by username
- `getUserByEmail(String email)` - Fetch user by email
- `updateProfile(Long userId, String firstName, String lastName)` - Update user profile
- `changePassword(Long userId, ChangePasswordRequest request)` - Change password with validation
- `deleteAccount(Long userId)` - Soft delete user account
- `verifyEmail(String token)` - Verify email with token
- `resendVerificationEmail(Long userId)` - Resend verification email

**Key Features:**
- Password validation
- Email verification
- Soft delete support
- Profile updates

---

## 2. AuthService

**Purpose:** Authentication and authorization

**Key Methods:**
- `register(RegisterRequest request)` - Register new user with email verification
- `login(LoginRequest request)` - Authenticate and return JWT tokens
- `logout(Long userId)` - Logout user (token invalidation)
- `refreshToken(String refreshToken)` - Refresh access token
- `forgotPassword(ForgotPasswordRequest request)` - Initiate password reset
- `resetPassword(ResetPasswordRequest request)` - Complete password reset
- `verifyEmailToken(String token)` - Verify email token

**Key Features:**
- JWT token generation (access + refresh)
- Failed login attempt tracking
- Account locking after 5 failed attempts
- Password reset flow
- Email verification

**Security:**
- Passwords hashed with BCrypt
- JWT tokens with configurable expiration
- Account lockout protection

---

## 3. AuthKeyService

**Purpose:** Authentication key management

**Key Methods:**
- `createAuthKey(Long userId, CreateAuthKeyRequest request)` - Create new auth key
- `getAuthKeyById(Long userId, Long authKeyId)` - Get auth key by ID
- `getAllAuthKeys(Long userId, Pageable pageable)` - Get all keys with pagination
- `getAuthKeysByFolder(Long userId, Long folderId, Pageable pageable)` - Filter by folder
- `getFavoriteAuthKeys(Long userId, Pageable pageable)` - Get favorite keys
- `updateAuthKey(Long userId, Long authKeyId, UpdateAuthKeyRequest request)` - Update key
- `deleteAuthKey(Long userId, Long authKeyId)` - Soft delete key
- `searchAuthKeys(Long userId, String query, Pageable pageable)` - Search keys
- `toggleFavorite(Long userId, Long authKeyId)` - Toggle favorite status
- `incrementAccessCount(Long userId, Long authKeyId)` - Track key usage

**Key Features:**
- Client-side encryption support (IV, salt)
- Folder organization
- Tag categorization
- Search functionality
- Favorite marking
- Access tracking
- Expiration dates
- Password strength tracking

---

## 4. FolderService

**Purpose:** Folder hierarchy management

**Key Methods:**
- `createFolder(Long userId, CreateFolderRequest request)` - Create folder
- `getFolderById(Long userId, Long folderId)` - Get folder with details
- `getAllFolders(Long userId)` - Get all user folders
- `getRootFolders(Long userId)` - Get top-level folders
- `getSubFolders(Long userId, Long parentFolderId)` - Get child folders
- `updateFolder(Long userId, Long folderId, UpdateFolderRequest request)` - Update folder
- `deleteFolder(Long userId, Long folderId)` - Soft delete folder
- `moveFolder(Long userId, Long folderId, Long newParentFolderId)` - Move folder

**Key Features:**
- Hierarchical structure (parent/child)
- Circular reference prevention
- Depth calculation
- Color and icon customization
- Soft delete with cascade

**Validation:**
- Prevents folder from being its own parent
- Prevents moving folder to its own descendant

---

## 5. TagService

**Purpose:** Tag management for categorization

**Key Methods:**
- `createTag(Long userId, CreateTagRequest request)` - Create tag
- `getTagById(Long userId, Long tagId)` - Get tag by ID
- `getAllTags(Long userId)` - Get all user tags
- `updateTag(Long userId, Long tagId, CreateTagRequest request)` - Update tag
- `deleteTag(Long userId, Long tagId)` - Soft delete tag

**Key Features:**
- Unique tag names per user
- Color customization
- Usage count tracking
- Soft delete

**Validation:**
- Prevents duplicate tag names per user

---

## 6. ShareLinkService

**Purpose:** Secure key sharing

**Key Methods:**
- `createShareLink(Long userId, CreateShareLinkRequest request)` - Create share link
- `getShareLink(String shareToken)` - Get link by token
- `accessShareLink(String shareToken, String accessPassword)` - Access shared key
- `getUserShareLinks(Long userId)` - Get all user's share links
- `getAuthKeyShareLinks(Long userId, Long authKeyId)` - Get links for specific key
- `revokeShareLink(Long userId, Long shareLinkId)` - Deactivate share link

**Key Features:**
- UUID token generation
- Optional password protection
- Access count limits
- Expiration dates
- Auto-deactivation when limit reached
- Download permission control
- Full share URL generation

**Security:**
- Access passwords hashed
- Token-based access
- Configurable expiration
- Access tracking

---

## 7. AuditLogService

**Purpose:** Security and activity logging

**Key Methods:**
- `logAction(...)` - Log user action (async)
- `getUserAuditLogs(Long userId, Pageable pageable)` - Get user's audit logs
- `getAuditLogsByAction(Long userId, String action, Pageable pageable)` - Filter by action
- `getAuditLogsByResource(...)` - Filter by resource type/ID

**Key Features:**
- Asynchronous logging (non-blocking)
- IP address tracking
- User agent tracking
- Success/failure status
- Error message logging
- Resource tracking (type + ID)
- Pagination support

**Use Cases:**
- Security monitoring
- Compliance tracking
- User activity history
- Debugging

---

## 8. EmailService

**Purpose:** Email notifications

**Key Methods:**
- `sendVerificationEmail(User user, String token)` - Send email verification
- `sendPasswordResetEmail(User user, String resetToken)` - Send password reset
- `sendWelcomeEmail(User user)` - Send welcome email
- `sendPasswordChangedEmail(User user)` - Notify password change
- `sendAccountLockedEmail(User user)` - Notify account lock

**Key Features:**
- Asynchronous sending (non-blocking)
- Configurable templates
- Base URL configuration
- App name branding
- Error handling and logging

**Configuration Required:**
- `spring.mail.username` - Sender email
- `spring.mail.password` - Email password
- `app.base-url` - Frontend URL
- `app.name` - Application name

---

## Common Patterns Across All Services

### Dependency Injection
All implementations use constructor injection via `@RequiredArgsConstructor`

### Transaction Management
- Read operations: `@Transactional(readOnly = true)`
- Write operations: `@Transactional`

### Exception Handling
- `ResourceNotFoundException` - When entity not found
- `BadRequestException` - For validation errors
- `UnauthorizedException` - For access denied

### Logging
All services use SLF4J logger:
- `log.info()` - Important operations
- `log.debug()` - Detailed information
- `log.error()` - Errors
- `log.warn()` - Warnings

### Soft Delete
Most services implement soft delete:
- Sets `isDeleted = true`
- Updates `updatedAt` timestamp
- Preserves data for audit

### DTO Conversion
Each service provides `convertToResponse()` method to map entities to DTOs

---

## Service Dependencies

```
AuthService
  └─> UserService, EmailService, JwtService

UserService
  └─> EmailService

AuthKeyService
  └─> UserService, FolderService, TagService

FolderService
  └─> UserService

TagService
  └─> UserService

ShareLinkService
  └─> (standalone)

AuditLogService
  └─> UserService

EmailService
  └─> (standalone)
```

---

## Configuration Required

### application.properties / application.yml

```properties
# JWT Configuration
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# Application Configuration
app.base-url=http://localhost:3000
app.name=Auth Key Storage System

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## Next Steps for Integration

1. **Create Controllers** - REST endpoints for each service
2. **Configure Security** - Spring Security with JWT
3. **Add Validation** - Global exception handler
4. **Write Tests** - Unit and integration tests
5. **API Documentation** - Swagger/OpenAPI
6. **Add Caching** - Redis for sessions/tokens
7. **Add Rate Limiting** - Prevent abuse
8. **Add Monitoring** - Actuator endpoints
