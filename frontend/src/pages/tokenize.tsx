import React, { use, useState } from 'react';
import TokenizeForm from '../components/TokenizeForm';
import { Box } from '@chakra-ui/react';
import { usePropertyContext } from '../contexts/PropertyContext';
import { requestPropertyTokenization } from '../lib/property';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';

function TokenizeProperty() {
  const { fetchUserRequestedProperties } = usePropertyContext();
  const [errorMessage, setErrorMessage] = useState('');
  const [addedMessage, setAddedMessage] = useState('');

  const handleTokenize = async (proppertyDetails) => {
    await requestPropertyTokenization(proppertyDetails, setErrorMessage);
    setAddedMessage('Added Property Request');
    fetchUserRequestedProperties();
  };

  return (
    <Box>
      <TokenizeForm onSubmit={handleTokenize} />
      {errorMessage && (
        <Alert status='error' mt={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          <CloseButton
            position='absolute'
            right='8px'
            top='8px'
            onClick={() => setErrorMessage('')}
          />
        </Alert>
      )}
      {addedMessage && (
        <Alert status='success' mt={4}>
          <AlertIcon />
          <AlertDescription>{addedMessage}</AlertDescription>
          <CloseButton
            position='absolute'
            right='8px'
            top='8px'
            onClick={() => setAddedMessage('')}
          />
        </Alert>
      )}
    </Box>
  );
}

export default TokenizeProperty;
