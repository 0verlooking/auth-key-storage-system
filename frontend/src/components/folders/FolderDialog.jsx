import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

/**
 * FolderDialog - Dialog for creating/editing folders
 */
const FolderDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Folder Dialog</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Coming soon...</Typography>
      </DialogContent>
    </Dialog>
  );
};

FolderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FolderDialog;
