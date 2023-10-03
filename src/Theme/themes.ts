import { createTheme } from '@mui/material';

// custom theme for the site
export const theme = createTheme({
    typography: {
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
    },
    palette: {
        primary: {
            main:'#5b8c57' // green
        },
        secondary: {
            main: '#373837' // grey
        },
        info : {
            main: '#d4af42' //dark yellow
        }
    }
})