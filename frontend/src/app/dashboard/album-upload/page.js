"use client";

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { textAlign } from '@mui/system';
import { backend_url } from '@/config';

const initialAlbums = [];

export default function AlbumUploadPage() {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [albums, setAlbums] = useState(initialAlbums);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
  };

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleAdd = () => {
    setLoading(true);
    const newAlbums = selectedFiles.map((file, index) => ({
      id: albums.length + index + 1,
      src: URL.createObjectURL(file),
    }));
    setAlbums([...albums, ...newAlbums]);
    uploadImages();  // send to backend
    handleClose();
  };

  const handleDelete = (album) => {
    setImageToDelete(album);
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

  const getAlbumImages = async () => {
    const response = await fetch(backend_url + '/get_album_images');
    const data = await response.json();
    const albums = data.map((album, index) => ({
      id: index + 1,
      label: album.label,
      src: album.s3_url,
    }));
    setAlbums(albums);
  }

  const uploadImages = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    const response = await fetch(backend_url + '/upload_user_image', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setLoading(false);
    return data;
  }

  const confirmDelete = async () => {
    setLoading(true);
    const response = await fetch(backend_url + '/delete_album_image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ s3_url: imageToDelete.src }),
    });
    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      setAlbums(albums.filter((album) => album.id !== imageToDelete.id));
    } else {
      console.error('Failed to delete image:', data.message);
    }
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  React.useEffect(() => {
    getAlbumImages();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Album Upload</Typography>
        </Stack>
        <div>
          <Button 
            variant="outlined" 
            disabled 
            style={{ marginLeft: '10px', backgroundColor: 'white' }} 
            startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Photos_icon_%282020%29.svg/2048px-Google_Photos_icon_%282020%29.svg.png" alt="Google Photos" style={{ width: '20px', height: '20px' }} />}
          >
            Link Google Photos (coming soon)
          </Button>
          <Button 
            variant="outlined" 
            disabled 
            style={{ marginLeft: '10px', backgroundColor: 'white' }} 
            startIcon={<img src="https://cdn0.iconfinder.com/data/icons/apple-apps/100/Apple_Photos-512.png" alt="Apple Photos" style={{ width: '20px', height: '20px' }} />}
          >
            Link Apple Photos (coming soon)
          </Button>
          <Button 
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
            variant="contained" 
            onClick={handleClickOpen}
            style={{ marginLeft: '10px' }}
          >
            Add Photos
          </Button>
        </div>
      </Stack>

      {albums.length === 0 ? (
        <Typography variant="h6" align="center" style={{marginTop: '300px'}}>No Photos Currently Added</Typography>
      ) : (
        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={12} sm={6} md={4} key={album.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={album.src}
                  alt={`Album ${album.id}`}
                  onClick={() => handleImageClick(album.src)}
                  style={{ cursor: 'pointer' }}
                />
                <CardActions style={{ justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(album)}
                  >
                    Delete Photo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Photos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload multiple photos to your album.
          </DialogContentText>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" startIcon={<UploadIcon />} style={{ marginTop: '10px' }}>
                Upload
              </Button>
            </label>
          </Box>
          <Grid container spacing={1}>
            {selectedFiles.map((file, index) => (
              <Grid item xs={4} key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected file ${index + 1}`}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Photos'}
          </Button>
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
            Are you sure you want to delete this photo? This action cannot be undone.
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
