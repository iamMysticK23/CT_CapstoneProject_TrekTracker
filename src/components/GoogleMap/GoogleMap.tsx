import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker,  Library } from "@react-google-maps/api";
import { NavBar } from '../sharedComponents';
import { TrailDetails } from '../TrailDetails';
import { Button } from '@mui/material'


const libraries: Library[] = ["places"];

const mapContainerStyle = {
    width: '70vw',
    height: '83vh',
    marginLeft: 'auto',
};

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
    country: string;
    length: number;
    description: string;
    directions: string;
    lat: string;
    lon: string;
    thumbnail: string;
    url: string;
};

// Update the component's state


// Fetch trail data based on the given coordinates (lat, lng)
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



export const MyGoogleMap = () => {
    const initialLocation = { lat:37.7258 , lng: -122.15 }; // Initial coordinates lat: 37.7258, lng: -122.15
    const [center, setCenter] = useState(initialLocation);
    const [zoom, setZoom] = useState(10);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>(''); // Initial location text
    const [trails, setTrails] = useState<Trail[]>([]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAjmZKfxWB9JSR9XFgNSY5EK7wPv25Inq4", // Replace with your Google Maps API key
        libraries,
    });

    // Fetch weather data for the given coordinates (lat, lng)
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
        // Fetch location data based on the entered search text
        fetchLocationData(searchText);
    };

    const fetchLocationData = async (searchText: string) => {
        try {
            const apiKey = "AIzaSyAjmZKfxWB9JSR9XFgNSY5EK7wPv25Inq4"; // Replace with your Google Maps API key
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

                    // Fetch weather data for the new location
                    fetchWeatherData(location.lat, location.lng);
                        // Fetch trail data for the new location
                    fetchTrailData(location.lat, location.lng, setTrails);

                    // Set the location name in state
                    setLocationName(data.results[0].formatted_address);
                }
            }
        } catch (error) {
            console.error("Error fetching location data: ", error);
        }
    };

    useEffect(() => {
      if (isLoaded) {
          // Fetch weather data for the initial coordinates when the map loads
          fetchWeatherData(initialLocation.lat, initialLocation.lng);

          // Fetch trail data for the initial coordinates when the map loads
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
        <h1 className="headertext">Google Map</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "10px" }}>
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
        <div style={{ position: 'relative' }}>
        <GoogleMap
    id="map"
    mapContainerStyle={mapContainerStyle}
    zoom={zoom}
    center={center}
>
    <Marker
        position={{ lat: center.lat, lng: center.lng }}
    />
    
    {/* Markers for the Trails */}
    {trails.slice(0, 5).map(trail => (
        <Marker
            key={trail.id}
            position={{ lat: parseFloat(trail.lat), lng: parseFloat(trail.lon) }}
            label={trail.name}
            onClick={() => {
                // Handle click on trail marker, e.g., display a modal with trail details
            }}
        />
    ))}
</GoogleMap>


        {/* Trail Info */}
        <div style={{
            position: 'absolute',
            top: '0px',
            bottom: '10px',
            left: '100px',
            background: 'rgba(91, 140, 86, 0.8)',
            padding: '10px',
            borderRadius: '5px',
            color: '#ffffff',
            maxWidth: '25%',
            maxHeight: '70vh',     // setting a maximum height for the container
            overflowY: 'auto'      // enabling vertical scrolling
        }}>
             <h2>Trail Info</h2>
             {trails.length === 0 && <p>No trails available.</p>}
             {trails.slice(0, 5).map(trail => (
                    <div key={trail.id} style={{ marginBottom: '10px', border: '1px solid white', padding: '5px', borderRadius: '5px' }}>
                    <img src={trail.thumbnail} alt="trail image"  style={{ width: '100%', height: 'auto', maxWidth: '100%' }} />
                    <p><strong>Name:</strong> {trail.name}</p>
                    <p><strong>Address:</strong> {trail.address}</p>
                    <p><strong>URL</strong> <a href={trail.url} style={{ color: 'orange' }}>{trail.url}</a></p>
                    <p><strong>City:</strong> {trail.city}</p>
                    <p><strong>Region:</strong> {trail.region}</p>
                    <p><strong>Length:</strong> {trail.length} miles</p>
                    <p><strong>Description:</strong> {trail.description}</p>
                    <p><strong>Directions:</strong> {trail.directions}</p>
                        </div>
            ))}
           
        </div>

        {/* Weather Info */}
        {weather && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '250px',
              background: 'rgba(91, 140, 86, 0.8)',
              padding: '10px',
              borderRadius: '5px',
              color: '#ffffff',
              maxWidth: '45%',
              maxHeight: '55vh',
            }}>
                <h2>Weather Info</h2>
                <p>Location: {locationName}</p>
                <p>Temperature: {weather.main.temp}°F</p>
                <p>Weather: {weather.weather[0].description}</p>
            </div>
            
        )}

        </div>
    </div>
  )}
