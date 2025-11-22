import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Slider,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { cryptoService } from '@services/cryptoService';
import { PASSWORD_GENERATOR_DEFAULTS } from '@config/constants';
import CopyButton from './CopyButton';
import PasswordStrengthMeter from './PasswordStrengthMeter';

/**
 * PasswordGenerator - Dialog for generating secure passwords
 */
const PasswordGenerator = ({ open, onClose, onGenerate }) => {
  const [options, setOptions] = useState({
    length: PASSWORD_GENERATOR_DEFAULTS.LENGTH,
    useUppercase: PASSWORD_GENERATOR_DEFAULTS.USE_UPPERCASE,
    useLowercase: PASSWORD_GENERATOR_DEFAULTS.USE_LOWERCASE,
    useNumbers: PASSWORD_GENERATOR_DEFAULTS.USE_NUMBERS,
    useSymbols: PASSWORD_GENERATOR_DEFAULTS.USE_SYMBOLS,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleGenerate = () => {
    const password = cryptoService.generatePassword(options);
    setGeneratedPassword(password);
  };

  const handleUse = () => {
    onGenerate(generatedPassword);
    onClose();
  };

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

  // Generate password on mount and when options change
  useEffect(() => {
    if (open) {
      handleGenerate();
    }
  }, [open, options]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Password Generator</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Generated Password */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generated Password
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                value={generatedPassword}
                InputProps={{
                  readOnly: true,
                  endAdornment: <CopyButton value={generatedPassword} />,
                }}
              />
              <IconButton onClick={handleGenerate} color="primary">
                <Refresh />
              </IconButton>
            </Box>
            {generatedPassword && (
              <Box sx={{ mt: 1 }}>
                <PasswordStrengthMeter password={generatedPassword} />
              </Box>
            )}
          </Box>

          {/* Length Slider */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Length: {options.length}
            </Typography>
            <Slider
              value={options.length}
              onChange={(e, value) => handleOptionChange('length', value)}
              min={PASSWORD_GENERATOR_DEFAULTS.MIN_LENGTH}
              max={PASSWORD_GENERATOR_DEFAULTS.MAX_LENGTH}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Character Options */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Character Types
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.useUppercase}
                  onChange={(e) => handleOptionChange('useUppercase', e.target.checked)}
                />
              }
              label="Uppercase (A-Z)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.useLowercase}
                  onChange={(e) => handleOptionChange('useLowercase', e.target.checked)}
                />
              }
              label="Lowercase (a-z)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.useNumbers}
                  onChange={(e) => handleOptionChange('useNumbers', e.target.checked)}
                />
              }
              label="Numbers (0-9)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.useSymbols}
                  onChange={(e) => handleOptionChange('useSymbols', e.target.checked)}
                />
              }
              label="Symbols (!@#$...)"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUse} variant="contained" disabled={!generatedPassword}>
          Use Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PasswordGenerator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
};

export default PasswordGenerator;
