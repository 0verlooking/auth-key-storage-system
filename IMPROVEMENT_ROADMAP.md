# ПОКРАЩЕНА ВЕРСІЯ SECURE VAULT - ROADMAP

## ПОРІВНЯННЯ: ПОТОЧНА vs ПОКРАЩЕНА ВЕРСІЯ

| Функція | Secure Vault (поточна) | Покращена версія |
|---------|------------------------|------------------|
| **Автентифікація** | Email + Password + JWT | + 2FA (TOTP/SMS) + WebAuthn + Biometric |
| **Шифрування** | AES-GCM (client-side) | + ChaCha20-Poly1305 + Multi-algorithm support |
| **Vault організація** | Плоский список | Folders + Tags + Categories + Favorites |
| **Пошук** | Базовий | Advanced search + Filters + Full-text |
| **Sharing** | В розробці | Secure sharing + Team vaults + Permissions |
| **Import/Export** | Відсутній | 1Password, LastPass, Dashlane, CSV, JSON |
| **Password Generator** | Відсутній | Advanced generator + Passphrase + Custom rules |
| **Browser Integration** | Відсутній | Chrome/Firefox extensions + Auto-fill |
| **Mobile** | В розробці (React Native) | iOS + Android native apps |
| **Offline режим** | Відсутній | Full offline support + Sync |
| **Audit** | Відсутній | Comprehensive audit logs + Activity monitor |
| **Breach monitoring** | Відсутній | Integration з Have I Been Pwned |
| **Emergency access** | Відсутній | Trusted contacts + Time-delayed access |
| **Monitoring** | Базове логування | Prometheus + Grafana + Alerts |
| **Deployment** | Docker Compose | + Kubernetes + Helm + Auto-scaling |

---

## PHASE 1: CORE IMPROVEMENTS (Місяць 1-2)

### 1.1 Backend Розширення

#### Додати Two-Factor Authentication

**Нові endpoints:**
```java
// TwoFactorController.java
@RestController
@RequestMapping("${api.uri-prefix}/v1/auth/2fa")
public class TwoFactorController {

    @PostMapping("/setup")
    public ResponseEntity<TwoFactorSetupResponse> setupTOTP() {
        // Генерація QR коду для Google Authenticator
        String secret = totpService.generateSecret();
        String qrCode = totpService.generateQRCode(secret);
        return ResponseEntity.ok(new TwoFactorSetupResponse(secret, qrCode));
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verifyTOTP(@RequestBody VerifyTOTPRequest request) {
        // Верифікація TOTP коду
        totpService.verify(request.getCode(), request.getSecret());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/enable")
    public ResponseEntity<Void> enableTwoFactor(@RequestBody EnableTwoFactorRequest request) {
        twoFactorService.enable(request.getUserId(), request.getMethod());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disable")
    public ResponseEntity<Void> disableTwoFactor() {
        twoFactorService.disable(getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/backup-codes")
    public ResponseEntity<BackupCodesResponse> generateBackupCodes() {
        List<String> codes = twoFactorService.generateBackupCodes(getCurrentUserId());
        return ResponseEntity.ok(new BackupCodesResponse(codes));
    }
}
```

**Залежності (pom.xml):**
```xml
<!-- TOTP для 2FA -->
<dependency>
    <groupId>dev.samstevens.totp</groupId>
    <artifactId>totp</artifactId>
    <version>1.7.1</version>
</dependency>

<!-- QR Code генерація -->
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.5.1</version>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.5.1</version>
</dependency>
```

**Entity:**
```java
@Document(collection = "two_factor_settings")
public class TwoFactorSettings {
    @Id
    private String id;
    private String userId;
    private boolean enabled;
    private TwoFactorMethod method; // TOTP, SMS, EMAIL
    private String secret; // Encrypted
    private List<String> backupCodes; // Hashed
    private LocalDateTime createdAt;
    private LocalDateTime enabledAt;
}

public enum TwoFactorMethod {
    TOTP,    // Google Authenticator, Authy
    SMS,     // SMS код
    EMAIL    // Email код
}
```

#### Password Generator Service

**Backend API:**
```java
@RestController
@RequestMapping("${api.uri-prefix}/v1/password")
public class PasswordGeneratorController {

    @PostMapping("/generate")
    public ResponseEntity<GeneratedPassword> generatePassword(
        @RequestBody @Valid PasswordGenerationRequest request
    ) {
        String password = passwordGeneratorService.generate(request.getOptions());
        int strength = passwordStrengthService.calculateStrength(password);

        return ResponseEntity.ok(new GeneratedPassword(
            password,
            strength,
            passwordStrengthService.getStrengthLabel(strength)
        ));
    }

    @PostMapping("/check-strength")
    public ResponseEntity<PasswordStrength> checkStrength(
        @RequestBody CheckPasswordRequest request
    ) {
        int strength = passwordStrengthService.calculateStrength(request.getPassword());
        List<String> suggestions = passwordStrengthService.getSuggestions(request.getPassword());

        return ResponseEntity.ok(new PasswordStrength(
            strength,
            passwordStrengthService.getStrengthLabel(strength),
            suggestions
        ));
    }

    @GetMapping("/check-breach")
    public ResponseEntity<BreachCheckResult> checkBreach(
        @RequestParam String passwordHash
    ) {
        // Integration з Have I Been Pwned API
        boolean breached = breachMonitorService.checkPassword(passwordHash);
        int count = breachMonitorService.getBreachCount(passwordHash);

        return ResponseEntity.ok(new BreachCheckResult(breached, count));
    }
}
```

**Password Generator Service:**
```java
@Service
public class PasswordGeneratorService {

    private final SecureRandom secureRandom = new SecureRandom();

    public String generate(PasswordOptions options) {
        StringBuilder charset = new StringBuilder();

        if (options.isIncludeLowercase()) {
            charset.append("abcdefghijklmnopqrstuvwxyz");
        }
        if (options.isIncludeUppercase()) {
            charset.append("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        }
        if (options.isIncludeNumbers()) {
            charset.append("0123456789");
        }
        if (options.isIncludeSymbols()) {
            charset.append("!@#$%^&*()_+-=[]{}|;:,.<>?");
        }

        if (options.isExcludeSimilar()) {
            // Видалити схожі символи: il1Lo0O
            charset = new StringBuilder(
                charset.toString().replaceAll("[il1Lo0O]", "")
            );
        }

        if (options.isExcludeAmbiguous()) {
            // Видалити неоднозначні: {}[]()/\\'\"`~,;:.<>
            charset = new StringBuilder(
                charset.toString().replaceAll("[{}\\[\\]()/\\\\'\"`~,;:.<>]", "")
            );
        }

        // Генерація паролю
        StringBuilder password = new StringBuilder(options.getLength());
        for (int i = 0; i < options.getLength(); i++) {
            int index = secureRandom.nextInt(charset.length());
            password.append(charset.charAt(index));
        }

        // Перевірка мінімальних вимог
        if (!meetsRequirements(password.toString(), options)) {
            return generate(options); // Retry
        }

        return password.toString();
    }

    public String generatePassphrase(PassphraseOptions options) {
        // Diceware-style passphrase generation
        List<String> words = wordListService.getRandomWords(options.getWordCount());

        String separator = options.getSeparator();
        boolean capitalize = options.isCapitalize();
        boolean includeNumber = options.isIncludeNumber();

        StringBuilder passphrase = new StringBuilder();
        for (int i = 0; i < words.size(); i++) {
            String word = words.get(i);

            if (capitalize) {
                word = StringUtils.capitalize(word);
            }

            passphrase.append(word);

            if (i < words.size() - 1) {
                passphrase.append(separator);
            }
        }

        if (includeNumber) {
            passphrase.append(separator).append(secureRandom.nextInt(9999));
        }

        return passphrase.toString();
    }

    private boolean meetsRequirements(String password, PasswordOptions options) {
        if (options.isIncludeLowercase() && !password.matches(".*[a-z].*")) {
            return false;
        }
        if (options.isIncludeUppercase() && !password.matches(".*[A-Z].*")) {
            return false;
        }
        if (options.isIncludeNumbers() && !password.matches(".*\\d.*")) {
            return false;
        }
        if (options.isIncludeSymbols() && !password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?].*")) {
            return false;
        }
        return true;
    }
}
```

#### Vault Folders та Tags

**Entities:**
```java
@Document(collection = "folders")
public class Folder {
    @Id
    private String id;
    private String userId;
    private String name;
    private String color;
    private String icon;
    private String parentId; // Для вкладених папок
    private int order;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Document(collection = "tags")
public class Tag {
    @Id
    private String id;
    private String userId;
    private String name;
    private String color;
    private int usageCount;
    private LocalDateTime createdAt;
}

@Document(collection = "vault_items")
public class VaultItem {
    @Id
    private String id;
    private String userId;
    private String folderId; // Nullable
    private List<String> tagIds;
    private String type; // PASSWORD, NOTE, CARD, IDENTITY
    private String name;
    private String encryptedData;
    private boolean favorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastAccessedAt;
}
```

**Controllers:**
```java
@RestController
@RequestMapping("${api.uri-prefix}/v1/folders")
public class FolderController {

    @GetMapping
    public ResponseEntity<List<Folder>> listFolders() {
        List<Folder> folders = folderService.getUserFolders(getCurrentUserId());
        return ResponseEntity.ok(folders);
    }

    @PostMapping
    public ResponseEntity<Folder> createFolder(@RequestBody @Valid CreateFolderRequest request) {
        Folder folder = folderService.create(getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(folder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Folder> updateFolder(
        @PathVariable String id,
        @RequestBody @Valid UpdateFolderRequest request
    ) {
        Folder folder = folderService.update(id, request);
        return ResponseEntity.ok(folder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable String id) {
        folderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

@RestController
@RequestMapping("${api.uri-prefix}/v1/tags")
public class TagController {

    @GetMapping
    public ResponseEntity<List<Tag>> listTags() {
        List<Tag> tags = tagService.getUserTags(getCurrentUserId());
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody @Valid CreateTagRequest request) {
        Tag tag = tagService.create(getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable String id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 1.2 Frontend Розширення

#### 2FA Setup Component

```typescript
// src/modules/auth/components/TwoFactorSetup.tsx
'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const verifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits')
})

export function TwoFactorSetup() {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup')
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(verifySchema)
  })

  const setupTOTP = async () => {
    const response = await fetch('/api/v1/auth/2fa/setup', {
      method: 'POST'
    })
    const data = await response.json()
    setSecret(data.secret)
    setQrCode(data.qrCode)
    setStep('verify')
  }

  const verifyCode = async (data: { code: string }) => {
    await fetch('/api/v1/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code: data.code, secret })
    })

    await fetch('/api/v1/auth/2fa/enable', { method: 'POST' })

    const backupResponse = await fetch('/api/v1/auth/2fa/backup-codes', {
      method: 'POST'
    })
    const backupData = await backupResponse.json()
    setBackupCodes(backupData.codes)
    setStep('backup')
  }

  return (
    <div>
      {step === 'setup' && (
        <div>
          <h2>Enable Two-Factor Authentication</h2>
          <p>Add an extra layer of security to your account</p>
          <button onClick={setupTOTP}>Get Started</button>
        </div>
      )}

      {step === 'verify' && (
        <div>
          <h2>Scan QR Code</h2>
          <QRCodeSVG value={qrCode} size={256} />
          <p>Secret: {secret}</p>

          <form onSubmit={handleSubmit(verifyCode)}>
            <input
              {...register('code')}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
            <button type="submit">Verify</button>
          </form>
        </div>
      )}

      {step === 'backup' && (
        <div>
          <h2>Backup Codes</h2>
          <p>Save these codes in a safe place. You can use them if you lose access to your authenticator.</p>
          <ul>
            {backupCodes.map(code => (
              <li key={code}>{code}</li>
            ))}
          </ul>
          <button onClick={() => navigator.clipboard.writeText(backupCodes.join('\n'))}>
            Copy Codes
          </button>
        </div>
      )}
    </div>
  )
}
```

#### Password Generator Component

```typescript
// src/modules/vault/components/PasswordGenerator.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Slider, Switch, Button } from '@heroui/react'

interface PasswordOptions {
  length: number
  includeLowercase: boolean
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export function PasswordGenerator({ onGenerate }: { onGenerate: (password: string) => void }) {
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  })

  const generatePassword = async () => {
    const response = await fetch('/api/v1/password/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options })
    })

    const data = await response.json()
    setPassword(data.password)
    setStrength(data.strength)
  }

  const checkStrength = async (password: string) => {
    const response = await fetch('/api/v1/password/check-strength', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    const data = await response.json()
    setStrength(data.strength)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={password}
          readOnly
          className="flex-1 font-mono"
        />
        <Button onClick={() => navigator.clipboard.writeText(password)}>
          Copy
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 h-2 rounded">
          <div
            className={`h-full rounded ${
              strength < 30 ? 'bg-red-500' :
              strength < 60 ? 'bg-yellow-500' :
              strength < 80 ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span>
          {strength < 30 ? 'Weak' :
           strength < 60 ? 'Fair' :
           strength < 80 ? 'Good' : 'Strong'}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label>Length: {options.length}</label>
          <Slider
            value={options.length}
            onChange={(value) => setOptions({ ...options, length: value as number })}
            min={8}
            max={128}
            step={1}
          />
        </div>

        <Switch
          checked={options.includeLowercase}
          onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
        >
          Lowercase (a-z)
        </Switch>

        <Switch
          checked={options.includeUppercase}
          onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
        >
          Uppercase (A-Z)
        </Switch>

        <Switch
          checked={options.includeNumbers}
          onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
        >
          Numbers (0-9)
        </Switch>

        <Switch
          checked={options.includeSymbols}
          onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
        >
          Symbols (!@#$%...)
        </Switch>

        <Switch
          checked={options.excludeSimilar}
          onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
        >
          Exclude similar (il1Lo0O)
        </Switch>

        <Switch
          checked={options.excludeAmbiguous}
          onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
        >
          Exclude ambiguous ({'{'}{'}'} [] () / \ ' " ` ~, ; : . {'<'} {'>'}  )
        </Switch>
      </div>

      <Button onClick={generatePassword} color="primary" className="w-full">
        Generate Password
      </Button>

      {password && (
        <Button onClick={() => onGenerate(password)} className="w-full">
          Use This Password
        </Button>
      )}
    </div>
  )
}
```

---

## PHASE 2: ADVANCED FEATURES (Місяць 3-4)

### 2.1 Import/Export

**Backend:**
```java
@RestController
@RequestMapping("${api.uri-prefix}/v1/import-export")
public class ImportExportController {

    @PostMapping("/import")
    public ResponseEntity<ImportResult> importData(
        @RequestParam("file") MultipartFile file,
        @RequestParam("format") ImportFormat format
    ) {
        ImportResult result = importService.importVaults(
            getCurrentUserId(),
            file,
            format
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportData(
        @RequestParam("format") ExportFormat format
    ) {
        byte[] data = exportService.exportVaults(getCurrentUserId(), format);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=vaults." + format.getExtension())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(data);
    }
}

public enum ImportFormat {
    LASTPASS,
    ONE_PASSWORD,
    DASHLANE,
    BITWARDEN,
    CHROME,
    FIREFOX,
    CSV,
    JSON
}

public enum ExportFormat {
    CSV("csv"),
    JSON("json"),
    ENCRYPTED_JSON("json.enc");

    private final String extension;
}
```

### 2.2 Browser Extension

**Manifest (Chrome/Firefox):**
```json
{
  "manifest_version": 3,
  "name": "Secure Vault",
  "version": "1.0.0",
  "description": "Password manager extension",

  "permissions": [
    "activeTab",
    "storage",
    "tabs"
  ],

  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],

  "background": {
    "service_worker": "background.js"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ],

  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  }
}
```

**Auto-fill Content Script:**
```javascript
// content.js
class AutoFillManager {
  constructor() {
    this.forms = []
    this.detectForms()
    this.listenForMessages()
  }

  detectForms() {
    const forms = document.querySelectorAll('form')

    forms.forEach(form => {
      const usernameField = this.findUsernameField(form)
      const passwordField = this.findPasswordField(form)

      if (usernameField && passwordField) {
        this.forms.push({ form, usernameField, passwordField })
        this.addFillButton(form)
      }
    })
  }

  findUsernameField(form) {
    return form.querySelector(
      'input[type="email"], input[type="text"], input[name*="user"], input[name*="email"]'
    )
  }

  findPasswordField(form) {
    return form.querySelector('input[type="password"]')
  }

  addFillButton(form) {
    const button = document.createElement('div')
    button.className = 'secure-vault-autofill-btn'
    button.innerHTML = '🔐 Fill'
    button.onclick = () => this.requestCredentials(form)

    const passwordField = this.findPasswordField(form)
    passwordField.parentNode.appendChild(button)
  }

  async requestCredentials(form) {
    const domain = window.location.hostname

    chrome.runtime.sendMessage(
      { action: 'getCredentials', domain },
      (response) => {
        if (response.credentials) {
          this.fillForm(form, response.credentials)
        }
      }
    )
  }

  fillForm(form, credentials) {
    const usernameField = this.findUsernameField(form)
    const passwordField = this.findPasswordField(form)

    if (usernameField) usernameField.value = credentials.username
    if (passwordField) passwordField.value = credentials.password

    // Trigger events для React forms
    usernameField.dispatchEvent(new Event('input', { bubbles: true }))
    passwordField.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

new AutoFillManager()
```

### 2.3 Audit Logging

**Entity:**
```java
@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String userId;
    private AuditAction action;
    private String resourceType;
    private String resourceId;
    private String ipAddress;
    private String userAgent;
    private String location; // GeoIP
    private Map<String, Object> metadata;
    private LocalDateTime timestamp;
}

public enum AuditAction {
    // Auth
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT,
    PASSWORD_CHANGED,
    TWO_FACTOR_ENABLED,
    TWO_FACTOR_DISABLED,

    // Vault
    VAULT_CREATED,
    VAULT_VIEWED,
    VAULT_UPDATED,
    VAULT_DELETED,
    VAULT_SHARED,

    // Export
    DATA_EXPORTED,
    DATA_IMPORTED
}
```

**Service:**
```java
@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Async
    public void log(
        String userId,
        AuditAction action,
        String resourceType,
        String resourceId,
        HttpServletRequest request
    ) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        log.setIpAddress(getClientIP(request));
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setLocation(geoIPService.getLocation(getClientIP(request)));
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
```

---

## PHASE 3: ENTERPRISE FEATURES (Місяць 5-6)

### 3.1 Team Vaults

**Entities:**
```java
@Document(collection = "teams")
public class Team {
    @Id
    private String id;
    private String name;
    private String ownerId;
    private List<TeamMember> members;
    private LocalDateTime createdAt;
}

public class TeamMember {
    private String userId;
    private TeamRole role;
    private LocalDateTime joinedAt;
}

public enum TeamRole {
    OWNER,
    ADMIN,
    MEMBER,
    VIEWER
}

@Document(collection = "shared_vaults")
public class SharedVault {
    @Id
    private String id;
    private String vaultId;
    private String teamId;
    private Map<String, Permission> permissions; // userId -> Permission
    private LocalDateTime sharedAt;
}

public class Permission {
    private boolean canView;
    private boolean canEdit;
    private boolean canDelete;
    private boolean canShare;
}
```

### 3.2 WebAuthn Support

**Dependencies:**
```xml
<dependency>
    <groupId>com.webauthn4j</groupId>
    <artifactId>webauthn4j-spring-security</artifactId>
    <version>0.21.0.RELEASE</version>
</dependency>
```

**Controller:**
```java
@RestController
@RequestMapping("${api.uri-prefix}/v1/webauthn")
public class WebAuthnController {

    @PostMapping("/register/options")
    public ResponseEntity<PublicKeyCredentialCreationOptions> getRegistrationOptions() {
        // Генерація challenge для реєстрації
        PublicKeyCredentialCreationOptions options =
            webAuthnService.generateRegistrationOptions(getCurrentUser());
        return ResponseEntity.ok(options);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerCredential(
        @RequestBody RegistrationRequest request
    ) {
        webAuthnService.processRegistration(getCurrentUserId(), request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/authenticate/options")
    public ResponseEntity<PublicKeyCredentialRequestOptions> getAuthenticationOptions() {
        PublicKeyCredentialRequestOptions options =
            webAuthnService.generateAuthenticationOptions();
        return ResponseEntity.ok(options);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
        @RequestBody AuthenticationRequest request
    ) {
        AuthenticationResponse response = webAuthnService.processAuthentication(request);
        return ResponseEntity.ok(response);
    }
}
```

---

## ТЕХНІЧНА ІНФРАСТРУКТУРА

### Kubernetes Deployment

**backend-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-vault-backend
  namespace: secure-vault
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: secure-vault-backend
  template:
    metadata:
      labels:
        app: secure-vault-backend
    spec:
      containers:
      - name: backend
        image: secure-vault-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: MONGO_URI
          valueFrom:
            secretKeyRef:
              name: secure-vault-secrets
              key: mongo-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: secure-vault-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/v1/health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health/ready
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: secure-vault-backend
  namespace: secure-vault
spec:
  selector:
    app: secure-vault-backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-vault-ingress
  namespace: secure-vault
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.securevault.example.com
    secretName: securevault-tls
  rules:
  - host: api.securevault.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: secure-vault-backend
            port:
              number: 80
```

### Monitoring з Prometheus

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'secure-vault-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['secure-vault-backend:8080']

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb-exporter:9216']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

---

## ПРІОРИТИЗАЦІЯ ФУНКЦІЙ

### Must Have (Критично важливі)
1. ✅ Two-Factor Authentication
2. ✅ Password Generator
3. ✅ Import/Export
4. ✅ Folders та Tags
5. ✅ Audit Logs

### Should Have (Дуже бажані)
6. ✅ Browser Extensions
7. ✅ Password Strength Checker
8. ✅ Breach Monitoring
9. ✅ Advanced Search
10. ✅ Favorites

### Nice to Have (Додаткові)
11. ✅ WebAuthn
12. ✅ Team Vaults
13. ✅ Emergency Access
14. ✅ Biometric Auth
15. ✅ File Attachments

---

## TIMELINE SUMMARY

| Phase | Duration | Features |
|-------|----------|----------|
| Phase 1 | 1-2 місяці | 2FA, Password Gen, Folders/Tags |
| Phase 2 | 1-2 місяці | Browser Ext, Import/Export, Audit |
| Phase 3 | 1-2 місяці | Teams, WebAuthn, Advanced Security |
| Phase 4 | 1 місяць | Mobile App, Offline Mode, Sync |
| Phase 5 | Ongoing | Optimization, Scaling, New Features |

**Total:** 6-9 місяців для повної реалізації

---

Цей roadmap надає чітку структуру для розробки покращеної версії Secure Vault з усіма необхідними функціями для конкурентоспроможного продукту.
