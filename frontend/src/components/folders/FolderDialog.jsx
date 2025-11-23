import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { folderSchema } from '@utils/validators';

/**
 * FolderDialog - Dialog for creating/editing folders
 */
const FolderDialog = ({ open, onClose, folder = null, folders = [], onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(folder);

  const formik = useFormik({
    initialValues: {
      name: folder?.name || '',
      parent_id: folder?.parentId || null,
      description: folder?.description || '',
    },
    validationSchema: folderSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onSave(values);
        handleClose();
      } catch (error) {
        console.error('Error saving folder:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Folder' : 'Create Folder'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Folder Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              select
              id="parent_id"
              name="parent_id"
              label="Parent Folder (optional)"
              value={formik.values.parent_id || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.parent_id && Boolean(formik.errors.parent_id)}
              helperText={formik.touched.parent_id && formik.errors.parent_id}
            >
              <MenuItem value="">None (Root folder)</MenuItem>
              {folders
                .filter((f) => f.id !== folder?.id) // Don't allow selecting self as parent
                .map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description (optional)"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

FolderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  folder: PropTypes.object,
  folders: PropTypes.array,
  onSave: PropTypes.func.isRequired,
};

export default FolderDialog;
