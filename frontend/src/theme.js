// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        primary: {
            500: '#1976d2',
        },
        secondary: {
            500: '#dc004e',
        },
    },
    fonts: {
        body: 'Roboto, sans-serif',
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'normal',
            },
        },
    },
});

export default theme;
