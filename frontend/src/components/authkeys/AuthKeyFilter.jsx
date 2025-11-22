import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AUTH_KEY_TYPES } from '@config/constants';
import { formatKeyType } from '@utils/formatters';

/**
 * AuthKeyFilter - Filter controls for auth keys
 */
const AuthKeyFilter = ({ value = '', onChange = () => {} }) => {
  return (
    <Box>
      <FormControl fullWidth size="small">
        <InputLabel>Type</InputLabel>
        <Select
          value={value}
          label="Type"
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value="">All Types</MenuItem>
          {Object.values(AUTH_KEY_TYPES).map((type) => (
            <MenuItem key={type} value={type}>
              {formatKeyType(type)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

AuthKeyFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default AuthKeyFilter;
