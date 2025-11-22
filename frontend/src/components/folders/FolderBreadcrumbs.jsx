import PropTypes from 'prop-types';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';

/**
 * FolderBreadcrumbs - Breadcrumb navigation for folders
 */
const FolderBreadcrumbs = ({ path = [] }) => {
  return (
    <Breadcrumbs>
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="/"
      >
        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {path.map((item, index) => (
        <Typography key={index} color="text.primary">
          {item.name}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

FolderBreadcrumbs.propTypes = {
  path: PropTypes.array,
};

export default FolderBreadcrumbs;
