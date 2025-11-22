import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ErrorOutline } from '@mui/icons-material';
import { ROUTES } from '@config/constants';

/**
 * NotFoundPage - 404 Error page
 */
const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <ErrorOutline sx={{ fontSize: 120, color: 'text.secondary' }} />

        <Typography variant="h1" fontWeight={700} color="text.primary">
          404
        </Typography>

        <Typography variant="h5" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Button
          component={RouterLink}
          to={ROUTES.DASHBOARD}
          variant="contained"
          size="large"
          startIcon={<Home />}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
