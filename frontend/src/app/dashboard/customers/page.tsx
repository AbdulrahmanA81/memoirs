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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

const initialReferences = [];

export default function Page(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [references, setReferences] = useState(initialReferences);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);

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
    const newReference = {
      id: references.length + 1,
      name: fileName,
      src: URL.createObjectURL(selectedFile),
    };
    setReferences([...references, newReference]);
    handleClose();
  };

  const handleDelete = (id) => {
    setReferences(references.filter((reference) => reference.id !== id));
  };

  const handleImageClick = (src) => {
    setOverlayImage(src);
    setOverlayOpen(true);
  };

  const handleOverlayClick = () => {
    setOverlayOpen(false);
    setOverlayImage(null);
  };

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
                    onClick={() => handleDelete(reference.id)}
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
