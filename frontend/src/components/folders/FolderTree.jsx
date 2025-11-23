import PropTypes from 'prop-types';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Collapse,
  Typography,
} from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useState } from 'react';

/**
 * FolderTreeNode - Recursive folder tree node component
 */
const FolderTreeNode = ({ folder, onEdit, onDelete, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = folder.id === selectedId;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(folder);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(folder);
  };

  const handleSelect = () => {
    onSelect(folder);
  };

  return (
    <Box>
      <ListItem
        disablePadding
        sx={{
          backgroundColor: isSelected ? 'action.selected' : 'transparent',
        }}
        secondaryAction={
          <Box>
            <IconButton edge="end" size="small" onClick={handleEdit}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton edge="end" size="small" onClick={handleDelete}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <ListItemButton onClick={handleSelect}>
          {hasChildren && (
            <IconButton size="small" onClick={handleToggle} sx={{ mr: 1 }}>
              {isOpen ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          )}
          {!hasChildren && <Box sx={{ width: 40 }} />}
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            {isOpen ? <FolderOpenIcon /> : <FolderIcon />}
          </Box>
          <ListItemText
            primary={folder.name}
            secondary={folder.description}
            secondaryTypographyProps={{
              noWrap: true,
              sx: { maxWidth: 300 },
            }}
          />
        </ListItemButton>
      </ListItem>

      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {folder.children.map((child) => (
              <FolderTreeNode
                key={child.id}
                folder={child}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

FolderTreeNode.propTypes = {
  folder: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
};

/**
 * FolderTree - Hierarchical folder tree component
 */
const FolderTree = ({ folders = [], onEdit, onDelete, onSelect, selectedId }) => {
  if (folders.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No folders yet. Create your first folder to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {folders.map((folder) => (
        <FolderTreeNode
          key={folder.id}
          folder={folder}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </List>
  );
};

FolderTree.propTypes = {
  folders: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
};

export default FolderTree;
