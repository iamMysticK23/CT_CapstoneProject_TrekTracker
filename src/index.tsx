import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/auth';

// internal imports
import {
        AuthComponent, 
        MyGoogleMap, 
        Home, 
        TrailList, 
        ImageGallery } from './components';
import { theme } from './Theme/themes';
import { firebaseConfig } from './firebaseConfig';
import './index.css';

// Root directory
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <ThemeProvider theme = {theme} >
      <Router>
          <Routes>
            <Route path='/' element={ <Home title={'TrekTracker'} />} />
            <Route path='/auth' element= {<AuthComponent title={'TrekTracker'} />} />
            <Route path='/googlemap' element= {<MyGoogleMap/>} />
            <Route path='/traillist' element= {<TrailList/>} />
            <Route path='/gallery' element= {<ImageGallery/>} />
          </Routes>
        </Router>
    </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)
