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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Casino } from '@mui/icons-material';
import { useAuthKeys } from '@hooks/useAuthKeys';
import { useNotification } from '@hooks/useNotification';
import { authKeySchema } from '@utils/validators';
import { AUTH_KEY_TYPES } from '@config/constants';
import { formatKeyType } from '@utils/formatters';
import PasswordGenerator from '@components/common/PasswordGenerator';
import PasswordStrengthMeter from '@components/common/PasswordStrengthMeter';

/**
 * AuthKeyDialog - Dialog for creating/editing auth keys
 */
const AuthKeyDialog = ({ open, onClose, authKey = null, onSaved }) => {
  const { createAuthKey, updateAuthKey } = useAuthKeys();
  const { success, error: showError } = useNotification();

  const [showValue, setShowValue] = useState(false);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(authKey);

  const formik = useFormik({
    initialValues: {
      name: authKey?.name || '',
      type: authKey?.type || 'password',
      value: authKey?.value || '',
      username: authKey?.username || '',
      url: authKey?.url || '',
      notes: authKey?.notes || '',
      folder_id: authKey?.folder_id || null,
      tag_ids: authKey?.tag_ids || [],
    },
    validationSchema: authKeySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEdit) {
          await updateAuthKey(authKey.id, values);
          success('Auth key updated successfully');
        } else {
          await createAuthKey(values);
          success('Auth key created successfully');
        }
        onSaved();
        onClose();
      } catch (err) {
        showError(err.message || 'Failed to save auth key');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleGeneratePassword = (password) => {
    formik.setFieldValue('value', password);
    setGeneratorOpen(false);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Auth Key' : 'Create Auth Key'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <TextField
                fullWidth
                select
                id="type"
                name="type"
                label="Type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {Object.values(AUTH_KEY_TYPES).map((type) => (
                  <MenuItem key={type} value={type}>
                    {formatKeyType(type)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username (optional)"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />

              <Box>
                <TextField
                  fullWidth
                  id="value"
                  name="value"
                  label={formik.values.type === 'password' ? 'Password' : 'Value'}
                  type={showValue ? 'text' : 'password'}
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.value && Boolean(formik.errors.value)}
                  helperText={formik.touched.value && formik.errors.value}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.type === 'password' && (
                          <IconButton
                            onClick={() => setGeneratorOpen(true)}
                            edge="end"
                            title="Generate password"
                          >
                            <Casino />
                          </IconButton>
                        )}
                        <IconButton onClick={() => setShowValue(!showValue)} edge="end">
                          {showValue ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {formik.values.type === 'password' && formik.values.value && (
                  <Box sx={{ mt: 1 }}>
                    <PasswordStrengthMeter password={formik.values.value} />
                  </Box>
                )}
              </Box>

              <TextField
                fullWidth
                id="url"
                name="url"
                label="URL (optional)"
                type="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.url && Boolean(formik.errors.url)}
                helperText={formik.touched.url && formik.errors.url}
              />

              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes (optional)"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
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

      <PasswordGenerator
        open={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        onGenerate={handleGeneratePassword}
      />
    </>
  );
};

AuthKeyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  authKey: PropTypes.object,
  onSaved: PropTypes.func.isRequired,
};

export default AuthKeyDialog;
