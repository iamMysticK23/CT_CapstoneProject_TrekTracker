import React, { useEffect, useState } from 'react';
import { NavBar } from '../sharedComponents';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {Button, Snackbar, Alert } from '@mui/material';
// import firebase from "firebase/compat/app"; // Use compat version for v9+
import { getAuth } from 'firebase/auth';

// import "firebase/compat/auth";

type Trail = {
    id: string;
    userID: string;
    notes?: string;
    name: string;
    city: string;
    region: string;
    rating: string;
    country: string;
    length: number;
    description: string;
    directions: string;
    lat: string;
    lon: string;
    thumbnail: string;
    url: string;
};

export const TrailList = () => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
    const [openNoteSavedSnackbar, setOpenNoteSavedSnackbar] = useState(false);



    useEffect(() => {
        const fetchSavedTrails = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser; // Get the currently logged-in user using modular SDK
        
            if(!currentUser) return; // Exit if no user is logged in
        
            try {
                const trailsSnapshot = await getDocs(query(collection(db, "trails"), where("userID", "==", currentUser.uid)));
                const trailsData = trailsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Trail));
                setTrails(trailsData);
            } catch (error) {
                console.error("Error fetching saved trails: ", error);
            }
        };
        
    
        fetchSavedTrails();
    }, []);

    const deleteTrail = async (trailId: string) => {
        try {
            const trailRef = doc(db, 'trails', trailId);
            await deleteDoc(trailRef);
            setTrails(prevTrails => prevTrails.filter(trail => trail.id !== trailId));
            console.log("Trail deleted successfully");

            setOpenDeleteSnackbar(true);

        } catch (error) {
            console.error("Error deleting trail: ", error);
        }
    }

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>, trailId: string) => {
        const updatedNote = e.target.value;
        setTrails(prevTrails => prevTrails.map(trail => trail.id === trailId ? {...trail, notes: updatedNote} : trail));
    }
    
    const saveNotes = async (trailId: string, notes: string) => {
        try {
            const trailRef = doc(db, 'trails', trailId);
            await updateDoc(trailRef, { notes });
            console.log("Notes saved successfully");
            setOpenNoteSavedSnackbar(true);  // Set the snackbar state to true here
        } catch (error) {
            console.error("Error saving notes: ", error);
        }
    }
    
    

    return (
        <div>
            <NavBar />
            <h1 className="headertext">Trail List</h1>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            {trails.map(trail => (
                <div key={trail.id} 
                style={{
                    border: '1px solid #ccc', 
                    padding: '10px', 
                    borderRadius: '5px',
                    backgroundColor: '#32453C',
                    color: 'white'
                    }}
                    
                    >
                        <img src={trail.thumbnail || 'https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400_6.png'} 
                        alt="trail image" 
                         style={{  
                            display: 'block', 
                            margin: '0 auto', 
                            width: '500px',
                            height: '300px', 
                            objectFit: 'cover' 
                            }} 
                            />
                        <h2>{trail.name}</h2>
                        <br />
                        <p><strong>City:</strong> {trail.city}</p>
                        <p><strong>Region:</strong> {trail.region}</p>
                        <p><strong>Length:</strong> {trail.length} miles</p>
                        <p><strong>Rating:</strong> {trail.rating} </p>
                        <br />
                        <p><strong>Description:</strong> {trail.description} </p>
                        <br />
                        <p><strong>Directions:</strong> {trail.directions} </p>
                        <p><strong>URL:</strong> <a href={trail.url} style={{ color: 'orange', wordWrap: 'break-word'}}>{trail.url}</a></p>
                        <Button onClick={() => deleteTrail(trail.id)} style={{marginTop: '10px', backgroundColor: 'darkred', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer'}}>Delete</Button>
                        <textarea 
                        value={trail.notes || ''}
                        placeholder="Add your notes here..."
                        onChange={(e) => handleNoteChange(e, trail.id)}
                        style={{ width: '100%', height: '100px', marginTop: '10px' }}
                    />
                    <button onClick={() => { if (trail.notes) saveNotes(trail.id, trail.notes); }} style={{marginTop: '10px', backgroundColor: 'darkorange', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer'}}>Save Notes</button>

                    </div>
                ))}


            </div>
            <Snackbar 
    open={openDeleteSnackbar} 
    autoHideDuration={3000} 
    onClose={() => setOpenDeleteSnackbar(false)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
    <Alert onClose={() => setOpenDeleteSnackbar(false)} severity="success" variant="filled">
        Trail has been deleted!
    </Alert>
</Snackbar>
<Snackbar 
    open={openNoteSavedSnackbar} 
    autoHideDuration={3000} 
    onClose={() => setOpenNoteSavedSnackbar(false)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
    <Alert onClose={() => setOpenNoteSavedSnackbar(false)} severity="success" variant="filled">
        Note has been saved!
    </Alert>
</Snackbar>

        </div>
    );
}
