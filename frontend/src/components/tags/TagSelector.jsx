import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/**
 * TagSelector - Component for selecting tags
 */
const TagSelector = ({ selectedTags = [], onChange }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        Tag selector - Coming soon
      </Typography>
    </Box>
  );
};

TagSelector.propTypes = {
  selectedTags: PropTypes.array,
  onChange: PropTypes.func,
};

export default TagSelector;
