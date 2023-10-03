import 'styled-components';
import { Theme } from '@mui/material/styles';

// custom theme for site
declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}