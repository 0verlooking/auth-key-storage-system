import { Box, Typography, Card, CardContent } from '@mui/material';

/**
 * AuditLogsPage - Audit logs page
 */
const AuditLogsPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Audit Logs
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Audit logs functionality coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditLogsPage;
