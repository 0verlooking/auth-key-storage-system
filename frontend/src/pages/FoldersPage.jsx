import { Box, Typography, Card, CardContent } from '@mui/material';

/**
 * FoldersPage - Folder management page
 */
const FoldersPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Folders
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Folder management coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FoldersPage;
