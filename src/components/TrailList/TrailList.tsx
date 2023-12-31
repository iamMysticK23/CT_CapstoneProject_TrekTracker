// external imports

import React, { useEffect, useState } from 'react';
import { NavBar } from '../sharedComponents';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {Button, Snackbar, Alert } from '@mui/material';
import { getAuth } from 'firebase/auth';


// internal imports
import trailList_image from '../../assets/Images/trail_list.jpeg';

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

// Display the saved trails 
export const TrailList = () => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
    const [openNoteSavedSnackbar, setOpenNoteSavedSnackbar] = useState(false);


  // Display the saved trails of the current user

  // i used the name "useEffect" throughout this project because I was using tutorials and this
  // was the easiest way for me to remember it.


    useEffect(() => {
        const fetchSavedTrails = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser; 
        
            if(!currentUser) return; 
        
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

    // User can delete a trail
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

    // user can edit a note/journal entry
    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>, trailId: string) => {
        const updatedNote = e.target.value;
        setTrails(prevTrails => prevTrails.map(trail => trail.id === trailId ? {...trail, notes: updatedNote} : trail));
    }
    
    // user can save their note to the database via their userID/trailID
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

    // Styling for the delete button and save button 
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);

    const handleMouseEnterDelete = () => {
        setIsDeleteHovered(true);
    }

    const handleMouseLeaveDelete = () => {
        setIsDeleteHovered(false);
    }

    const [isSaveHovered, setIsSaveHovered] = useState(false);

    const handleMouseEnterSave = () => {
        setIsSaveHovered(true);
    }

    const handleMouseLeaveSave = () => {
        setIsSaveHovered(false);
    }


    return (
        <div style={{
            backgroundImage: `linear-gradient(rgba(0,0,0, 0.2), rgba(0,0,0, 0.5)), url(${trailList_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment:'fixed',
            minHeight: '100vh',  
            width: '100%',
            overflow: 'auto'    
        }}>
          <NavBar />
          <h1 className="headertext" style={{color:'#a87731' , fontWeight: 'bold'}}>My Saved Trail List</h1>
          <p style = {{
              textAlign: 'center', 
              color: 'white', 
              fontWeight: 'bold'
              }}>The information cards are scrollable.</p>
          <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '20px', 
              justifyContent: 'center', 
              height: '100vh', 
              width: '100vw', 
              padding: '20px',
              marginLeft: '70px'}}
              >

            {trails.map(trail => (
              <div key={trail.id} style={{ width: 'calc(80% - 10px)', display: 'flex', flexDirection: 'row', margin: '20px' }}>
                
                {/* Trail Cards */}
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#32453C',
                    color: 'white',
                    cursor: 'pointer',
                    flex: '70%',
                    marginRight: '10px',
                    marginBottom: '40px',
                    height: '500px',
                    overflow: 'auto'
                  }}
                >
                  <img
                    src={trail.thumbnail || 'https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400_6.png'}
                    alt="trail image"
                    style={{
                      width: '90%',
                      height: '80%',
                      objectFit: 'cover',
                      marginLeft: '50px',
                      marginTop: '15px'
                     
                    }}
                  />
                  <h2>{trail.name}</h2>
                  <p><strong>City:</strong> {trail.city}</p>
                  <p><strong>Region:</strong> {trail.region}</p>
                  <p><strong>Length:</strong> {trail.length} miles</p>
                  <p><strong>Rating:</strong> {trail.rating} </p>
                  <br />
                  <p><strong>Description:</strong> {trail.description} </p>
                  <br />
                  <p><strong>Directions:</strong> {trail.directions} </p>
                  <br />
                  <p><strong>URL:</strong> <a href={trail.url} target="_blank" rel="noopener noreferrer" style={{ color: 'orange', wordWrap: 'break-word' }}>{trail.url}</a></p>


                  <Button onClick={() => deleteTrail(trail.id)} 
                          onMouseEnter={handleMouseEnterDelete}
                          onMouseLeave={handleMouseLeaveDelete}
                  style={{ 
                    marginTop: '20px',
                     marginBottom:'20px', 
                     backgroundColor:  isDeleteHovered ? '#8a2b1a' : '#a33724', 
                     color: 'white', 
                     border: 'none', 
                     padding: '10px',
                     borderRadius: '5px',
                     cursor: 'pointer' }}>Delete Trail</Button>
                </div>
                
                {/* Notes Section */}
                <div style={{ 
                  flex: '20%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  marginLeft: '20px'}}
                  >
                    <h2 style={{
                      textAlign: 'center',
                      color:'darkorange', 
                      fontWeight: 'bold' 
                      }}
                      >
                        My Journal
                      </h2>

                  <textarea
                    value={trail.notes || ''}
                    placeholder="Add your notes here..."
                    onChange={(e) => handleNoteChange(e, trail.id)}
                    style={{ 
                      backgroundColor: '#dbc9a2', 
                      width: '400px', 
                      height: '400px',
                      marginBottom: '10px', 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize:'16px', 
                      resize:'none',
                       border: '1px solid #ccc',
                       borderRadius: '4px',
                       padding: '10px'
                      }}
                  />

                  <button onClick={() => { if (trail.notes) saveNotes(trail.id, trail.notes); }} 
                        onMouseEnter={handleMouseEnterSave}
                        onMouseLeave={handleMouseLeaveSave}
                  style={{ 
                    backgroundColor: isSaveHovered ? '#d1994b' : 'darkorange', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    cursor: 'pointer' }}>Save Notes</button>
                </div>
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