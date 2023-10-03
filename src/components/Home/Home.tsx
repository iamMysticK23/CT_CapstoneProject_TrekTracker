import React from 'react';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

// internal imports
import homepage_image from '../../assets/Images/trektracker_hp.jpeg'

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
  top: '40px',
  left: '10px',
  width: '100%',
  height: 'calc(100% - 40px)',
  opacity: '0.7'
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
    showingo: 0,
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
  return (
    <Root>
      <Main>
        <HomePageText>
            <h1>{props.title} - Find Your Next Adventure.</h1>
            <p>Reflect on your journey.</p>
            <Button sx = {{
                 marginTop: '10px',
                 color: 'white',
                 backgroundColor: 'green',
                 '&:hover': {
                    backgroundColor: 'darkgreen',
                 }
                 }} 
                 component={Link} to={'/'} variant='contained'
                 >Register/Sign In</Button> {/*need to link to the button */}
        </HomePageText>
        <YouTubeVideo />

      </Main>
    </Root>
  );
};
