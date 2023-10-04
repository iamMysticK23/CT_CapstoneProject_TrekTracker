import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker,  Library } from "@react-google-maps/api";
import { NavBar } from '../sharedComponents';
import { Button } from '@mui/material'

const libraries: Library[] = ["places"];

const mapContainerStyle = {
    width: '95vw',
    height: '83vh',
    marginLeft: 'auto',
};


type WeatherData = {
    main: {
        temp: number;
    };
    weather: {
        description: string;
    }[];
};

export const MyGoogleMap = () => {
    const initialLocation = { lat: 37.7258, lng: -122.15 }; // Initial coordinates
    const [center, setCenter] = useState(initialLocation);
    const [zoom, setZoom] = useState(10);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('San Francisco, CA'); // Initial location text

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
                        backgroundColor: 'darkgreen', // Keep the same background color on hover
                        color: '#5B8C56', // Keep the same text color on hover
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
                </GoogleMap>
                {weather && (
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '250px',
                      background: 'rgba(91, 140, 86, 0.8)', /* Added opacity (0.7) */
                      padding: '10px',
                      borderRadius: '5px',
                      color: '#ffffff', /* Set text color to white */
                    }}>
                        <h2>Weather Info</h2>
                        <p>Location: {locationName}</p>
                        <p>Temperature: {weather.main.temp}°F</p>
                        <p>Weather: {weather.weather[0].description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
