import React, { useState, useEffect } from 'react';
import {
    Button,
    Drawer,
    ListItemButton,
    List,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Stack,
    Typography,
    Divider,
    CssBaseline,
    Box,
    InputBase,
    Menu,
    Icon,
    ListItemIcon,

} from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HikingIcon from '@mui/icons-material/Hiking';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';


// internal imports
import { theme } from '../../../Theme/themes';


const drawerWidth = 50; // need this to be small for the sidebar aspect

const navStyles = {
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),

    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
    })
   },
   menuButton : {
        marginRight: theme.spacing(2)
   },
   hide: {
        display: 'none'
   },
   drawer: {
        width: drawerWidth,
        flexShring: 0
   },
   drawerPaper: {
        width: drawerWidth
   },
   drawerHeader: {
        display: 'flex',
        width: drawerWidth,
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
   },
   content: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
   },
   contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
    },
    toolbar: {
        display: 'flex'
    },
    toolbarButton: {
        marginLeft: 'auto',
        backgroundColor: theme.palette.primary.contrastText
    },
    signInStack: {
        position: 'absolute',
        top: '20%', 
        right:'50px'
    }
}

// interface NavBarProps {
//     isAuthenticated: boolean;
// }


// NavBar component build out
// I will need to implement search bar and person icon
export const NavBar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [ open, setOpen ] = useState(location.pathname === '/googlemap');


    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const navLinks = [
        {
            text: 'Home',
            icon: <HomeIcon />,
            onClick: () => {navigate('/')},
            // show: () => true 
        },
        {
            text: 'Discover',
            icon:<HikingIcon />,
            onClick: () => {navigate('/googlemap')},
            // show: () => true 
        },
        {
            text: 'MyTrails',
            icon: <PermMediaIcon />,
            onClick: () => {navigate('/traillist')},
            // show: () => true 
        },
        {
            text: 'My Profile',
            icon: <AccountCircleIcon />,
            onClick: () => {navigate('/profile')},
            // show: () => true 
        },
    ]

    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleDarkMode = () => {
        const body = document.body;
        body.classList.toggle('dark-mode');
        const isCurrentlyEnabled = body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode-enabled', isCurrentlyEnabled.toString());

        setIsDarkMode(isCurrentlyEnabled);
    };

    // Check if dark mode is enabled in localStorage
    useEffect(() => {
        const isDarkModeEnabled = localStorage.getItem('dark-mode-enabled');
        if (isDarkModeEnabled === 'true') {
            document.body.classList.add('dark-mode');
        }
    }, []);

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline />
            <AppBar 
                sx={ open ? navStyles.appBarShift : navStyles.appBar }
                position = 'fixed'
            >
                <Toolbar sx={ navStyles.toolbar }>
                    <IconButton 
                        color='inherit'
                        aria-label='open drawer'
                        onClick = { handleDrawerOpen }
                        edge='start'
                        sx= { open ? navStyles.hide : navStyles.menuButton }
                    >
                        <AddIcon />
                    </IconButton>
                </Toolbar>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={ navStyles.signInStack }>
                    <Typography variant='body2' sx={{color: 'inherit'}}>
                        {/* below will change */}
                        User Email
                    </Typography>
                    <Button
                        variant ='outlined'
                        color ='info'
                        size = 'medium'
                        sx = {{ marginLeft: '20px'}}
                        onClick = { () => {navigate('/auth')}}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant ='outlined'
                        color ='info'
                        size = 'medium'
                        sx = {{ marginLeft: '20px'}}
                        onClick = { toggleDarkMode }
                    >
                       {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </Stack>
            </AppBar>
            <Drawer
                sx= { open ? navStyles.drawer : navStyles.hide }
                variant = 'persistent'
                anchor = 'left'
                open = {open}
            >
                <Box sx = { navStyles.drawerHeader }>
                    <IconButton onClick={handleDrawerClose}>
                        <TravelExploreIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List>
{ 
                      navLinks.map((item) =>  {
                            const { text, icon, onClick } = item;
                            return (
                                <ListItemButton 
                                key={text} 
                                onClick={onClick}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '8px',
                                }}
                                >
                                    { icon }
                                    <ListItemText primary={text} sx={{ fontSize: '0.3rem'}} />
                                </ListItemButton>
                            )
                        })
                    }
                </List>
            </Drawer>
        </Box>
    )
}