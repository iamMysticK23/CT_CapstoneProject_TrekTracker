import React, {useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';


// internal imports
import homepage_image from '../../assets/Images/trektracker_hp.jpeg';
import { NavBar } from '../sharedComponents';

interface Props {
  title: string;
}

const Root = styled('div')({
  padding: 0,
  margin: 0
});

const Main = styled('main')({
  backgroundImage: `linear-gradient(rgba(0,0,0, 0.3), rgba(0,0,0, 0.5)), url(${homepage_image});`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top 5px',
  position: 'absolute',
  width: '100vw',
  height: '100vh',
  marginTop: '20px',
  overflow: 'hidden',
  zIndex: 0
 
});

const HomePageText = styled('div')({
    textAlign: 'center',
    position: 'relative',
    top: '70%',
    left: '70%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    zIndex: 1
})

const VideoContainer = styled('div')({
  position: 'absolute',
  top: '90px',
  left: '105px',
  width: '100%',
  height: 'calc(100% - 40px)',
  opacity: '0.5'
});



// implement youtube video for front page
const videoId = '1gr0icgvFkM';

// youtube player options
const opts = {
  padding: '5px',
  width: '750vw',
  height: '400vh',
  playerVars: {
    autoplay: 1,
    mute: 1,
    modestbranding: 1,
    showinfo: 0,
    controls: 0,
   
  },
};

const YouTubeVideo = () => {
    
  return (
    <VideoContainer>
      <YouTube videoId={videoId} opts={opts} />
    </VideoContainer>
  );
};




export const Home = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(localStorage.getItem('auth') === 'true');

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(localStorage.getItem('auth') === 'true');
    };

    // Add event listener for localStorage changes
    window.addEventListener('storage', updateAuth);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('storage', updateAuth);
    };
  }, []);


  return (
    <Root>
      <NavBar />
      <Main>
        <HomePageText>
            <h1>{props.title} - Find Your Next Adventure.</h1>
            <p>Reflect on your journey.</p>
            <Button sx = {{
                 marginTop: '10px',
                 color: 'white',
                 }} 
                 component={Link} to={ isAuthenticated ? '/googlemap' : '/auth'} variant='contained'
                 > { isAuthenticated ? 'Discover Trails' : 'Register/Login'}</Button> 
        </HomePageText>
        <YouTubeVideo />

      </Main>
    </Root>
  );
};
