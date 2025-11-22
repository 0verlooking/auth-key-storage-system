import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

/**
 * ShareLinkDialog - Dialog for creating share links
 */
const ShareLinkDialog = ({ open, onClose, authKey }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Share Link</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Share link functionality - Coming soon...</Typography>
      </DialogContent>
    </Dialog>
  );
};

ShareLinkDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  authKey: PropTypes.object,
};

export default ShareLinkDialog;
