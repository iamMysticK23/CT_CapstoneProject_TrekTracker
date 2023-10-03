import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// internal imports
import { Home } from './components';
import './index.css'

// Root directory
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={ <Home title={'TrekTracker'} />} />
      </Routes>
    </Router>
   
  </React.StrictMode>,
)
