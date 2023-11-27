// external imports
import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { 
  Button, 
  Snackbar, 
  Alert,
  Dialog, 
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  LinearProgress } from '@mui/material';

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setDeleteConfirmationOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  



  // upload images section

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
        const userDisplayName = user.displayName || user.email || 'User';

        // Set the user's name in the state
        setUserName(userDisplayName);
        

        // Fetch image URLs
        const fetchImageURLs = async () => {
          try {
            const storageRef = ref(storage, `user-images/${user.uid}`);
            const imageList = await listAll(storageRef);
            const imageURLs = await Promise.all(imageList.items.map(async (item) => getDownloadURL(item)));
            setImages(imageURLs);
          } catch (error) {
            console.error('Error fetching image URLs:', error);
          }
        };

        fetchImageURLs();
      } else {
        setUserUid('');
        setUserName('')
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Set uploading to true when the upload starts
  const handleUploadStart = () => {
    setUploading(true);
  };

  // Set uploading to false when the upload ends
  const handleUploadEnd = () => {
    setUploading(false);
  };

  
  // upload images
  const handleImageUpload = async (file: File) => {
    try {
      const timestamp = new Date().getTime();
      const storagePath = `user-images/${userUid}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      handleUploadStart()

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
          handleUploadMessage('Upload failed', 'error');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImages((prevImages) => [...prevImages, downloadURL]);
          handleUploadEnd()
          handleUploadMessage('Upload complete', 'success');
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      handleUploadEnd()
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
      // Decode the URL
      const decodedURL = decodeURIComponent(imageURLToDelete);
      // Extract the file path from the decoded URL
      const filePath = decodedURL.split('/o/')[1].split('?')[0];
      // Replace %2F with /
      const storagePath = filePath.replace(/%2F/g, '/');
      console.log('Storage Path:', storagePath); // Log the storage path
      const storageRef = ref(storage, storagePath);
  
      // Check if the file exists before deleting
      getDownloadURL(storageRef)
        .then(() => {
          // If the file exists, delete it
          deleteObject(storageRef);
          console.log('Image deleted successfully');
          // Update the state to remove the deleted image from the gallery
          setImages((prevImages) => prevImages.filter((url) => url !== imageURLToDelete));
        })
        .catch((error) => {
          // If the file doesn't exist, log an error message
          console.error('File does not exist:', error);
        });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const handleDeleteConfirmationOpen = (imageURLToDelete: string) => {
    setImageToDelete(imageURLToDelete);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
    setImageToDelete(null);
  };

  const handleDeleteConfirmed = () => {
    if (imageToDelete) {
      deleteImage(imageToDelete);
      handleDeleteConfirmationClose();
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
        {`${userName}'s Image Gallery`}
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Keep track of your adventures with photos!
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
          <div key={index} style={{ margin: '35px 20px', maxWidth: '300px', width: '100%', maxHeight: '300px', backgroundColor: '#32453C', position: 'relative' }}>
            <img
              src={url}
              alt={`Image ${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '8px', textAlign: 'center' }}>
              <Button
                onClick={() => handleDeleteConfirmationOpen(url)}
                style={{ backgroundColor: 'orange', color: 'white' }}
              >
                Delete
            </Button>
        </div>
      </div>
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

      <div>
      <Dialog open={uploading}>
        <DialogTitle>
        {uploadProgress !== undefined
          ? `Uploading Image... ${Math.round(uploadProgress)}%`
          : 'Uploading Image...'}
      </DialogTitle>
      <LinearProgress variant="determinate" value={uploadProgress} />
    </Dialog>
      </div>

      <Dialog
        open={imageToDelete !== null}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this photo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};
