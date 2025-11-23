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
  Box,
  Grid,
} from '@mui/material';
import { tagSchema } from '@utils/validators';
import { tagService } from '@services/tagService';

/**
 * TagDialog - Dialog for creating/editing tags
 */
const TagDialog = ({ open, onClose, tag = null, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(tag);

  const popularColors = tagService.getPopularColors();

  const formik = useFormik({
    initialValues: {
      name: tag?.name || '',
      color: tag?.color || popularColors[0],
    },
    validationSchema: tagSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onSave(values);
        handleClose();
      } catch (error) {
        console.error('Error saving tag:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleColorSelect = (color) => {
    formik.setFieldValue('color', color);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Tag Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <Box>
              <TextField
                fullWidth
                id="color"
                name="color"
                label="Color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        backgroundColor: formik.values.color,
                        mr: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ),
                }}
              />

              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  {popularColors.map((color) => (
                    <Grid item key={color}>
                      <Box
                        onClick={() => handleColorSelect(color)}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: color,
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor:
                            formik.values.color === color ? 'primary.main' : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.light',
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
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

TagDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tag: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default TagDialog;
