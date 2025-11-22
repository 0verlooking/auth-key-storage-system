import { Box, Typography, Card, CardContent } from '@mui/material';

/**
 * SettingsPage - Application settings page
 */
const SettingsPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Settings functionality coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;
