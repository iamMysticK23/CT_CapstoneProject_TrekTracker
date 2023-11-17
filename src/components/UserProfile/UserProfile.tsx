// external imports
import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { Button, Snackbar, Alert, Card, CardContent, CardActions } from '@mui/material';

// internal imports
import { NavBar } from '../sharedComponents';
import userProfile_image from '../../assets/Images/green_biking.jpg';
import { auth, storage } from '../../firebaseConfig';

// display an image gallery via user uploading the images to Google Storage
export const ImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [userUid, setUserUid] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);

        // Fetch image URLs
        const fetchImageURLs = async () => {
          try {
            console.log('Fetching image URLs for user:', user.uid);
            const storageRef = ref(storage, `user-images/${user.uid}`);
            const imageList = await listAll(storageRef);
            console.log('Image list:', imageList); // Log image list for debugging
            const imageURLs = await Promise.all(imageList.items.map(async (item) => getDownloadURL(item)));
            console.log('Image URLs:', imageURLs); // Log image URLs for debugging
            setImages(imageURLs);
          } catch (error) {
            console.error('Error fetching image URLs:', error);
          }
        };

        fetchImageURLs();
      } else {
        setUserUid('');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // upload images
  const handleImageUpload = async (file: File) => {
    try {
      const timestamp = new Date().getTime();
      const storagePath = `user-images/${userUid}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
          handleUploadMessage('Upload failed', 'error');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImages((prevImages) => [...prevImages, downloadURL]);
          handleUploadMessage('Upload complete', 'success');
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      handleUploadMessage('Upload failed', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  // delete images
  const deleteImage = async (imageURLToDelete: string) => {
    try {
      const fileName = imageURLToDelete.split('/').pop() || ''; // Extract file name from URL
      const storageRef = ref(storage, `user-images/${userUid}/${fileName}`);
      await deleteObject(storageRef);
      setImages((prevImages) => prevImages.filter((url) => url !== imageURLToDelete));
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // success or error messages
  const handleUploadMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: '20px',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(0,0,0, 0.3), rgba(0,0,0, 0.2)), url(${userProfile_image})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        overflow: 'auto',
      }}
    >
      <NavBar />
      <h1 className="headertext" style={{ color: '#edce32', fontWeight: 'bold' }}>
        Image Gallery
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Add your image to the gallery for the community to see!
      </p>

      <label
        htmlFor="upload-button"
        style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}
      >
        <input
          type="file"
          accept="image/*"
          id="upload-button"
          style={{
            display: 'none',
          }}
          onChange={handleFileChange}
        />
        <Button variant="contained" color="primary" component="span">
          Upload Image
        </Button>
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((url, index) => (
          <Card
            key={index}
            style={{ margin: '8px', maxWidth: '300px', marginLeft: '120px', backgroundColor: '#32453C' }}
          >
            <img
              src={url}
              alt={`Image ${index}`}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
            <CardContent>
              <p style={{ color: 'darkorange', fontWeight: 'bold' }}>
                Images uploaded by TrekTracker users.
              </p>
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => deleteImage(url)}
                style={{ backgroundColor: 'orange', color: 'white' }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity as 'success' | 'error' | 'info' | 'warning'}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
