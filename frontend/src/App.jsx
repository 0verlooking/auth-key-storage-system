import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '@context/AuthContext';
import { AuthKeyProvider } from '@context/AuthKeyContext';
import { NotificationProvider } from '@context/NotificationContext';
import { useThemeMode } from '@hooks/useThemeMode';
import { getTheme } from '@config/theme';

// Layouts
import MainLayout from '@components/layout/MainLayout';
import AuthLayout from '@components/layout/AuthLayout';
import PrivateRoute from '@components/layout/PrivateRoute';

// Pages
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import FoldersPage from '@pages/FoldersPage';
import TagsPage from '@pages/TagsPage';
import ProfilePage from '@pages/ProfilePage';
import SettingsPage from '@pages/SettingsPage';
import AuditLogsPage from '@pages/AuditLogsPage';
import AdminPage from '@pages/AdminPage';
import NotFoundPage from '@pages/NotFoundPage';

// Components
import ShareLinkAccessPage from '@components/share/ShareLinkAccessPage';
import Notification from '@components/common/Notification';

function App() {
  const { mode, toggleTheme } = useThemeMode();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <AuthProvider>
          <AuthKeyProvider>
            <Notification />
            <Routes>
              {/* Public Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/share/:token" element={<ShareLinkAccessPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout mode={mode} toggleTheme={toggleTheme} />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/folders" element={<FoldersPage />} />
                  <Route path="/folders/:folderId" element={<DashboardPage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthKeyProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
