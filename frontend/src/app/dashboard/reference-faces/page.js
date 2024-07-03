"use client";

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { backend_url } from '@/config';

const initialReferences = [];

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');  // the label
  const [references, setReferences] = useState(initialReferences);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setFileName('');
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAdd = () => {
    // add to frontend
    const newReference = {
      id: references.length + 1,
      name: fileName,
      src: URL.createObjectURL(selectedFile),
    };
    setReferences([...references, newReference]);
    uploadReference();  // send to backend
    handleClose();
  };

  const handleDelete = (reference) => {
    setReferenceToDelete(reference);
    setDeleteDialogOpen(true);
  };

  const handleImageClick = (src) => {
    setOverlayImage(src);
    setOverlayOpen(true);
  };

  const handleOverlayClick = () => {
    setOverlayOpen(false);
    setOverlayImage(null);
  };

  const getReferenceImages = async () => {
    const response = await fetch(backend_url+'/get_reference_images', {
      method: 'GET',
    });
    const data = await response.json();
    const updatedData = data.map((reference, index) => {
      return {
        id: index + 1,
        name: reference.label,
        src: reference.s3_url,
      };
    });
    setReferences(updatedData);
  };

  const uploadReference = async () => {
    // Upload the file to the backend
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('label', fileName);
    const response = await fetch(backend_url+'/upload_reference', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  const confirmDelete = async () => {
    setLoading(true);
    const response = await fetch(backend_url+'/delete_reference_image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ s3_url: referenceToDelete.src }),
    });
    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      setReferences(references.filter((reference) => reference.id !== referenceToDelete.id));
    } else {
      console.error('Failed to delete reference:', data.message);
    }
    setDeleteDialogOpen(false);
    setReferenceToDelete(null);
  };

  React.useEffect(() => {
    getReferenceImages();  // Fetch reference images when the page loads
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Reference Faces</Typography>
        </Stack>
        <div>
          <Button 
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
            variant="contained" 
            onClick={handleClickOpen}
          >
            Add New Reference Face
          </Button>
        </div>
      </Stack>

      {references.length === 0 ? (
        <Typography variant="h6" align="center" style={{marginTop: '300px'}}>No Reference Faces Currently Added</Typography>
      ) : (
        <Grid container spacing={3}>
          {references.map((reference) => (
            <Grid item xs={12} sm={6} md={4} key={reference.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={reference.src}
                  alt={reference.name}
                  onClick={() => handleImageClick(reference.src)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div">
                    {reference.name}
                  </Typography>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(reference)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Reference Face</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload an image containing only the person's face, and give it a name.
          </DialogContentText>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" startIcon={<UploadIcon />} style={{ marginTop: '10px' }}>
                Upload
              </Button>
            </label>
          </Box>
          {selectedFile && (
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected file"
                style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
              />
            </div>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reference face? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="warning"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {overlayOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleOverlayClick}
        >
          <img 
            src={overlayImage} 
            alt="Overlay"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </Stack>
  );
}
