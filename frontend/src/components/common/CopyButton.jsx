import { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { copyToClipboard } from '@utils/helpers';

/**
 * CopyButton - Button to copy text to clipboard
 */
const CopyButton = ({ value, size = 'small', tooltip = 'Copy to clipboard' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Tooltip title={copied ? 'Copied!' : tooltip}>
      <IconButton size={size} onClick={handleCopy} color={copied ? 'success' : 'default'}>
        {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.string,
  tooltip: PropTypes.string,
};

export default CopyButton;
