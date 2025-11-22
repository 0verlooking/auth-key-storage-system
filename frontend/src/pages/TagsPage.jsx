import { Box, Typography, Card, CardContent } from '@mui/material';

/**
 * TagsPage - Tag management page
 */
const TagsPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Tags
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Tag management coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TagsPage;
