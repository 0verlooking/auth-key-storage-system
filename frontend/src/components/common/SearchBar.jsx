import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useDebounce } from '@hooks/useDebounce';

/**
 * SearchBar - Debounced search input field
 */
const SearchBar = ({ onSearch, placeholder = 'Search...', delay = 300, fullWidth = true }) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, delay);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <TextField
      fullWidth={fullWidth}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <Clear fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  delay: PropTypes.number,
  fullWidth: PropTypes.bool,
};

export default SearchBar;
