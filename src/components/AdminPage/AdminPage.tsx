import React from 'react';


// internal imports
import { NavBar } from '../sharedComponents';

export const AdminPage = () => {
    return (
        <div>
            <NavBar />
            <h1 className="headertext">Admin page - see all registered users and details about them</h1>
        </div>
    )
}