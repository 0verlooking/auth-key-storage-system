import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FolderTree from '@components/folders/FolderTree';
import FolderDialog from '@components/folders/FolderDialog';
import { folderService } from '@services/folderService';
import { useNotification } from '@hooks/useNotification';

/**
 * FoldersPage - Folder management page
 */
const FoldersPage = () => {
  const [folders, setFolders] = useState([]);
  const [folderTree, setFolderTree] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const data = await folderService.getFolders();
      setFolders(data);
      const tree = folderService.buildTree(data);
      setFolderTree(tree);
    } catch (err) {
      showError(err.message || 'Failed to load folders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedFolder(null);
    setDialogOpen(true);
  };

  const handleEdit = (folder) => {
    setSelectedFolder(folder);
    setDialogOpen(true);
  };

  const handleDelete = (folder) => {
    setFolderToDelete(folder);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!folderToDelete) return;

    try {
      await folderService.deleteFolder(folderToDelete.id);
      success('Folder deleted successfully');
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
      await fetchFolders();
    } catch (err) {
      showError(err.message || 'Failed to delete folder');
    }
  };

  const handleSave = async (values) => {
    try {
      // Map form fields to backend DTO structure
      const requestData = {
        name: values.name,
        parentId: values.parent_id || null,
        description: values.description || null,
      };

      if (selectedFolder) {
        await folderService.updateFolder(selectedFolder.id, requestData);
        success('Folder updated successfully');
      } else {
        await folderService.createFolder(requestData);
        success('Folder created successfully');
      }

      setDialogOpen(false);
      setSelectedFolder(null);
      await fetchFolders();
    } catch (err) {
      showError(err.message || 'Failed to save folder');
      throw err;
    }
  };

  const handleSelect = (folder) => {
    console.log('Selected folder:', folder);
    // Future: Navigate to folder view or filter auth keys by folder
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Folders
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          New Folder
        </Button>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FolderTree
              folders={folderTree}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          )}
        </CardContent>
      </Card>

      <FolderDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedFolder(null);
        }}
        folder={selectedFolder}
        folders={folders}
        onSave={handleSave}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the folder "{folderToDelete?.name}"?
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

export default FoldersPage;
