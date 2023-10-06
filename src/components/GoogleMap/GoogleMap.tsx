// external imports
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { Button , Snackbar, Alert } from '@mui/material'
import { getAuth } from 'firebase/auth';


// internal imports
import { NavBar } from '../sharedComponents';



// need this to load the Google Map
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const libraries = ["places"];


// weather data
type WeatherData = {
    main: {
        temp: number;
    };
    weather: {
        description: string;
    }[];
};


// trail data
type Trail = {
    id: number;
    name: string;
    address: string;
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


// Fetch trail data from TrailAPI based on the given coordinates 
const fetchTrailData = async (lat: number, lng: number, setTrails: React.Dispatch<React.SetStateAction<Trail[]>>) => {

    const apiKey = '9355ca4dffmshc8cdab31b941a31p14159djsna664b84460b4'; 
    const apiUrl = `https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
                "X-RapidAPI-Key": apiKey
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Trail Data", data)
            if (data.data) {
                setTrails(data.data);
            }
        }
    } catch (error) {
        console.error("Error fetching trail data: ", error);
    }
};

// implement Google Map

export const MyGoogleMap = () => {
    const initialLocation = { lat:37.7258 , lng: -122.15 }; // Initial coordinates for San Francisco, CA
    const [center, setCenter] = useState(initialLocation);
    const [zoom, setZoom] = useState(10);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('San Francisco, CA'); // Initial location 
    const [trails, setTrails] = useState<Trail[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    // save trail to Google Firestore DB
    const saveTrailToFirestore = async (trail: Trail) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        console.log("Current User ", currentUser)
        if (!currentUser) {
            setSnackbarMessage("Please log in to save a trail.");
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        // if a trail already exists in a profile, it won't be saved again
        const trailExists = await trailExistsInFirestore(trail.id, currentUser.uid);
        if (trailExists) {
            setSnackbarMessage("Trail already in profile.");
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
            return;
        }
        // linking trail to a user via their userID
        const trailWithUserId = {
            ...trail,
            userID: currentUser.uid  
        };
    
        try {
            await addDoc(collection(db, 'trails'), trailWithUserId);
            setSnackbarMessage("Trail saved successfully");
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage("Error saving trail: ");
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
    
    // Check to see if the trail exists in the current user's database
    const trailExistsInFirestore = async (trailID: number, userID: string) => {
        const trailCollection = collection(db, 'trails');
        const trailSnapshot = await getDocs(query(trailCollection, where("id", "==", trailID), where("userID", "==", userID)));
        return !trailSnapshot.empty; // returns true if trail exists or false if it does not
    };

    // Default structure to load Google Maps
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAjmZKfxWB9JSR9XFgNSY5EK7wPv25Inq4", 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        libraries: ["places"] as any,
    });

    // Fetch weather data with latitude/longitude using OpenWeatherMap API
    const fetchWeatherData = async (lat: number, lng: number) => {
        const apiKey = "3a51d59febd65531fa015a4c56a3cbc5"; 
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`;
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                setWeather(data as WeatherData);
            }
        } catch (error) {
            console.error("Error fetching weather data: ", error);
        }
    };


    const onSearchButtonClick = () => {

        // Fetch location data based on what the user enters in the search box
        fetchLocationData(searchText);
    };

    // Get user's location that they want to go to after inputing it in the search box
    const fetchLocationData = async (searchText: string) => {
        try {
            const apiKey = "AIzaSyAjmZKfxWB9JSR9XFgNSY5EK7wPv25Inq4"; 
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchText)}&key=${apiKey}`
            );
            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const location = data.results[0].geometry.location;
                    setCenter({
                        lat: location.lat,
                        lng: location.lng,
                    });
                    setZoom(15);

                    // Fetch weather data for the entered location
                    fetchWeatherData(location.lat, location.lng);
                    // Fetch trail data for the entered location
                    fetchTrailData(location.lat, location.lng, setTrails);

                    // Set the location name in results
                    setLocationName(data.results[0].formatted_address);
                }
            }
        } catch (error) {
            console.error("Error fetching location data: ", error);
        }
    };

    useEffect(() => {
      if (isLoaded) {
          // Fetch weather data for the initial coordinates when the page opens
          fetchWeatherData(initialLocation.lat, initialLocation.lng);

          // Fetch trail data for the initial coordinates when the page opens
         fetchTrailData(initialLocation.lat, initialLocation.lng, setTrails);

          // Set initial location name
          setLocationName(searchText);
      }
    }, [isLoaded, initialLocation.lat, initialLocation.lng, searchText]);

  if (loadError) return "Error loading Google Maps";
  if (!isLoaded) return "Loading Google Maps";

  return (
            <div>
                <NavBar />
                <h1 className="headertext">Discover Trails</h1>
                <div style={{ 
                    position: 'relative', 
                    height: '86vh', 
                    width: '95%', 
                    marginLeft: 'auto' 
                    }}> 
                    
                <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                    display: 'flex', 
                    alignItems: 'center' 
                }}>
                <input
                    type="text"
                    placeholder="Enter a location"
                    style={{ width: "300px", padding: "10px" }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button 
                    sx={{
                        marginTop: '5px',
                        marginLeft: '20px',
                        backgroundColor: '#5B8C56',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'darkgreen',
                            color: '#5B8C56',
                        },
                    }}
                    onClick={onSearchButtonClick}
                >
                    Search
                </Button>
            </div>

            <GoogleMap
                id="map"
                mapContainerStyle={{ height: '100%', width: '100%' }}  
                zoom={zoom}
                center={center}
            >
                <Marker
                    position={{ lat: center.lat, lng: center.lng }}
                />
                
                {/* Markers for trails when they are found*/}
                {trails.slice(0, 30).map(trail => (
                    <Marker
                        key={trail.id}
                        position={{ lat: parseFloat(trail.lat), lng: parseFloat(trail.lon) }}
                        label={{ 
                            text: trail.name, 
                            color: 'black',  
                            fontWeight: 'bold'
                        }}
                        onClick={() => {
                            
                        }}
                    />
                ))}
            </GoogleMap>

            {/* Display Trail Info */}
            <div style={{
                position: 'absolute',
                top: '90px',
                bottom: '30px',
                left: '50px',
                background: 'rgba(50, 69, 60, 0.9)',
                padding: '10px',
                borderRadius: '5px',
                color: '#ffffff',
                maxWidth: '30vw',
                maxHeight: '73vh',
                overflowY: 'auto'
            }}>
            <h2 style={{ textAlign: 'center' }}>Trail Info</h2>
            {trails.length === 0 && <p>No trails available.</p>}
            {trails.slice(0, 30).map(trail => (
                <div key={trail.id} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '15px',
                    border: '1px solid black',
                    padding: '10px',
                    borderRadius: '5px',
                    alignItems: 'center',
                    justifyContent: 'space-between'
            }}>
            {/* Image For Trails */}
            <img
                src={trail.thumbnail || 'https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400_6.png'}
                alt="trail image"
                style={{
                    height: '150px',
                    width: '150px',
                    marginRight: '15px',
                    borderRadius: '5px',
                }}

                //  {/* If the trail has no thumbnail value, a default image will display */}
                onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    const defaultImageUrl = 'https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400_6.png'; 
            
                
                    if (imgElement.src !== defaultImageUrl) {
                        imgElement.src = defaultImageUrl;
                    } else {
               
                        console.error(`Error loading image for trail: ${trail.name}`);
                            }
                        }}
                />
                        {/* Display Trail Details with styling */}
                        <div style={{ 
                            flex: 1, 
                            marginRight: '15px', 
                            display: 'flex', 
                            flexDirection: 'column' 
                            }}>
                            <h3 style={{ 
                                marginBottom: '5px', 
                                color: '#c4893f', 
                                textAlign: 'left' 
                                }}>
                                    {trail.name}
                            </h3>
                            <p style={{ marginBottom: '2px' }}><strong>City:</strong> {trail.city}</p>
                            <p style={{ marginBottom: '2px' }}><strong>Region:</strong> {trail.region}</p>
                            <p style={{ marginBottom: '2px' }}><strong>Length:</strong> {trail.length} miles</p>
                            <p style={{ marginBottom: '2px' }}><strong>Rating:</strong> {trail.rating}</p>
                            <div style={{ 
                                flex: 1, 
                                maxHeight: '150px',
                                 overflow: 'hidden' 
                            }}>
                                <p style={{
                                    marginBottom: '2px',
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'pre-line',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    width: '100%',
                                }}>
                                    <strong>Description:</strong> {trail.description}
                                </p>
                            </div>
                           
                            <Button
                                sx={{
                                    backgroundColor: 'darkorange',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#3f3f3f',
                                        color: '#5B8C56',
                                    },
                                }}
                                onClick={() => saveTrailToFirestore(trail)}
                            >
                                Save Trail
                            </Button>
                        </div>
                    </div>
                ))}
                <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} variant="filled">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>

            {/* Weather Info */}
            {weather && (
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '80px',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(128,128,128,0.9))', 
                    padding: '10px',
                    borderRadius: '8px',
                    color: '#ffffff',
                    maxWidth: '15vw', 
                    maxHeight: '35vh', 
                    boxShadow: '0px 3px 10px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <h2 style={{
                        fontSize: '10px', 
                        borderBottom: '1px solid white', 
                        paddingBottom: '5px', 
                        marginBottom: '10px',
                        textAlign: 'center'
                    }}>CURRENT WEATHER DETAILS</h2>
                    <p style={{ fontSize: '12px' }}><strong>LOCATION:</strong> {locationName}</p>
                    <p style={{ fontSize: '14px', color: 'darkorange' }}><strong>TEMPERATURE:</strong> <strong>{weather.main.temp}°F</strong></p>
                    <p style={{ fontSize: '14px', color: '#c8e3d0' }}><strong>WEATHER: {weather.weather[0].description.toUpperCase()}</strong></p>
                </div>
            )}
        </div>
    </div>
  );
};
