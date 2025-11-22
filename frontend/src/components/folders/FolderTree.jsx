import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/**
 * FolderTree - Hierarchical folder tree component
 */
const FolderTree = ({ folders = [] }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        Folder tree component - Coming soon
      </Typography>
    </Box>
  );
};

FolderTree.propTypes = {
  folders: PropTypes.array,
};

export default FolderTree;
