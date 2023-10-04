import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/auth';

// internal imports
import {
        AdminPage,
        AuthComponent, 
        MyGoogleMap, 
        Home,
        TrailDetails, 
        TrailList, 
        UserProfile } from './components';
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
            <Route path='/admin' element= {<AdminPage/>} />
            <Route path='/googlemap' element= {<MyGoogleMap/>} />
            <Route path='/traildetails' element= {<TrailDetails/>} />
            <Route path='/traillist' element= {<TrailList/>} />
            <Route path='/profile' element= {<UserProfile/>} />
          </Routes>
        </Router>
    </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)
