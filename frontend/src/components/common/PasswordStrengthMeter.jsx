import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography } from '@mui/material';
import { cryptoService } from '@services/cryptoService';

/**
 * PasswordStrengthMeter - Visual indicator of password strength
 */
const PasswordStrengthMeter = ({ password }) => {
  const strength = cryptoService.calculatePasswordStrength(password);

  const getStrengthConfig = () => {
    switch (strength) {
      case 'weak':
        return { color: 'error', label: 'Weak', value: 25 };
      case 'medium':
        return { color: 'warning', label: 'Medium', value: 50 };
      case 'strong':
        return { color: 'info', label: 'Strong', value: 75 };
      case 'very_strong':
        return { color: 'success', label: 'Very Strong', value: 100 };
      default:
        return { color: 'error', label: 'Weak', value: 0 };
    }
  };

  const config = getStrengthConfig();

  if (!password) return null;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Password Strength
        </Typography>
        <Typography variant="caption" color={`${config.color}.main`} fontWeight={500}>
          {config.label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={config.value}
        color={config.color}
        sx={{ height: 6, borderRadius: 1 }}
      />
    </Box>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string,
};

export default PasswordStrengthMeter;
