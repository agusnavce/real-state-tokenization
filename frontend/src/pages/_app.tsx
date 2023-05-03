import React from 'react';
import { PropertyProvider } from '../contexts/PropertyContext';
import { ChakraProvider } from '@chakra-ui/react';
import Header from '../components/Header';
import theme from '../theme';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp ({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme} >
            <Header />
            <ErrorBoundary>
            <PropertyProvider>
                <Component {...pageProps} />
            </PropertyProvider >
            </ErrorBoundary>
        </ChakraProvider>
    );
}

export default MyApp;