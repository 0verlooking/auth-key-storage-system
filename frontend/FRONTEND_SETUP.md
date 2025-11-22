# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── authkeys/   # Auth key components
│   │   ├── common/     # Shared components
│   │   ├── folders/    # Folder components
│   │   ├── layout/     # Layout components
│   │   ├── share/      # Share link components
│   │   └── tags/       # Tag components
│   ├── config/         # Configuration files
│   │   ├── api.js      # Axios setup
│   │   ├── constants.js # App constants
│   │   └── theme.js    # MUI theme
│   ├── context/        # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── AuthKeyContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useAuthKeys.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useThemeMode.js
│   ├── pages/          # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── ...
│   ├── services/       # API and utility services
│   │   ├── authService.js
│   │   ├── authKeyService.js
│   │   ├── cryptoService.js
│   │   ├── storageService.js
│   │   └── ...
│   ├── utils/          # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # Documentation
```

## Key Features

### 🔒 Zero-Knowledge Encryption
- Client-side AES-256-GCM encryption
- PBKDF2 key derivation (100,000 iterations)
- Master password never leaves the client
- Server only stores encrypted data

### 🎨 Modern UI
- Material-UI v5 components
- Responsive design (mobile-first)
- Dark/Light theme support
- Smooth animations and transitions

### 🔑 Auth Key Management
- Create, read, update, delete auth keys
- Multiple key types (password, API key, token, SSH key, etc.)
- Password strength meter
- Password generator with customizable options
- Copy to clipboard with auto-clear

### 📁 Organization
- Hierarchical folder structure
- Tag-based categorization
- Search and filter functionality
- Breadcrumb navigation

### 🔗 Secure Sharing
- Time-limited share links
- Access control (view-only or copy-allowed)
- Password protection
- Max access count limits

### 📊 Audit Logs
- Track all key access
- Monitor modifications
- Security compliance

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Code Style

This project uses:
- ESLint for linting
- Prettier for code formatting
- EditorConfig for consistent editor settings

### Path Aliases

The project uses path aliases for cleaner imports:

```javascript
import { useAuth } from '@hooks/useAuth';
import Button from '@components/common/Button';
import { authService } from '@services/authService';
```

Available aliases:
- `@/` → `src/`
- `@components/` → `src/components/`
- `@pages/` → `src/pages/`
- `@services/` → `src/services/`
- `@context/` → `src/context/`
- `@config/` → `src/config/`
- `@utils/` → `src/utils/`
- `@hooks/` → `src/hooks/`

## Security Considerations

### Client-Side Encryption

All sensitive data is encrypted before being sent to the server:

1. **Master Password**: Used to derive encryption key via PBKDF2
2. **Encryption**: AES-256-GCM for authenticated encryption
3. **Random Salts**: Each encrypted value has a unique salt
4. **Random IVs**: Each encryption uses a random initialization vector

### Session Management

- Automatic session timeout after inactivity
- Secure token storage
- Master password stored in sessionStorage (cleared on tab close)
- Activity tracking for auto-logout

### Best Practices

- Never log sensitive data
- Clear clipboard after copying passwords
- Use HTTPS in production
- Implement Content Security Policy
- Validate all user inputs

## Troubleshooting

### Common Issues

**Issue**: API requests fail with CORS error
**Solution**: Ensure backend is running and CORS is configured correctly

**Issue**: Decryption fails
**Solution**: Verify master password is correct and matches the one used for encryption

**Issue**: Build fails with path alias errors
**Solution**: Ensure `jsconfig.json` is present and Vite config has path aliases

**Issue**: Dark mode not persisting
**Solution**: Check localStorage permissions and browser settings

## Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

Note: The application uses modern web APIs (Web Crypto API) which require modern browsers.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
