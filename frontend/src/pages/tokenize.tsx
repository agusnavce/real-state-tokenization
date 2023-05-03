import React, { useState } from 'react';
import TokenizeForm from '../components/TokenizeForm';
import { Box } from '@chakra-ui/react';
import { usePropertyContext } from '../contexts/PropertyContext';
import { requestPropertyTokenization } from '../lib/property';
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';

function TokenizeProperty () {
    const { addProperty } = usePropertyContext();
    const [errorMessage, setErrorMessage] = useState('');

    const handleTokenize = async (proppertyDetails) => {
        const result = await requestPropertyTokenization(proppertyDetails, setErrorMessage);;
        if (result !== undefined) {
            console.error('Added property', result);
            addProperty(proppertyDetails);
        }
    };

    return (
        <Box>
            <TokenizeForm onSubmit={handleTokenize} />
            {errorMessage && (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                    <CloseButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={() => setErrorMessage('')}
                    />
                </Alert>
            )}
        </Box>
    );
}

export default TokenizeProperty;
