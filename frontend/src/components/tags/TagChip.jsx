import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { getContrastColor } from '@utils/helpers';

/**
 * TagChip - Colored tag chip component
 */
const TagChip = ({ tag, onClick, onDelete, size = 'small' }) => {
  return (
    <Chip
      label={tag.name}
      size={size}
      onClick={onClick}
      onDelete={onDelete}
      sx={{
        backgroundColor: tag.color,
        color: getContrastColor(tag.color),
        '&:hover': {
          opacity: 0.8,
        },
      }}
    />
  );
};

TagChip.propTypes = {
  tag: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  size: PropTypes.string,
};

export default TagChip;
