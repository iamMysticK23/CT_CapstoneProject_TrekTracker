import { createTheme } from '@mui/material';

// custom theme for the site
export const theme = createTheme({
    typography: {
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
    },
    palette: {
        primary: {
            main:'#32453c' // green
        },
        secondary: {
            main: '#373837' // grey
        },
        info : {
            main: '#b3b186' //dark yellow
        }
    }
})