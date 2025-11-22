# Auth Key Storage System - Frontend

Modern, secure password and authentication key management system built with React and Material-UI.

## Features

- **Zero-Knowledge Encryption**: Client-side AES-256-GCM encryption with PBKDF2 key derivation
- **Secure Storage**: All sensitive data encrypted before sending to server
- **Folder Organization**: Organize keys in hierarchical folders
- **Tag System**: Categorize keys with custom tags
- **Secure Sharing**: Time-limited, view-controlled share links
- **Password Generator**: Generate strong passwords with customizable options
- **Audit Logs**: Track all key access and modifications
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

- **React 18**: Modern React with hooks
- **Material-UI v5**: Comprehensive UI component library
- **React Router v6**: Client-side routing
- **Formik + Yup**: Form management and validation
- **Axios**: HTTP client with interceptors
- **Web Crypto API**: Secure client-side encryption
- **Vite**: Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:8080
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── authkeys/   # Auth key related components
│   │   ├── common/     # Shared components
│   │   ├── folders/    # Folder management
│   │   ├── layout/     # Layout components
│   │   ├── share/      # Share link components
│   │   └── tags/       # Tag management
│   ├── config/         # Configuration files
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API and utility services
│   └── utils/          # Utility functions
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## Security Features

### Client-Side Encryption

All sensitive data is encrypted on the client before transmission:

1. **Master Password**: Never sent to server
2. **Key Derivation**: PBKDF2 with 100,000 iterations
3. **Encryption**: AES-256-GCM
4. **Zero-Knowledge**: Server only stores encrypted data

### Security Best Practices

- Master password strength enforcement (min 12 characters)
- Session timeout after inactivity
- Secure password generator
- Clipboard auto-clear
- HTTPS enforcement in production
- Content Security Policy headers

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_PBKDF2_ITERATIONS` | PBKDF2 iterations | `100000` |
| `VITE_SESSION_TIMEOUT` | Session timeout (ms) | `3600000` |
| `VITE_ITEMS_PER_PAGE` | Pagination limit | `20` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
