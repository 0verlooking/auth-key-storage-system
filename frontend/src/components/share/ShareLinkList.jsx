import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/**
 * ShareLinkList - List of share links
 */
const ShareLinkList = ({ shareLinks = [] }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        Share links list - Coming soon
      </Typography>
    </Box>
  );
};

ShareLinkList.propTypes = {
  shareLinks: PropTypes.array,
};

export default ShareLinkList;
