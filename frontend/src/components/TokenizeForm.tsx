import React, { useState } from 'react';
import {
  Box,
  Input,
  VStack,
  Text,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { PropertyDetails } from '../types';

interface TokenizeFormProps {
  onSubmit: (propertyDetails: PropertyDetails) => void;
}

const dummyProp = {
  name: '',
  description: '',
  location: '',
  totalValue: 0,
  shares: 0,
};

const TokenizeForm: React.FC<TokenizeFormProps> = ({ onSubmit }) => {
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyDetails>(dummyProp);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails({ ...propertyDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(propertyDetails);
    setPropertyDetails(dummyProp);
  };

  return (
    <Box as='form' onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <Text fontSize='xl' fontWeight='semibold'>
          Request new property addition
        </Text>
        <FormControl id='name'>
          <FormLabel>Name</FormLabel>
          <Input
            name='name'
            value={propertyDetails.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id='description'>
          <FormLabel>Description</FormLabel>
          <Input
            name='description'
            value={propertyDetails.description}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id='location'>
          <FormLabel>Location</FormLabel>
          <Input
            name='location'
            value={propertyDetails.location}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id='totalValue'>
          <FormLabel>Value</FormLabel>
          <Input
            type='number'
            name='totalValue'
            value={propertyDetails.totalValue}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id='shares'>
          <FormLabel>Total Shares</FormLabel>
          <Input
            type='number'
            name='shares'
            value={propertyDetails.shares}
            onChange={handleChange}
          />
        </FormControl>
        <Button type='submit' colorScheme='blue'>
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default TokenizeForm;
