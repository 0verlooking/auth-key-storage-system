import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add as AddIcon, Edit, Delete } from '@mui/icons-material';
import TagDialog from '@components/tags/TagDialog';
import { tagService } from '@services/tagService';
import { useNotification } from '@hooks/useNotification';

/**
 * TagsPage - Tag management page
 */
const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (err) {
      showError(err.message || 'Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTag(null);
    setDialogOpen(true);
  };

  const handleEdit = (tag) => {
    setSelectedTag(tag);
    setDialogOpen(true);
  };

  const handleDelete = (tag) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      await tagService.deleteTag(tagToDelete.id);
      success('Tag deleted successfully');
      setDeleteDialogOpen(false);
      setTagToDelete(null);
      await fetchTags();
    } catch (err) {
      showError(err.message || 'Failed to delete tag');
    }
  };

  const handleSave = async (values) => {
    try {
      if (selectedTag) {
        await tagService.updateTag(selectedTag.id, values);
        success('Tag updated successfully');
      } else {
        await tagService.createTag(values);
        success('Tag created successfully');
      }

      setDialogOpen(false);
      setSelectedTag(null);
      await fetchTags();
    } catch (err) {
      showError(err.message || 'Failed to save tag');
      throw err;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Tags
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          New Tag
        </Button>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : tags.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No tags yet. Create your first tag to get started.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {tags.map((tag) => (
                <Grid item key={tag.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Chip
                      label={tag.name}
                      sx={{
                        backgroundColor: tag.color,
                        color: '#fff',
                        fontWeight: 500,
                      }}
                    />
                    <IconButton size="small" onClick={() => handleEdit(tag)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(tag)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <TagDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
        onSave={handleSave}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tag "{tagToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TagsPage;
