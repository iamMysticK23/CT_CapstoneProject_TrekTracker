import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// internal imports
import {
        AdminPage,
        Auth, 
        GoogleMap, 
        Home,
        TrailDetails, 
        TrailList, 
        UserProfile } from './components';
import { theme } from './Theme/themes';
import './index.css'

// Root directory
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme = {theme} >
      <Router>
          <Routes>
            <Route path='/' element={ <Home title={'TrekTracker'} />} />
            <Route path='/auth' element= {<Auth/>} />
            <Route path='/admin' element= {<AdminPage/>} />
            <Route path='/googlemap' element= {<GoogleMap/>} />
            <Route path='/traildetails' element= {<TrailDetails/>} />
            <Route path='/traillist' element= {<TrailList/>} />
            <Route path='/profile' element= {<UserProfile/>} />
          </Routes>
        </Router>
    </ThemeProvider>
  </React.StrictMode>,
)
