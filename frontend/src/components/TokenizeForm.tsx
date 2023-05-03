import React, { useState } from 'react';
import {
    Box, Input, VStack, Text, Button, FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { PropertyDetails } from '../types';

interface TokenizeFormProps {
    onSubmit: (propertyDetails: PropertyDetails) => void;
}

const TokenizeForm: React.FC<TokenizeFormProps> = ({ onSubmit }) => {
    const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
        name: '',
        description: '',
        location: '',
        totalValue: 0,
        shares: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyDetails({ ...propertyDetails, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(propertyDetails);
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <Text fontSize="xl" fontWeight="semibold">
                    Request new property addition
                </Text>
                <FormControl id="name">
                    <FormLabel>Name</FormLabel>
                    <Input
                        name="name"
                        value={propertyDetails.name}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id="desc">
                    <FormLabel>Description</FormLabel>
                    <Input
                        name="description"
                        value={propertyDetails.description}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id="loc">
                    <FormLabel>Location</FormLabel>
                    <Input
                        name="location"
                        value={propertyDetails.location}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id="value">
                    <FormLabel>Value</FormLabel>
                    <Input
                        type="number"
                        name="totalValue"
                        value={propertyDetails.totalValue}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id="totalShares">
                    <FormLabel>Total Shares</FormLabel>
                    <Input
                        type="number"
                        name="shares"
                        value={propertyDetails.shares}
                        onChange={handleChange}
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue">
                    Submit
                </Button>
            </VStack>
        </Box>
    );
};

export default TokenizeForm;
