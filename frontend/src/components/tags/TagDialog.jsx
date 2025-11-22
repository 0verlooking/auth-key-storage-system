import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

/**
 * TagDialog - Dialog for creating/editing tags
 */
const TagDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tag Dialog</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Coming soon...</Typography>
      </DialogContent>
    </Dialog>
  );
};

TagDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TagDialog;
